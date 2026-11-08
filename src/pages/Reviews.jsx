import React from "react";
import * as Icons from "lucide-react";
import { Link } from "react-router-dom";

export default function ReviewsPage({ reviews = [] }) {
  return (
    <main className="page-main">
      <div className="page-hero reviews-hero">
        <span className="eyebrow">VERIFIED STUDENT VOICES</span>
        <h1>Real experiences.<br /><span>From the academy database.</span></h1>
        <p>Only student reviews approved for public display are shown here. New student ratings are stored by Django and appear after an administrator approves them.</p>
      </div>
      <div className="review-summary">
        <div><strong>★★★★★</strong><h2>Student feedback matters.</h2><p>Reviews shown on this page are retrieved from the reviews database. No sample testimonials are displayed.</p></div>
        <Icons.MessageCircle size={38} />
      </div>
      {reviews.length ? (
        <div className="review-grid review-list">
          {reviews.map((review) => (
            <article className="review-card" key={review.id}>
              <div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{"★".repeat(Number(review.rating || 0))}</div>
              <p>{review.comment ? `“${review.comment}”` : "Student rating submitted."}</p>
              <div className="review-person">
                <span className="review-avatar">{(review.student_name || "S").trim().charAt(0).toUpperCase()}</span>
                <div><b>{review.student_name || "STar Academy student"}</b><small>{review.subject_name || (review.review_type === "subject" ? "Subject review" : "Overall experience")}</small></div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">No student reviews have been published yet. Once a student submits a rating and an administrator approves it in Django admin, it will appear here.</div>
      )}
      <section className="assurance-strip">
        <Icons.Star size={24} /><div><b>Are you a student?</b><p>Register for free, explore the topics, and submit an honest rating from your student dashboard.</p></div>
        <Link className="btn btn-primary btn-small" to="/signup?next=/dashboard">Register free <Icons.ArrowRight size={15} /></Link>
      </section>
    </main>
  );
}
