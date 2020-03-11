using System;
using System.Collections.Generic;

namespace Benner.LGPD
{
    public class RecordDetails : IRecordDetails
    {
        public Dictionary<string, string> Person { get; set; } = new Dictionary<string, string>();
        public string Table { get; set; }
        public string Fields { get; set; }
    }
}