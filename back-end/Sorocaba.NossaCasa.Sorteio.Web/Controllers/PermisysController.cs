using Newtonsoft.Json.Linq;
using Sorocaba.Commons.Web.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Sorocaba.NossaCasa.Sorteio.Web.Controllers {
    [RoutePrefix("api/usuario")]
    public class PermisysController : BaseController {

        [AllowAnonymous]
        [HttpGet]
        [Route]
        public AjaxRequestResult UsuarioAutenticado() {
            RequestResult.Data = new {
                Id = 1,
                Login = "Usuário Anônimo",
                Nome = "Usuário Anônimo"
            };
            return RequestResult;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public AjaxRequestResult EfetuarLogin([FromBody] Credenciais credenciais) {
            RequestResult.Data = new {
                Id = 1,
                Login = "Usuário Anônimo",
                Nome = "Usuário Anônimo"
            };
            return RequestResult;
        }

        [HttpPost]
        [Route("logout")]
        public AjaxRequestResult EfetuarLogout() {
            return RequestResult;
        }
    }

    public class Credenciais {
        public string Login { get; set; }
        public String Senha { get; set; }
    }
}
