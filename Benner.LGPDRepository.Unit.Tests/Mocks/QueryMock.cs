using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Benner.LGPDRepository.Unit.Tests.Mocks
{
    public class QueryMock : INoSQLQuery<LGPDRecord, LGPDFilter>
    {
        public List<LGPDRecord> Read(LGPDFilter filter)
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