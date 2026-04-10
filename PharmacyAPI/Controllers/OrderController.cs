using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;
using PharmacyAPI.DTOs;
using PharmacyAPI.Models;


namespace PharmacyAPI.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var order = new Order
            {
                UserId = userId,
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

                    var prescription = await _context.Prescriptions.FindAsync(dto.PrescriptionId);

                    if (prescription == null)
                        return BadRequest("Invalid prescription");

                    if (prescription.UserId != userId)
                        return BadRequest("Invalid prescription for this user");

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
        [HttpGet("my-orders")]
        public async Task<IActionResult> GetOrders()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Medicine)
                .Where(o => o.UserId == userId)
                .ToListAsync();

            return Ok(orders);
        }


        //(Admin view)
        [Authorize(Roles = "Admin")]
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
        [Authorize(Roles = "Admin")]
        [HttpPut("status/{orderId}")]
        public async Task<IActionResult> UpdateStatus(int orderId, [FromQuery] string status)
        {
            var order = await _context.Orders.FindAsync(orderId);

            if (order == null)
                return NotFound();

            var validStatuses = new[] { "Placed", "Processing", "Shipped", "Delivered", "Cancelled" };

            if (!validStatuses.Contains(status))
                return BadRequest("Invalid status");

            order.Status = status;

            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}