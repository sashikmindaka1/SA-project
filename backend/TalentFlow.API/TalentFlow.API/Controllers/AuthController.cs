using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TalentFlow.API.Data;
using TalentFlow.API.DTOs;
using TalentFlow.API.Models;
using TalentFlow.API.Services;

namespace TalentFlow.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;

        public AuthController(AppDbContext context, IConfiguration configuration, EmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        // 1. REGISTER
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "Email is already registered!" });
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = passwordHash,
                Role = string.IsNullOrEmpty(dto.Role) ? "Candidate" : dto.Role 
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully!" });
        }

        // 2. LOGIN
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password!" });
            }

            string token = CreateJwtToken(user);

            return Ok(new
            {
                token = token,
                user = new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    role = user.Role
                }
            });
        }

        // 3. FORGOT PASSWORD (SEND EMAIL WITH RESET LINK)
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            
            // Security Best Practice: User නැතත් එහෙම message එකක් යැවීමෙන් Email enumeration වළකී
            if (user == null)
            {
                return Ok(new { message = "If the email exists, a password reset link has been sent." });
            }

            // Secure Token එකක් සාදමු
            string resetToken = Convert.ToHexString(RandomNumberGenerator.GetBytes(64));

            user.PasswordResetToken = resetToken;
            user.ResetTokenExpires = DateTime.UtcNow.AddHours(1); // පැයක් සඳහා වලංගුයි
            await _context.SaveChangesAsync();

            // Frontend Link එක
            string frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:5173";
            string resetLink = $"{frontendUrl}/reset-password?token={resetToken}";

            try
            {
                await _emailService.SendResetPasswordEmailAsync(user.Email, resetLink);
                return Ok(new { message = "Password reset link sent to your email!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to send email: " + ex.Message });
            }
        }

        // 4. RESET PASSWORD (SAVE NEW PASSWORD VIA TOKEN)
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => 
                u.PasswordResetToken == dto.Token && 
                u.ResetTokenExpires > DateTime.UtcNow);

            if (user == null)
            {
                return BadRequest(new { message = "Invalid or expired password reset token!" });
            }

            // New password එක Hash කරලා save කරමු
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            
            // Token එක පාවිච්චි කරලා ඉවර නිසා Clear කිරීම
            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successful! You can now login with your new password." });
        }

        // HELPER METHOD: Generate JWT Token
        private string CreateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role ?? "Candidate")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}