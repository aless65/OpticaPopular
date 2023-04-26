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
    public class DetallesOrdenesController : ControllerBase
    {
        private readonly OpticaPopularService _opticaPopularService; 
        private readonly IMapper _mapper;
        
        public DetallesOrdenesController(OpticaPopularService opticaPopularService, IMapper mapper)
        {
            _opticaPopularService = opticaPopularService;
            _mapper = mapper;
        }
    }
}
