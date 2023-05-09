using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class RolViewModel
    {
        public int role_Id { get; set; }
        public string role_Nombre { get; set; }
        public int role_UsuCreacion { get; set; }
        public int? role_UsuModificacion { get; set; }
        public bool? role_Estado { get; set; }
        public int[] role_Pantallas { get; set; }
    }
}
