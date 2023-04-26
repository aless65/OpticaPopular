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



        #endregion

        #region Municipios



        #endregion

        #region Estados Civiles



        #endregion
    }
}
