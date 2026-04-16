import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#a855f7", "#06b6d4"];

export default function ExpenseChart({ transactions }) {
  const grouped = transactions.reduce((acc, transaction) => {
    const category = transaction.categoryName || "Other";
    acc[category] = (acc[category] || 0) + Number(transaction.amount);
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value
  }));

  if (data.length === 0) {
    return <p className="empty-state">No expense data for chart.</p>;
  }

  return (
    <PieChart width={320} height={320}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={110}
        label
      >
        {data.map((entry, index) => (
          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}