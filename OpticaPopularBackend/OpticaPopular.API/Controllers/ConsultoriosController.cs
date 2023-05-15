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
    public class ConsultoriosController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService;
        private readonly IMapper _mapper;

        public ConsultoriosController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _opticaPopularService.ListadoConsultorios();
            return Ok(list);
        }

        [HttpGet("Find")]
        public IActionResult Find(int id)
        {
            var list = _opticaPopularService.FindConsultorio(id);
            return Ok(list);
        }

        [HttpGet("ListadoConsultoriosPorIdSucursal/{sucu_Id}")]
        public IActionResult CarritoPorIdUsuario(int sucu_Id)
        {
            var lista = _opticaPopularService.ListadoConsultoriosPorIdSucursal(sucu_Id);

            lista.Data = _mapper.Map<IEnumerable<ConsultoriosViewModel>>(lista.Data);

            return Ok(lista);
        }


        [HttpPost("Insertar")]
        public IActionResult Insert(ConsultoriosViewModel consultorios)
        {
            var item = _mapper.Map<tbConsultorios>(consultorios);
            var insert = _opticaPopularService.InsertConsultorios(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(ConsultoriosViewModel consultorios)
        {
            var item = _mapper.Map<tbConsultorios>(consultorios);
            var update = _opticaPopularService.UpdateConsultorios(item);

            return Ok(update);
        }


        [HttpPut("Eliminar")]
        public IActionResult Delete(ConsultoriosViewModel consultorios)
        {
            var item = _mapper.Map<tbConsultorios>(consultorios);
            var delete = _opticaPopularService.DeleteConsultorios(item);

            return Ok(delete);
        }


    }
}