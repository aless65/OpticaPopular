﻿using OpticaPopular.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpticaPopular.BusinessLogic.Services
{
    public class OpticaPopularService
    {
        private readonly ArosRepository _arosRepository;
        private readonly CargosRepository _cargosRepository;
        private readonly CategoriasRepository _categoriasRepository;
        private readonly CitasRepository _citasRepository;
        private readonly ClientesRepository _clientesRepository;
        private readonly ConsultoriosRepository _consultoriosRepository;
        private readonly DetallesCitasRepository _detallesCitasRepository;
        private readonly DetallesEnviosRepository _detallesEnviosRepository;
        private readonly DetallesOrdenesRepository _detallesOrdenesRepository;
        private readonly DireccionesRepository _direccionesRepository;
        private readonly DireccionesPorClienteRepository _direccionesPorClienteRepository;
        private readonly EmpleadosRepository _empleadosRepository;
        private readonly EnviosRepository _enviosRepository;
        private readonly FacturasRepository _facturasRepository;
        private readonly FacturasDetallesRepository _facturasDetallesRepository;
        private readonly MarcasRepository _marcasRepository;
        private readonly MetodosPagoRepository _metodosPagoRepository;
        private readonly OrdenesRepository _ordenesRepository;
        private readonly ProveedoresRepository _proveedoresRepository;
        private readonly SucursalesRepository _sucursalesRepository;

        public OpticaPopularService(ArosRepository arosRepository, CargosRepository cargosRepository, CategoriasRepository categoriasRepository, CitasRepository citasRepository, ClientesRepository clientesRepository, ConsultoriosRepository consultoriosRepository, DetallesCitasRepository detallesCitasRepository, DetallesEnviosRepository detallesEnviosRepository, DetallesOrdenesRepository detallesOrdenesRepository, DireccionesRepository direccionesRepository, DireccionesPorClienteRepository direccionesPorClienteRepository, EmpleadosRepository empleadosRepository, EnviosRepository enviosRepository, FacturasRepository facturasRepository, FacturasDetallesRepository facturasDetallesRepository, MarcasRepository marcasRepository, MetodosPagoRepository metodosPagoRepository, OrdenesRepository ordenesRepository, ProveedoresRepository proveedoresRepository, SucursalesRepository sucursalesRepository)
        {
            _arosRepository = arosRepository;
            _cargosRepository = cargosRepository;
            _categoriasRepository = categoriasRepository;
            _citasRepository = citasRepository;
            _clientesRepository = clientesRepository;
            _consultoriosRepository = consultoriosRepository;
            _detallesCitasRepository = detallesCitasRepository;
            _detallesEnviosRepository = detallesEnviosRepository;
            _detallesOrdenesRepository = detallesOrdenesRepository;
            _direccionesRepository = direccionesRepository;
            _direccionesPorClienteRepository = direccionesPorClienteRepository;
            _empleadosRepository = empleadosRepository;
            _enviosRepository = enviosRepository;
            _facturasRepository = facturasRepository;
            _facturasDetallesRepository = facturasDetallesRepository;
            _marcasRepository = marcasRepository;
            _metodosPagoRepository = metodosPagoRepository;
            _ordenesRepository = ordenesRepository;
            _proveedoresRepository = proveedoresRepository;
            _sucursalesRepository = sucursalesRepository;
        }

        #region Aros



        #endregion

        #region Cargos



        #endregion

        #region Categorias



        #endregion

        #region Citas



        #endregion

        #region Clientes



        #endregion

        #region Consultorios



        #endregion

        #region DetallesCitas



        #endregion

        #region DetallesEnvios



        #endregion

        #region DetallesOrdenes



        #endregion

        #region Direcciones



        #endregion

        #region Direcciones Por Cliente



        #endregion

        #region Empleados



        #endregion

        #region Envios



        #endregion

        #region Facturas



        #endregion

        #region Facturas Detalles



        #endregion

        #region Marcas



        #endregion

        #region Metodos de pago



        #endregion

        #region Ordenes



        #endregion

        #region Proveedores



        #endregion

        #region Sucursales



        #endregion

    }
}
