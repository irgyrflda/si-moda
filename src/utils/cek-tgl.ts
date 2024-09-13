export const cekTgl = (dateTimeString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
  
    if (!regex.test(dateTimeString)) {
      return false;
    }
  
    const date = new Date(dateTimeString.replace(' ', 'T'));
  
    return date instanceof Date && !isNaN(date.getTime());
}