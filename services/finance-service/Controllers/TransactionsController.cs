using FinanceTracker.Api.DTOs.Transactions;
using FinanceTracker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceTracker.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
            return null;

        return int.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();
        return Ok(await _transactionService.GetAllAsync(userId.Value));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        var result = await _transactionService.GetByIdAsync(id, userId.Value);

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
    {
        if (dto.Amount <= 0)
            return BadRequest("Amount must be greater than 0.");

        if (dto.Type != "Income" && dto.Type != "Expense")
            return BadRequest("Transaction type must be Income or Expense.");

        if (dto.CategoryId <= 0)
            return BadRequest("Valid categoryId is required.");

        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

        return Ok(await _transactionService.AddAsync(dto, userId.Value));
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        return Ok(await _transactionService.GetSummaryAsync(userId.Value));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

        var deleted = await _transactionService.DeleteAsync(id, userId.Value);

        if (!deleted)
            return NotFound();

        return NoContent();
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateTransactionDto dto)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
            return Unauthorized();

        var updated = await _transactionService.UpdateAsync(id, dto, userId.Value);

        if (updated == null)
            return NotFound();

        return Ok(updated);
    }
}