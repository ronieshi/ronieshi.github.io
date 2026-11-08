# Portafolio creativo

Sitio estático para publicar dibujos, un videojuego y una aplicación móvil con GitHub Pages. No requiere instalar dependencias ni generar una compilación.

## Personalizar el contenido

- El retrato de `assets/ronieshi-icon.png` también se usa como favicon e imagen para compartir. Sustituye el archivo para actualizar esos usos.
- La tarjeta de WR Draft Assistant usa `assets/wr-draft-icon.png` como icono y `assets/wr-draft-champions.png`, `assets/wr-draft-counterpicks.png` y `assets/wr-draft-builds.png` como capturas. Cada captura se puede abrir en tamaño completo al seleccionarla.
- La tarjeta de Rigelstars Survivors usa `assets/rigelstars-survivors-banner.png` y enlaza a su página de Facebook para ver avances.
- En `index.html`, personaliza los títulos y descripciones, en especial la tarjeta del videojuego.
- El enlace a Bluesky está junto al título de la galería. Añade otras redes cuando tengas sus direcciones confirmadas.
- La tarjeta de WR Draft Assistant enlaza al repositorio y a la descarga directa del APK de su release v1.0.0.
- Los dibujos de la galería se cargan desde `drawings.json`; las imágenes se guardan en `assets/drawings/`.
- Reemplaza los gráficos de muestra de los proyectos con capturas o ilustraciones cuando estén disponibles.
- La paleta cálida vive en las variables `--paper`, `--paper-deep`, `--ink`, `--coral`, `--gold` y `--rust` al inicio de `styles.css`; cambia esos valores para ajustar el ambiente sin rehacer los componentes.
- Ajusta tipografía y distribución en `styles.css`. El menú móvil y el año del pie de página están en `script.js`.

## Publicar dibujos desde la página

La sección **Subir dibujos** crea commits directamente en `main`. La galería lee el manifiesto y las imágenes desde GitHub, evitando mostrar una copia antigua mientras se actualiza la caché del sitio:

1. Crea un [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) con acceso únicamente al repositorio `ronieshi/ronieshi.github.io`, permiso **Contents: Read and write** y una fecha de vencimiento.
2. En la página, pega el token, selecciona una categoría y una o varias imágenes PNG, JPG, WebP o GIF de hasta 8 MB cada una.
3. Pulsa **Publicar dibujos**. La galería se actualiza con los dibujos más recientes primero; el título inicial se obtiene del nombre de cada archivo.

El token se usa en memoria durante la operación, se borra del campo al terminar y no se escribe en `localStorage`, cookies ni archivos del sitio. Aun así, introducir un token en una página web implica confiar en el código que se ejecuta en esa pestaña; usa un token dedicado, limitado a este repositorio y con vencimiento, y revócalo cuando ya no lo necesites. El permiso de Contents permite modificar contenido del repositorio, no sólo subir imágenes.

## Publicar en GitHub Pages

El workflow `.github/workflows/pages.yml` publica automáticamente el contenido de la raíz cada vez que se actualiza `main`, y también permite iniciar el despliegue manualmente desde Actions.

En el repositorio, abre **Settings → Pages** y selecciona **GitHub Actions** como *Build and deployment source*. Después de subir estos archivos a `main`, espera a que termine el workflow. Al usar el repositorio `ronieshi.github.io`, la dirección será `https://ronieshi.github.io/`.
