using Newtonsoft.Json;
using Sorocaba.Commons.Web.Json.DateConverters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.NossaCasa.Sorteio.Business.Entities {
    [Table("CANDIDATO_SORTEIO_LISTA_SORTEIO")]
    public class CandidatoListaSorteio {

        [Key, Column(Order = 1)]
        [JsonIgnore][Required] public int IdCandidatoSorteio { get; set; }
        [ForeignKey("IdCandidatoSorteio")] public virtual CandidatoSorteio CandidatoSorteio { get; set; }

        [Key, Column(Order = 2)]
        [JsonIgnore][Required] public int IdListaSorteio { get; set; }
        [JsonIgnore][ForeignKey("IdListaSorteio")] public virtual ListaSorteio ListaSorteio { get; set; }

        /// <summary>
        /// Sequência única do candidato nesta lista.
        /// </summary>
        [Required]
        public int Sequencia { get; set; }

        /// <summary>
        /// Classificação do candidato nesta lista.
        /// </summary>
        [Required]
        public int Classificacao { get; set; }

        /// <summary>
        /// Sequência da contemplação do candidato nesta lista (caso tenha sido contemplado nesta lista).
        /// </summary>
        public int? SequenciaContemplacao { get; set; }

        /// <summary>
        /// Data na qual o candidato foi contemplado nesta lista (caso tenha sido contemplado nesta lista).
        /// </summary>
        [JsonConverter(typeof(LocalDateTimeMillisConverter))]
        public DateTime? DataContemplacao { get; set; }
    }
}
