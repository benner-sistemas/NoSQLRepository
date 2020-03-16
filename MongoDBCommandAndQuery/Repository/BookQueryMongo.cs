using Benner.NoSQLRepository.Interfaces;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Collections.Generic;

namespace MongoDBCommandAndQuery
{
    public class BookQueryMongo : INoSQLQuery<BookRecord, BookFilter>
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

        public List<BookRecord> Read(BookFilter filter)
        {
            EnsureCollection();

            var filterBuilder = Builders<BookRecord>.Filter;

            FilterDefinition<BookRecord> dbFilter = null;
            foreach (var param in filter.Params)
                if (dbFilter == null)
                    dbFilter = filterBuilder.Regex(param.Key, new BsonRegularExpression($".*{param.Value}.*"));
                else
                    dbFilter = dbFilter & filterBuilder.Regex(param.Key, new BsonRegularExpression($".*{param.Value}.*"));


            var result = new List<BookRecord>();
            using (var cursor = _collection.FindAsync(dbFilter ?? filterBuilder.Empty).Result)
                while (cursor.MoveNextAsync().Result)
                    result.AddRange(cursor.Current);


            return result;
        }
        private void EnsureCollection()
        {
            if (_collection != null)
                return;

            var client = new MongoClient(_settings["bookQuery:connectionString"]);
            var db = client.GetDatabase(_settings["bookQuery:dbName"]);
            _collection = db.GetCollection<BookRecord>(_settings["bookQuery:collectionName"]);
        }
    }
}
