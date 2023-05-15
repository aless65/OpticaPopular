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
    public class CitasController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService;
        private readonly IMapper _mapper;

        public CitasController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpGet("ListadoCitasPorIdSucursal/{sucu_Id}")]
        public IActionResult ListadoCitasPorIdSucursal(int sucu_Id)
        {
            var lista = _opticaPopularService.ListadoCitasPorIdSucursal(sucu_Id);

            lista.Data = _mapper.Map<IEnumerable<CitasViewModel>>(lista.Data);

            return Ok(lista);
        }

        [HttpGet("ListadoParaVentas")]
        public IActionResult ListadoParaVentaCita()
        {
            var lista = _opticaPopularService.ListadoCitasVentaCita();

            lista.Data = _mapper.Map<IEnumerable<CitasViewModel>>(lista.Data);

            return Ok(lista);
        }

        [HttpPost("Insert")]
        public IActionResult Insert(CitasViewModel citasViewModel)
        {
            var item = _mapper.Map<tbCitas>(citasViewModel);
            var respuesta = _opticaPopularService.InsertarCita(item);
            return Ok(respuesta);
        }

        [HttpPost("Editar")]
        public IActionResult Update(CitasViewModel citasViewModel)
        {
            var item = _mapper.Map<tbCitas>(citasViewModel);
            var respuesta = _opticaPopularService.EditarCita(item);
            return Ok(respuesta);
        }

        [HttpGet("BuscarCitaPorId/{cita_Id}")]
        public IActionResult BuscarCitaPorId(int cita_Id)
        {
            var item = _opticaPopularService.BuscarCitaPorId(cita_Id);
            item.Data = _mapper.Map<CitasViewModel>(item.Data);
            return Ok(item);
        }

        [HttpPost("Eliminar")]
        public IActionResult Delete(int cita_Id, int usua_IdModificacion )
        {
            CitasViewModel citasViewModel = new()
            {
                cita_Id = cita_Id,
                usua_IdModificacion = usua_IdModificacion
            };

            var item = _mapper.Map<tbCitas>(citasViewModel);
            var respuesta = _opticaPopularService.EliminarCita(item);
            return Ok(respuesta);
        }
    }
}
