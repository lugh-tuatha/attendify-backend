export function getWeekNumber(date: Date): number {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + firstJan.getDay() + 1) / 7);
}

export function formatDate(dateInput: string | Date, format: string): string {
  if (!dateInput) {
    return '';
  }

  const date: Date = (typeof dateInput === 'string') 
    ? new Date(dateInput + 'T00:00:00Z') 
    : dateInput;
  
  switch (format) {
    case 'MmmDdYyyy':
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      const day = date.getDate();
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      return `${monthNames[monthIndex]} ${day}, ${year}`;
    default:
      return 'Format not found';
  }
}