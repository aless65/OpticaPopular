﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using System;
using System.Collections.Generic;

#nullable disable

namespace OpticaPopular.Entities.Entities
{
    public partial class tbAros
    {
        public tbAros()
        {
            tbDetallesOrdenes = new HashSet<tbDetallesOrdenes>();
            tbStockArosPorSucursal = new HashSet<tbStockArosPorSucursal>();
        }

        public int aros_Id { get; set; }
        public string aros_Descripcion { get; set; }
        public decimal aros_CostoUni { get; set; }
        public int cate_Id { get; set; }
        public int prov_Id { get; set; }
        public int marc_Id { get; set; }
        public int aros_UsuCreacion { get; set; }
        public DateTime aros_FechaCreacion { get; set; }
        public DateTime? aros_FechaModificacion { get; set; }
        public int? aros_UsuModificacion { get; set; }
        public bool? aros_Estado { get; set; }

        public virtual tbUsuarios aros_UsuCreacionNavigation { get; set; }
        public virtual tbUsuarios aros_UsuModificacionNavigation { get; set; }
        public virtual tbCategorias cate { get; set; }
        public virtual tbMarcas marc { get; set; }
        public virtual tbProveedores prov { get; set; }
        public virtual ICollection<tbDetallesOrdenes> tbDetallesOrdenes { get; set; }
        public virtual ICollection<tbStockArosPorSucursal> tbStockArosPorSucursal { get; set; }
    }
}