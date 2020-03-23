using Benner.NoSQLRepository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Benner.LGPD
{

    public interface ILGPDConfiguration : INoSQLConfiguration
    {
        TracerLevel Level { get; set; }
    }
    public enum TracerLevel
    {
        Disable,
        Full
    }
}
