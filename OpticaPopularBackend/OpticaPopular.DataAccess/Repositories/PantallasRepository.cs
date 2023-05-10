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
    public class PantallasRepository : IRepository<tbPantallas, VW_tbPantallas>
    {
        public RequestStatus Delete(tbPantallas item)
        {
            throw new NotImplementedException();
        }

        public VW_tbPantallas Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbPantallas item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<VW_tbPantallas> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbPantallas>(ScriptsDataBase.UDP_Lista_Pantallas, null, commandType: CommandType.StoredProcedure);
        }

        public IEnumerable<VW_tbPantallasPorRoles> ListXRol(int id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@role_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.Query<VW_tbPantallasPorRoles>(ScriptsDataBase.UDP_Lista_RolesXPantalla, parametros, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbPantallas item)
        {
            throw new NotImplementedException();
        }
    }
}
