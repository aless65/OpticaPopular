using AutoMapper;
using OpticaPopular.API.Models;
using OpticaPopular.Entities.Entities;

namespace OpticaPopular.API.Extensions
{
    public class MappingProfileExtensions : Profile
    {
        public MappingProfileExtensions()
        {
            CreateMap<UsuarioViewModel, tbUsuarios>().ReverseMap();
            CreateMap<RolViewModel, tbRoles>().ReverseMap();
            CreateMap<ClienteViewModel, tbClientes>().ReverseMap();
            CreateMap<EmpleadoViewModel, VW_tbEmpleados>().ReverseMap();
            CreateMap<CitasViewModel, tbCitas>().ReverseMap();
            CreateMap<ConsultoriosViewModel, tbConsultorios>().ReverseMap();
            CreateMap<ProveedoresViewModel, tbProveedores>().ReverseMap();
            CreateMap<MarcasViewModel, tbMarcas>().ReverseMap();
            CreateMap<CategoriaViewModel, tbCategorias>().ReverseMap();

        }
    }
}
