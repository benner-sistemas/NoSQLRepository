using System;
using System.Collections.Generic;

namespace Benner.LGPD
{
    public class RecordDetails : IRecordDetails
    {
        public RecordDetails()
        {
            Person = new Dictionary<string, string>();
        }

        public Dictionary<string, string> Person { get; set; }
        public string Table { get; set; }
        public string Fields { get; set; }
    }
}