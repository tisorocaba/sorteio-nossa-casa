using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Web.Json.DateConverters {
    /// <summary>
    /// Conversor de formato de data JSON para o formato "dd/MM/yyyy HH:mm:ss.FFF".
    /// </summary>
    public class LocalDateTimeMillisConverter : IsoDateTimeConverter {
        public LocalDateTimeMillisConverter() {
            base.DateTimeFormat = "dd/MM/yyyy HH:mm:ss.FFF";
        }
    }
}
