using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Data.Pagination {
    public class FilterField {

        public FilterField(string fieldName, string @operator, object fieldValue) {
            FieldName = fieldName;
            Operator = @operator;
            FieldValue = fieldValue;
        }

        public string FieldName { get; set; }
        public string Operator { get; set; }
        public object FieldValue { get; set; }
    }
}
