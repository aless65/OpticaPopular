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
    public class DetallesEnviosController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService; 
        private readonly IMapper _mapper; 
        
        public DetallesEnviosController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }

        [HttpPost("Insert")]
        public IActionResult Insert(int envi_Id, int orde_Id, int usua_IdCreacion)
        {
            tbDetallesEnvios item = new()
            {
                envi_Id = envi_Id,
                orde_Id = orde_Id,
                usua_IdCreacion = usua_IdCreacion
            };

            var respuesta = _opticaPopularService.DetallesEnviosInsert(item);
            return Ok(respuesta);
        }
    }
}
