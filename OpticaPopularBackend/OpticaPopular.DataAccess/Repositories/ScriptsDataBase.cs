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
        #endregion

        #region Citas
        public static string UDP_tbCitas_ListadoPorIdSucursal = "opti.UDP_tbCitas_ListadoPorIdSucursal";
        public static string UDP_tbCitas_InsertarNuevaCita = "opti.UDP_tbCitas_InsertarNuevaCita";
        public static string UDP_tbCitas_BuscarCitaPorId = "opti.UDP_tbCitas_BuscarCitaPorId";
        #endregion

        #region Consultorios
        public static string UDP_tbConsultorios_ListPorIdSucursal = "opti.UDP_tbConsultorios_ListPorIdSucursal";
        #endregion
    }
}
