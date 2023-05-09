using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class CitasViewModel
    {
        public int cita_Id { get; set; }
        public int clie_Id { get; set; }
        public int cons_Id { get; set; }
        public DateTime cita_Fecha { get; set; }
        public int usua_IdCreacion { get; set; }
        public DateTime? cita_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public DateTime? cita_FechaModificacion { get; set; }

        public int sucu_Id { get; set; }

        public string clie_Nombres { get; set; }

        public string clie_Apellidos { get; set; }

        public string cons_Nombre { get; set; }

        public string empe_Nombres { get; set; }

        public string usua_NombreCreacion { get; set; }

        public string usua_NombreModificacion { get; set; }

        public int deci_Id { get; set; }

        public decimal deci_Costo { get; set; }

        public string deci_HoraInicio { get; set; }

        public string deci_HoraFin { get; set; }

    }
}
