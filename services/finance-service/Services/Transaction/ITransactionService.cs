using FinanceTracker.Api.DTOs.Transactions;

namespace FinanceTracker.Api.Services;

public interface ITransactionService
{
    Task<List<TransactionDto>> GetAllAsync(int userId);
    Task<TransactionDto?> GetByIdAsync(int id, int userId);
    Task<TransactionDto> AddAsync(CreateTransactionDto dto, int userId);
    Task<SummaryDto> GetSummaryAsync(int userId);
    Task<bool> DeleteAsync(int id, int userId);
    Task<TransactionDto?> UpdateAsync(int id, CreateTransactionDto dto, int userId);
}

