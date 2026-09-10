using ChurchPulse.API.Models;
using ChurchPulse.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ChurchPulse.API.Interfaces;
using ChurchPulse.API.Services;
using ChurchPulse.API.Repositories;

var builder = WebApplication.CreateBuilder(args);


// Enable CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


// Add services
builder.Services.AddControllers();

builder.Services.AddScoped<
    IMemberRepository,
    MemberRepository
>();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter your JWT token."
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// Register Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));


// Register services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();


// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["Key"]!))
    };
});


builder.Services.AddAuthorization();


var app = builder.Build();


// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();


// Enable CORS BEFORE Authentication
app.UseCors("AllowFrontend");


app.UseAuthentication();

app.UseAuthorization();


app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Auto-create missing database tables/migrations
    context.Database.Migrate();

    // Check if admin user exists; if not, create it with a valid BCrypt hash
    if (!context.Users.Any(u => u.Email == "admin@churchpulse.com"))
    {
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Admin User",
            Surname = "System",
            Email = "admin@churchpulse.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@12345"),
            Role = "Admin",
            MobileNumber = "0000000000",
            DateOfBirth = DateTime.UtcNow.AddYears(-30),
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(adminUser);
        context.SaveChanges();
        Console.WriteLine("--> Success: Admin user seeded successfully! (admin@churchpulse.com / Admin@12345)");
    }
}


app.Run();