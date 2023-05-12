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
    public class ProveedoresController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService;
        private readonly IMapper _mapper;

        public ProveedoresController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }
        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _opticaPopularService.ListadoProveedores();
            return Ok(list);
        }

        [HttpGet("Find")]
        public IActionResult Find(int id)
        {
            var list = _opticaPopularService.FindProveedores(id);
            return Ok(list);
        }


        [HttpPost("Insertar")]
        public IActionResult Insert(ProveedoresViewModel proveedores)
        {
            var item = _mapper.Map<VW_tbProveedores>(proveedores);
            var insert = _opticaPopularService.InsertProveedores(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(ProveedoresViewModel proveedores)
        {
            var item = _mapper.Map<VW_tbProveedores>(proveedores);
            var update = _opticaPopularService.UpdateProveedores(item);

            return Ok(update);
        }

        [HttpPut("Eliminar")]
        public IActionResult Delete(ProveedoresViewModel proveedores)
        {
            var item = _mapper.Map<VW_tbProveedores>(proveedores);
            var delete = _opticaPopularService.DeleteProveedores(item);

            return Ok(delete);
        }


    }
}
