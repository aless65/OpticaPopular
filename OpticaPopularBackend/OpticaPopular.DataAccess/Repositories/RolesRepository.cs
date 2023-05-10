using Dapper;
using Microsoft.Data.SqlClient;
using OpticaPopular.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpticaPopular.DataAccess.Repositories
{
    public class RolesRepository : IRepository<tbRoles, VW_tbRoles>
    {
        public RequestStatus Delete(tbRoles item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("role_Id", item.role_Id, DbType.Int32, ParameterDirection.Input);

            result.MessageStatus = db.QueryFirst<string>(ScriptsDataBase.UDP_Elimina_Roles, parametros, commandType: CommandType.StoredProcedure);

            if (result.MessageStatus == "El rol ha sido eliminado")
            {
                var parametrosDelete = new DynamicParameters();
                parametrosDelete.Add("@role_Id", item.role_Id, DbType.Int32, ParameterDirection.Input);

                db.Query(ScriptsDataBase.UDP_Elimina_RolesXPantalla, parametrosDelete, commandType: CommandType.StoredProcedure);
            }

            return result;
        }

        public VW_tbRoles Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbRoles item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@role_Nombre", item.role_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@role_UsuCreacion", item.role_UsuCreacion, DbType.Int32, ParameterDirection.Input);

            result = db.QueryFirst<RequestStatus>(ScriptsDataBase.UDP_Inserta_Roles, parametros, commandType: CommandType.StoredProcedure);

            if(result.MessageStatus == "El rol ha sido insertado con éxito")
            {
                foreach (var pantalla in item.role_Pantallas)
                {
                    var parametros2 = new DynamicParameters();
                    parametros2.Add("@role_Id", result.CodeStatus, DbType.Int32, ParameterDirection.Input);
                    parametros2.Add("@pant_Id", pantalla, DbType.Int32, ParameterDirection.Input);
                    parametros2.Add("@pantrole_UsuCreacion", item.role_UsuCreacion, DbType.Int32, ParameterDirection.Input);

                    var respuesta = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_RolesXPantalla, parametros2, commandType: CommandType.StoredProcedure);

                    if(respuesta != "Operación realizada con éxito")
                    {
                        result.MessageStatus = "Ha ocurrido un error en la asignación de pantallas";
                        break;
                    }
                }
            }

            return result;
        }

        public IEnumerable<VW_tbRoles> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbRoles>(ScriptsDataBase.UDP_Lista_Roles, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbRoles item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@role_Id", item.role_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@role_Nombre", item.role_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@role_UsuModificacion", item.role_UsuModificacion, DbType.Int32, ParameterDirection.Input);

            result.MessageStatus = db.QueryFirst<string>(ScriptsDataBase.UDP_Edita_Roles, parametros, commandType: CommandType.StoredProcedure);

            if(result.MessageStatus == "El rol ha sido editado con éxito")
            {
                var parametrosDelete = new DynamicParameters();
                parametrosDelete.Add("@role_Id", item.role_Id, DbType.Int32, ParameterDirection.Input);

                db.Query(ScriptsDataBase.UDP_Elimina_RolesXPantalla, parametrosDelete, commandType: CommandType.StoredProcedure);

                foreach (var pantalla in item.role_Pantallas)
                {
                    var parametros2 = new DynamicParameters();
                    parametros2.Add("@role_Id", item.role_Id, DbType.Int32, ParameterDirection.Input);
                    parametros2.Add("@pant_Id", pantalla, DbType.Int32, ParameterDirection.Input);
                    parametros2.Add("@pantrole_UsuCreacion", item.role_UsuModificacion, DbType.Int32, ParameterDirection.Input);

                    var respuesta = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_RolesXPantalla, parametros2, commandType: CommandType.StoredProcedure);

                    if (respuesta != "Operación realizada con éxito")
                    {
                        result.MessageStatus = "Ha ocurrido un error en la asignación de pantallas";
                        break;
                    }
                }
            }

            return result;
        }
    }
}
