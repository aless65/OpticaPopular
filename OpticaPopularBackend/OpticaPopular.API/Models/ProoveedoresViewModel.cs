using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class ProveedoresViewModel
    {
        public int prov_Id { get; set; }
        public string prov_Nombre { get; set; }
        public int dire_Id { get; set; }
        public string dire_DireccionExacta { get; set; }
        public string muni_Id { get; set; }
        public string sucu_MunicipioNombre { get; set; }
        public string depa_Id { get; set; }
        public string prov_CorreoElectronico { get; set; }
        public string prov_Telefono { get; set; }
        public int prov_UsuCreacion { get; set; }
        public string prov_NombreUsuCreacion { get; set; }
        
        public int? prov_UsuModificacion { get; set; }
        public string prov_NombreUsuModificacion { get; set; }
        
        public bool prov_Estado { get; set; }
    }
}
