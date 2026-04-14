namespace FinanceTracker.Api.DTOs.Budgets;

public class CreateBudgetDto
{
    public int Month { get; set; }
    public int Year { get; set; }
    public decimal LimitAmount { get; set; }
    public int CategoryId { get; set; }
}