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
    public class ArosController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService;
        private readonly IMapper _mapper;

        public ArosController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _opticaPopularService.ListadoAros();
            return Ok(list);
        }

        [HttpGet("ListadoXSucursal")]
        public IActionResult IndexSucursal(int id)
        {
            var list = _opticaPopularService.ListadoArosXSucursal(id);
            return Ok(list);
        }
    }
}
