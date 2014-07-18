using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Web.Exception.Translator {
    public interface IDbConstraintTranslator {
        string GetConstraintMessage(string constraintName);
    }
}
