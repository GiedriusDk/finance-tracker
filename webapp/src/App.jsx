import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import { authApi, financeApi, getEmailFromTokenPayload } from "./api/clients";
import { clearToken, decodeJwt, getToken, setToken } from "./auth/token";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TrackerPage from "./pages/TrackerPage";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState(null);
  const [authToken, setAuthToken] = useState(() => getToken());
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [transactionError, setTransactionError] = useState("");
  const [transactionSuccess, setTransactionSuccess] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    type: "Expense",
    description: "",
    date: "",
    categoryName: ""
  });

  const userEmail = useMemo(() => {
    if (!authToken) return null;
    const payload = decodeJwt(authToken);
    return getEmailFromTokenPayload(payload);
  }, [authToken]);

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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
      categoryName: transaction.categoryName || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      amount: "",
      type: "Expense",
      description: "",
      date: "",
      categoryName: ""
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
        categoryName: formData.categoryName.trim() || null
      };

      if (editingId) {
        await financeApi.put(`/transactions/${editingId}`, payload);
      } else {
        await financeApi.post("/transactions", payload);
      }

      handleCancelEdit();
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
    setTransactions([]);
    setCategories([]);
    setSummary(null);
    handleCancelEdit();
  };

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
    setAuthError("");
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
    setAuthError("");
  };

  const incomeTransactions = transactions.filter(
    (transaction) => transaction.type === "Income"
  );

  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "Expense"
  );

  return (
    <div className="app-shell">
      <Header
        userEmail={userEmail}
        onLogout={handleLogout}
        onOpenLogin={openLogin}
        onOpenRegister={openRegister}
      />

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

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              authToken={authToken}
              onOpenLogin={openLogin}
              onOpenRegister={openRegister}
            />
          }
        />

        <Route
          path="/tracker"
          element={
            authToken ? (
            <TrackerPage
              summary={summary}
              formData={formData}
              categories={categories}
              editingId={editingId}
              incomeTransactions={incomeTransactions}
              expenseTransactions={expenseTransactions}
              transactionError={transactionError}
              transactionSuccess={transactionSuccess}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onCancelEdit={handleCancelEdit}
            />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;