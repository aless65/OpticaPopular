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
    public class FacturasController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService; 
        private readonly IMapper _mapper;

        public FacturasController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpPost("Insert")]
        public IActionResult Insert(FacturasViewModel facturasViewModel)
        {
            var item = _mapper.Map<tbFacturas>(facturasViewModel);
            var respuesta = _opticaPopularService.FacturasInsert(item);
            return Ok(respuesta);
        }

        [HttpGet("ListByIdCita/{cita_Id}")]
        public IActionResult ListadoPorIdCital(int cita_Id)
        {
            var lista = _opticaPopularService.ListadoFacturasByIdCita(cita_Id);

            return Ok(lista);
        }

        [HttpGet("List")]
        public IActionResult ListadoFacturas()
        {
            var lista = _opticaPopularService.ListadoFacturas();

            return Ok(lista);
        }

    }
}
