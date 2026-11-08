import { ExternalLink, PlayCircle, Video as VideoIcon } from "lucide-react";
import "./topic-resources.css";

function getVideoSource(rawUrl) {
  const value = (rawUrl || "").trim();
  if (!value) return { kind: "none", url: "" };

  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? { kind: "embed", url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` } : { kind: "link", url: value };
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      let id = url.searchParams.get("v");
      if (!id && ["embed", "shorts", "live"].includes(parts[0])) id = parts[1];
      return id ? { kind: "embed", url: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` } : { kind: "link", url: value };
    }
    if (host === "vimeo.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      const id = parts.find((part) => /^\d+$/.test(part));
      return id ? { kind: "embed", url: `https://player.vimeo.com/video/${id}` } : { kind: "link", url: value };
    }
    if (host === "drive.google.com") {
      const pathMatch = url.pathname.match(/\/file\/d\/([^/]+)/);
      const queryId = url.searchParams.get("id");
      const id = pathMatch?.[1] || queryId;
      return id ? { kind: "embed", url: `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview` } : { kind: "link", url: value };
    }
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(`${url.pathname}${url.search}`)) return { kind: "direct", url: value };
    return { kind: "link", url: value };
  } catch {
    return { kind: "link", url: value };
  }
}

export default function TopicVideo({ topic }) {
  if (!topic) return null;
  const source = getVideoSource(topic.video_url);

  return (
    <section className="topic-video-card" aria-labelledby="topic-video-heading">
      <div className="topic-video-icon"><VideoIcon size={21} /></div>
      <div className="topic-video-content">
        <span className="eyebrow">VIDEO LESSON</span>
        <h3 id="topic-video-heading">Watch the topic video</h3>
        {source.kind === "embed" ? (
          <div className="topic-video-frame">
            <iframe
              src={source.url}
              title={`Video lesson: ${topic.title}`}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : source.kind === "direct" ? (
          <video className="topic-video-player" controls preload="metadata">
            <source src={source.url} />
            Your browser does not support the video player. Use the link below to open the video.
          </video>
        ) : source.kind === "link" ? (
          <>
            <p>Open the video lesson for <b>{topic.title}</b>.</p>
            <a className="topic-video-link" href={source.url} target="_blank" rel="noopener noreferrer">
              <PlayCircle size={17} /> Watch video <ExternalLink size={15} />
            </a>
          </>
        ) : (
          <p>The video for this topic has not been added yet. An administrator can add a YouTube, Vimeo or Google Drive video link in Django admin under Study → Topics.</p>
        )}
      </div>
    </section>
  );
}
