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
        #endregion

        #region Roles
        public static string UDP_Lista_Roles = "acce.UDP_acce_tbRoles_List";
        public static string UDP_Inserta_Roles = "acce.UDP_acce_tbRoles_Insert";
        public static string UDP_Edita_Roles = "acce.UDP_acce_tbRoles_Update";
        public static string UDP_Elimina_Roles = "acce.UDP_acce_tbRoles_Delete";
        #endregion

        #region Clientes
        public static string UDP_Lista_Clientes = "opti.UDP_opti_tbClientes_List";
        public static string UDP_Inserta_Clientes = "opti.UDP_opti_tbClientes_Insert";
        public static string UDP_Edita_Clientes = "opti.UDP_opti_tbClientes_Update";
        public static string UDP_Elimina_Clientes = "opti.UDP_opti_tbClientes_Delete";
        #endregion

        #region Empleados
        public static string UDP_Lista_Empleados = "opti.UDP_opti_tbEmpleados_List";
        public static string UDP_Inserta_Empleados = "opti.UDP_opti_tbEmpleados_Insert";
        public static string UDP_Edita_Empleados = "opti.UDP_opti_tbEmpleados_Update";
        public static string UDP_Elimina_Empleados = "opti.UDP_opti_tbEmpleados_Delete";
        public static string UDP_Find_Empleados = "opti.UDP_opti_tbEmpleados_Find";
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

        #region Citas
        public static string UDP_tbCitas_ListadoPorIdSucursal = "opti.UDP_tbCitas_ListadoPorIdSucursal";
        #endregion

        #region Consultorios
        public static string UDP_tbConsultorios_ListPorIdSucursal = "opti.UDP_tbConsultorios_ListPorIdSucursal";
        #endregion

        #region Proveedores
        public static string UDP_Lista_Proveedores = "opti.UDP_opti_tbProveedore_List";
        public static string UDP_Inserta_Proveedores = "opti.UDP_opti_tbProveedor_Insert";
        public static string UDP_Edita_Proveedores = "opti.UDP_opti_tbProveedor_Update";
        public static string UDP_Elimina_Proveedores = "opti.UDP_opti_tbProveedor_Delete";
        #endregion

        #region Consultorios
        public static string UDP_Lista_Consultorios = "opti.UDP_opti_tbConsultorios_List";
        public static string UDP_Inserta_Consultorios = "opti.UDP_opti_tbConsultorios_Insert";
        public static string UDP_Edita_Consultorios = "opti.UDP_opti_tbConsultorios_Update";
        public static string UDP_Elimina_Consultorios = "opti.UDP_opti_tbConsultorio_Delete";
        #endregion

        #region Marcas
        public static string UDP_Lista_Marcas = "opti.UDP_opti_tbMarca_List";
        public static string UDP_Inserta_Marcas = "opti.UDP_opti_tbMarcas_Insert";
        public static string UDP_Edita_Marcas = "opti.UDP_opti_tbMarcas_Update";
        public static string UDP_Elimina_Marcas = "opti.UDP_opti_tbMarcas_Delete";
        #endregion
    }
}
