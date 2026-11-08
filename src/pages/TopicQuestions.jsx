import { useEffect, useState } from "react";
import { CheckCircle2, CircleHelp, Loader2 } from "lucide-react";

import API from "../api.js";

export default function TopicQuestions({ topic }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuestions([]);
    setAnswers({});
    if (!topic?.id) return;
    const controller = new AbortController();
    async function loadQuestions() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API}/questions/?topic=${encodeURIComponent(topic.id)}`, {
          credentials: "include",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Questions could not be loaded from the database.");
        const body = await response.json();
        setQuestions(Array.isArray(body) ? body : body.results || []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Questions could not be loaded.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadQuestions();
    return () => controller.abort();
  }, [topic?.id]);

  if (!topic) return null;
  return (
    <section className="topic-questions-panel">
      <div className="panel-heading"><div><span className="eyebrow">PRACTISE AND CHECK</span><h2>{topic.title}</h2></div></div>
      {topic.summary && <p>{topic.summary}</p>}
      {loading && <p><Loader2 size={17} /> Loading published questions…</p>}
      {error && <p role="alert" className="payment-error">{error}</p>}
      {!loading && !error && questions.length === 0 && <div className="empty-state"><CircleHelp size={18} /> No published questions are available for this topic yet. Add questions in Django admin and enable “Is published”.</div>}
      {!loading && questions.map((question, index) => {
        const selected = answers[question.id];
        const hasAnswered = selected !== undefined;
        const correct = selected === question.correct_option;
        return (
          <article className="database-question" key={question.id}>
            <h3>{index + 1}. {question.prompt}</h3>
            <div className="answer-options">
              {Object.entries(question.options || {}).map(([letter, value]) => (
                <button type="button" key={letter} className={`answer-option ${selected === letter ? "chosen" : ""}`} onClick={() => setAnswers((current) => ({ ...current, [question.id]: letter }))}>
                  <span>{letter}</span>{value}
                  {hasAnswered && letter === question.correct_option && <CheckCircle2 size={18} />}
                </button>
              ))}
            </div>
            {hasAnswered && <div className="question-explanation"><b className={correct ? "correct-label" : "wrong-label"}>{correct ? "Correct answer" : `Not quite. Correct answer: ${question.correct_option}`}</b>{question.explanation && <p>{question.explanation}</p>}</div>}
          </article>
        );
      })}
    </section>
  );
}
