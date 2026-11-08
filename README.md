# Portafolio creativo

Sitio estático para publicar dibujos, un videojuego y una aplicación móvil con GitHub Pages. No requiere instalar dependencias ni generar una compilación.

## Personalizar el contenido

- El retrato de `assets/ronieshi-icon.png` también se usa como favicon e imagen para compartir. Sustituye el archivo para actualizar esos usos.
- En `index.html`, personaliza los títulos y descripciones de muestra, en especial la tarjeta del videojuego.
- Los enlaces de perfil de Bluesky y GitHub están en la sección “Sobre mí” y en el cierre. Añade otras redes cuando tengas sus direcciones confirmadas.
- La tarjeta de WR Draft Assistant enlaza al repositorio y a la descarga directa del APK de su release v1.0.0.
- La galería incluye ilustraciones SVG de muestra en el propio HTML. Sustituye cada `<svg>` por una imagen tuya, actualiza su texto alternativo y conserva o cambia el estilo de la tarjeta en `styles.css`.
- Reemplaza los gráficos de muestra de los proyectos con capturas o ilustraciones cuando estén disponibles.
- La paleta cálida vive en las variables `--paper`, `--paper-deep`, `--ink`, `--coral`, `--gold` y `--rust` al inicio de `styles.css`; cambia esos valores para ajustar el ambiente sin rehacer los componentes.
- Ajusta tipografía y distribución en `styles.css`. El menú móvil y el año del pie de página están en `script.js`.

## Publicar en GitHub Pages

El workflow `.github/workflows/pages.yml` publica automáticamente el contenido de la raíz cada vez que se actualiza `main`, y también permite iniciar el despliegue manualmente desde Actions.

En el repositorio, abre **Settings → Pages** y selecciona **GitHub Actions** como *Build and deployment source*. Después de subir estos archivos a `main`, espera a que termine el workflow. Al usar el repositorio `ronieshi.github.io`, la dirección será `https://ronieshi.github.io/`.
