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
    public class ClientesController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService;
        private readonly IMapper _mapper;

        public ClientesController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _opticaPopularService.ListadoClientes();
            return Ok(list);
        }

        [HttpGet("Find")]
        public IActionResult Find(int id)
        {
            var list = _opticaPopularService.FindClientes(id);
            return Ok(list);
        }

        [HttpPost("Insertar")]
        public IActionResult Insert(ClienteViewModel cliente)
        {
            var item = _mapper.Map<VW_tbClientes>(cliente);
            var insert = _opticaPopularService.InsertClientes(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(ClienteViewModel cliente)
        {
            var item = _mapper.Map<VW_tbClientes>(cliente);
            var update = _opticaPopularService.UpdateClientes(item);

            return Ok(update);
        }

        [HttpPut("Eliminar")]
        public IActionResult Delete(ClienteViewModel cliente)
        {
            var item = _mapper.Map<VW_tbClientes>(cliente);
            var delete = _opticaPopularService.DeleteClientes(item);

            return Ok(delete);
        }
    }
}
