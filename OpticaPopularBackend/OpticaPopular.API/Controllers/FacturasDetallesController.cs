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
    public class FacturasDetallesController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService; 
        private readonly IMapper _mapper; 
        
        public FacturasDetallesController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpPost("Insert")]
        public IActionResult Insert(DetallesFacturaViewModel detallesFacturaViewModel)
        {
            var item = _mapper.Map<tbDetallesFactura>(detallesFacturaViewModel);
            var respuesta = _opticaPopularService.DetallesFacturasInsert(item);
            return Ok(respuesta);
        }

        [HttpGet("ListByIdOrden/{orde_Id}")]
        public IActionResult ListadoPorIdOrden(int orde_Id)
        {
            var lista = _opticaPopularService.ListadoDetallesFacturasByIdOrden(orde_Id);

            return Ok(lista);
        }

        [HttpGet("ListByIdFactura/{fact_Id}")]
        public IActionResult ListByIdFactura(int fact_Id)
        {
            var lista = _opticaPopularService.ListadoDetallesFacturaByIdFactura(fact_Id);

            return Ok(lista);
        }
    }
}
