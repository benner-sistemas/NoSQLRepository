using System.Collections.Generic;

namespace Benner.NoSQLRepository.Interfaces
{
    public interface IConfigurable
    {
        void Configure(Dictionary<string, string> options);
    }
}