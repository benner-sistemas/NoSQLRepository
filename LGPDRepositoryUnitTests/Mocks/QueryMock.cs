using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Benner.LGPDRepository.Unit.Tests.Mocks
{
    public class QueryMock : INoSQLQuery<LGPDRecord, LGPDFilter>
    {
        public List<LGPDRecord> Read(LGPDFilter filter)
        {
            return MockCache.DataSource.Where(x => x.CPF == filter.CPF || x.Nome == filter.Nome).ToList();
        }
    }
}