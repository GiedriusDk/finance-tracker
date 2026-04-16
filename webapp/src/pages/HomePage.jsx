import { Link } from "react-router-dom";

export default function HomePage({ authToken, onOpenLogin, onOpenRegister }) {
  return (
    <main className="content home-page">
      <section className="hero">
        <h1>Simple and smarter money tracking</h1>
        <p>
          Start with a simple expense tracker and later expand into more tools
          like car cost planning, bill tracking, and custom financial calculators.
        </p>

        <div className="hero-actions">
          {authToken ? (
            <Link to="/tracker" className="primary-btn">
              Open Tracker
            </Link>
          ) : (
            <>
              <button type="button" className="primary-btn" onClick={onOpenLogin}>
                Login
              </button>
              <button type="button" className="secondary-btn" onClick={onOpenRegister}>
                Register
              </button>
            </>
          )}
        </div>
      </section>

      <section className="tool-cards">
        <article className="tool-card">
          <h3>Simple Tracker</h3>
          <p>Track your income and expenses in the easiest possible way.</p>
          <Link to="/tracker" className="secondary-btn">
            Open
          </Link>
        </article>

        <article className="tool-card">
          <h3>Car Costs</h3>
          <p>Plan fuel, insurance, maintenance, and total ownership costs.</p>
          <button type="button" className="secondary-btn" disabled>
            Coming soon
          </button>
        </article>

        <article className="tool-card">
          <h3>Bills Planner</h3>
          <p>Organize rent, subscriptions, and monthly bills in one place.</p>
          <button type="button" className="secondary-btn" disabled>
            Coming soon
          </button>
        </article>
      </section>
    </main>
  );
}