using FinanceTracker.Api.DTOs.Budgets;

namespace FinanceTracker.Api.Services;

public interface IBudgetService
{
    Task<List<BudgetDto>> GetAllAsync();
    Task<BudgetDto?> GetByIdAsync(int id);
    Task<BudgetDto> AddAsync(CreateBudgetDto dto);
}