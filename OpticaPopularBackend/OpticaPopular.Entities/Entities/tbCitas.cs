﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class tbCitas
    {
        public tbCitas()
        {
            tbDetallesCitas = new HashSet<tbDetallesCitas>();
            tbFacturasDetalles = new HashSet<tbFacturasDetalles>();
        }

        public int cita_Id { get; set; }
        public int clie_Id { get; set; }
        public int cons_Id { get; set; }
        public DateTime cita_Fecha { get; set; }
        public bool? cita_Estado { get; set; }
        public int usua_IdCreacion { get; set; }
        public DateTime? cita_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public DateTime? cita_FechaModificacion { get; set; }

        [NotMapped]
        public string clie_Nombres { get; set; }

        [NotMapped]
        public string clie_Apellidos { get; set; }

        [NotMapped]
        public string cons_Nombre { get; set; }

        [NotMapped]
        public string empe_Nombres { get; set; }

        [NotMapped]
        public string usua_NombreCreacion { get; set; }

        [NotMapped]
        public string usua_NombreModificacion { get; set; }

        [NotMapped]
        public int sucu_Id { get; set; }

        [NotMapped]
        public int deci_Id { get; set; }

        [NotMapped]
        public decimal deci_Costo { get; set; }

        [NotMapped]
        public string deci_HoraInicio { get; set; }

        [NotMapped]
        public string deci_HoraFin { get; set; }

        public virtual tbClientes clie { get; set; }
        public virtual tbConsultorios cons { get; set; }
        public virtual tbUsuarios usua_IdCreacionNavigation { get; set; }
        public virtual tbUsuarios usua_IdModificacionNavigation { get; set; }
        public virtual ICollection<tbDetallesCitas> tbDetallesCitas { get; set; }
        public virtual ICollection<tbFacturasDetalles> tbFacturasDetalles { get; set; }
    }
}