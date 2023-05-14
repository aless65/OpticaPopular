using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpticaPopular.API.Models;
using OpticaPopular.BusinessLogic.Services;
using OpticaPopular.Entities.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AccesoService _accesoService;
        private readonly IMapper _mapper;

        public UsuariosController(AccesoService accesoService, IMapper mapper)
        {
            _accesoService = accesoService;
            _mapper = mapper;
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _accesoService.ListadoUsuarios();
            return Ok(list);
        }

        [HttpGet("Find")]
        public IActionResult Find(int id)
        {
            var list = _accesoService.FindUsuarios(id);
            return Ok(list);
        }

        [HttpPost("Insertar")]
        public IActionResult Insert(UsuarioViewModel usuario)
        {
            var item = _mapper.Map<tbUsuarios>(usuario);
            var insert = _accesoService.InsertUsuarios(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(UsuarioViewModel usuario)
        {
            var item = _mapper.Map<tbUsuarios>(usuario);
            var update = _accesoService.UpdateUsuarios(item);

            return Ok(update);
        }

        [HttpPut("Eliminar")]
        public IActionResult Delete(UsuarioViewModel usuario)
        {
            var item = _mapper.Map<tbUsuarios>(usuario);
            var delete = _accesoService.DeleteUsuarios(item);

            return Ok(delete);
        }

        [HttpGet("Login")]
        public IActionResult Login(string usuario, string contrasena)
        {
            var list = _accesoService.Login(usuario, contrasena);
            return Ok(list);
        }

        [HttpGet("RecuperarContra")]
        public IActionResult Recuperar(string usuario, string contrasena)
        {
            var list = _accesoService.RecuperarContra(usuario, contrasena);
            return Ok(list);
        }
    }
}
