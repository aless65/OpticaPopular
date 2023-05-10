using OpticaPopular.DataAccess.Repositories;
using OpticaPopular.Entities.Entities;
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
        public ServiceResult ListadoCargos()
        {
            var result = new ServiceResult();
            try
            {
                var list = _cargosRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }
        #endregion

        #region Categorias



        #endregion

        #region Citas
        public ServiceResult ListadoCitasPorIdSucursal (int sucu_Id)
        {
            var resultado = new ServiceResult();

            try
            {
                var list = _citasRepository.ListPorIdSucursal(sucu_Id);
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }
        }

        #endregion

        #region Clientes
        public ServiceResult ListadoClientes()
        {
            var result = new ServiceResult();
            try
            {
                var list = _clientesRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult InsertClientes(tbClientes item)
        {
            var result = new ServiceResult();
            try
            {
                var insert = _clientesRepository.Insert(item);
                if (insert.MessageStatus == "El cliente ha sido ingresado con éxito")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Success);
                else if (insert.MessageStatus == "Ya existe un cliente con este número de identidad")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult UpdateClientes(tbClientes item)
        {
            var result = new ServiceResult();
            try
            {
                var update = _clientesRepository.Update(item);
                if (update.MessageStatus == "El cliente ha sido editado con éxito")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Success);
                else if (update.MessageStatus == "Ya existe un cliente con este número de identidad")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult DeleteClientes(tbClientes item)
        {
            var result = new ServiceResult();
            try
            {
                var update = _clientesRepository.Delete(item);
                if (update.MessageStatus == "El cliente ha sido eliminado")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Success);
                else if (update.MessageStatus == "El cliente no puede ser eliminado ya que está siendo utilizado en otro registro")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        #endregion

        #region Consultorios
        public ServiceResult ListadoConsultoriosPorIdSucursal(int sucu_Id)
        {
            var resultado = new ServiceResult();

            try
            {
                var list = _consultoriosRepository.ListPorIdSucursal(sucu_Id);
                return resultado.Ok(list);
            }
            catch (Exception ex)
            {
                return resultado.Error(ex.Message);
            }
        }

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

        public ServiceResult ListadoEmpleados()
        {
            var result = new ServiceResult();
            try
            {
                var list = _empleadosRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult FindEmpleadoos(int id)
        {
            var result = new ServiceResult();
            try
            {
                var empleado = _empleadosRepository.Find(id);
                return result.Ok(empleado);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult InsertEmpleados(VW_tbEmpleados item)
        {
            var result = new ServiceResult();
            try
            {
                var insert = _empleadosRepository.Insert(item);
                if (insert.MessageStatus == "El empleado ha sido ingresado con éxito")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Success);
                else if (insert.MessageStatus == "Ya existe un empleado con este número de identidad")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult UpdateEmpleados(VW_tbEmpleados item)
        {
            var result = new ServiceResult();
            try
            {
                var update = _empleadosRepository.Update(item);
                if (update.MessageStatus == "El empleado ha sido editado con éxito")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Success);
                else if (update.MessageStatus == "Ya existe un empleado con este número de identidad")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult DeleteEmpleados(VW_tbEmpleados item)
        {
            var result = new ServiceResult();
            try
            {
                var update = _empleadosRepository.Delete(item);
                if (update.MessageStatus == "El empleado ha sido eliminado")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Success);
                else
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }
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
        public ServiceResult ListadoOrdenes()
        {
            var result = new ServiceResult();
            try
            {
                var list = _ordenesRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult FindOrdenes(int id)
        {
            var result = new ServiceResult();
            try
            {
                var orden = _ordenesRepository.Find(id);
                return result.Ok(orden);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult ListadoDetallesOrdenes(int id)
        {
            var result = new ServiceResult();
            try
            {
                var list = _ordenesRepository.ListDetalles(id);
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }
        #endregion

        #region Proveedores
        public ServiceResult ListadoProveedores()
        {
            var result = new ServiceResult();
            try
            {
                var list = _proveedoresRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }


        public ServiceResult InsertProveedores(tbProveedores item)
        {
            var result = new ServiceResult();
            try
            {
                var insert = _proveedoresRepository.Insert(item);

                if (insert.MessageStatus == "El proveedor ha sido insertada con éxito")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Success);
                else if (insert.MessageStatus == "El proveedor ya existe")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult UpdateProveedores(tbProveedores item)
        {
            var result = new ServiceResult();
            try
            {
                var update = _proveedoresRepository.Update(item);

                if (update.MessageStatus == "El Proveedor ha sido editada con éxito")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Success);
                else if (update.MessageStatus == "EL Proveedor ya existe")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult DeleteProveedores(tbProveedores item)
        {
            var result = new ServiceResult();
            try
            {
                var update = _proveedoresRepository.Delete(item);

                if (update.MessageStatus == "El Proveedor ha sido eliminado")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Success);
                else if (update.MessageStatus == "El proveedor no puede ser eliminado ya que está siendo usado")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }


        #endregion

        #region Sucursales

        public ServiceResult ListadoSucursales()
        {
            var result = new ServiceResult();
            try
            {
                var list = _sucursalesRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }
        #endregion

    }
}
