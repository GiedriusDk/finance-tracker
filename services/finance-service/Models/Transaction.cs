namespace FinanceTracker.Api.Models;

public class Transaction
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty; // Income / Expense
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    public int UserId { get; set; }
}