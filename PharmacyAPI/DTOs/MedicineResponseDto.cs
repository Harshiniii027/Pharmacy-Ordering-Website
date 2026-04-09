namespace PharmacyAPI.DTOs;

public class MedicineResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
    public string Dosage { get; set; } = string.Empty;
    public string Packaging { get; set; } = string.Empty;
    public bool RequiresPrescription { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}

public class CategoryResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int MedicinesCount { get; set; }
}