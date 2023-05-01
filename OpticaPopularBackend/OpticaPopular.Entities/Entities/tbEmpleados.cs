﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class tbEmpleados
    {
        public tbEmpleados()
        {
            tbConsultorios = new HashSet<tbConsultorios>();
            tbFacturas = new HashSet<tbFacturas>();
            tbUsuarios = new HashSet<tbUsuarios>();
        }

        public int empe_Id { get; set; }
        public string empe_Nombres { get; set; }
        public string empe_Apellidos { get; set; }
        public string empe_Identidad { get; set; }
        public DateTime empe_FechaNacimiento { get; set; }
        public string empe_Sexo { get; set; }
        public int estacivi_Id { get; set; }
        public string empe_Telefono { get; set; }
        public string empe_CorreoElectronico { get; set; }
        public int carg_Id { get; set; }
        public int sucu_Id { get; set; }
        public int empe_UsuCreacion { get; set; }
        public DateTime empe_FechaCreacion { get; set; }
        public int? empe_UsuModificacion { get; set; }
        public DateTime? empe_FechaModificacion { get; set; }
        public bool? empe_Estado { get; set; }

        public virtual tbCargos carg { get; set; }
        public virtual tbUsuarios empe_UsuCreacionNavigation { get; set; }
        public virtual tbUsuarios empe_UsuModificacionNavigation { get; set; }
        public virtual tbEstadosCiviles estacivi { get; set; }
        public virtual tbSucursales sucu { get; set; }
        public virtual ICollection<tbConsultorios> tbConsultorios { get; set; }
        public virtual ICollection<tbFacturas> tbFacturas { get; set; }
        public virtual ICollection<tbUsuarios> tbUsuarios { get; set; }
    }
}