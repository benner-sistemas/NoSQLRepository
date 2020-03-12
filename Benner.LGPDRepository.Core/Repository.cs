using Benner.LGPD;
using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;

namespace Benner.LGPDRepository.Core
{
    public class Repository : NoSQLRepository<Record, Filter>
    {
        public Repository(INoSQLCommand<Record> command = null, INoSQLQuery<Record, Filter> query = null, INoSQLConfiguration config = null)
            : base(command ?? GetDefaultCommand(), query ?? GetDefaultQuery(), config ?? GetDefaultConfig())
        { }

        public static INoSQLCommand<Record> GetDefaultCommand()
        {
            return new Command();
        }
        public static INoSQLQuery<Record, Filter> GetDefaultQuery()
        {
            return new EmptyQuery();
        }
        public static INoSQLConfiguration GetDefaultConfig()
        {
            return new FileConfig();
        }
    }
}
