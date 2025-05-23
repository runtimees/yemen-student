
export const translateStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'submitted': 'تم استلام الطلب',
    'under_review': 'قيد المراجعة',
    'processing': 'قيد المعالجة',
    'approved': 'تمت الموافقة',
    'rejected': 'تم الرفض'
  };
  
  return statusMap[status] || status;
};

export const translateServiceType = (serviceType: string): string => {
  const serviceMap: Record<string, string> = {
    'certificate_authentication': 'توثيق الشهادات',
    'certificate_documentation': 'توثيق الوثائق',
    'ministry_authentication': 'توثيق وزاري',
    'passport_renewal': 'تجديد جواز السفر',
    'visa_request': 'طلب تأشيرة'
  };
  
  return serviceMap[serviceType] || serviceType;
};

export const getStatusColor = (status: string, isComplete: boolean): string => {
  if (!isComplete) return 'bg-gray-300';
  
  const colorMap: Record<string, string> = {
    'تم استلام الطلب': 'bg-blue-500',
    'قيد المراجعة': 'bg-yellow-500',
    'قيد المعالجة': 'bg-orange-500',
    'تمت الموافقة': 'bg-green-500',
    'تم الرفض': 'bg-red-500'
  };
  
  return colorMap[status] || 'bg-gray-300';
};

export const generateStatusTimeline = (requestData: any) => {
  const statusOrder = ['submitted', 'under_review', 'processing', 'approved', 'rejected'];
  const currentStatusIndex = statusOrder.indexOf(requestData.status);
  
  return statusOrder.map((status, index) => {
    let statusDate = '';
    let isComplete = false;
    
    if (status === 'submitted') {
      statusDate = new Date(requestData.created_at).toLocaleDateString('ar-SA');
      isComplete = true;
    } else if (index <= currentStatusIndex && currentStatusIndex !== -1) {
      statusDate = new Date().toLocaleDateString('ar-SA');
      isComplete = true;
    } else {
      statusDate = 'في الانتظار';
      isComplete = false;
    }
    
    if (requestData.status === 'rejected' && status === 'rejected') {
      statusDate = new Date().toLocaleDateString('ar-SA');
      isComplete = true;
    } else if (requestData.status === 'rejected' && ['processing', 'approved'].includes(status)) {
      statusDate = 'تم الرفض';
      isComplete = false;
    }
    
    return {
      status: translateStatus(status),
      date: statusDate,
      complete: isComplete
    };
  });
};
