using Microsoft.EntityFrameworkCore;
using TalentFlow.API.Data;

var builder = WebApplication.CreateBuilder(args);

// DbContext Registration
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Essential for your API to recognize your Controller classes
builder.Services.AddControllers();

var app = builder.Build();

// --- TABLE CREATION BLOCK ---
// This ensures your SQL tables are ready as soon as the app starts
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