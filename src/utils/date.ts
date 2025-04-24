import { format, parseISO } from 'date-fns';

export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error parsing date:', error);
    return dateString;
  }
};

export const formatDateTime = (dateString: string, timeString?: string): string => {
  try {
    const date = parseISO(dateString);
    const formattedDate = format(date, 'dd/MM/yyyy');
    return timeString ? `${formattedDate} ${timeString}` : formattedDate;
  } catch (error) {
    console.error('Error parsing date:', error);
    return timeString ? `${dateString} ${timeString}` : dateString;
  }
}; 