const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
  siteNav?.classList.toggle("is-open", !isExpanded);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menú");
    siteNav.classList.remove("is-open");
  });
});

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const repository = "ronieshi/ronieshi.github.io";
const manifestPath = "drawings.json";
const gallery = document.querySelector("#drawing-gallery");
const uploadForm = document.querySelector("#drawing-form");
const uploadStatus = document.querySelector("#upload-status");
const tokenInput = document.querySelector("#github-token");
const fileInput = document.querySelector("#drawing-files");
const categoryInput = document.querySelector("#drawing-category");
const maxFileSize = 8 * 1024 * 1024;
const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
let drawings = [];

function setUploadStatus(message, state = "") {
  if (!uploadStatus) return;
  uploadStatus.textContent = message;
  uploadStatus.dataset.state = state;
}

function formatUploadDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function renderDrawings() {
  if (!gallery) return;
  gallery.replaceChildren();

  if (!drawings.length) {
    const empty = document.createElement("p");
    empty.className = "gallery-status";
    empty.textContent = "Todavía no hay dibujos publicados. Aquí aparecerán cuando compartas el primero.";
    gallery.append(empty);
    return;
  }

  const sortedDrawings = [...drawings].sort(
    (first, second) => Date.parse(second.uploadedAt) - Date.parse(first.uploadedAt),
  );

  for (const drawing of sortedDrawings) {
    if (
      typeof drawing.path !== "string"
      || !drawing.path.startsWith("assets/drawings/")
      || drawing.path.includes("..")
    ) {
      continue;
    }

    const card = document.createElement("article");
    card.className = "art-card";

    const imageLink = document.createElement("a");
    imageLink.className = "art-image";
    imageLink.href = drawing.path;
    imageLink.target = "_blank";
    imageLink.rel = "noopener noreferrer";
    imageLink.setAttribute("aria-label", `Abrir dibujo: ${drawing.title || "Dibujo"}`);

    const image = document.createElement("img");
    image.src = drawing.path;
    image.alt = drawing.title || "Dibujo de Ronieshi";
    image.loading = "lazy";
    imageLink.append(image);

    const caption = document.createElement("div");
    caption.className = "art-card-caption";

    const title = document.createElement("h3");
    title.textContent = drawing.title || "Dibujo";

    const metadata = document.createElement("p");
    const date = formatUploadDate(drawing.uploadedAt);
    metadata.textContent = [drawing.category, date].filter(Boolean).join(" · ");

    caption.append(title, metadata);
    card.append(imageLink, caption);
    gallery.append(card);
  }

  if (!gallery.childElementCount) {
    const empty = document.createElement("p");
    empty.className = "gallery-status";
    empty.textContent = "No se pudieron mostrar los dibujos guardados.";
    gallery.append(empty);
  }
}

async function loadDrawings() {
  if (!gallery) return;

  try {
    const response = await fetch(manifestPath, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se pudo cargar la galería (${response.status}).`);
    const manifest = await response.json();
    drawings = Array.isArray(manifest) ? manifest : [];
    renderDrawings();
  } catch (error) {
    gallery.replaceChildren();
    const message = document.createElement("p");
    message.className = "gallery-status";
    message.textContent = error.message || "No se pudo cargar la galería.";
    gallery.append(message);
  }
}

async function githubRequest(path, token, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${repository}/contents/${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = result.message ? ` ${result.message}` : "";
    const error = new Error(`GitHub respondió ${response.status}.${detail}`);
    error.status = response.status;
    throw error;
  }
  return result;
}

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
}

function decodeBase64(value) {
  const binary = atob(value.replace(/\s/g, ""));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error(`No se pudo leer ${file.name}.`));
        return;
      }
      resolve(base64);
    });
    reader.addEventListener("error", () => reject(new Error(`No se pudo leer ${file.name}.`)));
    reader.readAsDataURL(file);
  });
}

function safeFileName(file) {
  const extensions = {
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const basename = file.name.replace(/\.[^.]+$/, "");
  const slug = basename
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "dibujo";
  return `${Date.now()}-${crypto.randomUUID()}-${slug}.${extensions[file.type]}`;
}

async function uploadImage(file, token) {
  const path = `assets/drawings/${safeFileName(file)}`;
  const uploaded = await githubRequest(path, token, {
    method: "PUT",
    body: JSON.stringify({
      message: `Añadir dibujo: ${file.name}`,
      content: await fileToBase64(file),
      branch: "main",
    }),
  });
  return { path, sha: uploaded.content.sha };
}

async function saveDrawingRecord(drawing, token) {
  const current = await githubRequest(manifestPath, token);
  const manifest = JSON.parse(decodeBase64(current.content));
  if (!Array.isArray(manifest)) throw new Error("El archivo drawings.json no tiene un formato válido.");

  const updated = [drawing, ...manifest];
  await githubRequest(manifestPath, token, {
    method: "PUT",
    body: JSON.stringify({
      message: `Actualizar galería: ${drawing.title}`,
      content: encodeBase64(`${JSON.stringify(updated, null, 2)}\n`),
      sha: current.sha,
      branch: "main",
    }),
  });
  return updated;
}

async function removeUploadedImage(path, sha, token) {
  await githubRequest(path, token, {
    method: "DELETE",
    body: JSON.stringify({
      message: "Retirar imagen no publicada",
      sha,
      branch: "main",
    }),
  });
}

uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = tokenInput?.value.trim();
  const files = Array.from(fileInput?.files || []);

  if (!token || !files.length) {
    setUploadStatus("Añade el token y selecciona al menos una imagen.", "error");
    return;
  }

  const invalidFile = files.find((file) => !allowedTypes.has(file.type) || file.size > maxFileSize || file.size === 0);
  if (invalidFile) {
    setUploadStatus(
      `${invalidFile.name} no es compatible. Usa PNG, JPG, WebP o GIF de hasta 8 MB.`,
      "error",
    );
    return;
  }

  const submitButton = uploadForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  uploadForm.setAttribute("aria-busy", "true");
  let savedCount = 0;

  try {
    for (const file of files) {
      setUploadStatus(`Publicando ${savedCount + 1} de ${files.length}: ${file.name}`);
      const uploaded = await uploadImage(file, token);
      const drawing = {
        title: file.name.replace(/\.[^.]+$/, ""),
        category: categoryInput?.value || "Ilustración",
        path: uploaded.path,
        uploadedAt: new Date().toISOString(),
      };

      try {
        drawings = await saveDrawingRecord(drawing, token);
      } catch (error) {
        if (error.status && error.status < 500) {
          try {
            await removeUploadedImage(uploaded.path, uploaded.sha, token);
          } catch (cleanupError) {
            throw new Error(
              `${error.message} No se pudo retirar ${uploaded.path}; elimínalo manualmente del repositorio. ${cleanupError.message}`,
            );
          }
          throw error;
        }
        throw new Error(
          `${error.message} La imagen ya se subió como ${uploaded.path}; comprueba drawings.json antes de volver a intentarlo.`,
        );
      }

      savedCount += 1;
      renderDrawings();
    }

    setUploadStatus(`¡Listo! Se publicaron ${savedCount} dibujo${savedCount === 1 ? "" : "s"}.`, "success");
    uploadForm.reset();
  } catch (error) {
    const partialMessage = savedCount
      ? ` Se publicaron ${savedCount}; las demás no se guardaron.`
      : "";
    setUploadStatus(`${error.message || "No se pudo publicar el dibujo."}${partialMessage}`, "error");
  } finally {
    if (tokenInput) tokenInput.value = "";
    uploadForm.removeAttribute("aria-busy");
    if (submitButton) submitButton.disabled = false;
  }
});

loadDrawings();
