using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class UsuarioViewModel
    {
        [Display(Name = "ID")]
        public int usua_Id { get; set; } 

        [Display(Name = "Nombre de usuario")]
        public string usua_NombreUsuario { get; set; }

        [Display(Name = "Contraseña")]
        public string usua_Contrasena { get; set; }

        [Display(Name = "Admin")]
        public bool? usua_EsAdmin { get; set; }

        [Display(Name = "Rol")]
        public int? role_Id { get; set; }

        [Display(Name = "Empleado")]
        public int? empe_Id { get; set; }

        public int? usua_UsuCreacion { get; set; }
        public int? usua_UsuModificacion { get; set; }
    }
}
