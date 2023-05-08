using OpticaPopular.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpticaPopular.BusinessLogic.Services
{
    public class GeneralService
    {
        private readonly DepartamentosRepository _departamentosRepository;
        private readonly MunicipiosRepository _municipiosRepository;
        private readonly EstadosCivilesRepository _estadosCivilesRepository;

        public GeneralService(DepartamentosRepository departamentosRepository, MunicipiosRepository municipiosRepository, EstadosCivilesRepository estadosCivilesRepository)
        {
            _departamentosRepository = departamentosRepository;
            _municipiosRepository = municipiosRepository;
            _estadosCivilesRepository = estadosCivilesRepository;
        }

        #region Departamentos
        public ServiceResult ListadoDepartamentos()
        {
            var result = new ServiceResult();
            try
            {
                var list = _departamentosRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }
        #endregion

        #region Municipios

        public ServiceResult ListadoMunicipios(string id)
        {
            var result = new ServiceResult();
            try
            {
                var list = _municipiosRepository.ListDdl(id);
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        #endregion

        #region Estados Civiles

        public ServiceResult ListadoEstadosCiviles()
        {
            var result = new ServiceResult();
            try
            {
                var list = _estadosCivilesRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        #endregion
    }
}
