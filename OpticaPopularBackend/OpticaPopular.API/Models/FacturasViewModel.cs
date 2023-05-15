using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class FacturasViewModel
    {
        public int fact_Id { get; set; }
        public int? cita_Id { get; set; }
        public int meto_Id { get; set; }
        public int empe_Id { get; set; }
        public decimal fact_Total { get; set; }
        public int usua_IdCreacion { get; set; }
    }
}
