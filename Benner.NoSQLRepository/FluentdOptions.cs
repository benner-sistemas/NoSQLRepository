namespace Benner.NoSQLRepository
{
    public class FluentdOptions
    {
        public string Host { get; set; }
        public int Port { get; set; } = 24224;
        public string Tag { get; set; }
    }
}
