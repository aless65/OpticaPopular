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
    public class EmpleadosRepository : IRepository<tbEmpleados, VW_tbEmpleados>
    {
        public RequestStatus Delete(tbEmpleados item)
        {
            throw new NotImplementedException();
        }

        public VW_tbEmpleados Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbEmpleados item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<VW_tbEmpleados> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbEmpleados>(ScriptsDataBase.UDP_Lista_Empleados, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbEmpleados item)
        {
            throw new NotImplementedException();
        }
    }
}
