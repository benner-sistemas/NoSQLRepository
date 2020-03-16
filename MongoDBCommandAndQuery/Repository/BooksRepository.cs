using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;

namespace MongoDBCommandAndQuery
{
    public class BooksRepository : NoSQLRepository<BookRecord, BookFilter>
    {
        public BooksRepository(INoSQLCommand<BookRecord> command, INoSQLQuery<BookRecord, BookFilter> query, INoSQLConfiguration configuration)
            : base(command, query, configuration)
        {
        }
    }
}