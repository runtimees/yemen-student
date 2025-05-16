
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
}

const Captcha = ({ onVerify }: CaptchaProps) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setError(false);
    setIsVerified(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const verifyCaptcha = () => {
    if (userInput === captchaText) {
      setIsVerified(true);
      onVerify(true);
      setError(false);
    } else {
      setError(true);
      onVerify(false);
      generateCaptcha();
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
      <div className="text-center">
        <Label className="block mb-2 font-medium">التحقق البشري</Label>
        <div className="mb-2 bg-gray-200 py-2 px-4 rounded-md flex justify-center items-center relative">
          <div className="select-none font-mono text-lg tracking-wider text-gray-800 relative" 
               style={{
                 background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M21.184 20c.357-.13.72-.264.888-.14.56.41 1.012.18 1.264-.23.25-.413.196-.98.844-1.134.648-.155 1.44.35 1.76.428.32.08.737.034.987-.43.25-.464.486-.965 1.18-.73.695.235 1.248.186 1.527-.63.278-.82.483-.53.63-.864.144-.334.395-.4.96-.263.56.134 1.236-.014 1.466-.582.23-.568.371-1.285.783-1.37.413-.086 1.006.12 1.213-.258.206-.377.26-.984.78-1.208.52-.224 1.185-.114 1.354-.5.17-.388.203-.878.63-1.01.428-.133.99-.194 1.23-.696.24-.5.236-1.15.77-1.24.535-.09 1.25.218 1.484-.122.234-.34.16-.85.6-1.07.44-.223 1.023-.304 1.324-.822.3-.518.396-1.256.89-1.402.494-.145 1.19.124 1.44-.663.25-.786.164-2 .63-2M0 20c.568-.228 1.06-.673 1.6-.928.54-.256.976-.324 1.213-.99.236-.665.133-1.43.724-1.735.592-.306 1.459-.03 1.924-.566.465-.537.385-1.312.952-1.55.567-.24 1.23.155 1.547-.523.317-.677.183-1.673.763-1.973.58-.3 1.5.056 1.76-.617.258-.673.077-1.597.63-1.913.553-.317 1.368-.075 1.686-.765.317-.69.142-1.64.68-1.963.537-.323 1.368-.032 1.774-.79.406-.76.284-1.852.907-2.187.624-.335 1.654.035 2.02-.748.366-.783.112-1.853.667-2.202C20.172.41 21.165.9 21.46.075c.297-.825.019-1.985.72-2.36.7-.375 1.728.208 2.596-.423.867-.63 1.145-2.228 2.43-2.368z\' fill=\'%23F2F4F8\' fill-rule=\'evenodd\' opacity=\'.2\'/%3E%3C/svg%3E") left center',
                 textShadow: '2px 2px 3px rgba(0,0,0,0.1)',
                 transformStyle: 'preserve-3d',
                 transform: 'perspective(500px) rotateY(-10deg)'
               }}
          >
            {captchaText}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-1"
            onClick={generateCaptcha}
            type="button"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="captcha-input">أدخل الرمز الموضح أعلاه</Label>
        <Input
          id="captcha-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className={`mt-1 ${error ? 'border-red-500' : ''}`}
          placeholder="أدخل النص من الصورة"
          disabled={isVerified}
        />
        {error && <p className="text-red-500 text-xs mt-1">الرمز غير صحيح. حاول مرة أخرى.</p>}
        {isVerified && <p className="text-green-500 text-xs mt-1">تم التحقق بنجاح!</p>}
      </div>
      {!isVerified && (
        <Button 
          onClick={verifyCaptcha} 
          className="w-full bg-yemen-blue hover:bg-blue-700"
          type="button"
        >
          تحقق
        </Button>
      )}
    </div>
  );
};

export default Captcha;
