using Benner.LGPD;
using Benner.NoSQLRepository;

namespace Sample.LGPD.Container.Usage
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var repository = new Repository(config: new ContainerConfig()))
                repository.Write(new Record
                {
                    AccessUsername = "jose.silva.default",
                    AccessIP = "127.0.0.1",
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
