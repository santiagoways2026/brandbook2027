#!/usr/bin/env python3
"""Consulta la API de exportacion de Microsoft Clarity para Magical SEO.

La API solo permite 10 peticiones por proyecto y dia, asi que este script
guarda en cache cada respuesta del dia. Repetir la misma consulta no gasta
cuota: se sirve del disco.

Token: ~/.config/claude-seo/clarity.json  ->  {"api_token": "..."}
       o la variable de entorno CLARITY_API_TOKEN.

Uso:
    python clarity.py --dias 3 --dim URL
    python clarity.py --dias 1 --dim URL --dim Device
    python clarity.py --dias 3 --dim URL --metricas "Rage Click Count,Quickback Click"
    python clarity.py --cuota        # cuantas peticiones llevas hoy
"""

import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date

ENDPOINT = "https://www.clarity.ms/export-data/api/v1/project-live-insights"
CONFIG = os.path.expanduser("~/.config/claude-seo/clarity.json")
CACHE_DIR = os.path.expanduser("~/.config/claude-seo/clarity-cache")
LIMITE_DIARIO = 10


def token():
    t = os.environ.get("CLARITY_API_TOKEN")
    if t:
        return t.strip()
    if os.path.exists(CONFIG):
        try:
            with open(CONFIG, encoding="utf-8") as f:
                t = (json.load(f).get("api_token") or "").strip()
            if t and not t.startswith("<"):
                return t
        except (json.JSONDecodeError, IOError) as e:
            print(f"No se pudo leer {CONFIG}: {e}", file=sys.stderr)
    print(
        "Falta el token de Clarity.\n"
        f"Pega el token en {CONFIG} con la forma "
        '{"api_token": "..."}\n'
        "Se genera en Clarity: Configuracion > Exportacion de datos > "
        "Generar nuevo token de API (solo administradores del proyecto).",
        file=sys.stderr,
    )
    sys.exit(2)


def _cache_path(params):
    clave = urllib.parse.urlencode(sorted(params.items()))
    seguro = "".join(c if c.isalnum() else "_" for c in clave)[:120]
    return os.path.join(CACHE_DIR, f"{date.today().isoformat()}__{seguro}.json")


def _peticiones_hoy():
    if not os.path.isdir(CACHE_DIR):
        return 0
    hoy = date.today().isoformat()
    return len([f for f in os.listdir(CACHE_DIR) if f.startswith(hoy)])


def consulta(params, forzar=False):
    """Devuelve (datos, de_cache). Respeta el limite diario."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    ruta = _cache_path(params)

    if os.path.exists(ruta) and not forzar:
        with open(ruta, encoding="utf-8") as f:
            return json.load(f), True

    usadas = _peticiones_hoy()
    if usadas >= LIMITE_DIARIO:
        print(
            f"Limite diario alcanzado: {usadas} de {LIMITE_DIARIO} peticiones hoy.\n"
            "La cuota se reinicia manana. Las consultas ya hechas siguen "
            f"disponibles en {CACHE_DIR}.",
            file=sys.stderr,
        )
        sys.exit(3)

    url = f"{ENDPOINT}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"Bearer {token()}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            datos = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        motivo = {
            401: "token ausente, invalido o caducado",
            403: "el token no tiene permiso para esta operacion",
            400: "parametros invalidos",
            429: "superado el limite diario de 10 peticiones",
        }.get(e.code, "error no identificado")
        print(f"Clarity devolvio {e.code}: {motivo}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as e:
        print(f"No se pudo conectar con Clarity: {e.reason}", file=sys.stderr)
        sys.exit(1)

    with open(ruta, "w", encoding="utf-8") as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
    return datos, False


def pagina(url):
    """Quita parametros de campana y ancla: deja la pagina real.

    Clarity cuenta cada URL completa, asi que una misma pagina aparece
    decenas de veces con distintos gclid y utm. Sin esto, las 1.000 filas
    del limite se gastan en ruido de anuncios.
    """
    if not url:
        return "(sin url)"
    u = url.split("?")[0].split("#")[0]
    return u.rstrip("/") or u


def forma(fila):
    """Clarity devuelve tres estructuras distintas segun la metrica."""
    if "sessionsWithMetricPercentage" in fila:
        return "clics"
    if "averageScrollDepth" in fila:
        return "scroll"
    if "totalSessionCount" in fila:
        return "trafico"
    if "totalTime" in fila:
        return "tiempo"
    return "otra"


def agrupa(filas):
    """Suma por pagina real. Devuelve (forma, lista ordenada)."""
    f0 = forma(filas[0])
    acc = {}
    for f in filas:
        clave = pagina(f.get("Url") or f.get("url") or "")
        d = acc.setdefault(clave, {"n": 0, "a": 0.0, "b": 0.0, "c": 0.0})
        d["n"] += 1
        if f0 == "clics":
            s = int(f.get("sessionsCount") or 0)
            d["a"] += s
            d["b"] += s * float(f.get("sessionsWithMetricPercentage") or 0) / 100.0
            d["c"] += int(f.get("subTotal") or 0)
        elif f0 == "scroll":
            d["a"] += float(f.get("averageScrollDepth") or 0)
        elif f0 == "trafico":
            d["a"] += int(f.get("totalSessionCount") or 0)
            d["b"] += int(f.get("totalBotSessionCount") or 0)
            d["c"] += float(f.get("pagesPerSessionPercentage") or 0)
        elif f0 == "tiempo":
            d["a"] += float(f.get("totalTime") or 0)
            d["b"] += float(f.get("activeTime") or 0)

    salida = []
    for url, d in acc.items():
        n = d["n"] or 1
        if f0 == "clics":
            salida.append({"url": url, "orden": d["a"], "col1": d["a"],
                           "col2": (d["b"] / d["a"] * 100) if d["a"] else 0.0,
                           "col3": d["c"]})
        elif f0 == "scroll":
            salida.append({"url": url, "orden": n, "col1": n,
                           "col2": d["a"] / n, "col3": 0})
        elif f0 == "trafico":
            salida.append({"url": url, "orden": d["a"], "col1": d["a"],
                           "col2": d["b"], "col3": d["c"] / n})
        elif f0 == "tiempo":
            salida.append({"url": url, "orden": n, "col1": n,
                           "col2": d["b"] / n, "col3": d["a"] / n})
        else:
            salida.append({"url": url, "orden": n, "col1": n, "col2": 0, "col3": 0})
    return f0, sorted(salida, key=lambda x: -x["orden"])


CABECERAS = {
    "clics":   ("sesiones", "% con", "veces"),
    "scroll":  ("muestras", "scroll medio %", ""),
    "trafico": ("sesiones", "de bots", "pags/sesion"),
    "tiempo":  ("muestras", "seg. activos", "seg. totales"),
    "otra":    ("filas", "", ""),
}


def imprime(datos, filtro_metricas=None, limite=20, agrupar=True, contiene=None):
    if not isinstance(datos, list):
        print(json.dumps(datos, ensure_ascii=False, indent=2)[:3000])
        return
    for bloque in datos:
        nombre = bloque.get("metricName", "?")
        if filtro_metricas and nombre not in filtro_metricas:
            continue
        filas = bloque.get("information") or []
        if not filas:
            continue

        if not agrupar:
            print(f"\n=== {nombre} ({len(filas)} filas sin agrupar) ===")
            for fila in filas[:limite]:
                partes = [f"{k}={v}" for k, v in fila.items() if v not in (None, "")]
                print("  " + "  ".join(partes))
            continue

        if "Url" not in filas[0] and "url" not in filas[0]:
            print(f"\n=== {nombre} ===")
            for fila in filas[:limite]:
                partes = [f"{k}={v}" for k, v in fila.items() if v not in (None, "")]
                print("  " + "  ".join(partes))
            continue

        f0, grupos = agrupa(filas)
        if contiene:
            grupos = [g for g in grupos if contiene.lower() in g["url"].lower()]
        if not grupos:
            continue
        c1, c2, c3 = CABECERAS.get(f0, CABECERAS["otra"])
        print(f"\n=== {nombre} · {len(grupos)} paginas (de {len(filas)} filas) ===")
        print(f"  {'pagina':<58}{c1:>10}{c2:>16}{c3:>14}")
        for g in grupos[:limite]:
            corta = g["url"].replace("https://santiagoways.com", "")[:56] or "/"
            print(f"  {corta:<58}{g['col1']:>10.0f}{g['col2']:>16.1f}"
                  f"{g['col3']:>14.1f}")
        if len(grupos) > limite:
            print(f"  ... y {len(grupos) - limite} paginas mas")


def main():
    p = argparse.ArgumentParser(description="Clarity Data Export para Magical SEO")
    p.add_argument("--dias", type=int, default=3, choices=[1, 2, 3],
                   help="ventana de datos: 1, 2 o 3 dias (por defecto 3)")
    p.add_argument("--dim", action="append", default=[],
                   help="dimension; hasta 3. Browser, Device, Country/Region, "
                        "OS, Source, Medium, Campaign, Channel, URL")
    p.add_argument("--metricas", default="",
                   help="filtra la salida a estas metricas, separadas por comas")
    p.add_argument("--limite", type=int, default=20, help="filas por metrica")
    p.add_argument("--crudo", action="store_true",
                   help="no agrupa por pagina: muestra las filas tal cual llegan")
    p.add_argument("--contiene", default="",
                   help="filtra las paginas cuya ruta contenga este texto")
    p.add_argument("--forzar", action="store_true",
                   help="ignora la cache y gasta una peticion")
    p.add_argument("--json", action="store_true", help="salida JSON cruda")
    p.add_argument("--cuota", action="store_true",
                   help="solo informa de las peticiones gastadas hoy")
    a = p.parse_args()

    if a.cuota:
        usadas = _peticiones_hoy()
        print(f"Peticiones a Clarity hoy: {usadas} de {LIMITE_DIARIO}. "
              f"Quedan {max(0, LIMITE_DIARIO - usadas)}.")
        return

    if len(a.dim) > 3:
        print("Clarity admite un maximo de 3 dimensiones por peticion.", file=sys.stderr)
        sys.exit(2)

    params = {"numOfDays": str(a.dias)}
    for i, d in enumerate(a.dim, start=1):
        params[f"dimension{i}"] = d

    datos, de_cache = consulta(params, forzar=a.forzar)

    if a.json:
        print(json.dumps(datos, ensure_ascii=False, indent=2))
        return

    origen = "cache del dia, sin gastar cuota" if de_cache else "peticion nueva"
    print(f"Clarity · ultimos {a.dias} dias · dimensiones: "
          f"{', '.join(a.dim) if a.dim else '(ninguna)'} · {origen}")
    print(f"Peticiones gastadas hoy: {_peticiones_hoy()} de {LIMITE_DIARIO}")
    filtro = {m.strip() for m in a.metricas.split(",") if m.strip()} or None
    imprime(datos, filtro, a.limite, agrupar=not a.crudo,
            contiene=a.contiene or None)


if __name__ == "__main__":
    main()
