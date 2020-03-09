using Benner.LGPD;
using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;

namespace Sample.LGPD.Usage
{
    internal class QuerySample : INoSQLQuery<Record, Filter>
    {
        public void Configure(Dictionary<string, string> options)
        { }

        public void Dispose()
        { }

        public List<Record> Read(Filter filter)
        {
            return new List<Record>();
        }
    }
}