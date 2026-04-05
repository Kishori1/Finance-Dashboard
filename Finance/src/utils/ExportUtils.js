/**
 * Utility to export transaction data as CSV or JSON
 */

export const exportToCSV = (data, filename = 'transactions_export.csv') => {
    if (!data || !data.length) return;
    
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const csvRows = [
      headers.join(','),
      ...data.map(row => [
        row.date,
        `"${row.description.replace(/"/g, '""')}"`,
        row.category,
        row.amount,
        row.type
      ].join(','))
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'transactions_export.json') => {
    if (!data || !data.length) return;
    
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
