using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Sorocaba.NossaCasa.Sorteio.Web {
    public static class WebApiConfig {

        public static void Register(HttpConfiguration config) {
            config.MapHttpAttributeRoutes();
            config.Formatters.Remove(config.Formatters.XmlFormatter);
            ConfigureJson(config.Formatters.JsonFormatter.SerializerSettings);
        }

        public static void ConfigureJson(JsonSerializerSettings settings) {
            settings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            settings.NullValueHandling = NullValueHandling.Ignore;
            settings.Formatting = Formatting.None;
            settings.DateFormatString = "dd/MM/yyyy HH:mm:ss";
            settings.Error = (sender, a) => { throw a.ErrorContext.Error; };
        }
    }
}
