using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.NossaCasa.Sorteio.Business.Entities {
    public class Empreendimento {

        [Key]
        [Column("ID_EMPREENDIMENTO ")]
        public int Id { get; set; }

        [Required]
        public int Ordem { get; set; }

        [Required]
        [MaxLength(300)]
        public string Nome { get; set; }

        [JsonIgnore][Required] public int IdSorteio { get; set; }
        [JsonIgnore][ForeignKey("IdSorteio")] public virtual SorteioE Sorteio { get; set; }
    }
}
