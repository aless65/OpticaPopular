using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Models
{
    public class CategoriaViewModel
    {
        public int cate_Id { get; set; }
        public string cate_Nombre { get; set; }
        public int cate_UsuCreacion { get; set; }
        public DateTime cate_FechaCreacion { get; set; }
        public int? cate_UsuModificacion { get; set; }
        public DateTime? cate_FechaModificacion { get; set; }
        public bool? cate_Estado { get; set; }
    }
}
