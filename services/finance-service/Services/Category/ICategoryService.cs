using FinanceTracker.Api.DTOs.Categories;

namespace FinanceTracker.Api.Services;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync(int userId);
    Task<CategoryDto?> GetByIdAsync(int id);
    Task<CategoryDto> AddAsync(CreateCategoryDto dto);
}