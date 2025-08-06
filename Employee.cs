using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        

       
        

        
        public int DepartmentId { get; set; }
        public string Password { get; set; }

        public Department? Department { get; set; } // optional navigation
    }
}
