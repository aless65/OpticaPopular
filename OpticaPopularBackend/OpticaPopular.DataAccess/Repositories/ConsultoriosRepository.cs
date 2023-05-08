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
    public class ConsultoriosRepository : IRepository<tbConsultorios, tbConsultorios>
    {
        public RequestStatus Delete(tbConsultorios item)
        {
            throw new NotImplementedException();
        }

        public tbConsultorios Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbConsultorios item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbConsultorios> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbConsultorios item)
        {
            throw new NotImplementedException();
        }


        public IEnumerable<tbConsultorios> ListPorIdSucursal(int sucu_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@sucu_Id", sucu_Id, DbType.Int32, ParameterDirection.Input);

            return db.Query<tbConsultorios>(ScriptsDataBase.UDP_tbConsultorios_ListPorIdSucursal, parametros, commandType: CommandType.StoredProcedure);
        }
    }
}
