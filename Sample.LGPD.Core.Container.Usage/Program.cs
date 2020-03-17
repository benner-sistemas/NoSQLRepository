using Benner.LGPD;
using Benner.LGPDRepository.Core;
using Benner.NoSQLRepository;
using Benner.NoSQLRepository.Interfaces;
namespace Sample.LGPD.Core.Container.Usage
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var repository = new Repository(new Command(), new EmptyQuery(), new ContainerConfig()))
            {

                repository.Write(new Record
                {
                    AccessUsername = "jose.silva.default",
                    Details = new RecordDetails
                    {
                        Person = {
                                { "CPF", "111.111.111-11" },
                                { "PASSPORT", "IEY5AHXA" },
                            },
                        Fields = "EMAIL, SALARIO, ENDEREÇO",
                        Table = "DO_FUNCIONARIOS",
                    },
                });
            }
        }
    }
}
