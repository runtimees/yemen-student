
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface RequestTrackingFormProps {
  onSubmit: (requestNumber: string) => Promise<void>;
  isLoading: boolean;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

const RequestTrackingForm = ({ onSubmit, isLoading, isLoggedIn, onLoginRequired }: RequestTrackingFormProps) => {
  const [requestNumber, setRequestNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    
    await onSubmit(requestNumber);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg sm:text-xl">استعلام عن حالة الطلب</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="requestNumber">رقم الطلب</Label>
              <Input
                id="requestNumber"
                placeholder="أدخل رقم الطلب"
                value={requestNumber}
                onChange={(e) => setRequestNumber(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-yemen-blue hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري البحث...
                </>
              ) : (
                'استعلام'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestTrackingForm;
