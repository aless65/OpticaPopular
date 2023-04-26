using Dapper;
using Microsoft.Data.SqlClient;
using OpticaPopular.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpticaPopular.DataAccess.Repositories
{
    public class UsuariosRepository : IRepository<tbUsuarios, VW_tbUsuarios>
    {
        public RequestStatus Delete(tbUsuarios item)
        {
            throw new NotImplementedException();
        }

        public VW_tbUsuarios Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbUsuarios item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<VW_tbUsuarios> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbUsuarios>(ScriptsDataBase.UDP_Lista_Usuarios, null, commandType: System.Data.CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbUsuarios item)
        {
            throw new NotImplementedException();
        }
    }
}
