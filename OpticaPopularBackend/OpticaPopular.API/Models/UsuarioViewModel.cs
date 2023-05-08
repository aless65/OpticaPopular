using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class UsuarioViewModel
    {
        public int usua_Id { get; set; } 

        public string usua_NombreUsuario { get; set; }

        public string usua_Contrasena { get; set; }

        public bool? usua_EsAdmin { get; set; }

        public int? role_Id { get; set; }

        public int? empe_Id { get; set; }

        public int sucu_Id { get; set; }

        public int? usua_UsuCreacion { get; set; }
        public int? usua_UsuModificacion { get; set; }
    }
}
