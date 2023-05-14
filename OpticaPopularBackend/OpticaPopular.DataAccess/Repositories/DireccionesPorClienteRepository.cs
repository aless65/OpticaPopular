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
    public class DireccionesPorClienteRepository : IRepository<tbDirecciones, tbDirecciones>
    {
        public RequestStatus Delete(tbDirecciones item)
        {
            throw new NotImplementedException();
        }

        public tbDirecciones Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbDirecciones item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbDirecciones> List()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<VW_tbDireccionesPorClientes> ListByIdCliente(int clie_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@clie_Id", clie_Id, DbType.Int32, ParameterDirection.Input);

            return db.Query<VW_tbDireccionesPorClientes>(ScriptsDataBase.UDP_tbDireccionesPorCliente_List, parametros, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbDirecciones item)
        {
            throw new NotImplementedException();
        }
    }
}
