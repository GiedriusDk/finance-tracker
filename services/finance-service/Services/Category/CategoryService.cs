using FinanceTracker.Api.Data;
using FinanceTracker.Api.DTOs.Categories;
using FinanceTracker.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Api.Services;

public class CategoryService : ICategoryService
{
    private readonly FinanceTrackerDbContext _context;

    public CategoryService(FinanceTrackerDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetAllAsync(int userId)
    {
        var categories = await _context.Categories
            .Where(c => c.UserId == null || c.UserId == userId)
            .OrderBy(c => c.Name)
            .ToListAsync();

        return categories.Select(c => new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Type = c.Type
        }).ToList();
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category == null)
            return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Type = category.Type
        };
    }

    public async Task<CategoryDto> AddAsync(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Type = dto.Type
        };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Type = category.Type
        };
    }
}