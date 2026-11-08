# Portafolio creativo

Sitio estático para publicar dibujos, un videojuego y una aplicación móvil con GitHub Pages. No requiere instalar dependencias ni generar una compilación.

## Personalizar el contenido

- En `index.html`, reemplaza `tu nombre`, `hola@tucorreo.com`, los títulos de muestra y las descripciones por tus datos.
- La galería incluye ilustraciones SVG de muestra en el propio HTML. Sustituye cada `<svg>` por una imagen tuya, actualiza su texto alternativo y conserva o cambia el estilo de la tarjeta en `styles.css`.
- Reemplaza los gráficos de muestra de los proyectos con capturas o ilustraciones cuando estén disponibles.
- Ajusta colores, tipografía y distribución en `styles.css`. El menú móvil y el año del pie de página están en `script.js`.

## Publicar en GitHub Pages

El workflow `.github/workflows/pages.yml` publica automáticamente el contenido de la raíz cada vez que se actualiza `main`, y también permite iniciar el despliegue manualmente desde Actions.

En el repositorio, abre **Settings → Pages** y selecciona **GitHub Actions** como *Build and deployment source*. Después de subir estos archivos a `main`, espera a que termine el workflow. Al usar el repositorio `ronieshi.github.io`, la dirección será `https://ronieshi.github.io/`.
