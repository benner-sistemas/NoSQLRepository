using System.Collections.Generic;

namespace Benner.NoSQLRepository.Interfaces
{
    public interface INoSQLConfiguration
    {
        Dictionary<string, string> Settings { get; set; }
        void LoadSettings();
    }
}