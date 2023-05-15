using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class DireccionesPorClienteViewModel
    {
        public int dicl_Id { get; set; }
        public int clie_Id { get; set; }
        public int dire_Id { get; set; }
        public int usua_IdCreacion { get; set; }
        public int usua_IdModificacion { get; set; }
        public string muni_Id { get; set; }
        public string dire_DireccionExacta { get; set; }
    }
}
