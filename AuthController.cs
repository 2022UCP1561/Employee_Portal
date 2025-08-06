using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApplication1.Data;
using WebApplication1.Models;
using WebApplication1.Helpers;
using System;
using System.Linq;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly EmailSettings _emailSettings;

        public AuthController(AppDbContext context, IOptions<EmailSettings> emailSettings)
        {
            _context = context;
            _emailSettings = emailSettings.Value;
        }

        // ✅ DTO classes (best practice: define outside controller or as nested)
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class SignupRequest
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public decimal Salary { get; set; }
            public int DepartmentId { get; set; }
        }

        public class OtpRequest
        {
            public string Email { get; set; }
        }

        public class OtpVerification
        {
            public string Email { get; set; }
            public string Otp { get; set; }
        }

        // ✅ LOGIN
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Employees
                .Where(e => e.Email == request.Email && e.Password == request.Password)
                .Select(e => new
                {
                    e.Id,
                    e.Name,
                    e.Email,
                    e.DepartmentId,
                    DepartmentName = e.Department != null ? e.Department.Name : null
                })
                .FirstOrDefault();

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(user);
        }

        // ✅ SIGNUP
        [HttpPost("signup")]
        public IActionResult Signup([FromBody] SignupRequest request)
        {
            if (_context.Employees.Any(e => e.Email == request.Email))
                return BadRequest(new { message = "Email already exists" });

            var newEmployee = new Employee
            {
                Name = request.Name,
                Email = request.Email,
                Password = request.Password,
                DepartmentId = request.DepartmentId
            };

            _context.Employees.Add(newEmployee);
            _context.SaveChanges();

            return Ok(new { message = "Employee registered successfully" });
        }

        // ✅ SEND OTP
        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] OtpRequest request)
        {
            var email = request.Email;
            var user = _context.Employees.FirstOrDefault(e => e.Email == email);

            if (user == null)
                return NotFound(new { message = "Email not registered." });

            var otp = new Random().Next(100000, 999999).ToString();
            var expiry = DateTime.Now.AddMinutes(5);
            OtpStore.Store[email] = (otp, expiry);

            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_emailSettings.FromEmail));
            message.To.Add(MailboxAddress.Parse(email));
            message.Subject = "Your OTP Code";
            message.Body = new TextPart("plain") { Text = $"Your OTP is {otp}" };

            using var client = new SmtpClient();
            client.Connect(_emailSettings.SmtpServer, _emailSettings.SmtpPort, SecureSocketOptions.StartTls);
            client.Authenticate(_emailSettings.FromEmail, _emailSettings.AppPassword);
            client.Send(message);
            client.Disconnect(true);

            return Ok(new { message = "OTP sent to your email." });
        }

        // ✅ VERIFY OTP
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] OtpVerification request)
        {
            if (OtpStore.Store.TryGetValue(request.Email, out var otpData))
            {
                if (otpData.Expiry < DateTime.Now)
                    return BadRequest(new { message = "OTP expired." });

                if (otpData.Otp == request.Otp)
                {
                    OtpStore.Store.Remove(request.Email);
                    var user = _context.Employees
                        .Where(e => e.Email == request.Email)
                        .Select(e => new
                        {
                            e.Id,
                            e.Name,
                            e.Email,
                            e.DepartmentId,
                            DepartmentName = e.Department != null ? e.Department.Name : null
                        }).FirstOrDefault();

                    return Ok(user);
                }

                return Unauthorized(new { message = "Invalid OTP." });
            }

            return NotFound(new { message = "No OTP found for this email." });
        }
    }
}
