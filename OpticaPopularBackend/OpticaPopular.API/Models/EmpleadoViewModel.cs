using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class EmpleadoViewModel
    {
        public int empe_Id { get; set; }
        public string empe_Nombres { get; set; }
        public string empe_Apellidos { get; set; }
        public string empe_NombreCompleto { get; set; }
        public string empe_Identidad { get; set; }
        public DateTime empe_FechaNacimiento { get; set; }
        public string empe_Sexo { get; set; }
        public int estacivi_Id { get; set; }
        public string Empe_EstadoCivilNombre { get; set; }
        public string empe_Telefono { get; set; }
        public string empe_CorreoElectronico { get; set; }
        public int dire_Id { get; set; }
        public string dire_DireccionExacta { get; set; }
        public string muni_Id { get; set; }
        public string sucu_MunicipioNombre { get; set; }
        public string depa_Id { get; set; }
        public int carg_Id { get; set; }
        public int sucu_Id { get; set; }
        public string Empe_SucursalNombre { get; set; }
        public int empe_UsuCreacion { get; set; }
        public string Empe_NombreUsuarioCreacion { get; set; }
        public DateTime empe_FechaCreacion { get; set; }
        public int? empe_UsuModificacion { get; set; }
        public string Empe_NombreUsuarioModificacion { get; set; }
        public DateTime? empe_FechaModificacion { get; set; }
        public bool empe_Estado { get; set; }
    }
}
