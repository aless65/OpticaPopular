﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class tbDirecciones
    {
        public tbDirecciones()
        {
            tbDireccionesPorCliente = new HashSet<tbDireccionesPorCliente>();
            tbEnvios = new HashSet<tbEnvios>();
        }

        public int dire_Id { get; set; }
        public string muni_Id { get; set; }
        public string dire_DireccionExacta { get; set; }
        public bool? clie_Estado { get; set; }
        public int usua_IdCreacion { get; set; }
        public DateTime? clie_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public DateTime? clie_FechaModificacion { get; set; }

        public virtual tbMunicipios muni { get; set; }
        public virtual tbUsuarios usua_IdCreacionNavigation { get; set; }
        public virtual tbUsuarios usua_IdModificacionNavigation { get; set; }
        public virtual ICollection<tbDireccionesPorCliente> tbDireccionesPorCliente { get; set; }
        public virtual ICollection<tbEnvios> tbEnvios { get; set; }
    }
}