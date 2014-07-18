using Sorocaba.Commons.Net.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sorocaba.Commons.Web.Json {
    /// <summary>
    /// Formato de resposta padrão para requisições AJAX.
    /// </summary>
    public class AjaxRequestResult {

        public bool Status { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
        public string ErrorMessage { get; set; }
        public string ErrorType { get; set; }
        public IList<string> StackMessage { get; set; }
        public IEnumerable<string> StackTrace { get; set; }

        public AjaxRequestResult() {
            Status = true;
        }

        public void SetSuccessMessage(string message) {
            Status = true;
            Message = message;
        }

        public void SetErrorMessage(string message) {
            Status = false;
            Message = message;
        }

        public void SetErrorException(System.Exception exception) {
            Status = false;
            ErrorType = exception.GetType().FullName;
            ErrorMessage = exception.Message;
            StackTrace = exception.StackTrace.Split("\r\n");
        }
    }
}
