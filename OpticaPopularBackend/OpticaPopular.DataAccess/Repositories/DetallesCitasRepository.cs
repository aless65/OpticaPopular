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
    public class DetallesCitasRepository : IRepository<tbDetallesCitas, tbDetallesCitas>
    {
        public RequestStatus Delete(tbDetallesCitas item)
        {
            throw new NotImplementedException();
        }

        public tbDetallesCitas Find(int? id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@cita_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.QueryFirst<tbDetallesCitas>(ScriptsDataBase.UDP_tbDetallesCitaPorIdCita, parametros, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Insert(tbDetallesCitas item)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@cita_Id", item.cita_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@deci_Costo", item.deci_Costo, DbType.Decimal, ParameterDirection.Input);
            parametros.Add("@deci_HoraInicio", item.deci_HoraInicio, DbType.String, ParameterDirection.Input);
            parametros.Add("@deci_HoraFin", item.deci_HoraFin, DbType.String, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<int>(ScriptsDataBase.UDP_tbDetallesCitas_Insert, parametros, commandType: CommandType.StoredProcedure);

            RequestStatus request = new()
            {
                CodeStatus = resultado,
                MessageStatus = "Estado insert"
            };

            return request;
        }

        public IEnumerable<tbDetallesCitas> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbDetallesCitas item)
        {
            throw new NotImplementedException();
        }


    }
}
