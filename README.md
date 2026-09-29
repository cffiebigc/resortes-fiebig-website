# Resortes Fiebig — sitio web

Sitio de **Resortes Fiebig Ltda.**, taller de fabricación y reparación de paquetes de resortes en Puerto Montt. Sitio estático generado con [Eleventy](https://www.11ty.dev/) y publicado en GitHub Pages bajo `www.resortesfiebig.cl`.

## Estructura

```
src/                       Fuentes del sitio (lo único que Eleventy lee)
  index.njk                Portada (hero, servicios, proceso, vehículos, taller, contacto)
  404.njk                  Página de error (noindex; Pages la sirve en cualquier ruta, por eso todo es absoluto)
  sitemap.njk              Sitemap generado, con la fecha del último commit de cada página
  _data/site.js            Fuente única de teléfono, WhatsApp, correo, dirección y links de Maps
  _data/fonts.json         Fuentes a precargar (lo escribe scripts/fetch-fonts.js)
  _includes/layouts/       base.njk: head, header, footer, barra del celular y scripts
  _includes/partials/      Sprite de íconos, header, footer, barra del celular, marca, resorte y fuentes
  _includes/schema/        JSON-LD del taller
  css/styles.css           Tokens de diseño, base, layout y componentes
  js/spring.js             Geometría paramétrica del paquete de resortes (compartida)
  js/main.js               Navegación, sección activa, barra móvil y animación del hero
  js/analytics.js          GA4 solo en producción y eventos de los botones de contacto (data-track)
  assets/                  Logos, íconos, imagen OG y fuentes propias (con sus licencias OFL)
  robots.txt, llms.txt     Se copian tal cual
  <clave>.txt              Clave de IndexNow
scripts/                   build-spring, build-logo, fetch-fonts e indexnow
test/                      Tests con node:test sobre lo que se publica (_site/)
.github/workflows/         deploy.yml
_site/                     Salida de Eleventy (no se versiona)
```

## Desarrollo

```sh
npm install
npm start              # servidor local con recarga (puerto 8765)
npm run build          # genera _site/
npm test               # genera _site/ y corre los tests
npm run build:spring   # regenera los parciales del resorte tras tocar src/js/spring.js
npm run build:logo     # regenera src/assets/logo*.svg, favicon.svg y el parcial de la marca
npm run fonts          # vuelve a bajar las fuentes de Google y regenera el @font-face
npm run format         # prettier sobre css, js y tests (ancho 120)
```

Las fuentes que vectoriza `build:logo` se bajan de Google Fonts a `scripts/.fonts/` la primera vez.

## Deploy

Cada push a `main` corre `.github/workflows/deploy.yml`: instala, corre los tests, publica `_site/` en GitHub Pages y avisa a IndexNow con las URLs del sitemap.

La fuente de Pages tiene que ser «GitHub Actions» (Settings → Pages); si no lo es, el build falla antes de publicar. Para volver atrás, primero se revierte el commit y recién después se cambia la fuente a la rama: al revés, Pages publicaría la raíz del repo, que no tiene `index.html`.

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
