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

        [HttpGet("ListadoOrdenesVentaCliente")]
        public IActionResult ListadoOrdenesVentaCliente()
        {
            var list = _opticaPopularService.ListadoOrdenesVentaCliente();
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

        [HttpPost("InsertarDetalles")]
        public IActionResult InsertDetalles(DetallesOrdenesViewModel orden)
        {
            var item = _mapper.Map<tbDetallesOrdenes>(orden);
            var insert = _opticaPopularService.InsertOrdenesDetalles(item);

            return Ok(insert);
        }

        [HttpGet("ListadoDetalles")]
        public IActionResult IndexDetalles(int id)
        {
            var list = _opticaPopularService.ListadoDetallesOrdenes(id);
            return Ok(list);
        }
    }
}
