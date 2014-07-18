using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Web.Exception.Translator {
    public class ValidationError {
        public string Entity { get; set; }
        public string Property { get; set; }
        public string Message { get; set; }
    }
}
