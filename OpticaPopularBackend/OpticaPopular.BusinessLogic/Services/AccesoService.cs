using OpticaPopular.DataAccess.Repositories;
using OpticaPopular.Entities.Entities;
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
        public ServiceResult ListadoUsuarios()
        {
            var result = new ServiceResult();
            try
            {
                var list = _usuariosRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }
        public ServiceResult FindUsuarios(int id)
        {
            var result = new ServiceResult();
            try
            {
                var usuario = _usuariosRepository.Find(id);
                return result.Ok(usuario);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult InsertUsuarios(tbUsuarios item)
        {
            var result = new ServiceResult();
            try
            {
                var insert = _usuariosRepository.Insert(item);

                if (insert.MessageStatus == "El usuario se ha insertado")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Success);
                else if(insert.MessageStatus == "Este usuario ya existe")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult UpdateUsuarios(tbUsuarios item)
        {
            var result = new ServiceResult();
            try
            {
                var update = _usuariosRepository.Update(item);

                if (update.MessageStatus == "El usuario ha sido editado con éxito")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Success);
                else
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult DeleteUsuarios(tbUsuarios item)
        {
            var result = new ServiceResult();
            try
            {
                var update = _usuariosRepository.Delete(item);

                if (update.MessageStatus == "El usuario ha sido eliminado")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Success);
                else
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult Login(string usuario, string contrasena)
        {
            var result = new ServiceResult();
            try
            {
                var list = _usuariosRepository.Login(usuario, contrasena);
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        #endregion

        #region Pantallas



        #endregion

        #region Roles

        public ServiceResult ListadoRoles()
        {
            var result = new ServiceResult();
            try
            {
                var list = _rolesRepository.List();
                return result.Ok(list);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }
        public ServiceResult InsertRoles(tbRoles item)
        {
            var result = new ServiceResult();
            try
            {
                var insert = _rolesRepository.Insert(item);

                if (insert.MessageStatus == "El rol ha sido insertado con éxito")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Success);
                else if (insert.MessageStatus == "El rol ya existe")
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(insert.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult UpdateRoles(tbRoles item)
        {
            var result = new ServiceResult();
            try
            {
                var update = _rolesRepository.Update(item);

                if (update.MessageStatus == "El rol ha sido editado con éxito")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Success);
                else if(update.MessageStatus == "El rol ya existe")
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(update.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        public ServiceResult DeleteRoles(tbRoles item)
        {
            var result = new ServiceResult();
            try
            {
                var delete = _rolesRepository.Delete(item);

                if (delete.MessageStatus == "El rol ha sido eliminado")
                    return result.SetMessage(delete.MessageStatus, ServiceResultType.Success);
                else if(delete.MessageStatus == "El rol no puede ser eliminado ya que está siendo usado")
                    return result.SetMessage(delete.MessageStatus, ServiceResultType.Warning);
                else
                    return result.SetMessage(delete.MessageStatus, ServiceResultType.Error);
            }
            catch (Exception e)
            {
                return result.Error(e.Message);
            }
        }

        #endregion

    }
}
