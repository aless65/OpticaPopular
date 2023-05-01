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
        #endregion

        #region
        public static string UDP_Lista_Roles = "acce.UDP_acce_tbRoles_List";
        public static string UDP_Inserta_Roles = "acce.UDP_acce_tbRoles_Insert";
        public static string UDP_Edita_Roles = "acce.UDP_acce_tbRoles_Update";
        public static string UDP_Elimina_Roles = "acce.UDP_acce_tbRoles_Delete";
        #endregion
    }
}
