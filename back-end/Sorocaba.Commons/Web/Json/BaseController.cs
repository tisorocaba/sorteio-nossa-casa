using Ninject;
using Sorocaba.Commons.Web.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace Sorocaba.Commons.Web.Json {
    public class BaseController : ApiController {
        [Inject]
        public AjaxRequestResult RequestResult { get; set; }
    }
}
