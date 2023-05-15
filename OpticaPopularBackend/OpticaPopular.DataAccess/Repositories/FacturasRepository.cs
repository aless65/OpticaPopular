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
    public class FacturasRepository : IRepository<tbFacturas, tbFacturas>
    {
        public RequestStatus Delete(tbFacturas item)
        {
            throw new NotImplementedException();
        }

        public tbFacturas Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbFacturas item)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@cita_Id", item.cita_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@meto_Id", item.meto_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@empe_Id", item.empe_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@fact_Total", item.fact_Total, DbType.Decimal, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<int>(ScriptsDataBase.UDP_tbFacturas_Insert, parametros, commandType: CommandType.StoredProcedure);

            RequestStatus request = new()
            {
                CodeStatus = resultado,
                MessageStatus = "Id Factura"
            };

            return request;
        }

        public IEnumerable<tbFacturas> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            return db.Query<tbFacturas>(ScriptsDataBase.UDP_tbFacturas_Listado, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbFacturas item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbFacturas> ListByIdCita(int cita_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@cita_Id", cita_Id, DbType.Int32, ParameterDirection.Input);

            return db.Query<tbFacturas>(ScriptsDataBase.UDP_tbFacturas_ListByIdCita, parametros, commandType: CommandType.StoredProcedure);
        }
    }
}
