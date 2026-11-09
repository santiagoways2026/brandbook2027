# -*- coding: utf-8 -*-
"""Monta el artículo /es/mapa-camino-de-santiago/ con los mapas nuevos.

    python tools/mapas/articulo.py

Lee salidas/mapa-camino-de-santiago/mapas/indice.json (lo escribe generar.py), así que las
cifras del texto, de las tablas y de los pies son siempre las de los SVG.

Escribe en salidas/mapa-camino-de-santiago/:
    articulo.html      el cuerpo del post, listo para pegar en un bloque HTML de WordPress
    schema.html        el JSON-LD para la cabecera (o para el campo del plugin de SEO)
    vista-previa.html  el mismo artículo con los SVG locales y las hojas del design system

Solo usa bloques catalogados: mapa, stats, tabla-responsive y cta-box. Su marcado es el de
bloques/<id>.html, carácter a carácter.
"""
import html
import json
import pathlib
import sys

AQUI = pathlib.Path(__file__).resolve().parent
RAIZ = AQUI.parent.parent
sys.path.insert(0, str(AQUI))
from generar import km_es  # noqa: E402

SALIDA = RAIZ / "salidas" / "mapa-camino-de-santiago"
URL_PAGINA = "https://santiagoways.com/es/mapa-camino-de-santiago/"
# WordPress guarda lo subido en uploads/<año>/<mes>/. Si se suben otro mes, se cambia aquí.
UPLOADS = "https://santiagoways.com/wp-content/uploads/2026/11/"
SARRIA = "https://santiagoways.com/es/camino-de-santiago/camino-frances/de-sarria-a-santiago/"
PRESUPUESTO = "/?page_id=67170"

e = html.escape


# ------------------------------------------------------------------ bloques

def b_mapa(img, movil, alt, titulo, texto, gpx=None, primero=False):
    """img y movil: (url, ancho, alto)."""
    url_img, ancho, alto = img
    clase = "mapa mapa--vertical" if alto > ancho * 1.1 else "mapa"
    carga = ('loading="eager" fetchpriority="high" decoding="async"' if primero
             else 'loading="lazy" decoding="async"')
    enlaces = []
    if gpx:
        enlaces.append(f'<a class="mapa__link" href="{e(gpx)}" download>Descargar el track GPX</a>')
    enlaces.append(f'<a class="mapa__link" href="{e(url_img)}">Ver el mapa a pantalla completa</a>')
    return "\n".join([
        f'<figure class="{clase}">',
        f'<a class="mapa__media" href="{e(url_img)}"><picture><source media="(max-width: 760px)" '
        f'srcset="{e(movil[0])}" width="{movil[1]}" height="{movil[2]}" />'
        f'<img class="mapa__img" src="{e(url_img)}" alt="{e(alt)}" '
        f'width="{ancho}" height="{alto}" {carga} /></picture></a>',
        '<figcaption class="mapa__caption">',
        f'<span class="mapa__title">{e(titulo)}</span>',
        f'<span class="mapa__text">{texto}</span>',
        f'<span class="mapa__links">{"".join(enlaces)}</span>',
        '</figcaption>',
        '</figure>',
    ])


def b_stats(pares):
    out = ['<div class="stats">']
    for valor, etiqueta in pares:
        out += ['<div class="stats__card">', '<div class="stats__bar"></div>', '<div class="stats__body">',
                f'<div class="stats__value">{e(valor)}</div>', f'<div class="stats__label">{e(etiqueta)}</div>',
                '</div>', '</div>']
    out.append('</div>')
    return "\n".join(out)


def b_tabla(cabeceras, filas):
    out = ['<div class="tabla-responsive-wrap">', '<table class="tabla-responsive">', '<thead>', '<tr>']
    out += [f'<th>{e(c)}</th>' for c in cabeceras]
    out += ['</tr>', '</thead>', '<tbody>']
    for fila in filas:
        out.append('<tr>')
        out.append(f'<td><strong>{fila[0]}</strong></td>')
        for c, v in zip(cabeceras[1:], fila[1:]):
            out.append(f'<td data-label="{e(c)}">{v}</td>')
        out.append('</tr>')
    out += ['</tbody>', '</table>', '</div>']
    return "\n".join(out)


def b_cta(titulo, texto, boton, url):
    return "\n".join(['<div class="cta-box">', f'<h3 class="cta-box__title">{e(titulo)}</h3>',
                      f'<p class="cta-box__text">{texto}</p>',
                      f'<a class="cta-box__button" href="{e(url)}">{e(boton)}</a>', '</div>'])


# ------------------------------------------------------------------ datos

IDX = json.loads((SALIDA / "mapas" / "indice.json").read_text(encoding="utf-8"))

DIFICULTAD = {
    "frances": "Media", "portugues": "Media-baja", "costa": "Baja", "norte": "Alta",
    "primitivo": "Alta", "ingles": "Media", "plata": "Alta", "fisterra": "Media",
}
TECHO = {"frances": "Cruz de Ferro", "primitivo": "Puerto del Palo", "plata": "Alto de Padornelo"}
INICIO = {
    "frances": "Saint-Jean-Pied-de-Port", "portugues": "Lisboa", "costa": "Oporto", "norte": "Irún",
    "primitivo": "Oviedo", "ingles": "Ferrol", "plata": "Sevilla", "fisterra": "Santiago",
}
POR = {
    "frances": "Pamplona, Logroño, Burgos, León, Ponferrada, O Cebreiro y Sarria",
    "portugues": "Santarém, Coimbra, Oporto, Ponte de Lima, Tui y Pontevedra",
    "costa": "Viana do Castelo, A Guarda, Baiona, Vigo y Pontevedra",
    "norte": "San Sebastián, Bilbao, Santander, Gijón, Ribadeo y Arzúa",
    "primitivo": "Grado, Tineo, Grandas de Salime, A Fonsagrada, Lugo y Melide",
    "ingles": "Pontedeume, Betanzos y Hospital de Bruma",
    "plata": "Mérida, Cáceres, Salamanca, Zamora, Puebla de Sanabria y Ourense",
    "fisterra": "Negreira, Olveiroa y Cee",
}


def km(clave):
    return km_es(IDX[clave]["km"])


def desnivel(clave):
    return km_es(round(IDX[clave]["subida"], -2))


def techo(clave):
    return km_es(IDX[clave]["max"])


def nombre_con_articulo(clave):
    n = IDX[clave]["nombre"]
    return ("de la " if n.startswith("Vía") else "del ") + n


def pieza(base, datos):
    return (base + datos["svg"], datos["ancho"], datos["alto"])


def mapa_de(clave, base, primero=False):
    r = IDX[clave]
    alt = f"Mapa {nombre_con_articulo(clave)} de {INICIO[clave]} a Santiago de Compostela, por {POR[clave]}"
    if clave == "fisterra":
        alt = "Mapa del Camino de Finisterre y Muxía desde Santiago de Compostela, por Negreira, Olveiroa y Cee"
    titulo = r["titulo"]
    texto = (f"{km(clave)} km de {INICIO[clave]} a Santiago de Compostela. En verde, la ruta; en gris, "
             f"el resto de caminos que llegan a Santiago.")
    if clave == "fisterra":
        texto = (f"{km(clave)} km de Santiago a Fisterra, con el ramal que se separa en Hospital hacia Muxía.")
    gpx = (base + "gpx/" + r["gpx"]) if base.startswith(".") else UPLOADS + r["gpx"]
    return b_mapa(pieza(base, r["web"]["mapa"]), pieza(base, r["movil"]["mapa"]), alt, titulo, texto, gpx, primero)


def perfil_de(clave, base):
    r = IDX[clave]
    nombre_t = TECHO.get(clave)
    techo_txt = f"{nombre_t}, {techo(clave)} m" if nombre_t else f"{techo(clave)} m"
    alt = (f"Perfil de altitud {nombre_con_articulo(clave)}: {km(clave)} km, punto más alto en {techo_txt} "
           f"y unos {desnivel(clave)} m de desnivel positivo")
    texto = f"Unos {desnivel(clave)} m de desnivel positivo acumulado. Punto más alto: {techo_txt}."
    return b_mapa(pieza(base, r["web"]["perfil"]), pieza(base, r["movil"]["perfil"]), alt, r["titulo_perfil"], texto)


def stats_de(clave):
    return b_stats([(f"{km(clave)} km", "Distancia"), (f"+{desnivel(clave)} m", "Desnivel"),
                    (f"{techo(clave)} m", "Punto más alto"), (DIFICULTAD[clave], "Dificultad")])


# ------------------------------------------------------------------ artículo

def articulo(base):
    """base: prefijo de las imágenes. UPLOADS para WordPress, «mapas/» para la vista previa."""
    g = IDX["general"]
    P = []
    a = P.append

    a('<p>El mapa del Camino de Santiago reúne un conjunto de rutas históricas que atraviesan la península '
      'y Europa hasta la catedral de Santiago de Compostela. Aunque solemos hablar del Camino como si fuera '
      'una sola ruta, hay varios itinerarios, cada uno con su recorrido, su dificultad y su paisaje.</p>')
    a('<p>En esta guía tienes el mapa de las ocho rutas más recorridas, una por una, con su perfil de '
      'altitud y su track GPX para descargar. Los trazados son los de las rutas señalizadas y las cifras '
      'salen de medirlos sobre el terreno.</p>')

    a('<h2>Mapa de las rutas del Camino de Santiago</h2>')
    a(b_mapa(pieza(base, g["web"]), pieza(base, g["movil"]),
             "Mapa del Camino de Santiago con todas sus rutas: Camino Francés, del Norte, Primitivo, Inglés, "
             "Portugués, Portugués por la Costa, Vía de la Plata y Camino de Finisterre y Muxía",
             "Mapa del Camino de Santiago con todas sus rutas",
             "Los ocho itinerarios de esta guía. Todos terminan en la catedral de Santiago, salvo el de "
             "Finisterre y Muxía, que sale de ella hacia el Atlántico.", None, primero=True))
    a('<p>Fíjate en cómo se juntan las rutas al acercarse a Santiago: el Primitivo se une al Francés en '
      'Melide y el del Norte, en Arzúa. Por eso los últimos días del Camino Francés son los más '
      'concurridos.</p>')

    a('<h2>Las rutas del Camino de Santiago, comparadas</h2>')
    filas = []
    for clave in ("frances", "portugues", "costa", "norte", "primitivo", "ingles", "plata", "fisterra"):
        filas.append([e(IDX[clave]["nombre"]), e(INICIO[clave]), f"<strong>{km(clave)} km</strong>",
                      f"+{desnivel(clave)} m", f"{techo(clave)} m", e(DIFICULTAD[clave])])
    a(b_tabla(["Ruta", "Inicio", "Distancia", "Desnivel positivo", "Punto más alto", "Dificultad"], filas))
    a('<p>Las distancias están medidas sobre el trazado señalizado y los desniveles, sobre un modelo digital '
      'del terreno: tómalos como aproximados. Las guías oficiales pueden dar unos kilómetros de más o de '
      'menos según las variantes que cuenten.</p>')

    a('<h2>Qué muestra el mapa del Camino de Santiago</h2>')
    a('<p>El mapa general sirve para ver cómo se reparten las rutas jacobeas y dónde confluyen antes de '
      'llegar a Santiago. Existen muchas variantes históricas y ramales secundarios, pero en la práctica se '
      'habla de rutas cuando están señalizadas, tienen tradición jacobea reconocida y cuentan con '
      'servicios para peregrinos.</p>')
    a('<p>En los mapas de cada ruta, la línea verde es el itinerario y los puntos son las poblaciones y '
      'finales de etapa más habituales. En gris aparecen el resto de caminos, para que veas con cuáles se '
      'cruza. Debajo de cada mapa va su perfil de altitud: la forma más rápida de saber dónde están las '
      'subidas.</p>')

    # Francés
    a('<h2>Mapa del Camino Francés</h2>')
    a('<p>El Camino Francés es la ruta más conocida y transitada del Camino de Santiago, y la única '
      'declarada Patrimonio de la Humanidad por la Unesco como itinerario. Sale de Saint-Jean-Pied-de-Port, '
      'en Francia, cruza los Pirineos por Roncesvalles y atraviesa el norte peninsular hasta Santiago.</p>')
    a(stats_de("frances"))
    a(mapa_de("frances", base))
    a('<h3>Recorrido del Camino Francés</h3>')
    a(f'<p>Son unos {km("frances")} km desde Saint-Jean-Pied-de-Port. Pasa por Pamplona, Logroño, Burgos, '
      'León, Astorga, Ponferrada, O Cebreiro y Sarria, y en su tramo final se le unen otras rutas.</p>')
    a(f'<p>Su tramo más popular es el <a href="{SARRIA}">Camino Francés desde Sarria</a>: son los últimos '
      '115 km, algo más de la distancia mínima a pie para conseguir la Compostela.</p>')
    a('<h3>Perfil del Camino Francés</h3>')
    a('<p>No es la ruta más fácil ni la más exigente. Combina etapas de montaña, zonas onduladas y largos '
      'tramos de llanura en la meseta castellana. Las tres subidas que marcan el perfil son el paso de los '
      f'Pirineos hasta Roncesvalles, la Cruz de Ferro, techo del Camino con {techo("frances")} m, y el '
      'ascenso a O Cebreiro, ya a las puertas de Galicia.</p>')
    a(perfil_de("frances", base))

    # Portugués
    a('<h2>Mapa del Camino Portugués</h2>')
    a('<p>El Camino Portugués es la segunda ruta más recorrida. Tiene dos grandes variantes, la Central y la '
      'de la Costa, que atraviesan Portugal de sur a norte, entran en Galicia y se juntan en Redondela. Son '
      'rutas amables en lo físico y con buenos servicios.</p>')
    a('<h3>Camino Portugués Central</h3>')
    a('<p>Sale tradicionalmente de Lisboa, aunque mucha gente empieza en Oporto o en Tui. Entra en España '
      'por el puente internacional entre Valença y Tui y sigue por O Porriño, Redondela, Pontevedra, Caldas '
      'de Reis y Padrón.</p>')
    a(stats_de("portugues"))
    a(mapa_de("portugues", base))
    a(f'<p>Desde Lisboa son unos {km("portugues")} km. No tiene grandes puertos: el punto más alto apenas '
      f'pasa de {techo("portugues")} m, en el tramo entre Santarém y Coimbra. Por eso es una de las rutas '
      'más recomendables para un primer Camino.</p>')
    a(perfil_de("portugues", base))
    a('<h3>Camino Portugués por la Costa</h3>')
    a('<p>Nace en Oporto y sube junto al Atlántico por Vila do Conde, Esposende y Viana do Castelo hasta '
      'cruzar el Miño entre Caminha y A Guarda. Sigue por la costa gallega, por Baiona y Vigo, y se une al '
      'trazado central en Redondela.</p>')
    a(stats_de("costa"))
    a(mapa_de("costa", base))
    a(f'<p>Son unos {km("costa")} km desde Oporto. Casi todo el recorrido va a baja altitud y el punto más '
      'alto es la propia llegada a Santiago. Es de las rutas más cómodas, y una buena opción para '
      'caminar en verano con la brisa del mar.</p>')
    a(perfil_de("costa", base))

    # Norte
    a('<h2>Mapa del Camino del Norte</h2>')
    a('<p>El Camino del Norte, también llamado de la Costa, sale de Irún y recorre toda la cornisa cantábrica '
      'hasta Galicia. Es una de las rutas más espectaculares: mar, acantilados, pueblos marineros y etapas '
      'muy variadas. En Arzúa se une al Camino Francés.</p>')
    a(stats_de("norte"))
    a(mapa_de("norte", base))
    a('<h3>Recorrido del Camino del Norte</h3>')
    a(f'<p>Son unos {km("norte")} km por el País Vasco, Cantabria, Asturias y Galicia, pasando por San '
      'Sebastián, Bilbao, Santander, Gijón y Ribadeo. Está menos concurrido que el Francés y tiene mucha '
      'identidad local.</p>')
    a('<h3>Perfil del Camino del Norte</h3>')
    a(f'<p>Ningún puerto es muy alto, pero el perfil no da tregua: el sube y baja constante de la costa suma '
      f'unos {desnivel("norte")} m de desnivel positivo, el mayor de todas las rutas. A eso se añaden etapas '
      'largas y algo menos de infraestructura que en el Francés o el Portugués.</p>')
    a(perfil_de("norte", base))

    # Primitivo
    a('<h2>Mapa del Camino Primitivo</h2>')
    a('<p>El Camino Primitivo sale de Oviedo y está considerado la ruta jacobea más antigua. Cruza el interior '
      'montañoso de Asturias y Galicia, pasa por Lugo y su muralla romana y se une al Camino Francés en '
      'Melide.</p>')
    a(stats_de("primitivo"))
    a(mapa_de("primitivo", base))
    a('<h3>Recorrido del Camino Primitivo</h3>')
    a(f'<p>Son unos {km("primitivo")} km por zonas rurales, de montaña y pueblos pequeños: un Camino más '
      'tranquilo y menos concurrido que los más populares.</p>')
    a('<h3>Perfil del Camino Primitivo</h3>')
    a(f'<p>Es la ruta más dura de las grandes, por cómo concentra el desnivel. El paso clave es el Puerto del '
      f'Palo, a {techo("primitivo")} m, seguido del descenso al embalse de Salime y la subida a A Fonsagrada. '
      'Se recomienda a quien ya tiene experiencia o busca un Camino deportivo y de naturaleza.</p>')
    a(perfil_de("primitivo", base))

    # Otras
    a('<h2>Otras rutas del Camino de Santiago</h2>')
    a('<p>Además de las rutas más populares, el mapa del Camino incluye otros itinerarios históricos que '
      'merecen atención.</p>')
    a('<h3>La Vía de la Plata y el Camino Sanabrés</h3>')
    a(f'<p>La Vía de la Plata es la ruta jacobea más larga: cruza la península de sur a norte desde Sevilla, '
      'por Mérida, Cáceres, Salamanca y Zamora. En Granja de Moreruela se separa el Camino Sanabrés, que '
      f'entra en Galicia por Puebla de Sanabria y Ourense. En total, unos {km("plata")} km.</p>')
    a(stats_de("plata"))
    a(mapa_de("plata", base))
    a(f'<p>Es una ruta solitaria y de fondo. El punto más alto es el Alto de Padornelo, a {techo("plata")} m, '
      'ya en la sierra de Sanabria.</p>')
    a(perfil_de("plata", base))
    a('<h3>El Camino Inglés</h3>')
    a(f'<p>Es la ruta más corta: unos {km("ingles")} km desde Ferrol, por Pontedeume y Betanzos. Supera los '
      '100 km que pide la Compostela y cabe en una semana, así que es buena opción si tienes pocos días.</p>')
    a(mapa_de("ingles", base))
    a(perfil_de("ingles", base))
    a('<h3>El Camino de Finisterre y Muxía</h3>')
    a(f'<p>Es el único que sale de Santiago en vez de llegar a ella. Va hacia la Costa da Morte por Negreira y '
      f'Olveiroa: unos {km("fisterra")} km hasta el faro de Fisterra, con un ramal que se separa en Hospital '
      'hacia Muxía. Mucha gente lo hace después de llegar a Compostela, para terminar el Camino en el '
      'mar.</p>')
    a(mapa_de("fisterra", base))
    a(perfil_de("fisterra", base))

    a('<h2>Qué ruta del Camino de Santiago elegir según tu perfil</h2>')
    a('<p>Depende del tiempo que tengas, de tu forma física, de la época del año y del paisaje que prefieras. '
      'De forma general:</p>')
    a('<ul>\n'
      '<li><strong>Camino Francés:</strong> la opción más clásica y completa.</li>\n'
      f'<li><strong><a href="{SARRIA}">Camino Francés desde Sarria</a>:</strong> ideal para una primera vez y '
      'para conseguir la Compostela en pocos días.</li>\n'
      '<li><strong>Camino Portugués Central:</strong> equilibrado, cómodo y con mucha tradición.</li>\n'
      '<li><strong>Camino Portugués por la Costa:</strong> el más suave, siempre cerca del mar.</li>\n'
      '<li><strong>Camino del Norte:</strong> paisajístico, exigente y menos concurrido.</li>\n'
      '<li><strong>Camino Primitivo:</strong> el más duro y uno de los más auténticos.</li>\n'
      '<li><strong>Camino Inglés:</strong> perfecto si tienes pocos días.</li>\n'
      '</ul>')

    a('<h2>Descarga los tracks GPX del Camino de Santiago</h2>')
    a('<p>Cada mapa lleva su track GPX. Sirve para llevar el trazado en el móvil o en el reloj, y para verlo '
      'sobre Google Maps: en Google My Maps, crea un mapa nuevo y usa «Importar» para cargar el archivo. '
      'También se abre en Wikiloc, Organic Maps o cualquier GPS de montaña.</p>')
    lista = []
    for clave in ("frances", "portugues", "costa", "norte", "primitivo", "ingles", "plata", "fisterra"):
        url = (base + "gpx/" + IDX[clave]["gpx"]) if base.startswith(".") else UPLOADS + IDX[clave]["gpx"]
        lista.append(f'<li><a href="{e(url)}" download>Track GPX {nombre_con_articulo(clave)}</a> '
                     f'({km(clave)} km)</li>')
    a("<ul>\n" + "\n".join(lista) + "\n</ul>")
    a('<p>Los tracks están simplificados para orientarse, no para seguirlos metro a metro. En el terreno manda '
      'siempre la señalización: las flechas amarillas y los mojones con la concha.</p>')

    a('<h2>Consejos para usar un mapa del Camino de Santiago</h2>')
    a('<p>Consultar el mapa antes de viajar ayuda a entender el recorrido, calcular etapas, comparar rutas y '
      'ver cómo se conectan los itinerarios. Además del mapa general, revisa siempre la información práctica '
      'de cada ruta: kilómetros, desnivel, servicios, alojamientos, clima y puntos de inicio habituales.</p>')
    a('<p>Si vas a caminar varios días, lleva el track GPX en el móvil y descarga los mapas para usarlos sin '
      'conexión: en algunas etapas de montaña la cobertura falla.</p>')

    a('<h2>Preguntas frecuentes sobre el mapa del Camino de Santiago</h2>')
    a('<h3>¿Cuál es la ruta más corta del Camino de Santiago?</h3>')
    a(f'<p>El Camino Inglés desde Ferrol, con unos {km("ingles")} km. Le sigue el Camino Francés desde Sarria, '
      'con unos 115 km.</p>')
    a('<h3>¿Desde dónde hay que empezar para conseguir la Compostela?</h3>')
    a('<p>Hay que recorrer al menos los últimos 100 km a pie, o 200 km en bicicleta. Por eso los inicios más '
      'habituales son Sarria en el Camino Francés, Tui en el Portugués y Ferrol en el Inglés.</p>')
    a('<h3>¿Cuál es la ruta más dura?</h3>')
    a('<p>El Camino Primitivo, por la forma en que concentra las subidas. El del Norte suma más desnivel en '
      'total, pero lo reparte en muchos más kilómetros.</p>')
    a('<h3>¿Puedo ver estos mapas en Google Maps?</h3>')
    a('<p>Sí. Descarga el track GPX de la ruta e impórtalo en Google My Maps: verás el trazado sobre el mapa '
      'de Google y podrás consultarlo desde el móvil.</p>')

    a(b_cta("¿Te organizamos el Camino?",
            "En Santiago Ways organizamos <strong>viajes autoguiados</strong> por todas estas rutas, con "
            "alojamientos seleccionados, traslado de equipaje y asistencia 24 horas, para que solo tengas "
            "que caminar a tu ritmo.",
            "Solicitar presupuesto", PRESUPUESTO))
    return "\n\n".join(P) + "\n"


def schema():
    g = IDX["general"]["web"]
    imagenes = [{"@type": "ImageObject", "contentUrl": UPLOADS + g["svg"],
                 "name": IDX["general"]["titulo"], "description": IDX["general"]["desc"],
                 "width": g["ancho"], "height": g["alto"]}]
    for clave in ("frances", "portugues", "costa", "norte", "primitivo", "ingles", "plata", "fisterra"):
        r = IDX[clave]
        m, pf = r["web"]["mapa"], r["web"]["perfil"]
        imagenes.append({"@type": "ImageObject", "contentUrl": UPLOADS + m["svg"], "name": r["titulo"],
                         "description": r["desc"], "width": m["ancho"], "height": m["alto"]})
        imagenes.append({"@type": "ImageObject", "contentUrl": UPLOADS + pf["svg"], "name": r["titulo_perfil"],
                         "description": r["desc_perfil"], "width": pf["ancho"], "height": pf["alto"]})
    datos = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "@id": URL_PAGINA + "#rutas",
        "name": "Rutas del Camino de Santiago",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "item": {
                "@type": "TouristTrip",
                "name": IDX[clave]["nombre"],
                "description": f"{km(clave)} km de {INICIO[clave]} a Santiago de Compostela",
                "url": URL_PAGINA,
                "image": UPLOADS + IDX[clave]["web"]["mapa"]["svg"],
                "touristType": "Peregrinos y senderistas",
            }}
            for i, clave in enumerate(("frances", "portugues", "costa", "norte", "primitivo", "ingles", "plata",
                                       "fisterra"))
        ],
    }
    galeria = {"@context": "https://schema.org", "@type": "ImageGallery", "@id": URL_PAGINA + "#mapas",
               "name": "Mapas y perfiles del Camino de Santiago", "url": URL_PAGINA, "image": imagenes}
    bloque = json.dumps([datos, galeria], ensure_ascii=False, indent=1)
    return ('<!-- JSON-LD para /es/mapa-camino-de-santiago/. Va en el <head> o en el campo de schema del '
            'plugin de SEO, no en el cuerpo del post. Complementa al Article que ya genera Yoast. -->\n'
            f'<script type="application/ld+json">\n{bloque}\n</script>\n')


def vista_previa(cuerpo):
    return f"""<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vista previa · Mapa del Camino de Santiago</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../design-system/bloques.css">
<link rel="stylesheet" href="../../design-system/tabla-responsive.css">
<link rel="stylesheet" href="../../design-system/mapa.css">
<style>
/* Solo para la vista previa: imita la columna de texto del blog. En WordPress la pone el tema. */
body{{margin:0;background:#FFFFFF;color:#2E2E2D;font-family:Montserrat,system-ui,sans-serif;font-size:16px;line-height:1.6}}
main{{max-width:820px;margin:0 auto;padding:40px 16px 80px}}
h1{{font-size:40px;line-height:1.1;font-weight:800;margin:0 0 24px}}
h2{{font-size:30px;line-height:1.15;font-weight:700;margin:56px 0 16px}}
h3{{font-size:22px;line-height:1.2;font-weight:700;margin:36px 0 12px}}
a{{color:#506718}}
.aviso{{background:#FAFFEE;border-radius:12px;padding:14px 18px;font-size:14px;margin-bottom:32px}}
@media (max-width:600px){{h1{{font-size:30px}}h2{{font-size:24px}}}}
</style>
</head>
<body>
<main>
<p class="aviso">Vista previa local. En WordPress el título lo pone el tema y las imágenes apuntan a <code>{UPLOADS}</code>.</p>
<h1>Mapa del Camino de Santiago: todas las rutas, perfiles y tracks GPX</h1>
{cuerpo}
</main>
</body>
</html>
"""


def main():
    (SALIDA / "articulo.html").write_text(articulo(UPLOADS), encoding="utf-8")
    (SALIDA / "schema.html").write_text(schema(), encoding="utf-8")
    (SALIDA / "vista-previa.html").write_text(vista_previa(articulo("./mapas/").replace(
        'href="./mapas/gpx/', 'href="./gpx/')), encoding="utf-8")
    print("articulo.html, schema.html y vista-previa.html escritos en", SALIDA.relative_to(RAIZ))


if __name__ == "__main__":
    main()
