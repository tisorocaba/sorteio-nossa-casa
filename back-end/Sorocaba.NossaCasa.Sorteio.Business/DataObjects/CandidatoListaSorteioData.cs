using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.NossaCasa.Sorteio.Business.DataObjects {
    public class CandidatoListaSorteioData {
        public int Id { get; set; }
        public decimal Cpf { get; set; }
        public string Nome { get; set; }
        public int? QuantidadeCriterios { get; set; }
        public bool Contemplado { get; set; }
        public int Sequencia { get; set; }
        public int Classificacao { get; set; }
        public int? SequenciaContemplacao { get; set; }
        public DateTime? DataContemplacao { get; set; }
    }
}
