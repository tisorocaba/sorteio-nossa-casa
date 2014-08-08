using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sorocaba.NossaCasa.Sorteio.Web.Data {
    public class ListaSorteioData {
        public int Ordem { get; set; }
        public string Nome { get; set; }
        public int? Semente { get; set; }
        public IQueryable<CandidatoSorteioData> Contemplados { get; set; }
    }
}
