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
    // Sufixo "E" utilizado para evitar conflitos com o namespace "Sorteio".
    [Table("SORTEIO")]
    public class SorteioE {

        [Key]
        [Column("ID_SORTEIO")]
        public int Id { get; set; }

        [JsonConverter(typeof(LocalDateConverter))]
        [Required]
        public DateTime Data { get; set; }

        [MaxLength(300)]
        public string Observacao { get; set; }

        /// <summary>
        /// Indica se todas as listas do sorteio já foram sorteadas.
        /// </summary>
        [Required]
        public bool Finalizado { get; set; }
    }
}
