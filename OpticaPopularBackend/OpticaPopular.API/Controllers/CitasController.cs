﻿using AutoMapper;
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
        public IActionResult CarritoPorIdUsuario(int sucu_Id)
        {
            var lista = _opticaPopularService.ListadoCitasPorIdSucursal(sucu_Id);

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

        [HttpGet("BuscarCitaPorId/{cita_Id}")]
        public IActionResult BuscarCitaPorId(int cita_Id)
        {
            var item = _opticaPopularService.BuscarCitaPorId(cita_Id);
            item.Data = _mapper.Map<CitasViewModel>(item.Data);
            return Ok(item);
        }
    }
}
