using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using OpticaPopular.API.Models;
using OpticaPopular.BusinessLogic.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetallesCitasController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService; 
        private readonly IMapper _mapper; 
        
        public DetallesCitasController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("BuscarDetalleCitaPorIdCita/{cita_Id}")]
        public IActionResult BuscarDetalleCitaPorIdCita(int cita_Id)
        {
            var item = _opticaPopularService.BuscarDetalleCitaPorIdCita(cita_Id);
            item.Data = _mapper.Map<DetallesCitasViewModel>(item.Data);
            return Ok(item);
        }
    }
}
