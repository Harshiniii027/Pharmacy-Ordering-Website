using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;
using PharmacyAPI.DTOs;
using PharmacyAPI.Models;

namespace PharmacyAPI.Services;

public interface IMedicineService
{
    Task<List<MedicineResponseDto>> GetAllMedicines(int? categoryId, string? search);
    Task<MedicineResponseDto?> GetMedicineById(int id);
    Task<Medicine> CreateMedicine(MedicineCreateDto createDto);
    Task<bool> UpdateMedicine(int id, MedicineCreateDto updateDto);
    Task<bool> DeleteMedicine(int id);
    Task<List<CategoryResponseDto>> GetAllCategories();
    Task<Category> CreateCategory(string name);
    Task<bool> UpdateCategory(int id, string name);
    Task<bool> DeleteCategory(int id);
    Task<bool> UpdateStockQuantity(int id, int quantity);
}

public class MedicineService : IMedicineService
{
    private readonly AppDbContext _context;

    public MedicineService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<MedicineResponseDto>> GetAllMedicines(int? categoryId, string? search)
    {
        var query = _context.Medicines
            .Include(m => m.Category)
            .AsQueryable();

        if (categoryId.HasValue)
            query = query.Where(m => m.CategoryId == categoryId.Value);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(m => m.Name.Contains(search) || m.Description.Contains(search));

        return await query
            .Select(m => new MedicineResponseDto
            {
                Id = m.Id,
                Name = m.Name,
                Description = m.Description,
                Price = m.Price,
                StockQuantity = m.StockQuantity,
                Dosage = m.Dosage,
                Packaging = m.Packaging,
                RequiresPrescription = m.RequiresPrescription,
                CategoryId = m.CategoryId,
                CategoryName = m.Category != null ? m.Category.Name : string.Empty
            })
            .ToListAsync();
    }

    public async Task<MedicineResponseDto?> GetMedicineById(int id)
    {
        var medicine = await _context.Medicines
            .Include(m => m.Category)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (medicine == null)
            return null;

        return new MedicineResponseDto
        {
            Id = medicine.Id,
            Name = medicine.Name,
            Description = medicine.Description,
            Price = medicine.Price,
            StockQuantity = medicine.StockQuantity,
            Dosage = medicine.Dosage,
            Packaging = medicine.Packaging,
            RequiresPrescription = medicine.RequiresPrescription,
            CategoryId = medicine.CategoryId,
            CategoryName = medicine.Category?.Name ?? string.Empty
        };
    }

    public async Task<Medicine> CreateMedicine(MedicineCreateDto createDto)
    {
        var medicine = new Medicine
        {
            Name = createDto.Name,
            Description = createDto.Description,
            Price = createDto.Price,
            StockQuantity = createDto.StockQuantity,
            Dosage = createDto.Dosage,
            Packaging = createDto.Packaging,
            RequiresPrescription = createDto.RequiresPrescription,
            CategoryId = createDto.CategoryId
        };

        _context.Medicines.Add(medicine);
        await _context.SaveChangesAsync();
        return medicine;
    }

    public async Task<bool> UpdateMedicine(int id, MedicineCreateDto updateDto)
    {
        var medicine = await _context.Medicines.FindAsync(id);
        if (medicine == null)
            return false;

        medicine.Name = updateDto.Name;
        medicine.Description = updateDto.Description;
        medicine.Price = updateDto.Price;
        medicine.StockQuantity = updateDto.StockQuantity;
        medicine.Dosage = updateDto.Dosage;
        medicine.Packaging = updateDto.Packaging;
        medicine.RequiresPrescription = updateDto.RequiresPrescription;
        medicine.CategoryId = updateDto.CategoryId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteMedicine(int id)
    {
        var medicine = await _context.Medicines.FindAsync(id);
        if (medicine == null)
            return false;

        _context.Medicines.Remove(medicine);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<CategoryResponseDto>> GetAllCategories()
    {
        return await _context.Categories
            .Select(c => new CategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                MedicinesCount = c.Medicines.Count
            })
            .ToListAsync();
    }

    public async Task<Category> CreateCategory(string name)
    {
        var category = new Category { Name = name };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<bool> UpdateCategory(int id, string name)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return false;

        category.Name = name;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Medicines)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null || category.Medicines.Any())
            return false;

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return true;
    }

    // Add this implementation to MedicineService class
    public async Task<bool> UpdateStockQuantity(int id, int quantity)
    {
        var medicine = await _context.Medicines.FindAsync(id);
        if (medicine == null)
            return false;

        if (quantity < 0)
            return false;

        medicine.StockQuantity = quantity;
        await _context.SaveChangesAsync();
        return true;
    }
}