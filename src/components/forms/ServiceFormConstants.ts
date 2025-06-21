
export const serviceNames = {
  certificate_authentication: 'توثيق الشهادات',
  certificate_documentation: 'توثيق الوثائق',
  ministry_authentication: 'التوثيق من الوزارة',
  passport_renewal: 'تجديد الجواز',
  visa_request: 'طلب فيزا',
};

export const getFileFieldLabel = (serviceType: string) => {
  switch (serviceType) {
    case 'passport_renewal':
      return 'صورة الجواز (PDF)';
    case 'visa_request':
      return 'صورة الجواز (PDF)';
    case 'certificate_authentication':
    case 'certificate_documentation':
    case 'ministry_authentication':
      return 'صورة الشهادة (PDF)';
    default:
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
  console.log('Service type received:', serviceType);
  const title = serviceNames[serviceType as keyof typeof serviceNames];
  console.log('Mapped title:', title);
  return title || 'خدمة غير محددة';
};

export const validateFileSize = (file: File) => {
  const maxSize = 1 * 1024 * 1024; // Changed to 1MB
  console.log('File size:', file.size, 'bytes');
  console.log('Max allowed size:', maxSize, 'bytes');
  console.log('File size in MB:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  return file.size <= maxSize;
};
