using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RouteManagement.Domain.Entities;

namespace RouteManagement.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<BookingClass> BookingClasses { get; set; }
        public DbSet<Route> Routes { get; set; }
        public DbSet<Season> Seasons { get; set; }
        public DbSet<TourOperator> TourOperators { get; set; }
        public DbSet<OperatorSeasonRoute> OperatorSeasonRoutes { get; set; }
        public DbSet<Pricing> Pricings { get; set; }
        public DbSet<RouteBookingClass> RouteBookingClasses { get; set; }
        public DbSet<TourOperatorBookingClass> TourOperatorBookingClasses { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<RouteBookingClass>()
                .HasKey(rbc => new { rbc.RouteId, rbc.BookingClassId });

            builder.Entity<TourOperatorBookingClass>()
                .HasKey(tobc => new { tobc.TourOperatorId, tobc.BookingClassId });

            builder.Entity<RouteBookingClass>()
                .HasOne(rbc => rbc.Route)
                .WithMany(r => r.RouteBookingClasses)
                .HasForeignKey(rbc => rbc.RouteId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<RouteBookingClass>()
                .HasOne(rbc => rbc.BookingClass)
                .WithMany(bc => bc.RouteBookingClasses)
                .HasForeignKey(rbc => rbc.BookingClassId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<TourOperatorBookingClass>()
                .HasOne(tobc => tobc.TourOperator)
                .WithMany(to => to.TourOperatorBookingClasses)
                .HasForeignKey(tobc => tobc.TourOperatorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<TourOperatorBookingClass>()
                .HasOne(tobc => tobc.BookingClass)
                .WithMany(bc => bc.TourOperatorBookingClasses)
                .HasForeignKey(tobc => tobc.BookingClassId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OperatorSeasonRoute>()
                .HasOne(osr => osr.TourOperator)
                .WithMany(to => to.OperatorSeasonRoutes)
                .HasForeignKey(osr => osr.TourOperatorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OperatorSeasonRoute>()
                .HasOne(osr => osr.Season)
                .WithMany(s => s.OperatorSeasonRoutes)
                .HasForeignKey(osr => osr.SeasonId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OperatorSeasonRoute>()
                .HasOne(osr => osr.Route)
                .WithMany(r => r.OperatorSeasonRoutes)
                .HasForeignKey(osr => osr.RouteId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Pricing>()
                .HasOne(p => p.OperatorSeasonRoute)
                .WithMany(osr => osr.Pricings)
                .HasForeignKey(p => p.OperatorSeasonRouteId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Pricing>()
                .HasOne(p => p.BookingClass)
                .WithMany(bc => bc.Pricings)
                .HasForeignKey(p => p.BookingClassId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<TourOperator>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(to => to.UserId)
                .HasPrincipalKey(u => u.Id)
                .IsRequired(false);

            builder.Entity<BookingClass>()
                .HasIndex(bc => bc.Name)
                .IsUnique();

            builder.Entity<OperatorSeasonRoute>()
                .HasIndex(osr => new { osr.TourOperatorId, osr.SeasonId, osr.RouteId })
                .IsUnique();

            builder.Entity<Season>()
                .HasIndex(s => new { s.Year, s.SeasonType })
                .HasFilter("[IsDeleted] = 0")
                .IsUnique();

            builder.Entity<Pricing>()
                .HasIndex(p => new { p.OperatorSeasonRouteId, p.Date, p.BookingClassId })
                .IsUnique();

            builder.Entity<Pricing>()
                .Property(p => p.Price)
                .HasPrecision(18, 2);

            builder.Entity<ApplicationUser>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<BookingClass>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Route>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Season>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<TourOperator>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<OperatorSeasonRoute>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<Pricing>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<RouteBookingClass>().HasQueryFilter(e => !e.IsDeleted);
            builder.Entity<TourOperatorBookingClass>().HasQueryFilter(e => !e.IsDeleted);
        }
    }
}
