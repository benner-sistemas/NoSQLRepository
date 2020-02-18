using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TemplateSolution.Interfaces;

namespace TemplateSolution.Tests
{
    public class QueryMock : INoSQLQuery<LGPDRecord, LGPDFilter>
    {
        public List<LGPDRecord> Read(LGPDFilter filter)
        {
            return MockCache.DataSource.Where(x => x.CPF == filter.CPF || x.Nome == filter.Nome).ToList();
        }
    }
}