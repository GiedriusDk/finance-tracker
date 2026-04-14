using FinanceTracker.Api.Data;
using FinanceTracker.Api.DTOs.Transactions;
using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Services;

public class TransactionService : ITransactionService
{
    private readonly FinanceTrackerDbContext _context;

    public TransactionService(FinanceTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<TransactionDto>> GetAllAsync(int userId)
    {
        var transactions = await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.UserId == userId)
            .ToListAsync();

        return transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Amount = t.Amount,
            Type = t.Type,
            Description = t.Description,
            Date = t.Date,
            CategoryId = t.CategoryId,
            CategoryName = t.Category != null ? t.Category.Name : string.Empty
        }).ToList();
    }

    public async Task<TransactionDto?> GetByIdAsync(int id, int userId)
{
    var transaction = await _context.Transactions
        .Include(t => t.Category)
        .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

    if (transaction == null)
        return null;

    return new TransactionDto
    {
        Id = transaction.Id,
        Amount = transaction.Amount,
        Type = transaction.Type,
        Description = transaction.Description,
        Date = transaction.Date,
        CategoryId = transaction.CategoryId,
        CategoryName = transaction.Category != null ? transaction.Category.Name : string.Empty
    };
}

    public async Task<TransactionDto> AddAsync(CreateTransactionDto dto, int userId)
    {
        var transaction = new Transaction
        {
            Amount = dto.Amount,
            Type = dto.Type,
            Description = dto.Description,
            Date = dto.Date,
            CategoryId = dto.CategoryId,
            UserId = userId
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        var createdTransaction = await _context.Transactions
            .Include(t => t.Category)
            .FirstAsync(t => t.Id == transaction.Id);

        return new TransactionDto
        {
            Id = createdTransaction.Id,
            Amount = createdTransaction.Amount,
            Type = createdTransaction.Type,
            Description = createdTransaction.Description,
            Date = createdTransaction.Date,
            CategoryId = createdTransaction.CategoryId,
            CategoryName = createdTransaction.Category != null ? createdTransaction.Category.Name : string.Empty
        };
    }

    public async Task<SummaryDto> GetSummaryAsync(int userId)
    {
        var transactions = await _context.Transactions
            .Where(t => t.UserId == userId)
            .ToListAsync();

        var totalIncome = transactions
            .Where(t => t.Type == "Income")
            .Sum(t => t.Amount);

        var totalExpense = transactions
            .Where(t => t.Type == "Expense")
            .Sum(t => t.Amount);

        return new SummaryDto
        {
            TotalIncome = totalIncome,
            TotalExpense = totalExpense,
            Balance = totalIncome - totalExpense
        };
    }

    public async Task<bool> DeleteAsync(int id, int userId)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null)
            return false;

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<TransactionDto?> UpdateAsync(int id, CreateTransactionDto dto, int userId)
    {
        var transaction = await _context.Transactions
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (transaction == null)
            return null;

        transaction.Amount = dto.Amount;
        transaction.Type = dto.Type;
        transaction.Description = dto.Description;
        transaction.Date = dto.Date;
        transaction.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();

        return new TransactionDto
        {
            Id = transaction.Id,
            Amount = transaction.Amount,
            Type = transaction.Type,
            Description = transaction.Description,
            Date = transaction.Date,
            CategoryId = transaction.CategoryId,
            CategoryName = transaction.Category?.Name ?? ""
        };
    }
}