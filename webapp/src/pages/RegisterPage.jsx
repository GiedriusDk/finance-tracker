export default function RegisterPage({
  email,
  password,
  error,
  onChange,
  onSubmit,
  onSwitchToLogin
}) {
  return (
    <div>
      <h2 className="auth-title">Regisration</h2>
      <form className="auth-form" onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="El. pastas"
          value={email}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Slaptazodis"
          value={password}
          onChange={onChange}
          required
        />

        {error ? <div className="auth-error">{error}</div> : null}

        <button type="submit" className="auth-submit">
          Register
        </button>
      </form>

      <div className="auth-switch">
        <button type="button" className="auth-link" onClick={onSwitchToLogin}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

