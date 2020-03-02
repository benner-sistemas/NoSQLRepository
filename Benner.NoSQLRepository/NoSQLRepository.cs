using Benner.NoSQLRepository.Interfaces;
using System;
using System.Collections.Generic;

namespace Benner.NoSQLRepository
{
    public abstract class NoSQLRepository<Record, Filter> : IDisposable
    {
        /// <summary>
        /// Writer, responsável por gravar os dados
        /// </summary>
        private readonly INoSQLCommand<Record> _command;

        /// <summary>
        /// Reader, responsável por ler os dados de acordo com o filtro
        /// </summary>
        private readonly INoSQLQuery<Record, Filter> _query;

        protected NoSQLRepository(INoSQLCommand<Record> command, INoSQLQuery<Record, Filter> query)
        {
            _command = command;
            _query = query;
        }

        /// <summary>
        /// Método que chama o Write do INoSQLCommand
        /// </summary>
        /// <param name="value"></param>
        public virtual void Write(Record value)
        {
            _command.Write(value);
        }

        /// <summary>
        /// Método que chama o Read do INoSQLQuery
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public virtual List<Record> Read(Filter filter)
        {
            return _query.Read(filter);
        }

        public void Dispose()
        {
            if (_command is IDisposable disposableCommand)
                disposableCommand.Dispose();

            if (_query is IDisposable disposableQuery)
                disposableQuery.Dispose();
        }
    }
}