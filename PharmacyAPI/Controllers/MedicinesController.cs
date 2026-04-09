using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PharmacyAPI.DTOs;
using PharmacyAPI.Services;

namespace PharmacyAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MedicinesController : ControllerBase
{
    private readonly IMedicineService _medicineService;

    public MedicinesController(IMedicineService medicineService)
    {
        _medicineService = medicineService;
    }

    // PUBLIC - Anyone can view medicines
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll([FromQuery] int? categoryId, [FromQuery] string? search)
    {
        var medicines = await _medicineService.GetAllMedicines(categoryId, search);
        return Ok(medicines);
    }

    // PUBLIC - Anyone can view single medicine
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var medicine = await _medicineService.GetMedicineById(id);
        if (medicine == null)
            return NotFound(new { message = "Medicine not found" });

        return Ok(medicine);
    }

    // ADMIN ONLY - Create medicine
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(MedicineCreateDto createDto)
    {
        var medicine = await _medicineService.CreateMedicine(createDto);
        return CreatedAtAction(nameof(GetById), new { id = medicine.Id }, medicine);
    }

    // ADMIN ONLY - Update medicine
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, MedicineCreateDto updateDto)
    {
        var result = await _medicineService.UpdateMedicine(id, updateDto);
        if (!result)
            return NotFound(new { message = "Medicine not found" });

        return Ok(new { message = "Medicine updated successfully" });
    }

    // ADMIN ONLY - Delete medicine
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _medicineService.DeleteMedicine(id);
        if (!result)
            return NotFound(new { message = "Medicine not found" });

        return Ok(new { message = "Medicine deleted successfully" });
    }

    // ADMIN ONLY - Update stock quantity
    [Authorize(Roles = "Admin")]
    [HttpPatch("{id}/stock")]
    public async Task<IActionResult> UpdateStock(int id, [FromBody] int quantity)
    {
        var result = await _medicineService.UpdateStockQuantity(id, quantity);
        if (!result)
            return NotFound(new { message = "Medicine not found" });

        return Ok(new { message = "Stock updated successfully" });
    }
}