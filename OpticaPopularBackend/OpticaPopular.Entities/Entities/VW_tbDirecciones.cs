﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class VW_tbDirecciones
    {
        public int dire_Id { get; set; }
        public string muni_Id { get; set; }
        public string muni_NombreMunicipio { get; set; }
        public string dire_DireccionExacta { get; set; }
        public bool? dire_Estado { get; set; }
        public int usua_IdCreacion { get; set; }
        public string dire_UsuarioCreacion { get; set; }
        public DateTime? dire_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public string dire_UsuarioModificacion { get; set; }
        public DateTime? dire_FechaModificacion { get; set; }
    }
}