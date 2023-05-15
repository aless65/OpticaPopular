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
    public class DireccionesPorClienteRepository : IRepository<tbDireccionesPorCliente, tbDireccionesPorCliente>
    {
        public RequestStatus Delete(tbDireccionesPorCliente item)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@clie_Id", item.clie_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@dire_Id", item.dire_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usua_IdModificacion", item.usua_IdModificacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<int>(ScriptsDataBase.UDP_tbDireccionesPorCliente_Delete, parametros, commandType: CommandType.StoredProcedure);

            RequestStatus request = new()
            {
                CodeStatus = resultado,
                MessageStatus = "Estado delete"
            };

            return request;
        }

        public tbDireccionesPorCliente Find(int? id)
        {
            throw new NotImplementedException();
        }

        public RequestStatus Insert(tbDireccionesPorCliente item)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@clie_Id", item.clie_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@muni_Id", item.muni_Id, DbType.String, ParameterDirection.Input);
            parametros.Add("@dire_DireccionExacta", item.dire_DireccionExacta, DbType.String, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<int>(ScriptsDataBase.UDP_tbDireccionesPorCliente_Insert, parametros, commandType: CommandType.StoredProcedure);

            RequestStatus request = new()
            {
                CodeStatus = resultado,
                MessageStatus = "Estado insert"
            };

            return request;
        }

        public IEnumerable<tbDireccionesPorCliente> List()
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

        public RequestStatus Update(tbDireccionesPorCliente item)
        {
            throw new NotImplementedException();
        }

        public VW_tbDireccionesPorClientes UltimaDireccionPorCliente(int clie_Id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();

            parametros.Add("@clie_Id", clie_Id, DbType.Int32, ParameterDirection.Input);

            return db.QueryFirst<VW_tbDireccionesPorClientes>(ScriptsDataBase.UDP_tbDireccionesPorCliente_Ultima, parametros, commandType: CommandType.StoredProcedure);
        }
    }
}
