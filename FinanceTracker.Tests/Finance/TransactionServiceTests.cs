using Xunit;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using FinanceTracker.Api.Services;
using FinanceTracker.Api.Data;
using FinanceTracker.Api.DTOs.Transactions;
using FinanceTracker.Api.Models;


namespace FinanceTracker.Tests.Finance;

public class TransactionServiceTests
{
    [Fact]
    public async Task CreateTransaction_Should_Create_Transaction_When_Data_Is_Valid()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<FinanceTrackerDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        await using var context = new FinanceTrackerDbContext(options);

        var transactionService = new TransactionService(context);

        var category = new Category
        {
            Name = "Test Category",
            Type = "Income"
        };

        context.Categories.Add(category);
        await context.SaveChangesAsync();

        var createDto = new CreateTransactionDto
        {
            Amount = 123,
            Description = "Test Transaction",
            Type = "Income",
            Date = DateTime.UtcNow,
            CategoryId = category.Id
        };

        // Act
        var createdTransaction = await transactionService.AddAsync(createDto, userId: 1);

        // Assert
        Assert.NotNull(createdTransaction);

        
        Assert.Equal(createDto.Description, createdTransaction!.Description);
        Assert.Equal(createDto.Amount, createdTransaction.Amount);
        Assert.Equal(createDto.Type, createdTransaction.Type);
    }
}