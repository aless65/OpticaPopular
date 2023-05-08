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
    public class MarcasController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService;
        private readonly IMapper _mapper;

        public MarcasController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _opticaPopularService.ListadoMarcas();
            return Ok(list);
        }


        [HttpPost("Insertar")]
        public IActionResult Insert(MarcasViewModel marca)
        {
            var item = _mapper.Map<tbMarcas>(marca);
            var insert = _opticaPopularService.InsertMarcas(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(MarcasViewModel marca)
        {
            var item = _mapper.Map<tbMarcas>(marca);
            var update = _opticaPopularService.UpdateMarcas(item);

            return Ok(update);
        }

        [HttpPut("Eliminar")]
        public IActionResult Delete(MarcasViewModel marca)
        {
            var item = _mapper.Map<tbMarcas>(marca);
            var delete = _opticaPopularService.DeleteMarcas(item);

            return Ok(delete);
        }

    }
}
