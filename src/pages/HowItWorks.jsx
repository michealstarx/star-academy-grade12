import React from "react";
import * as Icons from "lucide-react";

export default function HowItWorksPage(props) {
  const {  } = props;
  return (
            <main className="page-main how-page">
              <div className="page-hero">
                <span className="eyebrow">SIMPLE BY DESIGN</span>
                <h1>
                  Four steps to a<br />
                  <span>more focused revision plan.</span>
                </h1>
                <p>
                  Start with the subject you want to improve, then use a simple
                  routine to guide your preparation.
                </p>
              </div>
              <div className="steps-grid">
                {[
                  {
                    n: "01",
                    icon: Icons.Search,
                    title: "Choose your subject",
                    body: "Browse the subject library and pick the subjects you want to focus on.",
                  },
                  {
                    n: "02",
                    icon: Icons.Smartphone,
                    title: "Register for free",
                    body: "Create a free student account. There is no subscription or payment requirement while free access is enabled.",
                  },
                  {
                    n: "03",
                    icon: Icons.BookOpen,
                    title: "Study and practise",
                    body: "Work through topic guides, examples and exam-style questions at your pace.",
                  },
                  {
                    n: "04",
                    icon: Icons.Trophy,
                    title: "Review your progress",
                    body: "Use your practice results to spot gaps, revisit topics and keep improving.",
                  },
                ].map((x) => (
                  <article className="step-card" key={x.n}>
                    <span className="step-number">{x.n}</span>
                    <span className="step-icon">
                      {React.createElement(x.icon, { size: 24 })}
                    </span>
                    <h3>{x.title}</h3>
                    <p>{x.body}</p>
                  </article>
                ))}
              </div>
              <section className="faq-panel">
                <span className="eyebrow">GOOD TO KNOW</span>
                <h2>Frequently asked questions</h2>
                {[
                  {
                    q: "How much does STar Academy cost right now?",
                    a: "Learning is currently free. Students can register and immediately access the published subjects, topics and questions.",
                  },
                  {
                    q: "Do I need to pay to access topics?",
                    a: "No. Subscription and mobile-money payments are disabled while free access is enabled.",
                  },
                  {
                    q: "Where do the student reviews come from?",
                    a: "The website loads approved student reviews from the Django database. New ratings remain private until an administrator approves them.",
                  },
                  {
                    q: "How do topics and questions appear on the site?",
                    a: "Add subjects, topics and questions in Django admin. Mark each item as published for it to become visible on the website.",
                  },
                  {
                    q: "Are the questions official past papers?",
                    a: "Only content that you have the right to distribute should be labelled as official past papers. Clearly label original practice questions and mock exams.",
                  },
                ].map((f, i) => (
                  <details key={f.q} open={i === 0}>
                    <summary>
                      {f.q}
                      <Icons.ChevronDown size={18} />
                    </summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </section>
            </main>
  );
}
