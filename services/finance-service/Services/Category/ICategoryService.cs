using FinanceTracker.Api.DTOs.Categories;

namespace FinanceTracker.Api.Services;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();
    Task<CategoryDto?> GetByIdAsync(int id);
    Task<CategoryDto> AddAsync(CreateCategoryDto dto);
}