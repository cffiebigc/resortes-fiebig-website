# Resortes Fiebig — sitio web

Landing page de una sola página para **Resortes Fiebig Ltda.**, taller de fabricación y reparación de paquetes de resortes en Puerto Montt. Sitio estático (HTML, CSS y JS sin dependencias) publicado en GitHub Pages bajo `www.resortesfiebig.cl`.

## Estructura

```
index.html            Página completa (hero, servicios, proceso, vehículos, taller, contacto)
404.html              Página de error (noindex, rutas absolutas porque Pages la sirve en cualquier ruta)
css/styles.css        Tokens de diseño, base, layout y componentes
js/spring.js          Geometría paramétrica del paquete de resortes (compartida)
js/main.js            Navegación, sección activa, barra móvil y animación del hero
scripts/build-spring.js  Genera el SVG del resorte e inyecta el markup en index.html
scripts/build-logo.js    Genera la marca, el lockup y el favicon; inyecta la marca en index.html
assets/               logo.svg, logo-dark.svg, logo-mark.svg, favicon.svg, apple-touch-icon.png, og.png
test/                 Tests de SEO y marcado (node:test, sin dependencias)
robots.txt, sitemap.xml, llms.txt, CNAME, .nojekyll
```

## Desarrollo

No hay build. Sirve la carpeta con cualquier servidor estático:

```sh
python3 -m http.server 8765
```

Los scripts de build necesitan `npm install` (prettier y opentype.js).

```sh
npm run build:spring   # regenera el SVG del resorte (hero y diagrama) tras tocar js/spring.js
npm run build:logo     # regenera assets/logo*.svg, favicon.svg y la marca inline
npm run format         # prettier sobre html, css y js (ancho 120)
npm test               # tests de SEO y marcado
```

Las fuentes que vectoriza `build:logo` se bajan de Google Fonts a `scripts/.fonts/` la primera vez.

## Diseño

- **Color:** acero (`#1e2a35`, `#55636f`, `#b9c3cc`, `#eef1f3`) y un solo acento azul rey (`#4169e1`) para llamadas a la acción y la hoja madre.
- **Tipografía:** Big Shoulders Display (titulares, marca) y Archivo (texto). Ambas desde Google Fonts.
- **Pieza central:** el paquete de resortes dibujado en SVG a partir de una parábola. En el hero, al cargar, las hojas entran casi rectas y terminan de curvarse en un solo movimiento; al hacer clic, flexiona bajo carga (respeta `prefers-reduced-motion`). En servicios, el mismo dibujo sirve de diagrama de partes.

## Marca

El logo original de Fiebig (en azul y amarillo) apila tres cosas: media rueda dentada con «Fábrica de Resortes» arriba, el paquete de resortes al medio y un yunque abajo con el nombre de la ciudad. La marca nueva conserva las tres piezas como formas planas: engranaje y yunque en acero, paquete en brasa (el amarillo original), ojos arriba y hoja madre sobre las hojas cortas, igual que el dibujo del hero. El texto del lockup («Resortes Fiebig» + «Fábrica de resortes, Puerto Montt») va vectorizado, así que los SVG no dependen de fuentes instaladas.

- `assets/logo.svg` y `assets/logo-dark.svg`: lockup horizontal para fondo claro y oscuro.
- `assets/logo-mark.svg`: solo la marca.
- Colores y proporciones en `scripts/build-logo.js` (`COLORS`, `GEAR`, `SPRING`, `anvilPath`). Para volver al azul y amarillo históricos, basta cambiar `COLORS` y correr `npm run build:logo`.

## Datos del negocio usados

| Dato        | Valor                                                  | Fuente                         |
| ----------- | ------------------------------------------------------ | ------------------------------ |
| Razón social| Resortes Fiebig Limitada, RUT 78.486.010-8             | Mercantil, RedConecta          |
| Dirección   | Génesis 39, Parque Industrial Recondo, Puerto Montt    | Mercantil, RedConecta, Yelp    |
| Teléfono    | +56 65 226 3566                                        | RedConecta, Cylex              |
| WhatsApp    | +56 9 9519 0145 (celular, WhatsApp Business)           | Confirmado por el taller       |
| Correo      | contacto@resortesfiebig.cl                             | Confirmado por el taller       |
| Fundación   | 1994                                                   | EMIS                           |
| Horario     | Lunes a viernes, 8:00–12:00 y 14:00–18:00              | Confirmado por el taller       |
