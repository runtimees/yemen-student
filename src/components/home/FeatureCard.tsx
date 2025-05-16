
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

const FeatureCard = ({ title, description, icon, link }: FeatureCardProps) => {
  return (
    <Link to={link}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 bg-white border-yemen-blue hover:border-yemen-red">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-yemen-black text-white rounded-full">
              <span className="text-2xl">{icon}</span>
            </div>
          </div>
          <CardTitle className="text-center text-lg font-bold text-yemen-black">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeatureCard;
