using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Benner.LGPDRepository
{
    public class LGPDWriter : INoSQLCommand<LGPDRecord>
    {
        public void Write(LGPDRecord value)
        {
            FluentdWriter.Write(value);
        }
    }
}
