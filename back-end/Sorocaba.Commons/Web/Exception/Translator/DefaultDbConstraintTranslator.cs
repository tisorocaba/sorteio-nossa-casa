using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Web.Exception.Translator {
    public class DefaultDbConstraintTranslator : IDbConstraintTranslator {
        public string GetConstraintMessage(string constraintName) {
            return System.Configuration.ConfigurationManager.AppSettings[constraintName];
        }
    }
}
