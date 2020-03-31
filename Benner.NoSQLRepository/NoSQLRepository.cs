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

        protected NoSQLRepository(INoSQLCommand<Record> command, INoSQLQuery<Record, Filter> query, INoSQLConfiguration configuration)
        {
            _command = command ?? throw new ArgumentNullException(nameof(command));
            _query = query ?? throw new ArgumentNullException(nameof(query));
            var config = configuration ?? throw new ArgumentNullException(nameof(configuration));

            config.LoadSettings();

            var settings = new Dictionary<string, string>(config.Settings, StringComparer.InvariantCultureIgnoreCase);
            _command.Configure(settings);
            _query.Configure(settings);
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
            try
            {
                if (_command is IDisposable disposableCommand)
                    try { disposableCommand.Dispose(); } catch { /*ignore errors*/ }

                if (_query is IDisposable disposableQuery)
                    try { disposableQuery.Dispose(); } catch { /*ignore errors*/ }
            }
            finally
            {
                Disposed = true;
            }
        }

        /// <summary>
        /// Indica se esta instância já foi liberada
        /// </summary>
        public bool Disposed { get; private set; } = false;
    }
}