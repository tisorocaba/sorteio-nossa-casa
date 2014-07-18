using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sorocaba.Commons.Data {
    public class DataReaderWrapper : IDataReader {

        private IDataReader Wrapped { get; set; }

        public DataReaderWrapper(IDataReader dataReader) {
            this.Wrapped = dataReader;
        }

        // IDataReader
        public virtual int Depth { get { return Wrapped.Depth; } }
        public virtual bool IsClosed { get { return Wrapped.IsClosed; } }
        public virtual int RecordsAffected { get { return Wrapped.RecordsAffected; } }
        public virtual void Close() { Wrapped.Close(); }
        public virtual DataTable GetSchemaTable() { return Wrapped.GetSchemaTable(); }
        public virtual bool NextResult() { return Wrapped.NextResult(); }
        public virtual bool Read() { return Wrapped.Read(); }

        // IDataRecord
        public virtual int FieldCount { get { return Wrapped.FieldCount; } }
        public virtual object this[int i] { get { return Wrapped[i]; } }
        public virtual object this[string name] { get { return Wrapped[name]; } }
        public virtual bool GetBoolean(int i) { return Wrapped.GetBoolean(i); }
        public virtual byte GetByte(int i) { return Wrapped.GetByte(i); }
        public virtual long GetBytes(int i, long fieldOffset, byte[] buffer, int bufferoffset, int length) { return Wrapped.GetBytes(i, fieldOffset, buffer, bufferoffset, length); }
        public virtual char GetChar(int i) { return Wrapped.GetChar(i); }
        public virtual long GetChars(int i, long fieldoffset, char[] buffer, int bufferoffset, int length) { return Wrapped.GetChars(i, fieldoffset, buffer, bufferoffset, length); }
        public virtual IDataReader GetData(int i) { return Wrapped.GetData(i); }
        public virtual string GetDataTypeName(int i) { return Wrapped.GetDataTypeName(i); }
        public virtual DateTime GetDateTime(int i) { return Wrapped.GetDateTime(i); }
        public virtual decimal GetDecimal(int i) { return Wrapped.GetDecimal(i); }
        public virtual double GetDouble(int i) { return Wrapped.GetDouble(i); }
        public virtual Type GetFieldType(int i) { return Wrapped.GetFieldType(i); }
        public virtual float GetFloat(int i) { return Wrapped.GetFloat(i); }
        public virtual Guid GetGuid(int i) { return Wrapped.GetGuid(i); }
        public virtual short GetInt16(int i) { return Wrapped.GetInt16(i); }
        public virtual int GetInt32(int i) { return Wrapped.GetInt32(i); }
        public virtual long GetInt64(int i) { return Wrapped.GetInt64(i); }
        public virtual string GetName(int i) { return Wrapped.GetName(i); }
        public virtual int GetOrdinal(string name) { return Wrapped.GetOrdinal(name); }
        public virtual string GetString(int i) { return Wrapped.GetString(i); }
        public virtual object GetValue(int i) { return Wrapped.GetValue(i); }
        public virtual int GetValues(object[] values) { return Wrapped.GetValues(values); }
        public virtual bool IsDBNull(int i) { return Wrapped.IsDBNull(i); }

        // IDisposable
        public virtual void Dispose() { Wrapped.Dispose(); }
    }
}
