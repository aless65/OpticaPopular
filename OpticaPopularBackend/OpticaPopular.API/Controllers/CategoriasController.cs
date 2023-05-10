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
    public class CategoriasController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService;
        private readonly IMapper _mapper;

        public CategoriasController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _opticaPopularService.ListadoCategorias();
            return Ok(list);
        }

        [HttpPost("Insertar")]
        public IActionResult Insert(CategoriaViewModel categorias)
        {
            var item = _mapper.Map<tbCategorias>(categorias);
            var insert = _opticaPopularService.InsertCategorias(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(CategoriaViewModel categorias)
        {
            var item = _mapper.Map<tbCategorias>(categorias);
            var update = _opticaPopularService.UpdateCaregorias(item);

            return Ok(update);
        }


        [HttpPut("Eliminar")]
        public IActionResult Delete(CategoriaViewModel categorias)
        {
            var item = _mapper.Map<tbCategorias>(categorias);
            var delete = _opticaPopularService.DeleteCategorias(item);

            return Ok(delete);
        }

    }
}
