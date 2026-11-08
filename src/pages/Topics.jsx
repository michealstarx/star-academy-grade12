import { useEffect, useState } from "react";
import { BookOpen, ChevronRight, Loader2 } from "lucide-react";

import API from "../api.js";

export default function Topics({ subject, selectedTopicId, onSelectTopic }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!subject?.id) {
      setTopics([]);
      return;
    }
    const controller = new AbortController();
    async function loadTopics() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API}/topics/?subject=${encodeURIComponent(subject.id)}`, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Topics could not be loaded from the database.");
        const body = await response.json();
        setTopics(Array.isArray(body) ? body : body.results || []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Topics could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadTopics();
    return () => controller.abort();
  }, [subject?.id]);

  if (loading) return <div className="empty-state"><Loader2 size={18} /> Loading published topics…</div>;
  if (error) return <div className="empty-state" role="alert">{error}</div>;
  if (!topics.length) return <div className="empty-state">No published topics for {subject?.name || "this subject"} yet. Add topics in Django admin, select the subject, and enable “Is published”.</div>;

  return (
    <section className="topic-panel">
      <div className="panel-heading">
        <div><span className="eyebrow">YOUR LEARNING PATH</span><h2>Published topics</h2></div>
        <span className="count-pill">{topics.length} topics</span>
      </div>
      {topics.map((topic, index) => (
        <button type="button" className={`topic-row topic-select-row ${selectedTopicId === topic.id ? "selected" : ""}`} key={topic.id} onClick={() => onSelectTopic?.(topic)}>
          <span className="topic-number">{String(index + 1).padStart(2, "0")}</span>
          <span className="topic-select-copy"><b>{topic.title}</b><small>{topic.summary || "Open this topic to view PDF notes and available practice questions."}{topic.notes_url ? " · PDF notes available" : ""}{topic.video_url ? " · Video available" : ""}</small></span>
          <span className="topic-row-end"><BookOpen size={17} /><ChevronRight size={17} /></span>
        </button>
      ))}
    </section>
  );
}
