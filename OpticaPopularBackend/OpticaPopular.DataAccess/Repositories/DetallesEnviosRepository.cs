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
    public class DetallesEnviosRepository : IRepository<tbDetallesEnvios, tbDetallesEnvios>
    {
        public RequestStatus Delete(tbDetallesEnvios item)
        {
            throw new NotImplementedException();
        }

        public tbDetallesEnvios Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbDetallesEnvios item)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@envi_Id", item.envi_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@orde_Id", item.orde_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<int>(ScriptsDataBase.UDP_tbDetallesEnvios_Insert, parametros, commandType: CommandType.StoredProcedure);

            RequestStatus request = new()
            {
                CodeStatus = resultado,
                MessageStatus = "Estado insert"
            };

            return request;
        }

        public IEnumerable<tbDetallesEnvios> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbDetallesEnvios item)
        {
            throw new NotImplementedException();
        }


        public IEnumerable<tbDetallesEnvios> ListByIdOrden(int orde_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@orde_Id", orde_Id, DbType.Int32, ParameterDirection.Input);

            return db.Query<tbDetallesEnvios>(ScriptsDataBase.UDP_tbEnvios_ByIdOrden, parametros, commandType: CommandType.StoredProcedure);
        }
    }
}
