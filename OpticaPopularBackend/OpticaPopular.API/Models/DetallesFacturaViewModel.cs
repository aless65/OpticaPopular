using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class DetallesFacturaViewModel
    {
        public int fact_Id { get; set; }
        public int? orde_Id { get; set; }
        public int? envi_Id { get; set; }
        public int usua_IdCreacion { get; set; }
    }
}
