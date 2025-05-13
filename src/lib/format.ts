
export const formatCurrency = (value: number | string | undefined) => {
  if (value === undefined || value === null) return 'R$ 0,00';
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

export const formatMileage = (value: number | string | undefined) => {
  if (value === undefined || value === null) return '0 km';
  
  // If it's a string, sanitize it by removing dots and replacing commas with dots
  let numValue;
  if (typeof value === 'string') {
    // Remove all non-numeric characters except digits and dots/commas
    const sanitizedValue = value.replace(/[^\d.,]/g, '');
    // Replace dots with nothing (they are thousand separators in pt-BR)
    // Replace comma with dot (decimal separator in pt-BR)
    const normalizedValue = sanitizedValue.replace(/\./g, '').replace(',', '.');
    numValue = parseFloat(normalizedValue);
    
    // If parsing failed, return 0
    if (isNaN(numValue)) {
      numValue = 0;
    }
  } else {
    numValue = value;
  }
  
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 0
  }).format(numValue) + ' km';
};

export const formatDate = (isoDate: string) => {
  if (!isoDate) return '';
  
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return isoDate;
  }
};

export const formatPhone = (phone: string) => {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const numericPhone = phone.replace(/\D/g, '');
  
  // Handle different formats based on length
  if (numericPhone.length === 11) {
    // Format as (XX) XXXXX-XXXX (with 9 digit)
    return `(${numericPhone.slice(0, 2)}) ${numericPhone.slice(2, 7)}-${numericPhone.slice(7)}`;
  } else if (numericPhone.length === 10) {
    // Format as (XX) XXXX-XXXX
    return `(${numericPhone.slice(0, 2)}) ${numericPhone.slice(2, 6)}-${numericPhone.slice(6)}`;
  }
  
  // Return original if format unknown
  return phone;
};
