export default function LoginPage({ email, password, error, onChange, onSubmit, onSwitchToRegister }) {
  return (
    <div>
      <h2 className="auth-title">Login</h2>
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />

        {error ? <div className="auth-error">{error}</div> : null}

        <button type="submit" className="auth-submit">
          Login
        </button>
      </form>

      <div className="auth-switch">
        <button type="button" className="auth-link" onClick={onSwitchToRegister}>
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
}

