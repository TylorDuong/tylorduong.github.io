import { useEffect, useRef, useState } from "react";
import { C, mono } from "@/lib/theme";
import { Hover } from "@/lib/Hover";

// Reusable media carousel shared by the Featured section and the project
// detail page, so every project gets the same video + image playback whether
// it has a full gallery or just a thumbnail. `slides` arrive already normalized
// from src/data.js (toGallery): each is { type: "video", embedUrl, poster } or
// { type: "image", src }. A single-slide gallery renders as a plain framed
// image/embed with no controls.
//
// `autoPlayInView` (used by the Featured section) muted-autoplays a YouTube
// slide while it's on screen and pauses it when it scrolls away, via an
// IntersectionObserver driving the YouTube iframe postMessage API. Muted is
// required — browsers block autoplay with sound. The detail page leaves it off,
// so its video only plays on click.
export function Gallery({ slides = [], title = "", accent = C.rust, onImageActivate, autoPlayInView = false }) {
  const [idx, setIdx] = useState(0);
  const frameRef = useRef(null);
  const iframeRef = useRef(null);

  const n = slides.length;
  const i = Math.min(idx, Math.max(n - 1, 0));
  const slide = slides[i];

  // Only YouTube exposes the simple JSON postMessage command API we use below.
  const canAutoPlay = autoPlayInView && slide?.type === "video" && /youtube\.com\/embed\//.test(slide.embedUrl);

  useEffect(() => {
    if (!canAutoPlay) return;
    const frame = frameRef.current;
    if (!frame || typeof IntersectionObserver === "undefined") return;
    const cmd = (func) =>
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args: [] }),
        "*"
      );
    const io = new IntersectionObserver(
      ([entry]) => cmd(entry.isIntersecting ? "playVideo" : "pauseVideo"),
      { threshold: 0.5 }
    );
    io.observe(frame);
    return () => io.disconnect();
  }, [canAutoPlay, i]);

  if (!n) return null;
  const go = (d) => setIdx((prev) => (prev + d + n) % n);

  // enablejsapi lets us postMessage play/pause; mute + autoplay satisfy the
  // browser's muted-autoplay rule; origin is required for the JS API to accept
  // commands.
  const videoSrc =
    slide.type === "video"
      ? canAutoPlay
        ? `${slide.embedUrl}${slide.embedUrl.includes("?") ? "&" : "?"}enablejsapi=1&mute=1&autoplay=1&playsinline=1&rel=0&origin=${encodeURIComponent(typeof window !== "undefined" ? window.location.origin : "")}`
        : slide.embedUrl
      : null;

  return (
    <div
      tabIndex={n > 1 ? 0 : -1}
      onKeyDown={(e) => {
        if (n < 2) return;
        if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      }}
      style={{ display: "flex", flexDirection: "column", gap: 10, outline: "none" }}
    >
      <div ref={frameRef} style={{ position: "relative", border: `6px solid ${C.ink}`, background: C.tan, aspectRatio: "16/9", overflow: "hidden" }}>
        {slide.type === "video" ? (
          <iframe
            key={videoSrc}
            ref={iframeRef}
            src={videoSrc}
            title={`${title} — demo video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          />
        ) : onImageActivate ? (
          <Hover
            as="button"
            onClick={onImageActivate}
            aria-label={title}
            style={{ width: "100%", height: "100%", padding: 0, border: "none", cursor: "pointer", backgroundColor: C.tan, backgroundImage: `url(${slide.src})`, backgroundSize: "cover", backgroundPosition: "center", display: "block" }}
            hoverStyle={{ opacity: 0.92 }}
          />
        ) : (
          <div role="img" aria-label={title} style={{ width: "100%", height: "100%", backgroundImage: `url(${slide.src})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        )}

        {n > 1 && (
          <>
            <Arrow side="left" accent={accent} onClick={() => go(-1)} />
            <Arrow side="right" accent={accent} onClick={() => go(1)} />
            <div style={{ position: "absolute", top: 10, right: 10, ...mono({ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: C.paper }), background: "rgba(22,25,15,0.72)", padding: "4px 8px" }}>
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </div>
          </>
        )}
      </div>

      {n > 1 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {slides.map((s, j) => (
            <Hover
              key={j}
              as="button"
              onClick={() => setIdx(j)}
              aria-label={`Show ${s.type} ${j + 1}`}
              aria-current={j === i}
              title={s.type === "video" ? "Video" : `Image ${j + 1}`}
              style={{
                position: "relative",
                width: 72,
                height: 44,
                flex: "0 0 auto",
                padding: 0,
                cursor: "pointer",
                border: `2px solid ${j === i ? accent : C.ink}`,
                backgroundColor: C.tan,
                backgroundImage: s.type === "image" ? `url(${s.src})` : s.poster ? `url(${s.poster})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: j === i ? 1 : 0.7,
              }}
              hoverStyle={{ opacity: 1, borderColor: accent }}
            >
              {s.type === "video" && (
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(22,25,15,0.42)", color: C.paper, fontSize: 14 }}>
                  ▶
                </span>
              )}
            </Hover>
          ))}
        </div>
      )}
    </div>
  );
}

function Arrow({ side, onClick, accent }) {
  return (
    <Hover
      as="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        [side]: 10,
        width: 40,
        height: 40,
        border: `2px solid ${C.paper}`,
        background: "rgba(22,25,15,0.72)",
        color: C.paper,
        cursor: "pointer",
        fontSize: 20,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      hoverStyle={{ background: accent }}
    >
      {side === "left" ? "‹" : "›"}
    </Hover>
  );
}
