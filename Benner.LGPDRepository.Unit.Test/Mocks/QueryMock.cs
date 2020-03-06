using Benner.LGPD;
using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Benner.LGPDRepository.Unit.Test.Mocks
{
    public class QueryMock : INoSQLQuery<Record, Filter>
    {
        public void Configure(Dictionary<string, string> options)
        { }

        public void Dispose()
        { }

        public List<Record> Read(Filter filter)
        {

            return MockCache.DataSource.Where(
                x =>
                {
                    if (x.Details is RecordDetails details)
                        return details.Person["CPF"] == filter.CPF;
                    return false;
                })
                .ToList();
        }
    }
}