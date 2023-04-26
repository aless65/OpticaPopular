using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using OpticaPopular.DataAccess.Context;

namespace OpticaPopular.DataAccess
{
    public class OpticaPopularContext : OpticapopularContext
    {
        public static string ConnectionString { get; set; }

        public OpticaPopularContext()
        {
            ChangeTracker.LazyLoadingEnabled = false;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(ConnectionString);
            }

            base.OnConfiguring(optionsBuilder);
        }

        public static void BuildConnectionString(string connection)
        {
            var connectionStringBuilder = new SqlConnectionStringBuilder { ConnectionString = connection };
            ConnectionString = connectionStringBuilder.ConnectionString;
        }
    }
}
