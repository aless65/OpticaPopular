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
    public class DepartamentosController : ControllerBase
    {
        private readonly GeneralService _generalService;
        private readonly IMapper _mapper;

        public DepartamentosController(GeneralService generalService , IMapper mapper)
        {
            _generalService = generalService;
            _mapper = mapper;
        }
    }
}
