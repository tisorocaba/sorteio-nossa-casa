using Sorocaba.Commons.Web.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity.Core;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Web.Exception.Translator {
    public class DefaultExceptionTranslator : IExceptionTranslator {

        public IDbConstraintTranslator ConstraintTranslator { get; set; }

        public DefaultExceptionTranslator() {
        }

        public DefaultExceptionTranslator(IDbConstraintTranslator ConstraintTranslator) {
            this.ConstraintTranslator = ConstraintTranslator;
        }

        public bool TranslateException(System.Exception exception, AjaxRequestResult requestResult) {

            // Tratamento padrão.
            requestResult.Message = "Ocorreu um erro no processamento da requisição.";
            requestResult.SetErrorException(exception);
            requestResult.StackMessage = GetInnerMessage(exception);

            // IDataException
            if (exception is IDataException) {
                requestResult.Data = (exception as IDataException).GetExceptionData();
            }

            // IBusinessException
            if (exception is IBusinessException) {
                requestResult.Message = exception.Message;
            }
            // DbUpdateException
            else if (exception is DbUpdateException) {
                requestResult.Message = "Houve um erro ao tentar atualizar os dados.";
                exception = GetInnerException(exception);
                requestResult.SetErrorException(exception);
                if (exception is SqlException && ConstraintTranslator != null) {
                    Regex regex = null;
                    Regex regexA = new Regex("A instrução [A-Z]+ conflitou com a restrição do [A-Z]+ \"(?<cName>[_.A-Z0-9]+)\"\\..*");
                    Regex regexB = new Regex("Não é possível inserir uma linha de chave duplicada no objeto '[_.A-Z0-9]+' com índice exclusivo '(?<cName>[_.A-Z0-9]+)'\\..*");
                    Regex regexC = new Regex("Violação da restrição UNIQUE KEY '(?<cName>[_.A-Z0-9]+)'. Não é possível inserir a chave duplicada no objeto '[_.A-Z0-9]+'\\..*");

                    if (regexA.IsMatch(exception.Message)) {
                        regex = regexA;
                    } else if (regexB.IsMatch(exception.Message)) {
                        regex = regexB;
                    } else if (regexC.IsMatch(exception.Message)) {
                        regex = regexC;
                    }

                    if (regex != null) {
                        string constraintName = regex.Matches(exception.Message)[0].Groups["cName"].ToString();
                        string message = ConstraintTranslator.GetConstraintMessage(constraintName);
                        if (message != null) {
                            requestResult.Message = message;
                        }
                    }
                }
            }
            // ProviderIncompatibleException
            else if (exception is ProviderIncompatibleException) {
                requestResult.Message = "A aplicação não conseguiu se conectar ao banco de dados.";
            }
            // DbEntityValidationException
            else if (exception is DbEntityValidationException) {
                requestResult.Message = "Houveram erros na validação dos dados enviados.";
                List<ValidationError> errorList = new List<ValidationError>();
                requestResult.Data = errorList;

                var errors = (exception as DbEntityValidationException).EntityValidationErrors;
                foreach (var error in errors) {
                    foreach (var validationError in error.ValidationErrors) {
                        errorList.Add(new ValidationError() {
                            Entity = error.Entry.Entity.GetType().ToString(),
                            Property = validationError.PropertyName,
                            Message = validationError.ErrorMessage
                        });
                    }
                }
            }

            return true;
        }

        private System.Exception GetInnerException(System.Exception exception) {
            if (exception.InnerException == null) {
                return exception;
            } else {
                return GetInnerException(exception.InnerException);
            }
        }

        private List<string> GetInnerMessage(System.Exception exception) {
            List<string> results = new List<string>();
            results.Add(exception.Message);

            if (exception.InnerException != null) {
                results.AddRange(GetInnerMessage(exception.InnerException));
                return results;
            }
            else {
                return results;
            }
        }

    }
}
