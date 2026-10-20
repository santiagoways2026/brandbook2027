#!/usr/bin/env python3
"""Consultas a la API de Semrush para Magical SEO.

Existe para que los agentes tengan una orden fija y acotada, igual que gsc.py
y clarity.py. No escribas peticiones sueltas: solo este script esta autorizado.

Clave: ~/.config/claude-seo/semrush.json  ->  {"api_key": "..."}
       o la variable de entorno SEMRUSH_API_KEY.

LAS UNIDADES SON COMPARTIDAS. La clave es de la cuenta principal y cada
consulta gasta saldo de todo el equipo. El script avisa del coste antes de
gastar y guarda en cache la respuesta del dia: repetir no cuesta nada.

Uso:
    python magical-seo/scripts/semrush.py saldo
    python magical-seo/scripts/semrush.py dominio santiagoways.com
    python magical-seo/scripts/semrush.py keywords "xacobeo 2027"
    python magical-seo/scripts/semrush.py organico caminoways.com --limite 30
    python magical-seo/scripts/semrush.py hueco caminoways.com --limite 40
Todas aceptan --base (es, uk, us...), --json y --forzar.
"""

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import date

API = "https://api.semrush.com/"
SALDO = "https://www.semrush.com/users/countapiunits.html"
CONFIG = os.path.expanduser("~/.config/claude-seo/semrush.json")
CACHE = os.path.expanduser("~/.config/claude-seo/semrush-cache")
NUESTRO = "santiagoways.com"
MERCADOS = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                        "..", "datos", "mercados.json")


def bases_de(mercado):
    """Las bases de datos de Semrush que sirven a un mercado."""
    try:
        with open(MERCADOS, encoding="utf-8") as f:
            ms = json.load(f)["mercados"]
    except (IOError, json.JSONDecodeError, KeyError):
        print(f"No se pudo leer {MERCADOS}", file=sys.stderr)
        sys.exit(2)
    for m in ms:
        if m["id"].lower() == mercado.lower():
            return m["semrush"], m["nombre"]
    ids = ", ".join(m["id"] for m in ms)
    print(f"Mercado desconocido. Los que hay: {ids}", file=sys.stderr)
    sys.exit(2)

# Coste por linea devuelta, segun la documentacion de Semrush.
COSTE = {"domain_ranks": 10, "domain_organic": 10, "phrase_this": 10,
         "phrase_related": 40, "domain_domains": 80}


def clave():
    k = os.environ.get("SEMRUSH_API_KEY")
    if k:
        return k.strip()
    if os.path.exists(CONFIG):
        try:
            with open(CONFIG, encoding="utf-8") as f:
                k = (json.load(f).get("api_key") or "").strip()
            if k and not k.startswith("<"):
                return k
        except (json.JSONDecodeError, IOError) as e:
            print(f"No se pudo leer {CONFIG}: {e}", file=sys.stderr)
    print(f"Falta la clave de Semrush. Pegala en {CONFIG} "
          'con la forma {"api_key": "..."}', file=sys.stderr)
    sys.exit(2)


def _pide(url, params, forzar=False, etiqueta=""):
    """Devuelve (texto, de_cache). Cachea por dia para no repetir gasto."""
    os.makedirs(CACHE, exist_ok=True)
    firma = urllib.parse.urlencode(sorted((k, v) for k, v in params.items() if k != "key"))
    seguro = "".join(c if c.isalnum() else "_" for c in firma)[:110]
    ruta = os.path.join(CACHE, f"{date.today().isoformat()}__{seguro}.txt")
    if os.path.exists(ruta) and not forzar:
        with open(ruta, encoding="utf-8") as f:
            return f.read(), True
    try:
        with urllib.request.urlopen(f"{url}?{urllib.parse.urlencode(params)}", timeout=60) as r:
            texto = r.read().decode("utf-8", "replace")
    except Exception as e:
        print(f"No se pudo consultar Semrush{etiqueta}: {e}", file=sys.stderr)
        sys.exit(1)
    if texto.startswith("ERROR"):
        print(f"Semrush devolvio: {texto.strip()}", file=sys.stderr)
        sys.exit(1)
    with open(ruta, "w", encoding="utf-8") as f:
        f.write(texto)
    return texto, False


def saldo():
    try:
        with urllib.request.urlopen(f"{SALDO}?key={clave()}", timeout=30) as r:
            return int(r.read().decode().strip())
    except Exception:
        return -1


def informe(tipo, extra, limite, base, forzar):
    p = {"type": tipo, "key": clave(), "database": base,
         "display_limit": limite, **extra}
    if tipo == "domain_ranks":
        p["export_columns"] = "Db,Dn,Rk,Or,Ot,Oc,Ad,At,Ac"
    elif tipo == "domain_organic":
        p["export_columns"] = "Ph,Po,Nq,Cp,Co,Tr,Ur"
        p["display_sort"] = "tr_desc"
    elif tipo == "phrase_this":
        p["export_columns"] = "Ph,Nq,Cp,Co,Nr,Td"
    elif tipo == "domain_domains":
        p["export_columns"] = "Ph,P0,P1,Nq,Cp,Co"
    texto, cache = _pide(API, p, forzar, f" ({tipo})")
    lineas = [l for l in texto.strip().split("\n") if l]
    if not lineas:
        return {"filas": [], "deCache": cache, "coste": 0}
    cab = lineas[0].split(";")
    filas = [dict(zip(cab, l.split(";"))) for l in lineas[1:]]
    coste = 0 if cache else COSTE.get(tipo, 0) * max(1, len(filas))
    return {"informe": tipo, "base": base, "filas": filas,
            "deCache": cache, "coste": coste}


def imprime(d, titulo):
    filas = d.get("filas") or []
    origen = "cache del dia, sin gasto" if d.get("deCache") else f"~{d.get('coste',0)} unidades"
    print(f"{titulo}  ·  {len(filas)} filas  ·  {origen}")
    if not filas:
        print("  (sin resultados)")
        return
    cols = list(filas[0].keys())
    anchos = {c: min(max(len(c), *(len(str(f.get(c, ""))) for f in filas)), 46) for c in cols}
    print("  " + "  ".join(c[:anchos[c]].ljust(anchos[c]) for c in cols))
    print("  " + "-" * (sum(anchos.values()) + 2 * (len(cols) - 1)))
    for f in filas:
        print("  " + "  ".join(str(f.get(c, ""))[:anchos[c]].ljust(anchos[c]) for c in cols))


def main():
    p = argparse.ArgumentParser(description="Semrush para Magical SEO")
    p.add_argument("accion", choices=["saldo", "dominio", "keywords", "organico", "hueco"])
    p.add_argument("objetivo", nargs="?", help="dominio o palabra clave")
    p.add_argument("--base", default="es", help="base de datos: es, uk, us, de, it, pt...")
    p.add_argument("--mercado", default="", help="recorre todas las bases de un mercado "
                                                 "de datos/mercados.json: es-ES, de-DE, en-US...")
    p.add_argument("--limite", type=int, default=25)
    p.add_argument("--forzar", action="store_true", help="ignora la cache y gasta")
    p.add_argument("--json", action="store_true")
    a = p.parse_args()

    if a.accion == "saldo":
        u = saldo()
        print(f"Unidades disponibles: {u:,}".replace(",", ".") if u >= 0
              else "No se pudo consultar el saldo")
        print("Coste por linea devuelta: dominio 10, keywords 10, organico 10, hueco 80.")
        return

    if not a.objetivo:
        print("Falta el dominio o la palabra clave", file=sys.stderr)
        sys.exit(2)

    if a.mercado:
        bases, nombre = bases_de(a.mercado)
        print(f"Mercado {nombre}: {len(bases)} base(s) de datos")
        print()
        for b in bases:
            a.base = b
            _una(a)
            print()
        return

    _una(a)


def _una(a):
    if a.accion == "dominio":
        d = informe("domain_ranks", {"domain": a.objetivo}, 1, a.base, a.forzar)
        t = f"Resumen de {a.objetivo} en la base {a.base}"
    elif a.accion == "keywords":
        d = informe("phrase_this", {"phrase": a.objetivo}, 1, a.base, a.forzar)
        t = f"Volumen y coste de «{a.objetivo}» en la base {a.base}"
    elif a.accion == "organico":
        d = informe("domain_organic", {"domain": a.objetivo}, a.limite, a.base, a.forzar)
        t = f"Lo que posiciona {a.objetivo} en la base {a.base}"
    else:
        d = informe("domain_domains",
                    {"domains": f"*|or|{a.objetivo}|*|or|{NUESTRO}"},
                    a.limite, a.base, a.forzar)
        t = f"Keywords de {a.objetivo} frente a {NUESTRO} ({a.base})"

    if a.json:
        print(json.dumps(d, ensure_ascii=False, indent=1))
    else:
        imprime(d, t)
    return


if __name__ == "__main__":
    main()
