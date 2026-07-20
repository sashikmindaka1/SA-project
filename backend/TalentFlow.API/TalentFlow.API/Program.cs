using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// 1. Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// DbContext Registration - Configured for Neon PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Essential for your API to recognize your Controller classes
builder.Services.AddControllers();

var app = builder.Build();

// 2. Enable the policy
app.UseCors("AllowAll");

// Serve uploaded resume files
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "wwwroot")),
    RequestPath = ""
});

// --- AUTOMATIC MIGRATION ON STARTUP (OPTIONAL & SAFE) ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Auto applies pending migrations when backend runs
    context.Database.Migrate();
}

app.UseHttpsRedirection();
app.UseAuthorization();

// This line is what actually makes your API endpoints reachable
app.MapControllers();

app.Run();