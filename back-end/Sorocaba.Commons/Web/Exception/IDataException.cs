using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Web.Exception {
    /// <summary>
    /// Representa uma exceção que possui dados que devem ser enviados para o cliente.
    /// </summary>
    public interface IDataException {
        object GetExceptionData();
    }
}
