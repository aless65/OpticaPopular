using OpticaPopular.DataAccess.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OpticaPopular.BusinessLogic.Services
{
    public class AccesoService
    {
        private readonly UsuariosRepository _usuariosRepository;
        private readonly PantallasRepository _pantallasRepository;
        private readonly RolesRepository _rolesRepository;

        public AccesoService(UsuariosRepository usuariosRepository, PantallasRepository pantallasRepository, RolesRepository rolesRepository)
        {
            _usuariosRepository = usuariosRepository;
            _pantallasRepository = pantallasRepository;
            _rolesRepository = rolesRepository;
        }

        #region Usuarios



        #endregion

        #region Pantallas



        #endregion

        #region Roles



        #endregion

    }
}
