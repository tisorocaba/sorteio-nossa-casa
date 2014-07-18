using Sorocaba.Commons.Web.Exception.Translator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.SessionState;

namespace Sorocaba.NossaCasa.Sorteio.Web {
    public class WebApiApplication : System.Web.HttpApplication {

        protected void Application_Start() {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);

            GlobalConfiguration.Configuration.Filters.Add(
                new CustomExceptionFilterAttribute(new DefaultExceptionTranslator(new DefaultDbConstraintTranslator()))
            );
        }

        protected void Application_PostAuthorizeRequest() {
            if (IsWebApiRequest()) {
                HttpContext.Current.SetSessionStateBehavior(SessionStateBehavior.Required);
            }
        }

        private bool IsWebApiRequest() {
            return HttpContext.Current.Request.AppRelativeCurrentExecutionFilePath.StartsWith("~/");
        }

        protected void Application_AcquireRequestState(object sender, EventArgs e) {
        }
    }
}
