namespace PharmacyAPI.DTOs;

public class PlaceOrderDto
{
    public int UserId { get; set; }

    public int? PrescriptionId { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int MedicineId { get; set; }

    public int Quantity { get; set; }
}
