using System;
using System.Collections.Generic;

namespace Benner.LGPDRepository
{
    public class LGPDRecord
    {
        public DateTime AccessTimestamp { get; set; }
        public string AccessUsername { get; set; }
        public ILGPDRecordDetails Details { get; set; }
    }

    public interface ILGPDRecordDetails
    {
    }

    public class RecordDetails : ILGPDRecordDetails
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