﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class VW_tbEnvio
    {
        public int envi_Id { get; set; }
        public int clie_Id { get; set; }
        public string dire_Id { get; set; }
        public string dire_DireccionExacta { get; set; }
        public DateTime? envi_Fecha { get; set; }
        public DateTime envi_FechaEntrega { get; set; }
        public DateTime envi_FechaEntregaReal { get; set; }
        public bool? envi_Estado { get; set; }
        public int usua_IdCreacion { get; set; }
        public string envi_NombreUsuarioCreacion { get; set; }
        public DateTime? clie_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public string envi_NombreUsuarioModificacion { get; set; }
        public DateTime? clie_FechaModificacion { get; set; }
    }
}