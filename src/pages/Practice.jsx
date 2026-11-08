import { useState } from "react";
import { BookOpen, CircleHelp } from "lucide-react";
import Topics from "./Topics.jsx";
import TopicQuestions from "./TopicQuestions.jsx";

export default function PracticePage({ subjects = [] }) {
  const [subjectId, setSubjectId] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const subject = subjects.find((item) => String(item.id) === String(subjectId)) || null;
  function chooseSubject(event) {
    setSubjectId(event.target.value);
    setSelectedTopic(null);
  }
  return (
    <main className="page-main prep-page">
      <span className="eyebrow">DATABASE PRACTICE</span>
      <h1>Practise what you study.</h1>
      <p className="page-intro">Select a subject and topic. Questions and explanations are loaded from your STar Academy database rather than demonstration questions.</p>
      <div className="search-bar practice-subject-select">
        <BookOpen size={19} />
        <select value={subjectId} onChange={chooseSubject} aria-label="Choose a subject">
          <option value="">Choose a subject…</option>
          {subjects.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </div>
      {!subjects.length && <div className="empty-state">No subjects have been published yet. Add and publish a subject in Django admin first.</div>}
      {subject && <Topics subject={subject} selectedTopicId={selectedTopic?.id} onSelectTopic={setSelectedTopic} />}
      {selectedTopic && <TopicQuestions topic={selectedTopic} />}
      {subject && !selectedTopic && <div className="empty-state"><CircleHelp size={18} /> Select one of the published topics to open its questions.</div>}
    </main>
  );
}
