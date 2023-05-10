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
    public class OrdenesRepository : IRepository<tbOrdenes, VW_tbOrdenes>
    {
        public RequestStatus Delete(tbOrdenes item)
        {
            throw new NotImplementedException();
        }

        public VW_tbOrdenes Find(int? id)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@orde_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.QueryFirst<VW_tbOrdenes>(ScriptsDataBase.UDP_Find_Ordenes, parametros, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Insert(tbOrdenes item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<VW_tbOrdenes> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbOrdenes>(ScriptsDataBase.UDP_Lista_Ordenes, null, commandType: CommandType.StoredProcedure);
        }

        public IEnumerable<VW_tbDetallesOrdenes> ListDetalles(int id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();

            parameters.Add("@orde_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.Query<VW_tbDetallesOrdenes>(ScriptsDataBase.UDP_Lista_DetallesOrdenes, parameters, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbOrdenes item)
        {
            throw new NotImplementedException();
        }
    }
}
