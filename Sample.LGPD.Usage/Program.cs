using Benner.LGPD;
using System;

namespace Sample.LGPD.Usage
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var repository = new Repository())
            {
                repository.Write(new Record
                {
                    AccessTimestamp = DateTime.Now,
                    AccessUsername = "abalóda!!!",
                    Details = new RecordDetails
                    {
                        Person =
                        {
                            {"CPF", "123.123.321-44" },
                            { "PASSPORT", "4444444" },
                        },
                        Fields = "EMAIL, SALARIO, ENDEREÇO",
                        Table = "DO_FUNCIONARIOS",
                    },
                });
            }
        }
    }
}
