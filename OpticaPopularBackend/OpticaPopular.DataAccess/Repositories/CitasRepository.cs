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
    public class CitasRepository : IRepository<tbCitas, tbCitas>
    {
        public RequestStatus Delete(tbCitas item)
        {
            throw new NotImplementedException();
        }

        public tbCitas Find(int? id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@cita_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.QueryFirst<tbCitas>(ScriptsDataBase.UDP_tbCitas_BuscarCitaPorId, parametros, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Insert(tbCitas item)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@clie_Id", item.clie_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@cons_Id", item.cons_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@cita_Fecha", item.cita_Fecha, DbType.Date, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<int>(ScriptsDataBase.UDP_tbCitas_InsertarNuevaCita, parametros, commandType: CommandType.StoredProcedure);

            RequestStatus request = new()
            {
                CodeStatus = resultado,
                MessageStatus = "Estado insert"
            };

            return request;
        }

        public IEnumerable<tbCitas> List()
        {
            throw new NotImplementedException();
        }

        public RequestStatus Update(tbCitas item)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<tbCitas> ListPorIdSucursal(int sucu_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@sucu_Id", sucu_Id, DbType.Int32, ParameterDirection.Input);

            return db.Query<tbCitas>(ScriptsDataBase.UDP_tbCitas_ListadoPorIdSucursal, parametros, commandType: CommandType.StoredProcedure);
        }
    }
}
