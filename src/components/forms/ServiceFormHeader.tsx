
import { CardHeader, CardTitle } from '@/components/ui/card';
import { getServiceTitle } from './ServiceFormConstants';

interface ServiceFormHeaderProps {
  serviceType: string;
}

const ServiceFormHeader = ({ serviceType }: ServiceFormHeaderProps) => {
  return (
    <CardHeader className="text-center space-y-2">
      <CardTitle className="text-xl sm:text-2xl text-yemen-blue">
        {getServiceTitle(serviceType)}
      </CardTitle>
    </CardHeader>
  );
};

export default ServiceFormHeader;
