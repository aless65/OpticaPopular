using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpticaPopular.DataAccess.Repositories
{
    public class ScriptsDataBase
    {
        #region Usuarios
        public static string UDP_Lista_Usuarios = "acce.UDP_acce_tbUsuarios_List";
        public static string UDP_Find_Usuarios = "acce.UDP_acce_VW_tbUsuarios_Find";
        public static string UDP_Inserta_Usuarios = "acce.UDP_acce_tbUsuarios_Insert";
        public static string UDP_Edita_Usuarios = "acce.UDP_acce_tbUsuarios_Update";
        public static string UDP_Elimina_Usuarios = "acce.UDP_acce_tbUsuarios_DELETE";
        public static string UDP_Login_Usuarios = "acce.UDP_Login";

        public static string UDP_RecuperarContra_Usuarios = "acce.UDP_RecuperarContrasena";
        #endregion

        #region Roles
        public static string UDP_Lista_Roles = "acce.UDP_acce_tbRoles_List";
        public static string UDP_Find_Roles = "acce.UDP_acce_tbRoles_Find";
        public static string UDP_Inserta_Roles = "acce.UDP_acce_tbRoles_Insert";
        public static string UDP_Edita_Roles = "acce.UDP_acce_tbRoles_Update";
        public static string UDP_Elimina_Roles = "acce.UDP_acce_tbRoles_Delete";

        public static string UDP_Lista_RolesXPantalla = "acce.UDP_acce_tbPantallasPorRoles_List";
        public static string UDP_Inserta_RolesXPantalla = "acce.UDP_acce_tbPantallasPorRoles_Insert";
        public static string UDP_Elimina_RolesXPantalla = "acce.UDP_acce_tbPantallaPorRoles_Delete";
        #endregion

        #region Pantallas
        public static string UDP_Lista_Pantallas = "acce.UDP_acce_tbPantallas_List";
        public static string UDP_Lista_PantallasMenu = "acce.UDP_opti_tbPantallas_ListMenu";

        public static string UDP_Accesos_Pantallas = "acce.UDP_tbRolesPorPantalla_Accesos";
        #endregion

        #region Clientes
        public static string UDP_Lista_Clientes = "opti.UDP_opti_tbClientes_List";
        public static string UDP_Inserta_Clientes = "opti.UDP_opti_tbClientes_Insert";
        public static string UDP_Edita_Clientes = "opti.UDP_opti_tbClientes_Update";
        public static string UDP_Elimina_Clientes = "opti.UDP_opti_tbClientes_Delete";
        public static string UDP_Find_Clientes = "opti.UDP_opti_tbClientes_Find";
        #endregion

        #region Empleados
        public static string UDP_Lista_Empleados = "opti.UDP_opti_tbEmpleados_List";
        public static string UDP_Inserta_Empleados = "opti.UDP_opti_tbEmpleados_Insert";
        public static string UDP_Edita_Empleados = "opti.UDP_opti_tbEmpleados_Update";
        public static string UDP_Elimina_Empleados = "opti.UDP_opti_tbEmpleados_Delete";
        public static string UDP_Find_Empleados = "opti.UDP_opti_tbEmpleados_Find";
        public static string UDP_Grafica_EmpleadosSexo = "opti.Grafica_Sexo";
        #endregion

        #region Sucursales
        public static string UDP_Lista_Sucursales = "opti.UDP_opti_tbSucursales_List";



        #endregion

        #region Cargos
        public static string UDP_Lista_Cargos = "opti.UDP_opti_tbCargos_List";
        #endregion

        #region Estados Civiles
        public static string UDP_Lista_EstadosCiviles = "gral.UDP_tbEstadosCiviles_List";
        #endregion

        #region Municipios
        public static string UDP_Lista_Municipios = "gral.UDP_gral_tbMunicipios_List";
        #endregion

        #region Departamentos
        public static string UDP_Lista_Departamentos = "gral.UDP_gral_tbDepartamentos_List";
        #endregion

        #region Aros
        public static string UDP_Lista_Aros = "opti.UDP_opti_tbAros_List";
        public static string UDP_Lista_ArosXSucursal = "opti.UDP_opti_tbAros_ListXSucursal";
        public static string UDP_Precio_Aros = "opti.UDP_opti_PrecioAros";
        public static string UDP_Stock_ArosXSucursal = "opti.UDP_opti_StockArosXSucursal";
        #endregion

        #region Citas
        public static string UDP_tbCitas_ListadoPorIdSucursal = "opti.UDP_tbCitas_ListadoPorIdSucursal";
        public static string UDP_tbCitas_InsertarNuevaCita = "opti.UDP_tbCitas_InsertarNuevaCita";
        public static string UDP_tbCitas_BuscarCitaPorId = "opti.UDP_tbCitas_BuscarCitaPorId";
        public static string UDP_tbCitas_EditarCita = "opti.UDP_tbCitas_EditarCita";
        public static string UDP_tbCitas_EliminarCita = "opti.UDP_tbCitas_EliminarCita";
        #endregion

        #region Detalles Cita
        public static string UDP_tbDetallesCitaPorIdCita = "opti.UDP_tbDetallesCitaPorIdCita";
        public static string UDP_tbDetallesCitas_Insert = "opti.UDP_opti_tbDetallesCitas_Insert";
        public static string UDP_tbDetallesCitas_Update = "opti.UDP_opti_tbDetallesCitas_Update";
        #endregion

        #region Consultorios
        public static string UDP_tbConsultorios_ListPorIdSucursal = "opti.UDP_tbConsultorios_ListPorIdSucursal";
        #endregion

        #region Órdenes
        public static string UDP_Grafica_Ordenes = "opti.Grafica_Ordenes_Sucursales";
        public static string UDP_Lista_Ordenes = "opti.UDP_opti_tbOrdenes_List";
        public static string UDP_Find_Ordenes = "opti.UDP_opti_tbOrdenes_Find";
        public static string UDP_Inserta_Ordenes = "opti.UDP_opti_tbOrdenes_Insert";
        public static string UDP_Edita_Ordenes = "opti.UDP_opti_tbOrdenes_Update";
        public static string UDP_Elimina_Ordenes = "opti.UDP_opti_tbOrdenes_Delete";
        public static string UDP_Lista_OrdenesPorSucursal = "opti.UDP_opti_tbOrdenes_ListXSucu";

        public static string UDP_Lista_DetallesOrdenes = "opti.UDP_opti_tbDetallesOrdenes_List";
        public static string UDP_Inserta_DetallesOrdenes = "opti.UDP_opti_tbDetallesOrdenes_Insert";
        public static string UDP_Elimina_DetallesOrdenes = "opti.UDP_opti_tbDetallesOrdenes_Delete";
        public static string UDP_Edita_DetallesOrdenes = "opti.UDP_opti_tbDetallesOrdenes_Update";
        #endregion

        #region Proveedores
        public static string UDP_Lista_Proveedores = "opti.UDP_opti_tbProveedore_List";
        public static string UDP_Inserta_Proveedores = "opti.UDP_opti_tbProveedores_Insert";
        public static string UDP_Edita_Proveedores = "opti.UDP_opti_tbProveedores_Update";
        public static string UDP_Elimina_Proveedores = "opti.UDP_opti_tbProveedor_Delete";
        public static string UDP_Find_Proveedores = "opti.UDP_opti_tbProveedores_Find ";
        #endregion

        #region Consultorios
        public static string UDP_Lista_Consultorios = "opti.UDP_ConsultoriosListado";
        public static string UDP_Inserta_Consultorios = "opti.UDP_opti_tbConsultorios_Insert";
        public static string UDP_Edita_Consultorios = "opti.UDP_opti_tbConsultorios_Update";
        public static string UDP_Elimina_Consultorios = "opti.UDP_opti_tbConsultorio_Delete";
        public static string UDP_Lista2_Consultorios = "opti.UDP_ConsultoriosListado";

        #endregion

        #region Marcas
        public static string UDP_Lista_Marcas = "opti.UDP_opti_tbMarca_List";
        public static string UDP_Inserta_Marcas = "opti.UDP_opti_tbMarcas_Insert";
        public static string UDP_Edita_Marcas = "opti.UDP_opti_tbMarcas_Update";
        public static string UDP_Elimina_Marcas = "opti.UDP_opti_tbMarcas_Delete";
        #endregion

        #region Categorias
        public static string UDP_Lista_Categorias = "opti.UDP_opti_VW_tbCategorias";
        public static string UDP_Inserta_Categorias = "opti.UDP_opti_tbCategorias_Insert";
        public static string UDP_Edita_Categorias = "opti.UDP_opti_tbCategorias_Update";
        public static string UDP_Elimina_Categorias = "opti.UDP_opti_tbCategorias_Delete";
        #endregion
    }
}
