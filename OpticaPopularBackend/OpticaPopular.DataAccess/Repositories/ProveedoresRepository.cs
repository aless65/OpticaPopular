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
    public class ProveedoresRepository : IRepository<VW_tbProveedores, VW_tbProveedores>
    {
        public RequestStatus Delete(VW_tbProveedores item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@prov_Id", item.prov_Id, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Elimina_Proveedores, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public VW_tbProveedores Find(int? id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@prov_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.QueryFirst<VW_tbProveedores>(ScriptsDataBase.UDP_Find_Proveedores, parameters, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Insert(VW_tbProveedores item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@prov_Nombre", item.prov_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@prov_CorreoElectronico", item.prov_CorreoElectronico, DbType.String, ParameterDirection.Input);
            parametros.Add("@prov_Telefono", item.prov_Telefono, DbType.String, ParameterDirection.Input);
            parametros.Add("@prov_UsuCreacion", item.prov_UsuCreacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@muni_Id", item.muni_Id, DbType.String, ParameterDirection.Input);
            parametros.Add("@dire_DireccionExacta", item.dire_DireccionExacta, DbType.String, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_Proveedores, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public IEnumerable<VW_tbProveedores> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbProveedores>(ScriptsDataBase.UDP_Lista_Proveedores, null, commandType: CommandType.StoredProcedure);
        }


        public RequestStatus Update(VW_tbProveedores item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@prov_Id", item.prov_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@prov_Nombre", item.prov_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@prov_CorreoElectronico", item.prov_CorreoElectronico, DbType.String, ParameterDirection.Input);
            parametros.Add("@prov_Telefono", item.prov_Telefono, DbType.String, ParameterDirection.Input);
            parametros.Add("@prov_UsuModificacion", item.prov_UsuModificacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@muni_Id", item.muni_Id, DbType.String, ParameterDirection.Input);
            parametros.Add("@dire_DireccionExacta", item.dire_DireccionExacta, DbType.String, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Edita_Proveedores, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }
    }
}
