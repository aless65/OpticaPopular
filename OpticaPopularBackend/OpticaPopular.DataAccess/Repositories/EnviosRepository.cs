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
    public class EnviosRepository : IRepository<tbEnvios, tbEnvios>
    {
        public RequestStatus Delete(tbEnvios item)
        {
            throw new NotImplementedException();
        }

        public tbEnvios Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbEnvios item)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@fact_Id", item.fact_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@dire_Id", item.dire_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@envi_FechaEntrega", item.envi_FechaEntrega, DbType.DateTime, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<int>(ScriptsDataBase.UDP_tbEnvios_Insert, parametros, commandType: CommandType.StoredProcedure);

            RequestStatus request = new()
            {
                CodeStatus = resultado,
                MessageStatus = "Id envio"
            };

            return request;
        }

        public IEnumerable<tbEnvios> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbEnvios item)
        {
            throw new NotImplementedException();
        }

    }
}
