using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class MarcasViewModel
    {
        public int marc_Id { get; set; }
        public string marc_Nombre { get; set; }
        public bool? marc_Estado { get; set; }
        public int usua_IdCreacion { get; set; }
        public DateTime? marc_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public DateTime? marc_FechaModificacion { get; set; }
    }
}
