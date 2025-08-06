import Papa from 'papaparse';

export function exportTransactionsToCSV(transactions) {
  if (!transactions || transactions.length === 0) return;

  function formatDate(date) {
    let d;
    if (date && typeof date === 'object' && 'seconds' in date) {
      d = new Date(date.seconds * 1000);
    } else if (typeof date === 'string' || typeof date === 'number') {
      d = new Date(date);
    } else {
      return '';
    }
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const data = transactions.map(tx => ({
    Date: formatDate(tx.date),
    Type: tx.type,
    Category: tx.category,
    Amount: tx.amount,
    Note: tx.note || '',
  }));

  const csv = Papa.unparse(data);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
