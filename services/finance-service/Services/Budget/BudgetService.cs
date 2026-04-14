using FinanceTracker.Api.Data;
using FinanceTracker.Api.DTOs.Budgets;
using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Services;

public class BudgetService : IBudgetService
{
    private readonly FinanceTrackerDbContext _context;

    public BudgetService(FinanceTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<BudgetDto>> GetAllAsync()
    {
        var budgets = await _context.Budgets
            .Include(b => b.Category)
            .ToListAsync();

        return budgets.Select(b => new BudgetDto
        {
            Id = b.Id,
            Month = b.Month,
            Year = b.Year,
            LimitAmount = b.LimitAmount,
            CategoryId = b.CategoryId,
            CategoryName = b.Category != null ? b.Category.Name : string.Empty
        }).ToList();
    }

    public async Task<BudgetDto?> GetByIdAsync(int id)
    {
        var budget = await _context.Budgets
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (budget == null)
            return null;

        return new BudgetDto
        {
            Id = budget.Id,
            Month = budget.Month,
            Year = budget.Year,
            LimitAmount = budget.LimitAmount,
            CategoryId = budget.CategoryId,
            CategoryName = budget.Category != null ? budget.Category.Name : string.Empty
        };
    }

    public async Task<BudgetDto> AddAsync(CreateBudgetDto dto)
    {
        var budget = new Budget
        {
            Month = dto.Month,
            Year = dto.Year,
            LimitAmount = dto.LimitAmount,
            CategoryId = dto.CategoryId
        };

        _context.Budgets.Add(budget);
        await _context.SaveChangesAsync();

        var createdBudget = await _context.Budgets
            .Include(b => b.Category)
            .FirstAsync(b => b.Id == budget.Id);

        return new BudgetDto
        {
            Id = createdBudget.Id,
            Month = createdBudget.Month,
            Year = createdBudget.Year,
            LimitAmount = createdBudget.LimitAmount,
            CategoryId = createdBudget.CategoryId,
            CategoryName = createdBudget.Category != null ? createdBudget.Category.Name : string.Empty
        };
    }
}