﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class VW_tbProveedores
    {
        public int prov_Id { get; set; }
        public string prov_Nombre { get; set; }
        public int dire_Id { get; set; }
        public string dire_DireccionExacta { get; set; }
        public string muni_Id { get; set; }
        public string sucu_MunicipioNombre { get; set; }
        public string depa_Id { get; set; }
        public string prov_CorreoElectronico { get; set; }
        public string prov_Telefono { get; set; }
        public int prov_UsuCreacion { get; set; }
        public string prov_NombreUsuCreacion { get; set; }
        public DateTime prov_FechaCreacion { get; set; }
        public int? prov_UsuModificacion { get; set; }
        public string prov_NombreUsuModificacion { get; set; }
        public DateTime? prov_FechaModificacion { get; set; }
        public bool prov_Estado { get; set; }
    }
}