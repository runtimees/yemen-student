
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FormActionsProps {
  isSubmitting: boolean;
}

const FormActions = ({ isSubmitting }: FormActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-4">
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:flex-1 bg-yemen-blue hover:bg-blue-700 text-white"
      >
        {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/services')}
        disabled={isSubmitting}
        className="w-full sm:w-auto px-6"
      >
        إلغاء
      </Button>
    </div>
  );
};

export default FormActions;
