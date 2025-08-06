using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using System.Linq;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EmployeesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllEmployees()
        {
            return Ok(_context.Employees.ToList());
        }
    }
}
