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
    public class DepartamentosRepository : IRepository<tbDepartamentos, tbDepartamentos>
    {
        public RequestStatus Delete(tbDepartamentos item)
        {
            throw new NotImplementedException();
        }

        public tbDepartamentos Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbDepartamentos item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbDepartamentos> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            return db.Query<tbDepartamentos>(ScriptsDataBase.UDP_Lista_Departamentos, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbDepartamentos item)
        {
            throw new NotImplementedException();
        }
    }
}
