using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorocaba.NossaCasa.Sorteio.Web.Data {
    public class CandidatoSorteioData {
        public decimal Cpf { get; set; }
        public string Nome { get; set; }
        public int? QuantidadeCriterios { get; set;}
        public bool Contemplado { get; set; }
        public string Lista { get; set; }
        public int? Ordem { get; set; }
        public DateTime? Data { get; set; }
    }
}