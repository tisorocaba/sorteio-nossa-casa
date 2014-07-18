using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Data.Conventions {
    public class CustomConvention : Convention {

        protected CustomConvention() {
            this.Types().Configure(t => t.ToTable(parseName(t.ClrType.Name)));
            this.Properties().Configure(p => p.HasColumnName(parseName(p.ClrPropertyInfo.Name)));
            this.Properties()
                .Where(p => p.Name == "Id" + p.DeclaringType.Name)
                .Configure(p => p.IsKey());
            this.Properties<string>().Configure(p => p.IsUnicode(false));
            this.Properties<string>().Configure(p => p.HasColumnType("varchar"));
            this.Properties<string>().Configure(p => p.HasMaxLength(50));
        }

        protected string parseName(string name) {
            return CamelCaseToUnderscore(name).ToUpper();
        }

        protected string CamelCaseToUnderscore(string name) {
            return Regex.Replace(name, ".[A-Z]", m => m.Value[0] + "_" + m.Value[1]);
        }

        public static void ApplyConfiguration(DbModelBuilder modelBuilder) {
            modelBuilder.Conventions.Remove<IdKeyDiscoveryConvention>();
            modelBuilder.Conventions.Add(new CustomConvention());
        }
    }
}
