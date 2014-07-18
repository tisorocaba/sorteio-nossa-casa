using Sorocaba.Commons.Web.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Filters;

namespace Sorocaba.Commons.Web.Exception.Translator {
    public class CustomExceptionFilterAttribute : ExceptionFilterAttribute {

        public IExceptionTranslator CustomTranslator { get; set; }
        private IExceptionTranslator DefaultTranslator { get; set; }

        public CustomExceptionFilterAttribute() {
            DefaultTranslator = new DefaultExceptionTranslator();
        }

        public CustomExceptionFilterAttribute(IExceptionTranslator customTranslator) {
            CustomTranslator = customTranslator;
            DefaultTranslator = new DefaultExceptionTranslator();
        }

        public override void OnException(HttpActionExecutedContext ctx) {
            AjaxRequestResult requestResult = new AjaxRequestResult();
            if (CustomTranslator == null || !CustomTranslator.TranslateException(ctx.Exception, requestResult)) {
                DefaultTranslator.TranslateException(ctx.Exception, requestResult);
            }
            ctx.Response = ctx.Request.CreateResponse(HttpStatusCode.OK, requestResult);
        }
    }
}
