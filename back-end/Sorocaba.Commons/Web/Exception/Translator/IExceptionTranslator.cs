using Sorocaba.Commons.Web.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Web.Exception.Translator {
    public interface IExceptionTranslator {
        bool TranslateException(System.Exception exception, AjaxRequestResult requestResult);
    }
}
