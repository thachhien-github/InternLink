using Microsoft.EntityFrameworkCore;
using InternLink.Domain.Entities;

namespace InternLink.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(b =>
        {
            b.ToTable("Users");
            b.HasKey(x => x.Id);
            b.Property(x => x.Username).IsRequired().HasMaxLength(100);
            b.Property(x => x.PasswordHash).IsRequired();
            b.Property(x => x.Email).HasMaxLength(200);
            b.Property(x => x.FullName).HasMaxLength(200);
            b.Property(x => x.IsActive).HasDefaultValue(true);
            b.Property(x => x.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });
    }
}
