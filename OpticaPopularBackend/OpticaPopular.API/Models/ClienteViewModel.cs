using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class ClienteViewModel
    {
        public int clie_Id { get; set; }
        public string clie_Nombres { get; set; }
        public string clie_Apellidos { get; set; }
        public string clie_Identidad { get; set; }
        public string clie_Sexo { get; set; }
        public DateTime clie_FechaNacimiento { get; set; }
        public int estacivi_Id { get; set; }
        public string clie_Telefono { get; set; }
        public string clie_CorreoElectronico { get; set; }
        public int clie_UsuCreacion { get; set; }
        public int? clie_UsuModificacion { get; set; }
        public bool? clie_Estado { get; set; }

        public string dire_DireccionExacta { get; set; }
        public string muni_Id { get; set; }

    }
}
