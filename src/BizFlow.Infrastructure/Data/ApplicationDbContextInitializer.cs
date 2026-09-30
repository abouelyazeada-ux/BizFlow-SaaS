using BizFlow.Domain.Entities;
using BizFlow.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BizFlow.Infrastructure.Data;

public class ApplicationDbContextInitializer
{
    private readonly ILogger<ApplicationDbContextInitializer> _logger;
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public ApplicationDbContextInitializer(ILogger<ApplicationDbContextInitializer> logger, ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _logger = logger;
        _context = context;
        _userManager = userManager;
    }

    public async Task SeedAsync()
    {
        try
        {
            if (_context.Database.IsSqlServer())
            {
                await _context.Database.MigrateAsync();
            }
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task TrySeedAsync()
    {
        if (!await _context.Companies.AnyAsync())
        {
            var company = new Company { Name = "Demo Company" };
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            var adminUser = new ApplicationUser { UserName = "admin@demo.com", Email = "admin@demo.com", CompanyId = company.Id };
            await _userManager.CreateAsync(adminUser, "Password123!");

            var customer = new Customer { CompanyId = company.Id, Name = "Acme Corp", Email = "contact@acme.com", Phone = "555-0100" };
            _context.Customers.Add(customer);

            var category = new Category { CompanyId = company.Id, Name = "Electronics" };
            _context.Categories.Add(category);

            var product = new Product { CompanyId = company.Id, Category = category, Name = "Laptop", Price = 1200, CostPrice = 800, Quantity = 50, MinimumStockLevel = 10, IsActive = true };
            _context.Products.Add(product);
            
            await _context.SaveChangesAsync();

            var invoice = new Invoice { CompanyId = company.Id, CustomerId = customer.Id, InvoiceNumber = "INV-001", InvoiceDate = DateTime.UtcNow };
            invoice.AddItem(product.Id, product.Name, 2, 1200);
            invoice.SetDiscountAndTax(0, 240);
            
            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
        }
    }
}
