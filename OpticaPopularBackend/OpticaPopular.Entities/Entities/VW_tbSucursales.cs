﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class VW_tbSucursales
    {
        public int sucu_Id { get; set; }
        public string sucu_Descripcion { get; set; }
        public int dire_Id { get; set; }
        public string muni_Id { get; set; }
        public string sucu_MunicipioNombre { get; set; }
        public string dire_DireccionExacta { get; set; }
        public DateTime sucu_FechaCreacion { get; set; }
        public int sucu_UsuCreacion { get; set; }
        public string sucu_NombreUsuarioCreacion { get; set; }
        public DateTime? sucu_FechaModificacion { get; set; }
        public int? sucu_NombreUsuarioModifica { get; set; }
        public int? sucu_UsuModificacion { get; set; }
        public bool sucu_Estado { get; set; }
    }
}