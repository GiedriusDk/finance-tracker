import { Link } from "react-router-dom";

export default function Header({
  userEmail,
  onLogout,
  onOpenLogin,
  onOpenRegister
}) {
  return (
    <header className="top-banner">
      <div className="banner-content">
        <div>
          <p className="banner-kicker">Finance Tracker</p>
          <h1>Manage Your Finances Simplier</h1>
          <p className="banner-subtitle">
            Pradine versija sukurta taip, kad veliau lengvai prijungsime
            prisijungima, vartotojo paskyra ir istorija.
          </p>
        </div>

        <div className="header-actions">
          <Link to="/" className="login-btn login-btn-alt">
            Home
          </Link>

          {userEmail ? (
            <>
              <Link to="/tracker" className="login-btn">
                Tracker
              </Link>

              <span className="user-email">{userEmail}</span>

              <button
                type="button"
                className="logout-btn"
                onClick={onLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="login-btn"
                onClick={onOpenLogin}
              >
                Login
              </button>

              <button
                type="button"
                className="login-btn login-btn-alt"
                onClick={onOpenRegister}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}