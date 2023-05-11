using AutoMapper;
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
    public class DetallesCitasController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService; 
        private readonly IMapper _mapper; 
        
        public DetallesCitasController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpPost("Insert")]
        public IActionResult Insert(int cita_Id, string deci_Costo, string deci_HoraInicio, string deci_HoraFin, int usua_IdCreacion)
        {

            tbDetallesCitas item = new()
            {
                cita_Id = cita_Id,
                deci_Costo = decimal.Parse(deci_Costo),
                deci_HoraInicio = deci_HoraInicio,
                deci_HoraFin = deci_HoraFin,
                usua_IdCreacion = usua_IdCreacion
            };

            var respuesta = _opticaPopularService.InsertarDetalleCita(item);
            return Ok(respuesta);

        }

        [HttpPost("Editar")]
        public IActionResult Update(int cita_Id, string deci_Costo, string deci_HoraInicio, string deci_HoraFin, int usua_IdModificacion)
        {

            tbDetallesCitas item = new()
            {
                cita_Id = cita_Id,
                deci_Costo = decimal.Parse(deci_Costo),
                deci_HoraInicio = deci_HoraInicio,
                deci_HoraFin = deci_HoraFin,
                usua_IdModificacion = usua_IdModificacion
            };

            var respuesta = _opticaPopularService.EditarDetalleCita(item);
            return Ok(respuesta);

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
