using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;

namespace Benner.LGPD
{
    public class Repository : NoSQLRepository<Record, Filter>
    {
        public Repository(INoSQLCommand<Record> command = null, INoSQLQuery<Record, Filter> query = null, ILGPDConfiguration config = null)
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
        public static ILGPDConfiguration GetDefaultConfig()
        { 
            return new FileConfig();
        }
    }
}