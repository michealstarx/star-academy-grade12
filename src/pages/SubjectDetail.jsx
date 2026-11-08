import { useEffect, useState } from "react";
import * as Icons from "lucide-react";
import Topics from "./Topics.jsx";
import TopicQuestions from "./TopicQuestions.jsx";
import TopicNotes from "./TopicNotes.jsx";
import TopicVideo from "./TopicVideo.jsx";

export default function SubjectDetailPage({ activeSubject, go }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  useEffect(() => setSelectedTopic(null), [activeSubject?.id]);
  if (!activeSubject) return <main className="page-main"><p>Select a subject to begin.</p></main>;
  const SubjectIcon = activeSubject.icon || Icons.BookOpen;
  return (
    <main className="page-main subject-detail-page">
      <button className="back-link" onClick={() => go("subjects")}>← Back to all subjects</button>
      <div className="detail-hero">
        <div className={`subject-icon large ${activeSubject.color || "blue"}`}><SubjectIcon size={31} /></div>
        <span className="eyebrow">{activeSubject.curriculum || "Zambia ECZ"} · {(activeSubject.category || "SUBJECT").toUpperCase()}</span>
        <h1>{activeSubject.name}<br /><span>Learning hub</span></h1>
        <p>{activeSubject.description || activeSubject.desc || "Browse the published topics and practise with questions from the STar Academy database."}</p>
        <div className="detail-stats">
          <span><Icons.BookOpen size={17} /> {activeSubject.topics} published topics</span>
          <span><Icons.Clock3 size={17} /> Self-paced learning</span>
          <span><Icons.Target size={17} /> Database practice questions</span>
        </div>
        <div className="detail-actions">
          <span className="price-pill">Free access</span>
          <span><Icons.CheckCircle2 size={15} /> Register free and start learning immediately</span>
        </div>
      </div>
      <div className="detail-columns database-learning-columns">
        <div className="database-topics-column">
          <Topics subject={activeSubject} selectedTopicId={selectedTopic?.id} onSelectTopic={setSelectedTopic} />
        </div>
        <aside className="database-questions-column">
          {selectedTopic ? (
            <div className="topic-study-stack">
              <TopicNotes topic={selectedTopic} />
              <TopicVideo topic={selectedTopic} />
              <TopicQuestions topic={selectedTopic} />
            </div>
          ) : (
            <div className="purchase-card free-access-card">
              <div className="purchase-top"><span className="eyebrow">HOW TO START</span><div className="purchase-price">Free <small>/ for now</small></div><p>Choose a topic from the list to view its notes PDF and published practice questions.</p></div>
              <ul>
                <li><Icons.CheckCircle2 /> No subscription or payment required</li>
                <li><Icons.CheckCircle2 /> Topics are managed in Django admin</li>
                <li><Icons.CheckCircle2 /> Published questions show here automatically</li>
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
