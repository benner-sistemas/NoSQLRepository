using Benner.NoSQLRepository.Interfaces;
using MongoDB.Driver;
using System.Collections.Generic;

namespace MongoDBCommandAndQuery
{
    public class BookCommandMongo : INoSQLCommand<BookRecord>
    {
        private Dictionary<string, string> _settings;
        private IMongoCollection<BookRecord> _collection;

        public void Configure(Dictionary<string, string> options)
        {
            _settings = options;
        }

        public void Dispose()
        {
            _collection = null;
        }

        public void Write(BookRecord value)
        {
            EnsureCollection();
            _collection.InsertOne(value);
        }

        private void EnsureCollection()
        {
            if (_collection != null)
                return;

            var client = new MongoClient(_settings["bookCommand:connectionString"]);
            var db = client.GetDatabase(_settings["bookCommand:dbName"]);
            _collection = db.GetCollection<BookRecord>(_settings["bookCommand:collectionName"]);
        }
    }
}
