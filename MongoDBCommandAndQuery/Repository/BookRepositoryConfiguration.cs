using Benner.NoSQLRepository.Interfaces;
using System.Collections.Generic;

namespace MongoDBCommandAndQuery
{
    public class BookRepositoryConfiguration : INoSQLConfiguration
    {
        public Dictionary<string, string> Settings { get; set; }

        public void LoadSettings()
        {
            Settings = new Dictionary<string, string>
            {
                { "bookCommand:connectionString", "mongodb://bnu-vtec012:27017" },
                { "bookCommand:dbName", "books-db" },
                { "bookCommand:collectionName", "books-collection" },

                { "bookQuery:connectionString", "mongodb://bnu-vtec012:27017" },
                { "bookQuery:dbName", "books-db" },
                { "bookQuery:collectionName", "books-collection" },
            };
        }
    }
}
