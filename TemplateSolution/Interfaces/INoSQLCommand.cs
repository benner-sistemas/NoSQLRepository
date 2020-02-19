namespace Benner.NoSQLRepository.Interfaces
{
    /// <summary>
    /// Interface responsável por declarar o método Read, que lê um dado genérico de acordo com o filtro passado.
    /// </summary>
    /// <typeparam name="T">Tipo genérico, retorno do método read.</typeparam>
    /// <typeparam name="F">Tipo Genérico, filtro</typeparam>
    public interface INoSQLCommand<T>
    {
        void Write(T value);
    }
}