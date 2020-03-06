using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Extensions;
using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;

namespace Benner.LGPD
{
    public class EmptyQuery : INoSQLQuery<Record, Filter>
    {
        public void Configure(Dictionary<string, string> options)
        {
            //throw new System.NotImplementedException();
        }

        public void Dispose()
        {
            //throw new System.NotImplementedException();
        }

        public List<Record> Read(Filter filter)
        {
            throw new System.NotImplementedException();
        }
    }
}