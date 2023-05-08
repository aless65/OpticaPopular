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
    public class MarcasRepository : IRepository<tbMarcas, VW_tbMarcas>
    {
        public RequestStatus Delete(tbMarcas item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@marc_Id", item.marc_Id, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Elimina_Marcas, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public VW_tbMarcas Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbMarcas item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@marc_Nombre", item.marc_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_Marcas, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public IEnumerable<VW_tbMarcas> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbMarcas>(ScriptsDataBase.UDP_Lista_Marcas, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbMarcas item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@marc_Id", item.marc_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@marc_Nombre", item.marc_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@usua_IdModificacion", item.usua_IdModificacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Edita_Marcas, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }
    }
}
