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
    public class OrdenesController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService;
        private readonly IMapper _mapper;

        public OrdenesController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("GraficaXSucursales")]
        public IActionResult GraficaXSucursales()
        {
            var list = _opticaPopularService.GraficaOrdenes();
            return Ok(list);
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _opticaPopularService.ListadoOrdenes();
            return Ok(list);
        }

        [HttpGet("ListadoXSucursales")]
        public IActionResult IndexPorSucursales(int id)
        {
            var list = _opticaPopularService.ListadoOrdenesXSucursales(id);
            return Ok(list);
        }

        [HttpGet("Find")]
        public IActionResult Find(int id)
        {
            var list = _opticaPopularService.FindOrdenes(id);
            return Ok(list);
        }

        [HttpPost("Insertar")]
        public IActionResult Insert(OrdenesViewModel orden)
        {
            var item = _mapper.Map<tbOrdenes>(orden);
            var insert = _opticaPopularService.InsertOrdenes(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(OrdenesViewModel orden)
        {
            var item = _mapper.Map<tbOrdenes>(orden);
            var update = _opticaPopularService.UpdateOrdenes(item);

            return Ok(update);
        }

        [HttpGet("ListadoDetalles")]
        public IActionResult IndexDetalles(int id)
        {
            var list = _opticaPopularService.ListadoDetallesOrdenes(id);
            return Ok(list);
        }

        [HttpPost("InsertarDetalles")]
        public IActionResult InsertDetalles(DetallesOrdenesViewModel orden)
        {
            var item = _mapper.Map<tbDetallesOrdenes>(orden);
            var insert = _opticaPopularService.InsertOrdenesDetalles(item);

            return Ok(insert);
        }

        [HttpPut("EliminarDetalles")]
        public IActionResult DeleteDetalles(int id)
        {
            var delete = _opticaPopularService.DeleteDetallesOrdenes(id);

            return Ok(delete);
        }
    }
}
