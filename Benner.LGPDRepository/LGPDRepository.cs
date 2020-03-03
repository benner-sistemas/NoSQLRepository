using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;

namespace Benner.LGPDRepository
{
    public class LGPDRepository : NoSQLRepository<LGPDRecord, LGPDFilter>
    {
        public LGPDRepository(INoSQLCommand<LGPDRecord> command, INoSQLQuery<LGPDRecord, LGPDFilter> query, INoSQLConfiguration config) 
            : base(command, query, config)
        { }
    }
}