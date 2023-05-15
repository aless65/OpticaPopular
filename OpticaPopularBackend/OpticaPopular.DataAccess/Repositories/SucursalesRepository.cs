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
    public class SucursalesRepository : IRepository<VW_tbSucursales, VW_tbSucursales>
    {
        public RequestStatus Delete(VW_tbSucursales item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@sucu_Id", item.sucu_Id, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Elimina_Sucursales, parameters, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public VW_tbSucursales Find(int? id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@sucu_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.QueryFirst<VW_tbSucursales>(ScriptsDataBase.UDP_Find_Sucursales, parameters, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Insert(VW_tbSucursales item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@sucu_Descripcion", item.sucu_Descripcion, DbType.String, ParameterDirection.Input);
            parameters.Add("@sucu_UsuCreacion", item.sucu_UsuCreacion, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@muni_Id", item.muni_Id, DbType.String, ParameterDirection.Input);
            parameters.Add("@dire_DireccionExacta", item.dire_DireccionExacta, DbType.String, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_Sucursales, parameters, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public IEnumerable<VW_tbSucursales> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbSucursales>(ScriptsDataBase.UDP_Lista_Sucursales, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(VW_tbSucursales item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@sucu_Id", item.sucu_Id, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@sucu_Descripcion", item.sucu_Descripcion, DbType.String, ParameterDirection.Input);
            parameters.Add("@muni_Id", item.muni_Id, DbType.String, ParameterDirection.Input);
            parameters.Add("@dire_DireccionExacta", item.dire_DireccionExacta, DbType.String, ParameterDirection.Input);
            parameters.Add("@sucu_UsuModificacion", item.sucu_UsuModificacion, DbType.Int32, ParameterDirection.Input);


            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Edita_Sucursales, parameters, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }
    }
}