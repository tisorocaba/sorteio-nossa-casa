using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Net.Extensions {
    public static class StringExtensions {

        /// <summary>
        /// Separa uma string utilizando o delimitador especificado.
        /// Espaço adicionais são removidos.
        /// </summary>
        public static IEnumerable<String> Split(this String value, String delimitador) {
            return value
                .Split(new String[] { delimitador }, StringSplitOptions.None)
                .Select(s => s.Trim());
        }
    }
}
