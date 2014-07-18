using Sorocaba.Commons.Web.Exception;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.NossaCasa.Sorteio.Business.Exceptions {
    public class ImportacaoCandidatoException : Exception, IBusinessException {
        public ImportacaoCandidatoException(string message) : base(message) {
        }
    }
}
