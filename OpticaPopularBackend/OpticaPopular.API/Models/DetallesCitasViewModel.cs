using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class DetallesCitasViewModel
    {
        public int deci_Id { get; set; }
        public int cita_Id { get; set; }
        public decimal deci_Costo { get; set; }
        public string deci_HoraInicio { get; set; }
        public string deci_HoraFin { get; set; }
        public int usua_IdCreacion { get; set; }
        public DateTime? deci_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public DateTime? deci_FechaModificacion { get; set; }

        public string deci_NombreUsuarioCreacion { get; set; }

        public string deci_NombreUsuarioModificacion { get; set; }

        public DateTime? cita_Fecha { get; set; }

        public string cons_Nombre { get; set; }

        public string empe_Nombres { get; set; }

        public string empe_Apellidos { get; set; }

        public string sucu_Descripcion { get; set; }
    }
}
