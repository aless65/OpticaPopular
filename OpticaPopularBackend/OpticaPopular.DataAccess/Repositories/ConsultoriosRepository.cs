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
    public class ConsultoriosRepository : IRepository<tbConsultorios, VW_tbConsultorios>
    {
        public RequestStatus Delete(tbConsultorios item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@cons_Id", item.cons_Id, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Elimina_Consultorios, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result; ;
        }

        public VW_tbConsultorios Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbConsultorios item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@cons_Nombre", item.cons_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@empe_Id", item.empe_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);
            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_Consultorios, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public IEnumerable<VW_tbConsultorios> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbConsultorios>(ScriptsDataBase.UDP_Lista_Consultorios, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbConsultorios item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@cons_Id", item.cons_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@cons_Nombre", item.cons_Nombre, DbType.String, ParameterDirection.Input);
            parametros.Add("@empe_Id", item.empe_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usua_IdModificacion", item.usua_IdModificacion, DbType.Int32, ParameterDirection.Input);
            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Edita_Consultorios, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }
    }
}
