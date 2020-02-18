using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ninject;
using TemplateSolution.Interfaces;
using TemplateSolution.Tests;

namespace TemplateSolution
{
    public class LGPDRepository : NoSQLRepository<LGPDRecord, LGPDFilter>
    {
        public LGPDRepository(INoSQLCommand<LGPDRecord> command, INoSQLQuery<LGPDRecord, LGPDFilter> query) : base(command, query) { }
    }
}