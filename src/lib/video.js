// Normalize a pasted YouTube / Vimeo link into an embeddable iframe `src`.
// Returns null for empty/unrecognised input so callers can fall back to a
// thumbnail. URLs already in /embed/ (YouTube) or player.vimeo.com form pass
// through untouched.

export function toEmbedUrl(url) {
  const raw = (url || "").trim();
  if (!raw) return null;

  // Already embeddable.
  if (/youtube\.com\/embed\//i.test(raw) || /player\.vimeo\.com\/video\//i.test(raw)) {
    return raw;
  }

  // YouTube: watch?v=ID, youtu.be/ID, /shorts/ID.
  const yt =
    raw.match(/[?&]v=([A-Za-z0-9_-]{6,})/) ||
    raw.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/) ||
    raw.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;

  // Vimeo: vimeo.com/ID.
  const vimeo = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}

// Still-frame thumbnail for a normalized /embed/ID URL, used to label a video
// slide in the carousel's thumbnail strip. YouTube exposes a stable URL;
// Vimeo doesn't, so those fall back to the carousel's play-badge tile.
function posterFor(embedUrl) {
  const yt = embedUrl.match(/youtube\.com\/embed\/([A-Za-z0-9_-]+)/);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : null;
}

// Normalize a project's authored `gallery` into carousel slides. Each raw entry
// is either a video link (anything toEmbedUrl recognizes) or a site-root image
// path ("/projects/…"); videos become { type: "video", embedUrl, poster },
// everything else an image slide. Falls back to the single project thumbnail so
// a project with no gallery still renders one slide and callers never have to
// special-case the empty state. The first entry leads the carousel — commonly
// a demo video.
export function toGallery(items, fallbackImage) {
  const slides = (Array.isArray(items) ? items : [])
    .map((raw) => String(raw ?? "").trim())
    .filter(Boolean)
    .map((raw) => {
      const embedUrl = toEmbedUrl(raw);
      if (embedUrl) return { type: "video", embedUrl, src: raw, poster: posterFor(embedUrl) };
      return { type: "image", src: raw };
    });
  if (slides.length === 0 && fallbackImage) {
    return [{ type: "image", src: fallbackImage }];
  }
  return slides;
}
