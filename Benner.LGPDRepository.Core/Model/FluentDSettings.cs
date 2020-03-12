namespace Benner.LGPDRepository.Core.Model
{
    public class FluentDSettings
    {
        /// <summary>
        /// FluentD host
        /// </summary>
        public string Host { get; set; }

        /// <summary>
        /// FluentD port
        /// </summary>
        public string Port { get; set; }

        /// <summary>
        /// FluentD Tag (match name).
        /// </summary>
        public string Tag { get; set; }
    }
}