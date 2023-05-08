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
    public class CitasRepository : IRepository<tbCitas, tbCitas>
    {
        public RequestStatus Delete(tbCitas item)
        {
            throw new NotImplementedException();
        }

        public tbCitas Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbCitas item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbCitas> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbCitas item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbCitas> ListPorIdSucursal(int sucu_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@sucu_Id", sucu_Id, DbType.Int32, ParameterDirection.Input);

            return db.Query<tbCitas>(ScriptsDataBase.UDP_tbCitas_ListadoPorIdSucursal, parametros, commandType: CommandType.StoredProcedure);
        }
    }
}
