import { useEffect, useMemo, useState } from "react";
import "./App.css";

import { authApi, financeApi, getEmailFromTokenPayload } from "./api/clients";
import { clearToken, decodeJwt, getToken, setToken } from "./auth/token";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [authToken, setAuthToken] = useState(() => getToken());
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const userEmail = useMemo(() => {
    if (!authToken) return null;
    const payload = decodeJwt(authToken);
    return getEmailFromTokenPayload(payload);
  }, [authToken]);

  const [formData, setFormData] = useState({
    amount: "",
    type: "Expense",
    description: "",
    date: "",
    categoryId: ""
  });

  useEffect(() => {
    if (!authToken) return;
    const load = async () => {
      try {
        const [txRes, categoriesRes, summaryRes] = await Promise.all([
          financeApi.get("/transactions"),
          financeApi.get("/categories"),
          financeApi.get("/transactions/summary")
        ]);

        setTransactions(txRes.data);
        setCategories(categoriesRes.data);
        setSummary(summaryRes.data);
      } catch (error) {
        console.error("Failed to load protected data:", error);
      }
    };

    void load();
  }, [authToken]);

  async function refreshTransactions() {
    const response = await financeApi.get("/transactions");
    setTransactions(response.data);
  }

  async function refreshSummary() {
    const response = await financeApi.get("/transactions/summary");
    setSummary(response.data);
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (id) => {
    try {
      await financeApi.delete(`/transactions/${id}`);
      await refreshTransactions();
      await refreshSummary();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setFormData({
      amount: transaction.amount.toString(),
      type: transaction.type,
      description: transaction.description || "",
      date: new Date(transaction.date).toISOString().slice(0, 16),
      categoryId: transaction.categoryId?.toString() || ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        amount: Number(formData.amount),
        type: formData.type,
        description: formData.description,
        date: formData.date,
        categoryId: Number(formData.categoryId)
      };

      if (editingId) {
        await financeApi.put(`/transactions/${editingId}`, payload);
      } else {
        await financeApi.post("/transactions", payload);
      }

      setFormData({
        amount: "",
        type: "Expense",
        description: "",
        date: "",
        categoryId: ""
      });

      setEditingId(null);

      await refreshTransactions();
      await refreshSummary();
    } catch (error) {
      console.error("Failed to save transaction:", error);
    }
  };

  const handleAuthChange = (e) => {
    setAuthForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      if (authMode === "register") {
        await authApi.post("/Auth/register", {
          email: authForm.email,
          password: authForm.password
        });

        // After successful register, switch to login.
        setAuthMode("login");
        setAuthError("Registration successful. Please login.");
        return;
      }

      const response = await authApi.post("/Auth/login", {
        email: authForm.email,
        password: authForm.password
      });

      const token = response.data?.token;
      if (!token) {
        setAuthError("Login failed: token not found.");
        return;
      }

      setToken(token);
      setAuthToken(token);
      setAuthOpen(false);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "Failed to login.";
      setAuthError(typeof message === "string" ? message : "Failed to login.");
    }
  };

  const handleLogout = () => {
    clearToken();
    setAuthToken(null);
    setAuthOpen(false);
    setAuthError("");
  };

  const incomeTransactions = transactions.filter((transaction) => transaction.type === "Income");
  const expenseTransactions = transactions.filter((transaction) => transaction.type === "Expense");

  return (
    <div className="app-shell">
      <header className="top-banner">
        <div className="banner-content">
          <div>
            <p className="banner-kicker">Finance Tracker</p>
            <h1>Manage Your Finances Simplier</h1>
            <p className="banner-subtitle">
              Pradine versija sukurta taip, kad veliau lengvai prijungsime prisijungima, vartotojo paskyra ir istorija.
            </p>
          </div>
          {userEmail ? (
            <div className="header-actions">
              <span className="user-email">{userEmail}</span>
              <button type="button" className="logout-btn" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <div className="header-actions">
              <button
                type="button"
                className="login-btn"
                onClick={() => {
                  setAuthMode("login");
                  setAuthOpen(true);
                  setAuthError("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="login-btn login-btn-alt"
                onClick={() => {
                  setAuthMode("register");
                  setAuthOpen(true);
                  setAuthError("");
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      {authOpen && (
        <div
          className="auth-modal-overlay"
          onMouseDown={() => {
            setAuthOpen(false);
            setAuthError("");
          }}
        >
          <div
            className="auth-modal"
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
          >
            {authMode === "login" ? (
              <LoginPage
                email={authForm.email}
                password={authForm.password}
                error={authError}
                onChange={handleAuthChange}
                onSubmit={handleAuthSubmit}
                onSwitchToRegister={() => {
                  setAuthMode("register");
                  setAuthError("");
                }}
              />
            ) : (
              <RegisterPage
                email={authForm.email}
                password={authForm.password}
                error={authError}
                onChange={handleAuthChange}
                onSubmit={handleAuthSubmit}
                onSwitchToLogin={() => {
                  setAuthMode("login");
                  setAuthError("");
                }}
              />
            )}
          </div>
        </div>
      )}

      <main className="content">
        {!authToken ? (
          <section className="card auth-gate">
            <h2>Need Authentication</h2>
            <p>Login or create an account to view transactions.</p>
            <div className="auth-gate-actions">
              <button
                type="button"
                className="login-btn"
                onClick={() => {
                  setAuthMode("login");
                  setAuthOpen(true);
                  setAuthError("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className="login-btn login-btn-alt"
                onClick={() => {
                  setAuthMode("register");
                  setAuthOpen(true);
                  setAuthError("");
                }}
              >
                Register
              </button>
            </div>
          </section>
        ) : (
          <>
            {summary && (
              <section className="card">
                <h2>Summary</h2>
                <div className="summary-grid">
                  <article className="summary-item">
                    <span>Income</span>
                    <strong>{summary.totalIncome}</strong>
                  </article>
                  <article className="summary-item">
                    <span>Expenses</span>
                    <strong>{summary.totalExpense}</strong>
                  </article>
                  <article className="summary-item">
                    <span>Balance</span>
                    <strong>{summary.balance}</strong>
                  </article>
                </div>
              </section>
            )}

            <section className="card">
              <h2>Add Transaction</h2>
              <form onSubmit={handleSubmit} className="transaction-form">
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />

                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>

                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                />

                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />

                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((category) => category.type === formData.type)
                    .map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>

                <button type="submit">
                  {editingId ? "Update" : "Submit"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({
                        amount: "",
                        type: "Expense",
                        description: "",
                        date: "",
                        categoryId: ""
                      });
                    }}
                  >
                    Cancel
                  </button>
                )}
              </form>
            </section>

            <section className="split-grid">
              <article className="card">
                <h2>Income</h2>
                {incomeTransactions.length === 0 ? (
                  <p>No income transactions found.</p>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Amount</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Category</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incomeTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{transaction.amount}</td>
                            <td>{transaction.description}</td>
                            <td>{new Date(transaction.date).toLocaleString()}</td>
                            <td>{transaction.categoryName}</td>
                            <td>
                              <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                            </td>
                            <td>
                              <button type="button" onClick={() => handleEdit(transaction)}>
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>

              <article className="card">
                <h2>Expense</h2>
                {expenseTransactions.length === 0 ? (
                  <p>No expense transactions found.</p>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Amount</th>
                          <th>Description</th>
                          <th>Date</th>
                          <th>Category</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenseTransactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td>{transaction.amount}</td>
                            <td>{transaction.description}</td>
                            <td>{new Date(transaction.date).toLocaleString()}</td>
                            <td>{transaction.categoryName}</td>
                            <td>
                              <button onClick={() => handleDelete(transaction.id)}>Delete</button>
                            </td>
                            <td>
                              <button type="button" onClick={() => handleEdit(transaction)}>
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;