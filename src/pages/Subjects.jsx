import React from "react";
import * as Icons from "lucide-react";

export default function SubjectsPage(props) {
  const { SubjectCard, categories = ["All"], category, filtered, query, setCategory, setQuery, subjectsLoading, subjectsError, subjects = [] } = props;
  return (
    <main className="page-main">
      <div className="page-hero">
        <span className="eyebrow">DATABASE-DRIVEN LEARNING LIBRARY</span>
        <h1>Your subjects.<br /><span>Your next breakthrough.</span></h1>
        <p>Subjects and published topics are loaded directly from the STar Academy database. Registration and learning are free for now.</p>
        <div className="search-bar">
          <Icons.Search size={19} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subjects..." />
          <span>{filtered.length} subjects</span>
        </div>
      </div>
      <div className="filter-row">
        {categories.map((value) => (
          <button className={`filter-chip ${category === value ? "selected" : ""}`} key={value} onClick={() => setCategory(value)}>{value}</button>
        ))}
      </div>
      {subjectsLoading && <div className="empty-state">Loading published subjects from the database…</div>}
      {subjectsError && <div className="empty-state" role="alert">{subjectsError}</div>}
      {!subjectsLoading && !subjectsError && (
        <>
          <div className="subject-grid catalogue-grid">
            {filtered.map((subject) => <SubjectCard s={subject} key={subject.id} />)}
          </div>
          {subjects.length === 0 && <div className="empty-state">There are no published subjects yet. Add subjects in Django admin and enable “Is published”.</div>}
          {subjects.length > 0 && filtered.length === 0 && <div className="empty-state">No subjects match your search. Try another subject name or category.</div>}
        </>
      )}
      <section className="assurance-strip">
        <Icons.BookOpen size={24} />
        <div><b>Free learning access</b><p>Students can register for free and immediately browse published subjects, topics and available practice questions.</p></div>
        <span>Free</span>
      </section>
    </main>
  );
}
