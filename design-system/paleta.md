# Paleta real vs. Brandbook 2027

Los colores que usa [`bloques.css`](bloques.css) en producción, comparados con los que
define el Brandbook 2027. **No se ha cambiado nada en el CSS**: esto es un diagnóstico.

## Coincide

| Color | Hex | Uso en el CSS |
|---|---|---|
| Verde Ways | `#7AA606` | Botones, puntos, barras, líneas, etiquetas. 24 usos |

## No está en el brandbook

| Hex | Usos | Para qué se usa | Observación |
|---|---:|---|---|
| `#668814` | **32** | Color de texto de antetítulos, etiquetas, cifras y enlaces | El brandbook define Verde sendero `#506718` para este papel |
| `#184834` | 7 | Verde muy oscuro: fondo del lateral de `gr-planner`, etiquetas `--dark`, texto sobre banderola | No existe en el brandbook |
| `#9DDB07` | 1 | Banderola lima de `roads__flag` | No existe en el brandbook |
| `#6a9205` | 3 | Hover de los botones verdes | Derivado razonable de `#7AA606` |
| `#F7FAF2` | 8 | Superficie verde muy claro de las cajas | El brandbook define «brote» `#FAFFEE` |
| `#5A6067` | 1 | Gris de la nota de `gr-planner` | El brandbook define gris `#6F6F6E` |

## ⚠️ Contraste: `#668814` no llega a AA

`#668814` es el color de texto más usado de toda la hoja (32 veces) y casi siempre en
tamaños pequeños: antetítulos de 11-12 px, etiquetas, cifras de `stats`, enlaces de `finder`.

| Combinación | Ratio | AA texto normal (4,5:1) |
|---|---:|---|
| `#668814` sobre blanco | **4,12:1** | ✗ no pasa |
| `#668814` sobre `#F7FAF2` (las cajas verdes) | **3,91:1** | ✗ no pasa |
| `#506718` sobre blanco (Verde sendero del brandbook) | 6,37:1 | ✓ pasa |
| `#184834` sobre blanco | 10,42:1 | ✓ pasa |
| `#2E2E2D` sobre blanco (Grafito del brandbook) | 13,59:1 | ✓ pasa |

Cambiar `#668814` por `#506718` resolvería el problema en los 32 sitios de golpe, acercaría
la hoja al brandbook y es un cambio visualmente pequeño: ambos son el mismo verde, uno un
punto más oscuro.

**No lo he tocado.** Es una decisión tuya: afecta a toda la web.

## Otros avisos de contraste

- `#7AA606` sobre blanco da **2,88:1**. El brandbook ya lo recoge y dice: Verde Ways
  «nunca texto». En el CSS se respeta: solo aparece como fondo, borde o relleno de barra.
- `#9DDB07` sobre blanco da 1,67:1, pero solo se usa como fondo de banderola con texto
  `#184834` encima, que da 6,24:1. Correcto.
- Blanco sobre `#184834` da 10,42:1. Correcto.

## Detalle menor

`.note` abre con una línea en blanco antes de la primera propiedad (`bloques.css`, apartado
7-quotes). No afecta al render; se puede limpiar cuando toques el archivo.
