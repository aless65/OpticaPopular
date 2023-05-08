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
    public class MunicipiosRepository : IRepository<tbMunicipios, tbMunicipios>
    {
        public RequestStatus Delete(tbMunicipios item)
        {
            throw new NotImplementedException();
        }

        public tbMunicipios Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbMunicipios item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbMunicipios> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbMunicipios item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbMunicipios> ListDdl(string id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@depa_Id", id, DbType.String, ParameterDirection.Input);

            return db.Query<tbMunicipios>(ScriptsDataBase.UDP_Lista_Municipios, parameters, commandType: CommandType.StoredProcedure);
        }
    }
}
