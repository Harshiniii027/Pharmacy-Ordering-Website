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
                Status = "Placed"
            };

            decimal total = 0;

            foreach (var item in dto.Items)
            {
                var medicine = await _context.Medicines.FindAsync(item.MedicineId);

                if (medicine == null)
                    return BadRequest($"Medicine ID {item.MedicineId} not found");

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

        //
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

        //add order status[admin]

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