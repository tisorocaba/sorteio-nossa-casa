using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Web.Json.DateConverters {
    /// <summary>
    /// Conversor de formato de data JSON para o formato "HH:mm:ss".
    /// </summary>
    public class LocalTimeConverter : IsoDateTimeConverter {
        public LocalTimeConverter() {
            base.DateTimeFormat = "HH:mm:ss";
        }
    }
}
