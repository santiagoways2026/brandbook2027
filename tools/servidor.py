# -*- coding: utf-8 -*-
"""Servidor de desarrollo para la herramienta.

    python tools/servidor.py

Igual que `python -m http.server`, pero sin caché: el navegador vuelve a pedir
cada archivo. Con el servidor normal, al editar app/modulos.js el navegador
sirve la versión antigua y parece que el cambio no ha entrado.
"""
import functools
import http.server
import os
import pathlib
import socketserver
import webbrowser

PUERTO = 8899
RAIZ = pathlib.Path(__file__).resolve().parent.parent


class SinCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, formato, *args):
        # Solo los errores: el log de cada archivo no aporta nada.
        if args and str(args[1]).startswith(("4", "5")):
            super().log_message(formato, *args)


class Reusable(socketserver.TCPServer):
    allow_reuse_address = True


def main():
    os.chdir(RAIZ)
    manejador = functools.partial(SinCache, directory=str(RAIZ))
    url = f"http://localhost:{PUERTO}/app/"
    with Reusable(("", PUERTO), manejador) as servidor:
        print(f"Design Code · Santiago Ways")
        print(f"  Herramienta  {url}")
        print(f"  Bloques      http://localhost:{PUERTO}/design-system/preview.html")
        print(f"  Ctrl+C para parar")
        try:
            webbrowser.open(url)
        except Exception:
            pass
        try:
            servidor.serve_forever()
        except KeyboardInterrupt:
            print("\nParado.")


if __name__ == "__main__":
    main()
