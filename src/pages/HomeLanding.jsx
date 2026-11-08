import React from "react";
import * as Icons from "lucide-react";

export default function HomeLanding(props) {
  const { Footer, SubjectCard, go, subjects, reviews } = props;
  return (
            <>
              <main>
                <section className="hero">
                  <div className="hero-grid">
                    <div className="hero-copy">
                      <div className="hero-label">
                        <span className="pulse-dot" /> ZAMBIA ECZ GRADE 12 · YOUR
                        NEXT STEP
                      </div>
                      <h1>
                        Prepare smarter.
                        <br />
                        <span>Walk in confident.</span>
                      </h1>
                      <p className="hero-desc">
                        A free Zambia ECZ Grade 12 revision space: understand published
                        topics, practise database questions and build confidence
                        — one topic at a time.
                      </p>
                      <div className="hero-actions">
                        <button
                          className="btn btn-primary btn-large"
                          onClick={() => go("subjects")}
                        >
                          Explore subjects <Icons.ArrowRight size={18} />
                        </button>
                        <button
                          className="btn btn-ghost btn-large"
                          onClick={() => go("how")}
                        >
                          <span className="play-icon">
                            <Icons.Play size={14} fill="currentColor" />
                          </span>{" "}
                          See how it works
                        </button>
                      </div>
                      <div className="hero-trust">
                        <div className="avatar-stack"><span>G</span><span>12</span><span>✓</span></div>
                        <div><div className="trust-stars"><b>Free learning access</b></div><small>Published topics · Practice · Progress</small></div>
                      </div>
                    </div>
                    <div className="hero-visual">
                      <div className="visual-orbit orbit-one" />
                      <div className="visual-orbit orbit-two" />
                      <div className="study-board">
                        <div className="board-top">
                          <span className="window-dots">
                            <i />
                            <i />
                            <i />
                          </span>
                          <span className="board-label">YOUR STUDY SPACE</span>
                          <span className="board-menu">•••</span>
                        </div>
                        <div className="board-welcome">
                          <div>
                            <span className="eyebrow">YOUR NEXT STEP</span>
                            <h3>
                              Small steps.
                              <br />
                              Big progress.
                            </h3>
                          </div>
                          <div className="board-illustration">
                            <Icons.BookOpen size={34} />
                          </div>
                        </div>
                        <div className="progress-panel">
                          <div className="progress-title">
                            <span>Weekly study goal</span>
                            <b>4 of 5 sessions</b>
                          </div>
                          <div className="progress-track">
                            <span style={{ width: "80%" }} />
                          </div>
                          <div className="progress-foot">
                            <span>Keep your momentum going</span>
                            <span>80%</span>
                          </div>
                        </div>
                        <div className="mini-subjects">
                          {subjects.slice(0, 2).map((subject) => {
                            const SubjectIcon = subject.icon || Icons.BookOpen;
                            return (
                              <button className="mini-subject" key={subject.id} onClick={() => go("subjects")}>
                                <span className="mini-icon math"><SubjectIcon size={16} /></span>
                                <span><b>{subject.name}</b><small>{subject.topics || 0} published topics</small></span>
                                <Icons.ArrowRight size={15} />
                              </button>
                            );
                          })}
                          {subjects.length === 0 && <small className="mini-subject-empty">Published subjects will appear here.</small>}
                        </div>
                        <div className="board-footer">
                          <Icons.ShieldCheck size={15} /> Learn at your own pace
                        </div>
                      </div>
                      <div className="float-card float-top">
                        <span className="float-icon">
                          <Icons.Target size={18} />
                        </span>
                        <span>
                          <b>Focus your revision</b>
                          <small>One topic at a time</small>
                        </span>
                      </div>
                      <div className="float-card float-bottom">
                        <span className="float-icon trophy">
                          <Icons.Trophy size={18} />
                        </span>
                        <span>
                          <b>Progress you can see</b>
                          <small>Practice. Review. Improve.</small>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="hero-bottom">
                    <span>
                      <Icons.CheckCircle2 size={16} /> Clear, structured revision
                    </span>
                    <span>
                      <Icons.CheckCircle2 size={16} /> Exam-style practice
                    </span>
                    <span>
                      <Icons.CheckCircle2 size={16} /> Free access for every registered learner
                    </span>
                  </div>
                </section>
                <section className="section subjects-section" id="subjects">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">YOUR REVISION STARTS HERE</span>
                      <h2>
                        Choose your subjects.
                        <br />
                        <span>Own your preparation.</span>
                      </h2>
                    </div>
                    <button className="link-button" onClick={() => go("subjects")}>
                      View all subjects <Icons.ArrowRight size={17} />
                    </button>
                  </div>
                  <div className="subject-grid">
                    {subjects.slice(0, 6).map((s) => (
                      <SubjectCard s={s} key={s.id} />
                    ))}
                    {subjects.length === 0 && (
                      <p className="empty-state">No subjects are published yet. They will appear here when added in the academy database.</p>
                    )}
                  </div>
                  <div className="center-action">
                    <button
                      className="btn btn-outline"
                      onClick={() => go("subjects")}
                    >
                      Explore all subjects <Icons.ArrowRight size={17} />
                    </button>
                  </div>
                </section>
                <section className="value-section">
                  <div className="value-left">
                    <span className="eyebrow light">MORE THAN NOTES</span>
                    <h2>
                      A plan for your
                      <br />
                      <span>best performance.</span>
                    </h2>
                    <p>
                      Studying harder is not always the answer. Studying with a plan
                      helps you use your time better.
                    </p>
                    <button className="btn btn-white" onClick={() => go("how")}>
                      Discover how it works <Icons.ArrowRight size={17} />
                    </button>
                  </div>
                  <div className="value-features">
                    <div className="feature">
                      <span>
                        <Icons.BookOpen />
                      </span>
                      <div>
                        <h3>Learn topic by topic</h3>
                        <p>
                          Break the syllabus into smaller sections that are easier
                          to understand and revise.
                        </p>
                      </div>
                      <b>01</b>
                    </div>
                    <div className="feature">
                      <span>
                        <Icons.Target />
                      </span>
                      <div>
                        <h3>Practise with purpose</h3>
                        <p>
                          Use exam-style questions to test your understanding and
                          identify weak areas.
                        </p>
                      </div>
                      <b>02</b>
                    </div>
                    <div className="feature">
                      <span>
                        <Icons.ChartNoAxesCombined />
                      </span>
                      <div>
                        <h3>Track your improvement</h3>
                        <p>
                          Review your scores, revisit difficult topics and build a
                          consistent study routine.
                        </p>
                      </div>
                      <b>03</b>
                    </div>
                  </div>
                </section>
                <section className="section review-section">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">THE STUDENT EXPERIENCE</span>
                      <h2>
                        Revision should feel
                        <br />
                        <span>less overwhelming.</span>
                      </h2>
                      <p className="section-sub">
                        A focused space for your goals, your questions and your next
                        step.
                      </p>
                    </div>
                    <button className="link-button" onClick={() => go("reviews")}>
                      Visit reviews <Icons.ArrowRight size={17} />
                    </button>
                  </div>
                  <div className="review-grid">
                    {reviews.slice(0, 3).map((review) => (
                      <article className="review-card" key={review.id}>
                        <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(Number(review.rating || 0))}</div>
                        <p>{review.comment ? `“${review.comment}”` : "Student rating submitted."}</p>
                        <div className="review-person">
                          <span className="review-avatar">{(review.student_name || "S").trim().charAt(0).toUpperCase()}</span>
                          <div>
                            <b>{review.student_name || "STar Academy student"}</b>
                            <small>{review.subject_name || (review.review_type === "subject" ? "Subject review" : "Student experience")}</small>
                          </div>
                          <span className="quote-mark">“</span>
                        </div>
                      </article>
                    ))}
                    {reviews.length === 0 && (
                      <p className="empty-state">No student reviews have been published yet. Approved reviews from the database will appear here.</p>
                    )}
                  </div>
                </section>
                <section className="cta-section">
                  <div className="cta-icon">
                    <Icons.GraduationCap size={28} />
                  </div>
                  <div>
                    <span className="eyebrow light">
                      YOUR FUTURE IS WORTH PREPARING FOR
                    </span>
                    <h2>Make your next study session count.</h2>
                    <p>
                      Choose a subject, follow a plan and start building confidence
                      today.
                    </p>
                  </div>
                  <button className="btn btn-white" onClick={() => go("subjects")}>
                    Find your subject <Icons.ArrowRight size={17} />
                  </button>
                  <div className="cta-shape" />
                </section>
              </main>
              <Footer go={go} />
            </>
  );
}
