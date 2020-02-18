using Ninject;
using System.Collections.Generic;
using TemplateSolution.Interfaces;
using TemplateSolution.Tests;

namespace TemplateSolution
{
    public abstract class NoSQLRepository<Record, Filter>
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
        /// Método que chama o Reed do INoSQLQuery
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        public virtual List<Record> Read(Filter filter)
        {
            return _query.Read(filter);
        }
    }
}