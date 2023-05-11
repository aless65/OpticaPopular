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
    public class ClientesRepository : IRepository<VW_tbClientes, VW_tbClientes>
    {
        public RequestStatus Delete(VW_tbClientes item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@clie_Id", item.clie_Id, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Elimina_Clientes, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public VW_tbClientes Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(VW_tbClientes item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@clie_Nombres", item.clie_Nombres, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_Apellidos", item.clie_Apellidos, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_Identidad", item.clie_Identidad, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_Sexo", item.clie_Sexo, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_FechaNacimiento", item.clie_FechaNacimiento, DbType.DateTime, ParameterDirection.Input);
            parametros.Add("@estacivi_Id", item.estacivi_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@clie_Telefono", item.clie_Telefono, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_CorreoElectronico", item.clie_CorreoElectronico, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_UsuCreacion", item.clie_UsuCreacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@muni_Id", item.muni_Id, DbType.String, ParameterDirection.Input);
            parametros.Add("@dire_DireccionExacta", item.dire_DireccionExacta, DbType.String, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_Clientes, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public IEnumerable<VW_tbClientes> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbClientes>(ScriptsDataBase.UDP_Lista_Clientes, null, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(VW_tbClientes item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@clie_Id", item.clie_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@clie_Nombres", item.clie_Nombres, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_Apellidos", item.clie_Apellidos, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_Identidad", item.clie_Identidad, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_Sexo", item.clie_Sexo, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_FechaNacimiento", item.clie_FechaNacimiento, DbType.DateTime, ParameterDirection.Input);
            parametros.Add("@estacivi_Id", item.estacivi_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@clie_Telefono", item.clie_Telefono, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_CorreoElectronico", item.clie_CorreoElectronico, DbType.String, ParameterDirection.Input);
            parametros.Add("@clie_UsuModificacion", item.clie_UsuModificacion, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@muni_Id", item.muni_Id, DbType.String, ParameterDirection.Input);
            parametros.Add("@dire_DireccionExacta", item.dire_DireccionExacta, DbType.String, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Edita_Clientes, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }
    }
}
