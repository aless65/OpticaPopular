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
    public class SucursalesRepository : IRepository<tbSucursales, tbSucursales>
    {
        public RequestStatus Delete(tbSucursales item)
        {
            throw new NotImplementedException();
        }

        public tbSucursales Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbSucursales item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbSucursales> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<tbSucursales>(ScriptsDataBase.UDP_Lista_Sucursales, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbSucursales item)
        {
            throw new NotImplementedException();
        }
    }
}
