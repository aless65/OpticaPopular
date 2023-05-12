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
    public class ArosRepository : IRepository<tbAros, VW_tbAros>
    {
        public RequestStatus Delete(tbAros item)
        {
            throw new NotImplementedException();
        }

        public VW_tbAros Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbAros item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<VW_tbAros> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbAros>(ScriptsDataBase.UDP_Lista_Aros, null, commandType: CommandType.StoredProcedure);
        }

        public IEnumerable<VW_tbAros> ListXSucursal(int id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();

            parameters.Add("@sucu_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.Query<VW_tbAros>(ScriptsDataBase.UDP_Lista_ArosXSucursal, parameters, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus PrecioAros(int id)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();

            parameters.Add("@aros_Id", id, DbType.Int32, ParameterDirection.Input);

            result.MessageStatus = db.QueryFirst<string>(ScriptsDataBase.UDP_Precio_Aros, parameters, commandType: CommandType.StoredProcedure);

            return result;
        }

        public RequestStatus StockAros(int aros_Id, int sucu_Id)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();

            parameters.Add("@aros_Id", aros_Id, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@sucu_Id", sucu_Id, DbType.Int32, ParameterDirection.Input);

            result.MessageStatus = db.QueryFirst<string>(ScriptsDataBase.UDP_Stock_ArosXSucursal, parameters, commandType: CommandType.StoredProcedure);

            return result;
        }

        public RequestStatus Update(tbAros item)
        {
            throw new NotImplementedException();
        }
    }
}
