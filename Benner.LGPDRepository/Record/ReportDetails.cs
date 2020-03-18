namespace Benner.LGPD.Record
{
    public class ReportDetails : IRecordDetails
    {
        /// <summary>
        /// Nome do relatório
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        /// Código do relatório
        /// </summary>
        public string Codigo { get; set; }
    }
}
