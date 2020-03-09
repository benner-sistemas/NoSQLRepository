using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;

namespace Benner.LGPD
{
    public class Repository : NoSQLRepository<Record, Filter>
    {
        public Repository(INoSQLCommand<Record> command = null, INoSQLQuery<Record, Filter> query = null, INoSQLConfiguration config = null)
            : base(command ?? new Command(), query ?? new EmptyQuery(), config ?? new FileConfig())
        { }
    }
}