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
            throw new NotImplementedException();
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
