using System;

namespace Benner.NoSQLRepository.Interfaces
{
    /// <summary>
    /// Interface responsável por declarar o método Write, que escreve um dado genérico.
    /// </summary>
    /// <typeparam name="T">Tipo genérico, retorno do método write.</typeparam>
    public interface INoSQLCommand<T> : IConfigurable, IDisposable
    {
        void Write(T value);
    }
}