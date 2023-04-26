using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OpticaPopular.BusinessLogic.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OpticaPopular.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PantallasController : ControllerBase
    {
        private readonly AccesoService _accesoService;
        private readonly IMapper _mapper;

        public PantallasController(AccesoService accesoService, IMapper mapper)
        {
            _accesoService = accesoService;
            _mapper = mapper;
        }
    }
}
