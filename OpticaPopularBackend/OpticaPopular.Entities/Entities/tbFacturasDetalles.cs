﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class tbFacturasDetalles
    {
        public int factdeta_Id { get; set; }
        public int fact_Id { get; set; }
        public int deci_Id { get; set; }
        public int aros_Id { get; set; }
        public int orde_Id { get; set; }
        public int envi_Id { get; set; }
        public decimal factdeta_Precio { get; set; }
        public int factdeta_UsuCreacion { get; set; }
        public DateTime factdeta_FechaCreacion { get; set; }
        public DateTime? factdeta_FechaModificacion { get; set; }
        public int? factdeta_UsuModificacion { get; set; }
        public bool? factdeta_Estado { get; set; }

        public virtual tbAros aros { get; set; }
        public virtual tbDetallesCitas deci { get; set; }
        public virtual tbEnvios envi { get; set; }
        public virtual tbFacturas fact { get; set; }
        public virtual tbUsuarios factdeta_UsuCreacionNavigation { get; set; }
        public virtual tbUsuarios factdeta_UsuModificacionNavigation { get; set; }
        public virtual tbOrdenes orde { get; set; }
    }
}