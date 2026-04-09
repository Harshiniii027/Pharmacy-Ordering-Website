using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;
using PharmacyAPI.DTOs;
using PharmacyAPI.Models;


namespace PharmacyAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : Controller
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        //place order

        [HttpPost("place")]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDto dto)
        {
            var order = new Order
            {
                UserId = dto.UserId,
                OrderDate = DateTime.UtcNow,
                Status = "Placed",
                PrescriptionId = dto.PrescriptionId
            };

            decimal total = 0;

            foreach (var item in dto.Items)
            {
                var medicine = await _context.Medicines.FindAsync(item.MedicineId);

                if (medicine == null)
                    return BadRequest($"Medicine ID {item.MedicineId} not found");

                // check for prescription

                if (medicine.RequiresPrescription)
                {
                    if (dto.PrescriptionId == null)
                        return BadRequest($"Prescription required for {medicine.Name}");

                    var prescription = await _context.Prescriptions
                        .FindAsync(dto.PrescriptionId);

                    if (prescription == null)
                        return BadRequest("Invalid prescription");

                    if (prescription.Status != "Approved")
                        return BadRequest("Prescription not approved yet");
                }

                if (medicine.StockQuantity < item.Quantity)
                    return BadRequest($"Not enough stock for {medicine.Name}");

                var orderItem = new OrderItem
                {
                    MedicineId = item.MedicineId,
                    Quantity = item.Quantity,
                    Price = medicine.Price
                };

                total += medicine.Price * item.Quantity;

                medicine.StockQuantity -= item.Quantity;

                order.OrderItems.Add(orderItem);
            }

            order.TotalAmount = total;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return Ok(order);
        }

        // Get orders for specific user
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrders(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Medicine)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            return Ok(orders);
        }


        //(Admin view)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Medicine)
                .ToListAsync();

            return Ok(orders);
        }


        // Update order status
        [HttpPut("status/{orderId}")]
        public async Task<IActionResult> UpdateStatus(int orderId, [FromQuery] string status)
        {
            var order = await _context.Orders.FindAsync(orderId);

            if (order == null)
                return NotFound();

            order.Status = status;

            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}