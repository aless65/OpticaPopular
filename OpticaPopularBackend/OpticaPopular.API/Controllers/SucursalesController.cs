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
    public class SucursalesController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService;
        private readonly IMapper _mapper;

        public SucursalesController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _opticaPopularService.ListadoSucursales();
            return Ok(list);
        }

        [HttpGet("Find")]
        public IActionResult Find(int id)
        {
            var list = _opticaPopularService.FindSucursales(id);
            return Ok(list);
        }

        [HttpPost("Insertar")]
        public IActionResult Insert(SucursalesViewModel sucursales)
        {
            var item = _mapper.Map<VW_tbSucursales>(sucursales);
            var insert = _opticaPopularService.InsertSucursales(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(SucursalesViewModel sucursales)
        {
            var item = _mapper.Map<VW_tbSucursales>(sucursales);
            var update = _opticaPopularService.UpdateSucursales(item);

            return Ok(update);
        }

        [HttpPut("Eliminar")]
        public IActionResult Delete(SucursalesViewModel sucursales)
        {
            var item = _mapper.Map<VW_tbSucursales>(sucursales);
            var delete = _opticaPopularService.DeleteSucursales(item);

            return Ok(delete);
        }
    }
}
