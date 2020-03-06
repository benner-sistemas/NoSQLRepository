using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;

namespace Benner.LGPD
{
    public class Repository : NoSQLRepository<Record, Filter>
    {
        public Repository(INoSQLCommand<Record> command, INoSQLQuery<Record, Filter> query, INoSQLConfiguration config) 
            : base(command, query, config)
        { }

        public Repository()
            : base(new Command(), new EmptyQuery(), new FileConfig())
        { }
    }
}