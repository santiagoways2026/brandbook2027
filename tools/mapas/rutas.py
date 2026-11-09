# -*- coding: utf-8 -*-
"""Definición de las rutas que dibuja tools/mapas.

Cada ruta dice:
  relaciones  relaciones de OpenStreetMap cuyas vías forman el trazado. Se bajan de
              forma recursiva: una superruta trae todas sus etapas.
  paso        lugares por los que el trazado TIENE que pasar, en orden. El camino
              se calcula como el más corto sobre la red de vías que pasa por todos.
              Así se descartan variantes y ramales sin tocar los datos.
  lugares     pueblos que se marcan. «nivel» decide qué se rotula:
                1  siempre (inicio, meta y grandes ciudades)
                2  en el mapa de la ruta
                3  solo como punto, sin rótulo, y en el perfil si hay sitio
  ramales     tramos extra que se dibujan con la ruta (p. ej. Muxía).

Las coordenadas de cada lugar salen de Nominatim y se guardan en datos/lugares.json.
Si una sale mal, se corrige ahí a mano: el script no la vuelve a pedir.
"""

SANTIAGO = "Santiago de Compostela"

# Relaciones del Camino Francés: se reutilizan para los tramos finales de Norte y Primitivo.
FRANCES = [2163573]

RUTAS = {
    "frances": {
        "nombre": "Camino Francés",
        "corto": "Francés",
        "relaciones": FRANCES,
        "paso": ["Saint-Jean-Pied-de-Port", "Roncesvalles", "Pamplona", "Logroño", "Burgos",
                 "León", "Astorga", "Ponferrada", "O Cebreiro", "Sarria", "Melide", SANTIAGO],
        "lugares": [
            ("Saint-Jean-Pied-de-Port", 1), ("Roncesvalles", 2), ("Pamplona", 1),
            ("Puente la Reina", 3), ("Estella", 3), ("Logroño", 1), ("Nájera", 3),
            ("Santo Domingo de la Calzada", 3), ("Burgos", 1), ("Castrojeriz", 3),
            ("Frómista", 3), ("Carrión de los Condes", 3), ("Sahagún", 2), ("León", 1),
            ("Astorga", 2), ("Foncebadón", 3), ("Ponferrada", 2), ("Villafranca del Bierzo", 3),
            ("O Cebreiro", 2), ("Sarria", 2), ("Portomarín", 3), ("Palas de Rei", 3),
            ("Melide", 3), ("Arzúa", 3), ("O Pedrouzo", 3), (SANTIAGO, 1),
        ],
    },
    "portugues": {
        "nombre": "Camino Portugués Central",
        "corto": "Portugués",
        "relaciones": [7684546, 12786090],
        "paso": ["Lisboa", "Santarém", "Tomar", "Coimbra", "Porto", "Barcelos", "Ponte de Lima",
                 "Valença", "Tui", "Redondela", "Pontevedra", "Padrón", SANTIAGO],
        "lugares": [
            ("Lisboa", 1), ("Vila Franca de Xira", 3), ("Santarém", 2), ("Golegã", 3),
            ("Tomar", 2), ("Ansião", 3), ("Coimbra", 1), ("Mealhada", 3), ("Águeda", 3),
            ("Albergaria-a-Velha", 3), ("Oliveira de Azeméis", 3), ("Porto", 1),
            ("Vilarinho", 3), ("Barcelos", 2), ("Ponte de Lima", 2), ("Rubiães", 3),
            ("Valença", 2), ("Tui", 1), ("O Porriño", 3), ("Redondela", 3), ("Pontevedra", 2),
            ("Caldas de Reis", 3), ("Padrón", 3), (SANTIAGO, 1),
        ],
    },
    "costa": {
        "nombre": "Camino Portugués por la Costa",
        "corto": "Portugués por la Costa",
        "relaciones": [6100606, 18168169, 8099566, 12786089, 12786090],
        "paso": ["Porto", "Vila do Conde", "Esposende", "Viana do Castelo", "Caminha",
                 "A Guarda", "Baiona", "Vigo", "Redondela", "Pontevedra", "Padrón", SANTIAGO],
        "lugares": [
            ("Porto", 1), ("Vila do Conde", 3), ("Póvoa de Varzim", 3), ("Esposende", 3),
            ("Viana do Castelo", 2), ("Caminha", 3), ("A Guarda", 2), ("Oia", 3),
            ("Baiona", 2), ("Vigo", 1), ("Redondela", 3), ("Pontevedra", 2),
            ("Caldas de Reis", 3), ("Padrón", 3), (SANTIAGO, 1),
        ],
    },
    "norte": {
        "nombre": "Camino del Norte",
        "corto": "Norte",
        "relaciones": [19001007, 1554697] + FRANCES,
        "paso": ["Irún", "San Sebastián", "Bilbao", "Santander", "Llanes", "Gijón", "Avilés",
                 "Luarca", "Ribadeo", "Mondoñedo", "Vilalba", "Sobrado dos Monxes", "Arzúa", SANTIAGO],
        "lugares": [
            ("Irún", 1), ("San Sebastián", 2), ("Zarautz", 3), ("Deba", 3), ("Markina-Xemein", 3),
            ("Gernika", 3), ("Bilbao", 1), ("Portugalete", 3), ("Castro Urdiales", 3),
            ("Laredo", 3), ("Güemes", 3), ("Santander", 1), ("Santillana del Mar", 3),
            ("Comillas", 3), ("San Vicente de la Barquera", 3), ("Llanes", 2),
            ("Ribadesella", 3), ("Villaviciosa", 3), ("Gijón", 1), ("Avilés", 2),
            ("Soto de Luiña", 3), ("Luarca", 2), ("Ribadeo", 2), ("Mondoñedo", 3),
            ("Vilalba", 3), ("Baamonde", 3), ("Sobrado dos Monxes", 3), ("Arzúa", 2),
            ("O Pedrouzo", 3), (SANTIAGO, 1),
        ],
    },
    "primitivo": {
        "nombre": "Camino Primitivo",
        "corto": "Primitivo",
        "relaciones": [19298101] + FRANCES,
        "paso": ["Oviedo", "Grado", "Salas", "Tineo", "Pola de Allande", "Grandas de Salime",
                 "A Fonsagrada", "Lugo", "Melide", "Arzúa", SANTIAGO],
        "lugares": [
            ("Oviedo", 1), ("Grado", 3), ("Salas", 3), ("Tineo", 2), ("Pola de Allande", 3),
            ("Grandas de Salime", 2), ("A Fonsagrada", 2), ("O Cádavo", 3), ("Lugo", 1),
            ("San Romao da Retorta", 3), ("Melide", 2), ("Arzúa", 3), ("O Pedrouzo", 3),
            (SANTIAGO, 1),
        ],
    },
    "ingles": {
        "nombre": "Camino Inglés",
        "corto": "Inglés",
        "relaciones": [1102966],
        "paso": ["Ferrol", "Pontedeume", "Betanzos", "Hospital de Bruma", "Sigüeiro", SANTIAGO],
        "lugares": [
            ("Ferrol", 1), ("Neda", 3), ("Pontedeume", 2), ("Miño", 3), ("Betanzos", 2),
            ("Hospital de Bruma", 3), ("Sigüeiro", 3), (SANTIAGO, 1),
        ],
    },
    "plata": {
        "nombre": "Vía de la Plata y Camino Sanabrés",
        "corto": "Vía de la Plata",
        "relaciones": [241329, 2164353, 2164354],
        # El Sanabrés tiene un hueco en OSM entre Puebla de Sanabria y A Gudiña: se cose
        # con más margen que en el resto de rutas.
        "costura_km": 1.0,
        "paso": ["Sevilla", "Zafra", "Mérida", "Cáceres", "Salamanca", "Zamora",
                 "Granja de Moreruela", "Puebla de Sanabria", "A Gudiña", "Ourense", SANTIAGO],
        "lugares": [
            ("Sevilla", 1), ("Zafra", 3), ("Mérida", 1), ("Cáceres", 2), ("Carcaboso", 3),
            ("Baños de Montemayor", 3), ("Salamanca", 1), ("Zamora", 2),
            ("Granja de Moreruela", 3), ("Puebla de Sanabria", 2), ("A Gudiña", 3),
            ("Laza", 3), ("Ourense", 1), ("Cea", 3), ("Silleda", 3), (SANTIAGO, 1),
        ],
    },
    "fisterra": {
        "nombre": "Camino de Finisterre y Muxía",
        "corto": "Finisterre y Muxía",
        "relaciones": [385098],
        "paso": [SANTIAGO, "Negreira", "Olveiroa", "Cee", "Fisterra"],
        "ramales": [["Olveiroa", "Dumbría", "Muxía"]],
        "lugares": [
            (SANTIAGO, 1), ("Negreira", 2), ("Santa Mariña", 3), ("Olveiroa", 2),
            ("Cee", 3), ("Fisterra", 1), ("Dumbría", 3), ("Muxía", 1),
        ],
    },
}

# Pistas para Nominatim: país y, si hace falta, una consulta más precisa.
CONSULTAS = {
    "Saint-Jean-Pied-de-Port": "Saint-Jean-Pied-de-Port, France",
    "Roncesvalles": "Orreaga/Roncesvalles, Navarra",
    "O Cebreiro": "O Cebreiro, Pedrafita do Cebreiro, Lugo",
    "Foncebadón": "Foncebadón, León",
    "O Pedrouzo": "O Pedrouzo, O Pino, A Coruña",
    "Melide": "Melide, A Coruña",
    "Arzúa": "Arzúa, A Coruña",
    "Palas de Rei": "Palas de Rei, Lugo",
    "Lisboa": "Lisboa, Portugal",
    "Porto": "Porto, Portugal",
    "Santarém": "Santarém, Portugal",
    "Tomar": "Tomar, Portugal",
    "Coimbra": "Coimbra, Portugal",
    "Golegã": "Golegã, Portugal",
    "Ansião": "Ansião, Portugal",
    "Mealhada": "Mealhada, Portugal",
    "Águeda": "Águeda, Portugal",
    "Albergaria-a-Velha": "Albergaria-a-Velha, Portugal",
    "Oliveira de Azeméis": "Oliveira de Azeméis, Portugal",
    "Vilarinho": "Vilarinho, Portugal",
    "Barcelos": "Barcelos, Portugal",
    "Ponte de Lima": "Ponte de Lima, Portugal",
    "Rubiães": "Rubiães, Paredes de Coura, Portugal",
    "Valença": "Valença, Viana do Castelo, Portugal",
    "Vila Franca de Xira": "Vila Franca de Xira, Portugal",
    "Vila do Conde": "Vila do Conde, Portugal",
    "Póvoa de Varzim": "Póvoa de Varzim, Portugal",
    "Esposende": "Esposende, Portugal",
    "Viana do Castelo": "Viana do Castelo, Portugal",
    "Caminha": "Caminha, Portugal",
    "Tui": "Tui, Pontevedra",
    "O Porriño": "O Porriño, Pontevedra",
    "Redondela": "Redondela, Pontevedra",
    "A Guarda": "A Guarda, Pontevedra",
    "Oia": "Oia, Pontevedra",
    "Baiona": "Baiona, Pontevedra",
    "Vigo": "Vigo, Pontevedra",
    "Pontevedra": "Pontevedra, Pontevedra",
    "Caldas de Reis": "Caldas de Reis, Pontevedra",
    "Padrón": "Padrón, A Coruña",
    "Irún": "Irun, Gipuzkoa",
    "San Sebastián": "Donostia/San Sebastián, Gipuzkoa",
    "Zarautz": "Zarautz, Gipuzkoa",
    "Deba": "Deba, Gipuzkoa",
    "Markina-Xemein": "Markina-Xemein, Bizkaia",
    "Gernika": "Gernika-Lumo, Bizkaia",
    "Bilbao": "Bilbao, Bizkaia",
    "Portugalete": "Portugalete, Bizkaia",
    "Castro Urdiales": "Castro Urdiales, Cantabria",
    "Laredo": "Laredo, Cantabria",
    "Güemes": "Güemes, Bareyo, Cantabria",
    "Santander": "Santander, Cantabria",
    "Santillana del Mar": "Santillana del Mar, Cantabria",
    "Comillas": "Comillas, Cantabria",
    "San Vicente de la Barquera": "San Vicente de la Barquera, Cantabria",
    "Llanes": "Llanes, Asturias",
    "Ribadesella": "Ribadesella, Asturias",
    "Villaviciosa": "Villaviciosa, Asturias",
    "Gijón": "Gijón, Asturias",
    "Avilés": "Avilés, Asturias",
    "Soto de Luiña": "Soto de Luiña, Cudillero, Asturias",
    "Luarca": "Luarca, Valdés, Asturias",
    "Ribadeo": "Ribadeo, Lugo",
    "Mondoñedo": "Mondoñedo, Lugo",
    "Vilalba": "Vilalba, Lugo",
    "Baamonde": "Baamonde, Begonte, Lugo",
    "Sobrado dos Monxes": "Sobrado, A Coruña",
    "Oviedo": "Oviedo, Asturias",
    "Grado": "Grado, Asturias",
    "Salas": "Salas, Asturias",
    "Tineo": "Tineo, Asturias",
    "Pola de Allande": "Pola de Allande, Asturias",
    "Grandas de Salime": "Grandas de Salime, Asturias",
    "A Fonsagrada": "A Fonsagrada, Lugo",
    "O Cádavo": "O Cádavo, Baleira, Lugo",
    "Lugo": "Lugo, Lugo",
    "San Romao da Retorta": "San Romao da Retorta, Guntín, Lugo",
    "Ferrol": "Ferrol, A Coruña",
    "Neda": "Neda, A Coruña",
    "Pontedeume": "Pontedeume, A Coruña",
    "Miño": "Miño, A Coruña",
    "Betanzos": "Betanzos, A Coruña",
    "Hospital de Bruma": "Bruma, Mesía, A Coruña",
    "Sigüeiro": "Sigüeiro, Oroso, A Coruña",
    "Sevilla": "Sevilla, España",
    "Zafra": "Zafra, Badajoz",
    "Mérida": "Mérida, Badajoz",
    "Cáceres": "Cáceres, España",
    "Carcaboso": "Carcaboso, Cáceres",
    "Baños de Montemayor": "Baños de Montemayor, Cáceres",
    "Salamanca": "Salamanca, España",
    "Zamora": "Zamora, España",
    "Granja de Moreruela": "Granja de Moreruela, Zamora",
    "Puebla de Sanabria": "Puebla de Sanabria, Zamora",
    "A Gudiña": "A Gudiña, Ourense",
    "Laza": "Laza, Ourense",
    "Ourense": "Ourense, Ourense",
    "Cea": "Cea, San Cristovo de Cea, Ourense",
    "Silleda": "Silleda, Pontevedra",
    "Negreira": "Negreira, A Coruña",
    "Santa Mariña": "Santa Mariña, Mazaricos, A Coruña",
    "Olveiroa": "Olveiroa, Dumbría, A Coruña",
    "Cee": "Cee, A Coruña",
    "Fisterra": "Fisterra, A Coruña",
    "Dumbría": "Dumbría, A Coruña",
    "Muxía": "Muxía, A Coruña",
    SANTIAGO: "Catedral de Santiago de Compostela",
    "Pamplona": "Pamplona, Navarra",
    "Puente la Reina": "Puente la Reina, Navarra",
    "Estella": "Estella-Lizarra, Navarra",
    "Logroño": "Logroño, La Rioja",
    "Nájera": "Nájera, La Rioja",
    "Santo Domingo de la Calzada": "Santo Domingo de la Calzada, La Rioja",
    "Burgos": "Burgos, España",
    "Castrojeriz": "Castrojeriz, Burgos",
    "Frómista": "Frómista, Palencia",
    "Carrión de los Condes": "Carrión de los Condes, Palencia",
    "Sahagún": "Sahagún, León",
    "León": "León, España",
    "Astorga": "Astorga, León",
    "Ponferrada": "Ponferrada, León",
    "Villafranca del Bierzo": "Villafranca del Bierzo, León",
    "Sarria": "Sarria, Lugo",
    "Portomarín": "Portomarín, Lugo",
}

# Coordenadas fijadas a mano (lon, lat). Solo para lugares que Nominatim no resuelve bien
# ni eligiendo el candidato más cercano al trazado.
# Todos estos devolvían el centroide del municipio o una aldea homónima: Sobrado caía
# junto a Arzúa y obligaba al Camino del Norte a dar un rodeo de varios kilómetros.
MANUAL = {
    "Pontevedra": (-8.6449, 42.4316),          # iglesia de la Peregrina
    "Caldas de Reis": (-8.6422, 42.6047),
    "Padrón": (-8.6602, 42.7388),
    "Baiona": (-8.8492, 42.1186),
    "Sobrado dos Monxes": (-8.0232, 43.0391),  # monasterio
    "Ferrol": (-8.2440, 43.4810),              # muelle de Curuxeiras, inicio del Camino
    "Betanzos": (-8.2149, 43.2802),
    "Zamora": (-5.7449, 41.5034),              # plaza Mayor
    "Ribadeo": (-7.0405, 43.5355),
}
