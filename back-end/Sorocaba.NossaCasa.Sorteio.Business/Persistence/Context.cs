using Sorocaba.Commons.Data.Conventions;
using Sorocaba.NossaCasa.Sorteio.Business.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.NossaCasa.Sorteio.Business.Persistence {
    public class Context : DbContext {

        public Context() : base("DBConnection") {
            //Database.Log = sql => Debug.WriteLine(sql);
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder) {
            Database.SetInitializer<Context>(null);
            CustomConvention.ApplyConfiguration(modelBuilder);
            modelBuilder.HasDefaultSchema("NOSSACASA_SORTEIO");
        }

        public DbSet<SorteioE> Sorteio { get; set; }
        public DbSet<Empreendimento> Empreedimento { get; set; }
        public DbSet<CandidatoSorteio> CandidatoSorteio { get; set; }
        public DbSet<ListaSorteio> ListaSorteio { get; set; }
        public DbSet<CandidatoListaSorteio> CandidatoListaSorteio { get; set; }
    }
}
