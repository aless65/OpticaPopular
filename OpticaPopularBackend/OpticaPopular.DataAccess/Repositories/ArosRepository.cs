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

        public RequestStatus Update(tbAros item)
        {
            throw new NotImplementedException();
        }
    }
}
