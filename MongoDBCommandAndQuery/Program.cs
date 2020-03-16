using Benner.NoSQLRepository.Interfaces;
using Ninject;
using System;
using System.Collections.Generic;

namespace MongoDBCommandAndQuery
{
    class Program
    {
        static void Main(string[] args)
        {
            var iocKernel = new StandardKernel();

            iocKernel.Bind<INoSQLCommand<BookRecord>>().To(typeof(BookCommandMongo));
            iocKernel.Bind<INoSQLQuery<BookRecord, BookFilter>>().To(typeof(BookQueryMongo));
            iocKernel.Bind<INoSQLConfiguration>().To(typeof(BookRepositoryConfiguration));

            using (var repository = iocKernel.Get<BooksRepository>())
            {
                repository.Write(new BookRecord
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = "Think and Grow Rich",
                    Format = "pdf",
                    Isbn = "9781492208402",
                });

                repository.Write(new BookRecord
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = "The Lean Startup",
                    Format = "epub",
                    Isbn = "9785961433913",
                });

                var resultSet = repository.Read(new BookFilter
                {
                    Params = new Dictionary<string, string>
                    {
                        { "Title", "Th" },
                        { "Format", "pdf" }
                    }
                });
            }
        }
    }
}
