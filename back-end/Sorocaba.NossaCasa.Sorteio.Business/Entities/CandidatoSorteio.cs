using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.NossaCasa.Sorteio.Business.Entities {
    public class CandidatoSorteio {

        [Key]
        [Column("ID_CANDIDATO_SORTEIO")]
        public int Id { get; set; }

        [Required]
        public decimal Cpf { get; set; }

        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        public bool Idoso { get; set; }

        [Required]
        public bool AuxilioMoradia { get; set; }

        [Column("CRIT_SEXO")]
        [Required]
        public bool CriterioSexo { get; set; }

        [Column("CRIT_ALUGUEL")]
        [Required]
        public bool CriterioAluguel { get; set; }

        [Column("CRIT_TEMPO")]
        [Required]
        public bool CriterioTempo { get; set; }

        [Column("CRIT_DEFICIENTE")]
        [Required]
        public bool CriterioDeficiente { get; set; }

        [Column("CRIT_DOENCA")]
        [Required]
        public bool CriterioDoenca { get; set; }

        [Column("CRIT_RISCO")]
        [Required]
        public bool CriterioRisco { get; set; }

        /// <summary>
        /// Contagem da quantidade de critérios atendidos pelo candidato.
        /// </summary>
        public int? QuantidadeCriterios { get; set; }

        /// <summary>
        /// Indica se o candidato já foi contemplado em qualquer lista do sorteio.
        /// </summary>
        [Required]
        public bool Contemplado { get; set; }

        [JsonIgnore][Required] public int IdSorteio { get; set; }
        [JsonIgnore][ForeignKey("IdSorteio")] public virtual SorteioE Sorteio { get; set; }
    }
}
