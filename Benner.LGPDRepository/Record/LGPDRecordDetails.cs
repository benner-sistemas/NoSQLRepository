using System;
using System.Collections.Generic;

namespace Benner.LGPDRepository
{
    public class LGPDRecordDetails : ILGPDRecordDetails
    {
        public LGPDRecordDetails()
        {
            Person = new Dictionary<string, string>();
        }

        public Dictionary<string, string> Person { get; set; }
        public string Table { get; set; }
        public string Fields { get; set; }
    }
}