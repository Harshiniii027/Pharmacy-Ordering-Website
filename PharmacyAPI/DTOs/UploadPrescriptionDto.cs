namespace PharmacyAPI.DTOs
{
    public class UploadPrescriptionDto
    {
        public IFormFile File { get; set; }
        public int UserId { get; set; }
    }
}
