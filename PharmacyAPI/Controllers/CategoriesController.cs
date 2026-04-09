using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmacyAPI.Services;

namespace PharmacyAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly IMedicineService _medicineService;

    public CategoriesController(IMedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    // PUBLIC - Anyone can view categories
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _medicineService.GetAllCategories();
        return Ok(categories);
    }

    // ADMIN ONLY - Create category
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] string name)
    {
        var category = await _medicineService.CreateCategory(name);
        return Ok(new { id = category.Id, name = category.Name, message = "Category created successfully" });
    }

    // ADMIN ONLY - Update category
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] string name)
    {
        var result = await _medicineService.UpdateCategory(id, name);
        if (!result)
            return NotFound(new { message = "Category not found" });

        return Ok(new { message = "Category updated successfully" });
    }

    // ADMIN ONLY - Delete category
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _medicineService.DeleteCategory(id);
        if (!result)
            return BadRequest(new { message = "Cannot delete category with medicines or category not found" });

        return Ok(new { message = "Category deleted successfully" });
    }
}