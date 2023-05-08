using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class ConsultoriosViewModel
    {
        public int cons_Id { get; set; }
        public string cons_Nombre { get; set; }
        public int empe_Id { get; set; }
        public bool? cons_Estado { get; set; }
        public int usua_IdCreacion { get; set; }
        public DateTime? cons_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public DateTime? cons_FechaModificacion { get; set; }
    }
}
