using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// DbContext Registration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Essential for your API to recognize your Controller classes
builder.Services.AddControllers();

var app = builder.Build();

// 2. Enable the policy
app.UseCors("AllowAll");

// --- TABLE CREATION BLOCK ---
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

app.UseHttpsRedirection();
app.UseAuthorization();

// This line is what actually makes your API endpoints reachable
app.MapControllers();

app.Run();