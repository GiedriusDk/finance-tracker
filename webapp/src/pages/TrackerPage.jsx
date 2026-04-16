import ExpenseChart from "../components/ExpenseChart";

export default function TrackerPage({
  summary,
  formData,
  categories,
  editingId,
  incomeTransactions,
  expenseTransactions,
  transactionError,
  transactionSuccess,
  onChange,
  onSubmit,
  onDelete,
  onEdit,
  onCancelEdit
}) {
  return (
    <main className="content">
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

      <section className="card chart-card">
        <h2>Expenses by Category</h2>
        <ExpenseChart transactions={expenseTransactions} />
      </section>

      <section className="card">
        <h2>{editingId ? "Edit Transaction" : "Add Transaction"}</h2>

        {transactionError ? <div className="form-error">{transactionError}</div> : null}
        {transactionSuccess ? <div className="form-success">{transactionSuccess}</div> : null}

        <form onSubmit={onSubmit} className="transaction-form">
          <input
            type="number"
            step="0.01"
            name="amount"
            placeholder="Amount (€)"
            value={formData.amount}
            onChange={onChange}
            required
          />

          <select name="type" value={formData.type} onChange={onChange}>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={onChange}
          />

          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={onChange}
            required
          />

          <input
            type="text"
            name="categoryName"
            list="category-options"
            placeholder="Food, Rent, Salary..."
            value={formData.categoryName}
            onChange={onChange}
          />

          <datalist id="category-options">
            {categories
              .filter((category) => category.type === formData.type)
              .map((category) => (
                <option key={category.id} value={category.name} />
              ))}
          </datalist>

          <button type="submit">{editingId ? "Update" : "Submit"}</button>

          {editingId && (
            <button type="button" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="split-grid">
        <article className="card">
          <h2>Income</h2>
          {incomeTransactions.length === 0 ? (
            <p className="empty-state">No income transactions yet.</p>
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
                      <td>{transaction.description || "—"}</td>
                      <td>{new Date(transaction.date).toLocaleString()}</td>
                      <td>{transaction.categoryName || "—"}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="table-btn delete-btn"
                            onClick={() => onDelete(transaction.id)}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="table-btn edit-btn"
                            onClick={() => onEdit(transaction)}
                          >
                            Edit
                          </button>
                        </div>
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
            <p className="empty-state">No expense transactions yet.</p>
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
                      <td>{transaction.description || "—"}</td>
                      <td>{new Date(transaction.date).toLocaleString()}</td>
                      <td>{transaction.categoryName || "—"}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="table-btn delete-btn"
                            onClick={() => onDelete(transaction.id)}
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            className="table-btn edit-btn"
                            onClick={() => onEdit(transaction)}
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}