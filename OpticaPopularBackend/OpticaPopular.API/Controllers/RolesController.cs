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
    public class RolesController : ControllerBase
    {
        private readonly AccesoService _accesoService;
        private readonly IMapper _mapper;

        public RolesController(AccesoService accesoService, IMapper mapper)
        {
            _accesoService = accesoService;
            _mapper = mapper;
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _accesoService.ListadoRoles();
            return Ok(list);
        }

        [HttpGet("Find")]
        public IActionResult Find(int id)
        {
            var list = _accesoService.FindRoles(id);
            return Ok(list);
        }


        [HttpPost("Insertar")]
        public IActionResult Insert(RolViewModel rol)
        {
            var item = _mapper.Map<tbRoles>(rol);
            var insert = _accesoService.InsertRoles(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(RolViewModel rol)
        {
            var item = _mapper.Map<tbRoles>(rol);
            var update = _accesoService.UpdateRoles(item);

            return Ok(update);
        }


        [HttpPut("Eliminar")]
        public IActionResult Delete(RolViewModel rol)
        {
            var item = _mapper.Map<tbRoles>(rol);
            var delete = _accesoService.DeleteRoles(item);

            return Ok(delete);
        }
    }
}
