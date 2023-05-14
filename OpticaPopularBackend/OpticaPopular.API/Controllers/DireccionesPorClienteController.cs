using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpticaPopular.BusinessLogic.Services;
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
        public IActionResult CarritoPorIdUsuario(int clie_Id)
        {
            var lista = _opticaPopularService.ListadoDireccionesPorCliente(clie_Id);

            return Ok(lista);
        }
    }
}
