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

        [Column("LISTA_DEFICIENTES")]
        [Required]
        public bool ListaDeficientes { get; set; }

        [Column("LISTA_IDOSOS")]
        [Required]
        public bool ListaIdosos { get; set; }

        [Column("LISTA_INDICADOS")]
        [Required]
        public bool ListaIndicados { get; set; }

        [Column("LISTA_GERAL_I")]
        [Required]
        public bool ListaGeralI { get; set; }

        [Column("LISTA_GERAL_II")]
        [Required]
        public bool ListaGeralII { get; set; }

        /// <summary>
        /// Contagem da quantidade de critérios atendidos pelo candidato.
        /// </summary>
        [Required]
        public int QuantidadeCriterios { get; set; }

        /// <summary>
        /// Indica se o candidato já foi contemplado em qualquer lista do sorteio.
        /// </summary>
        [Required]
        public bool Contemplado { get; set; }

        [JsonIgnore][Required] public int IdSorteio { get; set; }
        [JsonIgnore][ForeignKey("IdSorteio")] public virtual SorteioE Sorteio { get; set; }
    }
}
