
export const serviceNames = {
  certificate_authentication: 'توثيق الشهادات',
  certificate_documentation: 'توثيق الوثائق',
  ministry_authentication: 'التوثيق من الوزارة',
  passport_renewal: 'تجديد الجواز',
  visa_request: 'طلب فيزا',
};

export const getFileFieldLabel = (serviceType: string) => {
  console.log('getFileFieldLabel called with serviceType:', serviceType);
  
  switch (serviceType) {
    case 'passport_renewal':
      console.log('Returning passport label for passport_renewal');
      return 'صورة الجواز (PDF)';
    case 'visa_request':
      console.log('Returning passport label for visa_request');
      return 'صورة الجواز (PDF)';
    case 'certificate_authentication':
    case 'certificate_documentation':
    case 'ministry_authentication':
      console.log('Returning certificate label for certificate service');
      return 'صورة الشهادة (PDF)';
    default:
      console.log('Returning default label for unknown service:', serviceType);
      return 'المستندات (PDF)';
  }
};

export const getFileAcceptType = (serviceType: string) => {
  switch (serviceType) {
    case 'passport_renewal':
    case 'certificate_authentication':
    case 'certificate_documentation':
    case 'ministry_authentication':
    case 'visa_request':
      return '.pdf';
    default:
      return '.pdf';
  }
};

export const getServiceTitle = (serviceType: string) => {
  console.log('getServiceTitle - Service type received:', serviceType);
  const title = serviceNames[serviceType as keyof typeof serviceNames];
  console.log('getServiceTitle - Mapped title:', title);
  return title || 'خدمة غير محددة';
};

export const validateFileSize = (file: File) => {
  const maxSize = 1 * 1024 * 1024; // 1MB
  console.log('File size:', file.size, 'bytes');
  console.log('Max allowed size:', maxSize, 'bytes');
  console.log('File size in MB:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  return file.size <= maxSize;
};
