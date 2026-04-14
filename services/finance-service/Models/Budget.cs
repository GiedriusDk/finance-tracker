namespace FinanceTracker.Api.Models;

public class Budget
{
    public int Id { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal LimitAmount { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}