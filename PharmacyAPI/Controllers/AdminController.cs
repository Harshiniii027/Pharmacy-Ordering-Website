using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PharmacyAPI.Data;
using PharmacyAPI.DTOs;

namespace PharmacyAPI.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/admin/users - View all users
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Phone,
                u.Role,
                u.Orders,
                OrdersCount = u.Orders.Count,
                PrescriptionsCount = u.Prescriptions.Count
            })
            .ToListAsync();

        return Ok(users);
    }

    // GET: api/admin/users/{id} - View specific user
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _context.Users
            .Include(u => u.Orders)
            .Include(u => u.Prescriptions)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "User not found" });

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.Phone,
            user.Role,
            Orders = user.Orders.Select(o => new
            {
                o.Id,
                o.OrderDate,
                o.TotalAmount,
                o.Status
            }),
            Prescriptions = user.Prescriptions.Select(p => new
            {
                p.Id,
                p.FilePath,
                p.Status,
                p.UploadedAt
            })
        });
    }

    // PUT: api/admin/users/{id}/role - Update user role
    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] string role)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "User not found" });

        if (role != "Customer" && role != "Admin")
            return BadRequest(new { message = "Role must be either 'Customer' or 'Admin'" });

        user.Role = role;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"User role updated to {role}" });
    }

    // GET: api/admin/orders - View all orders
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders([FromQuery] string? status)
    {
        var query = _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Medicine)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);

        var orders = await query
            .Select(o => new
            {
                o.Id,
                CustomerName = o.User != null ? o.User.FullName : "Unknown",
                CustomerEmail = o.User != null ? o.User.Email : "Unknown",
                o.OrderDate,
                o.TotalAmount,
                o.Status,
                ItemsCount = o.OrderItems.Count,
                Items = o.OrderItems.Select(oi => new
                {
                    oi.Medicine.Name,
                    oi.Quantity,
                    oi.Price
                })
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/admin/orders/{id} - View specific order
    [HttpGet("orders/{id}")]
    public async Task<IActionResult> GetOrderById(int id)
    {
        var order = await _context.Orders
            .Include(o => o.User)
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Medicine)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = "Order not found" });

        return Ok(new
        {
            order.Id,
            Customer = new
            {
                order.User?.Id,
                order.User?.FullName,
                order.User?.Email,
                order.User?.Phone
            },
            order.OrderDate,
            order.TotalAmount,
            order.Status,
            Items = order.OrderItems.Select(oi => new
            {
                oi.Medicine?.Name,
                oi.Quantity,
                oi.Price,
                Subtotal = oi.Quantity * oi.Price
            })
        });
    }

    // PUT: api/admin/orders/{id}/status - Update order status
    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
            return NotFound(new { message = "Order not found" });

        var validStatuses = new[] { "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled" };
        if (!validStatuses.Contains(status))
            return BadRequest(new { message = "Invalid status" });

        order.Status = status;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"Order status updated to {status}" });
    }

    // GET: api/admin/dashboard/stats - Dashboard statistics
    [HttpGet("dashboard/stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var totalUsers = await _context.Users.CountAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var totalMedicines = await _context.Medicines.CountAsync();
        var pendingOrders = await _context.Orders.CountAsync(o => o.Status == "Pending");
        var lowStockMedicines = await _context.Medicines.CountAsync(m => m.StockQuantity < 50);
        var totalRevenue = await _context.Orders.SumAsync(o => o.TotalAmount);
        var pendingPrescriptions = await _context.Prescriptions.CountAsync(p => p.Status == "Pending");

        return Ok(new
        {
            TotalUsers = totalUsers,
            TotalOrders = totalOrders,
            TotalMedicines = totalMedicines,
            PendingOrders = pendingOrders,
            LowStockMedicines = lowStockMedicines,
            TotalRevenue = totalRevenue,
            PendingPrescriptions = pendingPrescriptions,
            RecentOrders = await _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.TotalAmount,
                    o.Status
                })
                .ToListAsync()
        });
    }
}