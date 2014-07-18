using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.NossaCasa.Sorteio.Business.Entities {
    public class ListaSorteio {

        [Key]
        [Column("ID_LISTA_SORTEIO")]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Nome { get; set; }

        /// <summary>
        /// Ordem de sorteio desta lista dentro do sorteio correspondente.
        /// </summary>
        [Required]
        public int OrdemSorteio { get; set; }

        /// <summary>
        /// Quantidade de candidatos que serão sorteados nesta lista.
        /// </summary>
        [Required]
        public int Quantidade { get; set; }

        /// <summary>
        /// Indica se a lista já foi sorteada.
        /// </summary>
        [Required]
        public bool Sorteada { get; set; }

        /// <summary>
        /// Semente para geração de números aleatórios que foi utilizada no sorteio (caso a lista já tenha sido sorteada).
        /// </summary>
        public int? SementeSorteio { get; set; }

        [JsonIgnore][Required] public int IdSorteio { get; set; }
        [JsonIgnore][ForeignKey("IdSorteio")] public virtual SorteioE Sorteio { get; set; }
    }
}
