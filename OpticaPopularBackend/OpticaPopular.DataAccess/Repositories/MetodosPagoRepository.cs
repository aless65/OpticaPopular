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
    public class MetodosPagoRepository : IRepository<tbMetodosPago, tbMetodosPago>
    {
        public RequestStatus Delete(tbMetodosPago item)
        {
            throw new NotImplementedException();
        }

        public tbMetodosPago Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbMetodosPago item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbMetodosPago> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            return db.Query<tbMetodosPago>(ScriptsDataBase.UDP_opti_tbMetodosPagos_List, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbMetodosPago item)
        {
            throw new NotImplementedException();
        }
    }
}
