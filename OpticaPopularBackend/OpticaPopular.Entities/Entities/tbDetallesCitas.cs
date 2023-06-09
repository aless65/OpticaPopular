﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class tbDetallesCitas
    {
        public int deci_Id { get; set; }
        public int cita_Id { get; set; }
        public decimal deci_Costo { get; set; }
        public string deci_HoraInicio { get; set; }
        public string deci_HoraFin { get; set; }
        public bool? deci_Estado { get; set; }
        public int usua_IdCreacion { get; set; }
        public DateTime? deci_FechaCreacion { get; set; }
        public int? usua_IdModificacion { get; set; }
        public DateTime? deci_FechaModificacion { get; set; }

        [NotMapped]
        public string deci_NombreUsuarioCreacion { get; set; }

        [NotMapped]
        public string deci_NombreUsuarioModificacion { get; set; }

        [NotMapped]
        public DateTime? cita_Fecha { get; set; }

        [NotMapped]
        public string cons_Nombre { get; set; }

        [NotMapped]
        public string empe_Nombres { get; set; }

        [NotMapped]
        public string empe_Apellidos { get; set; }

        [NotMapped]
        public string sucu_Descripcion { get; set; }

        [NotMapped]
        public int sucu_Id { get; set; }

        [NotMapped]
        public int clie_Id { get; set; }

        [NotMapped]
        public string clie_Nombres { get; set; }

        [NotMapped]
        public string clie_Apellidos { get; set; }

        [NotMapped]
        public int? orde_Id { get; set; }

        public virtual tbCitas cita { get; set; }
        public virtual tbUsuarios usua_IdCreacionNavigation { get; set; }
        public virtual tbUsuarios usua_IdModificacionNavigation { get; set; }
    }
}