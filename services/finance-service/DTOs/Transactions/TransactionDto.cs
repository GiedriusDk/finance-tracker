namespace FinanceTracker.Api.DTOs.Transactions;

public class TransactionDto
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }

    public int? CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}