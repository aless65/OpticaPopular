using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class DetallesOrdenesViewModel
    {
        public int deor_Id { get; set; }
        public int orde_Id { get; set; }
        public int? aros_Id { get; set; }
        public string deor_GraduacionLeft { get; set; }
        public string deor_GraduacionRight { get; set; }
        public bool? deor_Transition { get; set; }
        public bool? deor_FiltroLuzAzul { get; set; }
        public decimal deor_Precio { get; set; }
        public int deor_Cantidad { get; set; }
        public decimal deor_Total { get; set; }
        public bool? deor_Estado { get; set; }
        public int usua_IdCreacion { get; set; }
        public DateTime? orde_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public DateTime? orde_FechaModificacion { get; set; }
    }
}
