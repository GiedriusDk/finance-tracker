namespace FinanceTracker.Api.DTOs.Transactions;

public class UpdateTransactionDto
{
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public int? CategoryId { get; set; }
}