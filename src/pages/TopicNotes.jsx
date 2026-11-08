import { Download, ExternalLink, FileText } from "lucide-react";
import "./topic-resources.css";

export default function TopicNotes({ topic }) {
  if (!topic) return null;

  const notesUrl = (topic.notes_url || "").trim();

  return (
    <section className="topic-notes-card" aria-labelledby="topic-notes-heading">
      <div className="topic-notes-icon"><FileText size={21} /></div>
      <div className="topic-notes-content">
        <span className="eyebrow">STUDY MATERIAL</span>
        <h3 id="topic-notes-heading">Download topic notes</h3>
        {notesUrl ? (
          <>
            <p>Open the PDF notes for <b>{topic.title}</b>. The link is provided by STar Academy through Google Drive or another document host.</p>
            <a className="topic-notes-download" href={notesUrl} target="_blank" rel="noopener noreferrer">
              <Download size={17} /> Open / download PDF notes <ExternalLink size={15} />
            </a>
            <small>If Google Drive opens a preview, use its Download button to save the PDF to your device.</small>
          </>
        ) : (
          <>
            <p>Notes for this topic have not been linked yet. Practice questions may still be available below.</p>
            <small>The administrator can add a Google Drive PDF link in Django admin under Study → Topics → Notes PDF link.</small>
          </>
        )}
      </div>
    </section>
  );
}
