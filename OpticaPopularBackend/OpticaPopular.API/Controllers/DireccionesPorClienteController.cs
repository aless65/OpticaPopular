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
    public class DireccionesPorClienteController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService; 
        private readonly IMapper _mapper; 

        public DireccionesPorClienteController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("ListadoByIdCliente")]
        public IActionResult List(int clie_Id)
        {
            var lista = _opticaPopularService.ListadoDireccionesPorCliente(clie_Id);

            return Ok(lista);
        }


        [HttpGet("UltimaDireccionPorCliente")]
        public IActionResult UltimaDireccionPorCliente(int clie_Id)
        {
            var result = _opticaPopularService.UltimaDireccionPorCliente(clie_Id);

            return Ok(result);
        }

        [HttpPost("Insert")]
        public IActionResult Insert(DireccionesPorClienteViewModel direccionesPorClienteViewModel)
        {
            var item = _mapper.Map<tbDireccionesPorCliente>(direccionesPorClienteViewModel);
            var respuesta = _opticaPopularService.DireccionesPorClienteInsert(item);
            return Ok(respuesta);
        }

        [HttpPost("Delete")]
        public IActionResult Delete(DireccionesPorClienteViewModel direccionesPorClienteViewModel)
        {
            var item = _mapper.Map<tbDireccionesPorCliente>(direccionesPorClienteViewModel);
            var respuesta = _opticaPopularService.DireccionesPorClienteDelete(item);
            return Ok(respuesta);
        }
    }
}
