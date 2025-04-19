using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using FluentValidation.AspNetCore;
using Server.Validators;
using Server.database;
using Server.Utilities;
using Server.Models;
using FluentValidation;
using System.Text;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers + FluentValidation
builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation()
                .AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<UserValidator>();

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Server API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "JWT Authorization header using the Bearer scheme."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// JWT Config
var jwtSection = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSection["SecretKey"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["JwtSettings:SecretKey"])),
            
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
            
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JwtSettings:Audience"],
            
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            
            // important configuration for .NET 8 
            RoleClaimType = ClaimTypes.Role,
            NameClaimType = ClaimTypes.NameIdentifier
        };
    });

// Authorization Policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("UserOnly", policy => policy.RequireRole("User"));
    options.AddPolicy("AdminOrOwner", policy =>
    {
        policy.RequireAssertion(context =>
        {   
            // Admin always has access
            if (context.User.IsInRole("Admin"))
            {
                Console.WriteLine("DEBUG: User is Admin - access granted");
                return true;
            }

            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var httpContext = context.Resource as HttpContext;
            var routeId = httpContext?.Request.RouteValues["id"]?.ToString();

            if (userIdClaim == null || routeId == null)
            {
                return false;
            }

            var result = userIdClaim == routeId;
            return result;
        });
    });
});

// DB Context (In-Memory)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("UserDB"));

var app = builder.Build();

// Middleware setup
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed default Admin user
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Users.Any())
    {
        var admin = new User
        {
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@example.com",
            Password = PasswordHasher.HashPassword("Admin123"),
            Role = "Admin"
        };

        db.Users.Add(admin);
        await db.SaveChangesAsync();

        Console.WriteLine("Seeded initial admin user.");
    }
}

app.Run();
