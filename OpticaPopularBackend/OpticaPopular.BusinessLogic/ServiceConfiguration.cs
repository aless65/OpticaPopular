using Microsoft.Extensions.DependencyInjection;
using OpticaPopular.BusinessLogic.Services;
using OpticaPopular.DataAccess;
using OpticaPopular.DataAccess.Repositories;

namespace OpticaPopular.BusinessLogic
{
    public static class ServiceConfiguration
    {
        public static void DataAcces(this IServiceCollection services, string conection)
        {
            #region Acceso
            services.AddScoped<UsuariosRepository>();
            services.AddScoped<PantallasRepository>();
            services.AddScoped<RolesRepository>();
            #endregion

            #region General
            services.AddScoped<DepartamentosRepository>();
            services.AddScoped<MunicipiosRepository>();
            services.AddScoped<EstadosCivilesRepository>();
            #endregion

            #region Optica Popular
            services.AddScoped<ArosRepository>();
            services.AddScoped<CargosRepository>();
            services.AddScoped<CategoriasRepository>();
            services.AddScoped<CitasRepository>();
            services.AddScoped<ClientesRepository>();
            services.AddScoped<ConsultoriosRepository>();
            services.AddScoped<DetallesCitasRepository>();
            services.AddScoped<DetallesEnviosRepository>();
            services.AddScoped<DetallesOrdenesRepository>();
            services.AddScoped<DireccionesRepository>();
            services.AddScoped<DireccionesPorClienteRepository>();
            services.AddScoped<EmpleadosRepository>();
            services.AddScoped<EnviosRepository>();
            services.AddScoped<FacturasRepository>();
            services.AddScoped<FacturasDetallesRepository>();
            services.AddScoped<MarcasRepository>();
            services.AddScoped<MetodosPagoRepository>();
            services.AddScoped<OrdenesRepository>();
            services.AddScoped<ProveedoresRepository>();
            services.AddScoped<SucursalesRepository>();
            #endregion

            OpticaPopularContext.BuildConnectionString(conection);
        }

        public static void BusinessLogic(this IServiceCollection services)
        {
            services.AddScoped<AccesoService>();
            services.AddScoped<GeneralService>();
            services.AddScoped<OpticaPopularService>();
        }
    }
}
