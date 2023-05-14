using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class OrdenesViewModel
    {
        public int orde_Id { get; set; }
        public int clie_Id { get; set; }
        public int cita_Id { get; set; }
        public DateTime? orde_Fecha { get; set; }
        public DateTime orde_FechaEntrega { get; set; }
        public DateTime? orde_FechaEntregaReal { get; set; }
        public int sucu_Id { get; set; }
        public bool? orde_Estado { get; set; }
        public int usua_IdCreacion { get; set; }
        public DateTime? orde_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public DateTime? orde_FechaModificacion { get; set; }

    }
}
