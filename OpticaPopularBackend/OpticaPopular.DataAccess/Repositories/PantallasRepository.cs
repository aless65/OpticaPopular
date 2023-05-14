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

        public IEnumerable<VW_tbPantallas> ListMenu(bool esAdmin, int role_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();

            parameters.Add("@usua_EsAdmin", esAdmin, DbType.Boolean, ParameterDirection.Input);
            parameters.Add("@role_Id", role_Id, DbType.Int32, ParameterDirection.Input);

            return db.Query<VW_tbPantallas>(ScriptsDataBase.UDP_Lista_PantallasMenu, parameters, commandType: CommandType.StoredProcedure);
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

        public string AccesoPantalla(int role_Id, bool esAdmin, string pant_Nombre)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@role_Id", role_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@esAdmin", esAdmin, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@pant_Nombre", pant_Nombre, DbType.String, ParameterDirection.Input);

            return db.QueryFirst<string>(ScriptsDataBase.UDP_Accesos_Pantallas, parametros, commandType: CommandType.StoredProcedure);
        }
    }
}
