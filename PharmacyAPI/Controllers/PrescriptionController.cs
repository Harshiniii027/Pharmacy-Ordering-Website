using Microsoft.AspNetCore.Mvc;
using PharmacyAPI.Data;
using PharmacyAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace PharmacyAPI.Controllers
{
    
        [Route("api/[controller]")]
        [ApiController]
        public class PrescriptionController : ControllerBase
        {
            private readonly AppDbContext _context;

            public PrescriptionController(AppDbContext context)
            {
                _context = context;
            }


        //upload method

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file, int userId)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required");

            var allowedExtensions = new[] { ".jpg", ".png", ".pdf" };
            var extension = Path.GetExtension(file.FileName).ToLower();

            if (!allowedExtensions.Contains(extension))
                return BadRequest("Invalid file type");

            var fileName = Guid.NewGuid() + extension;
            var filePath = Path.Combine("Uploads", fileName);

            Directory.CreateDirectory("Uploads");

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var prescription = new Prescription
            {
                UserId = userId,
                FilePath = filePath,
                Status = "Pending"
            };

            _context.Prescriptions.Add(prescription);
            await _context.SaveChangesAsync();

            return Ok(prescription);
        }

        //get prescription

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPrescriptions(int userId)
        {
            var prescriptions = await _context.Prescriptions
                .Where(p => p.UserId == userId)
                .ToListAsync();

            return Ok(prescriptions);
        }


    }
}
