﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class VW_tbUsuarios
    {
        public int user_Id { get; set; }
        public string user_NombreUsuario { get; set; }
        public string user_Contrasena { get; set; }
        public bool? user_EsAdmin { get; set; }
        public int? role_Id { get; set; }
        public string role_Nombre { get; set; }
        public int? empe_Id { get; set; }
        public string empe_NombreCompleto { get; set; }
        public int? user_UsuCreacion { get; set; }
        public string user_UsuCreacion_Nombre { get; set; }
        public DateTime user_FechaCreacion { get; set; }
        public int? user_UsuModificacion { get; set; }
        public string user_UsuModificacion_Nombre { get; set; }
        public DateTime? user_FechaModificacion { get; set; }
        public bool user_Estado { get; set; }
        public int sucu_Id { get; set; }
    }
}