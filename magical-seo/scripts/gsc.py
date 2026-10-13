#!/usr/bin/env python3
"""Consultas a Google Search Console y Analytics para Magical SEO.

Existe para que los agentes tengan una orden fija y acotada en lugar de
ejecutar Python suelto: asi el permiso se puede dar a este script y a nada mas.

Credenciales: ~/.config/claude-seo/ (OAuth, las mismas de la skill seo-google).
Propiedad: https://santiagoways.com/ y solo esa. Las propiedades por idioma son
duplicados; para segmentar por idioma se filtra por ruta.

Uso:
    python gsc.py posiciones --limite 1000
    python gsc.py posiciones --contiene "xacobeo" --limite 30
    python gsc.py paginas --contiene "/en/" --limite 25
    python gsc.py inspecciona https://santiagoways.com/es/xacobeo/
    python gsc.py sitemaps
    python gsc.py trafico --limite 20
Todas aceptan --json para salida cruda.
"""

import argparse
import json
import os
import sys
from datetime import date, timedelta

SCRIPTS = os.path.expanduser(r"~/.claude/skills/seo/scripts")
SITIO = "https://santiagoways.com/"
GA4 = "properties/309135189"


def _api(servicio, version, alcance):
    sys.path.insert(0, SCRIPTS)
    try:
        from google_auth import get_oauth_credentials, SCOPES
    except ImportError:
        print(f"No encuentro google_auth.py en {SCRIPTS}", file=sys.stderr)
        sys.exit(2)
    from googleapiclient.discovery import build
    cred = get_oauth_credentials([SCOPES[alcance]])
    if not cred:
        print("Sin credenciales. Revisa ~/.config/claude-seo/ "
              "o vuelve a autorizar con google_auth.py --auth", file=sys.stderr)
        sys.exit(2)
    return build(servicio, version, credentials=cred)


def _ventana(dias=28, retraso=3):
    """Search Console no tiene los ultimos dias: se deja margen."""
    fin = date.today() - timedelta(days=retraso)
    return (fin - timedelta(days=dias)).isoformat(), fin.isoformat()


def _filtro(dimension, texto):
    if not texto:
        return []
    return [{"filters": [{"dimension": dimension, "operator": "contains",
                          "expression": texto}]}]


def consulta_sc(dimension, contiene, limite, dias):
    s = _api("searchconsole", "v1", "gsc_readonly")
    ini, fin = _ventana(dias)
    cuerpo = {"startDate": ini, "endDate": fin, "dimensions": [dimension],
              "rowLimit": min(limite, 25000)}
    g = _filtro(dimension, contiene)
    if g:
        cuerpo["dimensionFilterGroups"] = g
    r = s.searchanalytics().query(siteUrl=SITIO, body=cuerpo).execute()
    filas = []
    for x in r.get("rows", []):
        filas.append({"clave": x["keys"][0], "clics": round(x["clicks"]),
                      "impresiones": round(x["impressions"]),
                      "ctr": round(x["ctr"] * 100, 2),
                      "posicion": round(x["position"], 1)})
    return {"periodo": f"{ini} a {fin}", "dimension": dimension,
            "filtro": contiene or "", "filas": filas}


def inspecciona(url):
    s = _api("searchconsole", "v1", "gsc_readonly")
    r = s.urlInspection().index().inspect(
        body={"inspectionUrl": url, "siteUrl": SITIO}).execute()
    i = r.get("inspectionResult", {}).get("indexStatusResult", {})
    return {"url": url, "veredicto": i.get("verdict"),
            "cobertura": i.get("coverageState"),
            "canonicaGoogle": i.get("googleCanonical"),
            "canonicaDeclarada": i.get("userCanonical"),
            "ultimoRastreo": i.get("lastCrawlTime")}


def sitemaps():
    s = _api("searchconsole", "v1", "gsc_readonly")
    r = s.sitemaps().list(siteUrl=SITIO).execute()
    out = []
    for x in r.get("sitemap", []):
        c = (x.get("contents") or [{}])[0]
        out.append({"ruta": x.get("path"), "tipo": x.get("type"),
                    "enviados": c.get("submitted"),
                    "errores": x.get("errors", 0), "avisos": x.get("warnings", 0)})
    return {"sitemaps": out}


def trafico(limite, dias):
    d = _api("analyticsdata", "v1beta", "ga4")
    fin = date.today() - timedelta(days=1)
    ini = fin - timedelta(days=dias)
    r = d.properties().runReport(property=GA4, body={
        "dateRanges": [{"startDate": ini.isoformat(), "endDate": fin.isoformat()}],
        "dimensions": [{"name": "landingPage"}],
        "metrics": [{"name": "sessions"}],
        "dimensionFilter": {"filter": {"fieldName": "sessionDefaultChannelGroup",
                                       "stringFilter": {"value": "Organic Search"}}},
        "orderBys": [{"metric": {"metricName": "sessions"}, "desc": True}],
        "limit": limite}).execute()
    filas = [{"pagina": x["dimensionValues"][0]["value"],
              "sesiones": int(x["metricValues"][0]["value"])}
             for x in r.get("rows", [])]
    return {"periodo": f"{ini} a {fin}", "canal": "Organic Search", "filas": filas}


def imprime(d):
    filas = d.get("filas") or d.get("sitemaps")
    if not isinstance(filas, list):
        for k, v in d.items():
            print(f"{k}: {v}")
        return
    if d.get("periodo"):
        print(f"Periodo {d['periodo']}" + (f" · filtro «{d['filtro']}»" if d.get("filtro") else ""))
    if not filas:
        print("(sin filas)")
        return
    cols = list(filas[0].keys())
    anchos = {c: max(len(c), *(len(str(f.get(c, ""))) for f in filas)) for c in cols}
    anchos[cols[0]] = min(anchos[cols[0]], 62)
    print("  ".join(c.ljust(anchos[c]) for c in cols))
    print("-" * (sum(anchos.values()) + 2 * (len(cols) - 1)))
    for f in filas:
        print("  ".join(str(f.get(c, ""))[:anchos[c]].ljust(anchos[c]) for c in cols))


def main():
    p = argparse.ArgumentParser(description="Search Console y Analytics para Magical SEO")
    p.add_argument("accion", choices=["posiciones", "paginas", "inspecciona",
                                      "sitemaps", "trafico"])
    p.add_argument("url", nargs="?", help="solo para inspecciona")
    p.add_argument("--contiene", default="", help="filtra por texto")
    p.add_argument("--limite", type=int, default=100)
    p.add_argument("--dias", type=int, default=28)
    p.add_argument("--json", action="store_true")
    a = p.parse_args()

    if a.accion == "posiciones":
        d = consulta_sc("query", a.contiene, a.limite, a.dias)
    elif a.accion == "paginas":
        d = consulta_sc("page", a.contiene, a.limite, a.dias)
    elif a.accion == "inspecciona":
        if not a.url:
            print("Falta la URL a inspeccionar", file=sys.stderr)
            sys.exit(2)
        d = inspecciona(a.url)
    elif a.accion == "sitemaps":
        d = sitemaps()
    else:
        d = trafico(a.limite, a.dias)

    print(json.dumps(d, ensure_ascii=False, indent=1) if a.json else "", end="")
    if not a.json:
        imprime(d)


if __name__ == "__main__":
    main()
