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
    public class EmpleadosRepository : IRepository<VW_tbEmpleados, VW_tbEmpleados>
    {
        public RequestStatus Delete(VW_tbEmpleados item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@empe_Id", item.empe_Id, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Elimina_Empleados, parameters, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public VW_tbEmpleados Find(int? id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@empe_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.QueryFirst<VW_tbEmpleados>(ScriptsDataBase.UDP_Find_Empleados, parameters, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Insert(VW_tbEmpleados item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@empe_Nombres", item.empe_Nombres, DbType.String, ParameterDirection.Input);
            parameters.Add("@empe_Apellidos", item.empe_Apellidos, DbType.String, ParameterDirection.Input);
            parameters.Add("@empe_Identidad", item.empe_Identidad, DbType.String, ParameterDirection.Input);
            parameters.Add("@empe_FechaNacimiento", item.empe_FechaNacimiento, DbType.Date, ParameterDirection.Input);
            parameters.Add("@empe_Sexo", item.empe_Sexo, DbType.String, ParameterDirection.Input);
            parameters.Add("@estacivi_Id", item.estacivi_Id, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@empe_Telefono", item.empe_Telefono, DbType.String, ParameterDirection.Input);
            parameters.Add("@empe_CorreoElectronico", item.empe_CorreoElectronico, DbType.String, ParameterDirection.Input);
            parameters.Add("@muni_Id", item.muni_Id, DbType.String, ParameterDirection.Input);
            parameters.Add("@dire_DireccionExacta", item.dire_DireccionExacta, DbType.String, ParameterDirection.Input);
            parameters.Add("@carg_Id", item.carg_Id, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@sucu_Id", item.sucu_Id, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@empe_UsuCreacion", item.empe_UsuCreacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_Empleados, parameters, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public IEnumerable<VW_tbEmpleados> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbEmpleados>(ScriptsDataBase.UDP_Lista_Empleados, null, commandType: CommandType.StoredProcedure);
        }

        public SexoEmpleados GraficaSexo()
        {

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            return db.QueryFirst<SexoEmpleados>(ScriptsDataBase.UDP_Grafica_EmpleadosSexo, null, commandType: CommandType.StoredProcedure);

        }

        public RequestStatus Update(VW_tbEmpleados item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@empe_Id", item.empe_Id, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@empe_Nombres", item.empe_Nombres, DbType.String, ParameterDirection.Input);
            parameters.Add("@empe_Apellidos", item.empe_Apellidos, DbType.String, ParameterDirection.Input);
            parameters.Add("@empe_Identidad", item.empe_Identidad, DbType.String, ParameterDirection.Input);
            parameters.Add("@empe_FechaNacimiento", item.empe_FechaNacimiento, DbType.Date, ParameterDirection.Input);
            parameters.Add("@empe_Sexo", item.empe_Sexo, DbType.String, ParameterDirection.Input);
            parameters.Add("@estacivi_Id", item.estacivi_Id, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@empe_Telefono", item.empe_Telefono, DbType.String, ParameterDirection.Input);
            parameters.Add("@empe_CorreoElectronico", item.empe_CorreoElectronico, DbType.String, ParameterDirection.Input);
            parameters.Add("@muni_Id", item.muni_Id, DbType.String, ParameterDirection.Input);
            parameters.Add("@dire_DireccionExacta", item.dire_DireccionExacta, DbType.String, ParameterDirection.Input);
            parameters.Add("@carg_Id", item.carg_Id, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@sucu_Id", item.sucu_Id, DbType.Int32, ParameterDirection.Input);
            parameters.Add("@empe_UsuModificacion", item.empe_UsuModificacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Edita_Empleados, parameters, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }
    }
}
