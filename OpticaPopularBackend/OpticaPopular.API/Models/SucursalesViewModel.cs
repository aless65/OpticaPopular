using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class SucursalesViewModel
    {
        public int sucu_Id { get; set; }
        public string sucu_Descripcion { get; set; }
        public string muni_Id { get; set; }
        public string depa_Id { get; set; }
        public string dire_DireccionExacta { get; set; }
        public int sucu_UsuCreacion { get; set; }
        public int? sucu_UsuModificacion { get; set; }

    }
}