using FinanceTracker.Api.DTOs.Budgets;
using FinanceTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FinanceTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BudgetsController : ControllerBase
{
    private readonly IBudgetService _budgetService;

    public BudgetsController(IBudgetService budgetService)
    {
        _budgetService = budgetService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _budgetService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _budgetService.GetByIdAsync(id);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBudgetDto dto)
    {
        if (dto.Month < 1 || dto.Month > 12)
            return BadRequest("Month must be between 1 and 12.");

        if (dto.Year < 2000 || dto.Year > 2100)
            return BadRequest("Year is not valid.");

        if (dto.LimitAmount <= 0)
            return BadRequest("Limit amount must be greater than 0.");

        if (dto.CategoryId <= 0)
            return BadRequest("Valid categoryId is required.");

        return Ok(await _budgetService.AddAsync(dto));
    }
}