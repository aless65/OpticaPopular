using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class EnviosViewModel
    {
        public int fact_Id { get; set; }
        public int dire_Id { get; set; }
        public DateTime envi_FechaEntrega { get; set; }
        public int usua_IdCreacion { get; set; }
    }
}
