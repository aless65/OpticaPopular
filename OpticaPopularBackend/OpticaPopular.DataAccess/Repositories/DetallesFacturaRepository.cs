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
    public class DetallesFacturaRepository : IRepository<tbDetallesFactura, tbDetallesFactura>
    {
        public RequestStatus Delete(tbDetallesFactura item)
        {
            throw new NotImplementedException();
        }

        public tbDetallesFactura Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbDetallesFactura item)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@fact_Id", item.fact_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@orde_Id", item.orde_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@envi_Id", item.envi_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<int>(ScriptsDataBase.UDP_tbDetallesFactura_Insert, parametros, commandType: CommandType.StoredProcedure);

            RequestStatus request = new()
            {
                CodeStatus = resultado,
                MessageStatus = "Estado insert"
            };

            return request;
        }

        public IEnumerable<tbDetallesFactura> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbDetallesFactura item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbDetallesFactura> ListByIdOrden(int orde_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@orde_Id", orde_Id, DbType.Int32, ParameterDirection.Input);

            return db.Query<tbDetallesFactura>(ScriptsDataBase.UDP_tbDetallesFacturasByIdOrden, parametros, commandType: CommandType.StoredProcedure);
        }

        public IEnumerable<tbDetallesFactura> ListByIdFactura(int fact_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@fact_Id", fact_Id, DbType.Int32, ParameterDirection.Input);

            return db.Query<tbDetallesFactura>(ScriptsDataBase.UDP_tbDetallesFactura_ListByFacturaId, parametros, commandType: CommandType.StoredProcedure);
        }
    }
}
