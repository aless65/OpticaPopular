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
    public class OrdenesRepository : IRepository<tbOrdenes, VW_tbOrdenes>
    {
        public RequestStatus Delete(tbOrdenes item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@orde_Id", item.orde_Id, DbType.Int32, ParameterDirection.Input);

            result.MessageStatus = db.QueryFirst<string>(ScriptsDataBase.UDP_Elimina_Ordenes, parametros, commandType: CommandType.StoredProcedure);

            //if (result.MessageStatus == "La orden ha sido insertada con éxito")
            //    result.MessageStatus = result.CodeStatus.ToString();

            return result;
        }

        public VW_tbOrdenes Find(int? id)
        {

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@orde_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.QueryFirst<VW_tbOrdenes>(ScriptsDataBase.UDP_Find_Ordenes, parametros, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Insert(tbOrdenes item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@clie_Id", item.clie_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@cita_Id", item.cita_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@orde_Fecha", item.orde_Fecha, DbType.Date, ParameterDirection.Input);
            parametros.Add("@orde_FechaEntrega", item.orde_FechaEntrega, DbType.Date, ParameterDirection.Input);
            parametros.Add("@sucu_Id", item.sucu_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            result.MessageStatus = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_Ordenes, parametros, commandType: CommandType.StoredProcedure);

            //if (result.MessageStatus == "La orden ha sido insertada con éxito")
            //    result.MessageStatus = result.CodeStatus.ToString();

            return result;
        }

        public RequestStatus InsertDetalles(tbDetallesOrdenes item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@orde_Id", item.orde_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@aros_Id", item.aros_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@deor_GraduacionLeft", item.deor_GraduacionLeft, DbType.String, ParameterDirection.Input);
            parametros.Add("@deor_GraduacionRight", item.deor_GraduacionRight, DbType.String, ParameterDirection.Input);
            parametros.Add("@deor_Transition", item.deor_Transition, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@deor_FiltroLuzAzul", item.deor_FiltroLuzAzul, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@deor_Cantidad", item.deor_Cantidad, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@usua_IdCreacion", item.usua_IdCreacion, DbType.Int32, ParameterDirection.Input);

            result.MessageStatus = db.QueryFirst<string>(ScriptsDataBase.UDP_Inserta_DetallesOrdenes, parametros, commandType: CommandType.StoredProcedure);

            return result;
        }

        public IEnumerable<VW_tbOrdenes> ListXSucursales(int id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();
            parameters.Add("@sucu_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.Query<VW_tbOrdenes>(ScriptsDataBase.UDP_Lista_OrdenesPorSucursal, parameters, commandType: CommandType.StoredProcedure);
        }

        public IEnumerable<VW_tbOrdenes> ListOrdenesVentaCliente()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            return db.Query<VW_tbOrdenes>(ScriptsDataBase.UDP_tbOrdenes_ListadoVentaCliente, null, commandType: CommandType.StoredProcedure);
        }


        public IEnumerable<VW_tbOrdenes> List()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);
            return db.Query<VW_tbOrdenes>(ScriptsDataBase.UDP_Lista_Ordenes, null, commandType: CommandType.StoredProcedure);
        }

        public IEnumerable<GraficasOrdenesTop2Sucursales> GraficaXSucursales()
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            return db.Query<GraficasOrdenesTop2Sucursales>(ScriptsDataBase.UDP_Grafica_Ordenes, null, commandType: CommandType.StoredProcedure);
        }


        public IEnumerable<VW_tbDetallesOrdenes> ListDetalles(int id)
        {
            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parameters = new DynamicParameters();

            parameters.Add("@orde_Id", id, DbType.Int32, ParameterDirection.Input);

            return db.Query<VW_tbDetallesOrdenes>(ScriptsDataBase.UDP_Lista_DetallesOrdenes, parameters, commandType: CommandType.StoredProcedure);
        }

        public RequestStatus Update(tbOrdenes item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@orde_Id", item.orde_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@orde_FechaEntrega", item.orde_FechaEntrega, DbType.Date, ParameterDirection.Input);
            parametros.Add("@orde_FechaEntregaReal", item.orde_FechaEntregaReal, DbType.Date, ParameterDirection.Input);
            parametros.Add("@usua_IdModificacion", item.usua_IdModificacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Edita_Ordenes, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }
        public RequestStatus DeleteDetalles(int id)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@deor_Id", id, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Elimina_DetallesOrdenes, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }

        public RequestStatus UpdateDetalles(tbDetallesOrdenes item)
        {
            RequestStatus result = new RequestStatus();

            using var db = new SqlConnection(OpticaPopularContext.ConnectionString);

            var parametros = new DynamicParameters();
            parametros.Add("@deor_Id", item.deor_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@aros_Id", item.aros_Id, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@deor_GraduacionLeft", item.deor_GraduacionLeft, DbType.String, ParameterDirection.Input);
            parametros.Add("@deor_GraduacionRight", item.deor_GraduacionRight, DbType.String, ParameterDirection.Input);
            parametros.Add("@deor_Cantidad", item.deor_Cantidad, DbType.Int32, ParameterDirection.Input);
            parametros.Add("@deor_Transition", item.deor_Transition, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@deor_FiltroLuzAzul", item.deor_FiltroLuzAzul, DbType.Boolean, ParameterDirection.Input);
            parametros.Add("@usua_IdModificacion", item.usua_IdModificacion, DbType.Int32, ParameterDirection.Input);

            var resultado = db.QueryFirst<string>(ScriptsDataBase.UDP_Edita_DetallesOrdenes, parametros, commandType: CommandType.StoredProcedure);

            result.MessageStatus = resultado;

            return result;
        }
    }
}
