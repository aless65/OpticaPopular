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
    public class EmpleadosController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService; 
        private readonly IMapper _mapper; 

        public EmpleadosController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("Listado")]
        public IActionResult Index()
        {
            var list = _opticaPopularService.ListadoEmpleados();
            return Ok(list);
        }

        [HttpGet("Find")]
        public IActionResult Find(int id)
        {
            var list = _opticaPopularService.FindEmpleadoos(id);
            return Ok(list);
        }

        [HttpPost("Insertar")]
        public IActionResult Insert(EmpleadoViewModel empleado)
        {
            var item = _mapper.Map<VW_tbEmpleados>(empleado);
            var insert = _opticaPopularService.InsertEmpleados(item);

            return Ok(insert);
        }

        [HttpPut("Editar")]
        public IActionResult Update(EmpleadoViewModel empleado)
        {
            var item = _mapper.Map<VW_tbEmpleados>(empleado);
            var update = _opticaPopularService.UpdateEmpleados(item);

            return Ok(update);
        }

        [HttpPut("Eliminar")]
        public IActionResult Delete(EmpleadoViewModel empleado)
        {
            var item = _mapper.Map<VW_tbEmpleados>(empleado);
            var delete = _opticaPopularService.DeleteEmpleados(item);

            return Ok(delete);
        }
    }
}
