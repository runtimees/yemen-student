
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const countryCodes = [
  { code: '+93', country: 'أفغانستان', flag: '🇦🇫' },
  { code: '+355', country: 'ألبانيا', flag: '🇦🇱' },
  { code: '+213', country: 'الجزائر', flag: '🇩🇿' },
  { code: '+1684', country: 'ساموا الأمريكية', flag: '🇦🇸' },
  { code: '+376', country: 'أندورا', flag: '🇦🇩' },
  { code: '+244', country: 'أنغولا', flag: '🇦🇴' },
  { code: '+1264', country: 'أنغويلا', flag: '🇦🇮' },
  { code: '+1268', country: 'أنتيغوا وبربودا', flag: '🇦🇬' },
  { code: '+54', country: 'الأرجنتين', flag: '🇦🇷' },
  { code: '+374', country: 'أرمينيا', flag: '🇦🇲' },
  { code: '+297', country: 'أروبا', flag: '🇦🇼' },
  { code: '+61', country: 'أستراليا', flag: '🇦🇺' },
  { code: '+43', country: 'النمسا', flag: '🇦🇹' },
  { code: '+994', country: 'أذربيجان', flag: '🇦🇿' },
  { code: '+1242', country: 'الباهاما', flag: '🇧🇸' },
  { code: '+973', country: 'البحرين', flag: '🇧🇭' },
  { code: '+880', country: 'بنغلاديش', flag: '🇧🇩' },
  { code: '+1246', country: 'بربادوس', flag: '🇧🇧' },
  { code: '+375', country: 'بيلاروسيا', flag: '🇧🇾' },
  { code: '+32', country: 'بلجيكا', flag: '🇧🇪' },
  { code: '+501', country: 'بليز', flag: '🇧🇿' },
  { code: '+229', country: 'بنين', flag: '🇧🇯' },
  { code: '+1441', country: 'برمودا', flag: '🇧🇲' },
  { code: '+975', country: 'بوتان', flag: '🇧🇹' },
  { code: '+591', country: 'بوليفيا', flag: '🇧🇴' },
  { code: '+387', country: 'البوسنة والهرسك', flag: '🇧🇦' },
  { code: '+267', country: 'بوتسوانا', flag: '🇧🇼' },
  { code: '+55', country: 'البرازيل', flag: '🇧🇷' },
  { code: '+673', country: 'بروناي', flag: '🇧🇳' },
  { code: '+359', country: 'بلغاريا', flag: '🇧🇬' },
  { code: '+226', country: 'بوركينا فاسو', flag: '🇧🇫' },
  { code: '+257', country: 'بوروندي', flag: '🇧🇮' },
  { code: '+855', country: 'كمبوديا', flag: '🇰🇭' },
  { code: '+237', country: 'الكاميرون', flag: '🇨🇲' },
  { code: '+1', country: 'كندا', flag: '🇨🇦' },
  { code: '+238', country: 'الرأس الأخضر', flag: '🇨🇻' },
  { code: '+1345', country: 'جزر كايمان', flag: '🇰🇾' },
  { code: '+236', country: 'جمهورية أفريقيا الوسطى', flag: '🇨🇫' },
  { code: '+235', country: 'تشاد', flag: '🇹🇩' },
  { code: '+56', country: 'تشيلي', flag: '🇨🇱' },
  { code: '+86', country: 'الصين', flag: '🇨🇳' },
  { code: '+57', country: 'كولومبيا', flag: '🇨🇴' },
  { code: '+269', country: 'جزر القمر', flag: '🇰🇲' },
  { code: '+242', country: 'الكونغو', flag: '🇨🇬' },
  { code: '+243', country: 'جمهورية الكونغو الديمقراطية', flag: '🇨🇩' },
  { code: '+682', country: 'جزر كوك', flag: '🇨🇰' },
  { code: '+506', country: 'كوستاريكا', flag: '🇨🇷' },
  { code: '+225', country: 'ساحل العاج', flag: '🇨🇮' },
  { code: '+385', country: 'كرواتيا', flag: '🇭🇷' },
  { code: '+53', country: 'كوبا', flag: '🇨🇺' },
  { code: '+357', country: 'قبرص', flag: '🇨🇾' },
  { code: '+420', country: 'التشيك', flag: '🇨🇿' },
  { code: '+45', country: 'الدنمارك', flag: '🇩🇰' },
  { code: '+253', country: 'جيبوتي', flag: '🇩🇯' },
  { code: '+1767', country: 'دومينيكا', flag: '🇩🇲' },
  { code: '+1809', country: 'جمهورية الدومينيكان', flag: '🇩🇴' },
  { code: '+593', country: 'الإكوادور', flag: '🇪🇨' },
  { code: '+20', country: 'مصر', flag: '🇪🇬' },
  { code: '+503', country: 'السلفادور', flag: '🇸🇻' },
  { code: '+240', country: 'غينيا الاستوائية', flag: '🇬🇶' },
  { code: '+291', country: 'إريتريا', flag: '🇪🇷' },
  { code: '+372', country: 'إستونيا', flag: '🇪🇪' },
  { code: '+251', country: 'إثيوبيا', flag: '🇪🇹' },
  { code: '+500', country: 'جزر فوكلاند', flag: '🇫🇰' },
  { code: '+298', country: 'جزر فاروس', flag: '🇫🇴' },
  { code: '+679', country: 'فيجي', flag: '🇫🇯' },
  { code: '+358', country: 'فنلندا', flag: '🇫🇮' },
  { code: '+33', country: 'فرنسا', flag: '🇫🇷' },
  { code: '+594', country: 'غويانا الفرنسية', flag: '🇬🇫' },
  { code: '+689', country: 'بولينيزيا الفرنسية', flag: '🇵🇫' },
  { code: '+241', country: 'الغابون', flag: '🇬🇦' },
  { code: '+220', country: 'غامبيا', flag: '🇬🇲' },
  { code: '+995', country: 'جورجيا', flag: '🇬🇪' },
  { code: '+49', country: 'ألمانيا', flag: '🇩🇪' },
  { code: '+233', country: 'غانا', flag: '🇬🇭' },
  { code: '+350', country: 'جبل طارق', flag: '🇬🇮' },
  { code: '+30', country: 'اليونان', flag: '🇬🇷' },
  { code: '+299', country: 'غرينلاند', flag: '🇬🇱' },
  { code: '+1473', country: 'غرينادا', flag: '🇬🇩' },
  { code: '+590', country: 'غوادلوب', flag: '🇬🇵' },
  { code: '+1671', country: 'غوام', flag: '🇬🇺' },
  { code: '+502', country: 'غواتيمالا', flag: '🇬🇹' },
  { code: '+224', country: 'غينيا', flag: '🇬🇳' },
  { code: '+245', country: 'غينيا بيساو', flag: '🇬🇼' },
  { code: '+592', country: 'غيانا', flag: '🇬🇾' },
  { code: '+509', country: 'هايتي', flag: '🇭🇹' },
  { code: '+504', country: 'هندوراس', flag: '🇭🇳' },
  { code: '+852', country: 'هونغ كونغ', flag: '🇭🇰' },
  { code: '+36', country: 'المجر', flag: '🇭🇺' },
  { code: '+354', country: 'أيسلندا', flag: '🇮🇸' },
  { code: '+91', country: 'الهند', flag: '🇮🇳' },
  { code: '+62', country: 'إندونيسيا', flag: '🇮🇩' },
  { code: '+98', country: 'إيران', flag: '🇮🇷' },
  { code: '+964', country: 'العراق', flag: '🇮🇶' },
  { code: '+353', country: 'أيرلندا', flag: '🇮🇪' },
  { code: '+972', country: 'إسرائيل', flag: '🇮🇱' },
  { code: '+39', country: 'إيطاليا', flag: '🇮🇹' },
  { code: '+1876', country: 'جامايكا', flag: '🇯🇲' },
  { code: '+81', country: 'اليابان', flag: '🇯🇵' },
  { code: '+962', country: 'الأردن', flag: '🇯🇴' },
  { code: '+7', country: 'كازاخستان', flag: '🇰🇿' },
  { code: '+254', country: 'كينيا', flag: '🇰🇪' },
  { code: '+686', country: 'كيريباتي', flag: '🇰🇮' },
  { code: '+850', country: 'كوريا الشمالية', flag: '🇰🇵' },
  { code: '+82', country: 'كوريا الجنوبية', flag: '🇰🇷' },
  { code: '+965', country: 'الكويت', flag: '🇰🇼' },
  { code: '+996', country: 'قيرغيزستان', flag: '🇰🇬' },
  { code: '+856', country: 'لاوس', flag: '🇱🇦' },
  { code: '+371', country: 'لاتفيا', flag: '🇱🇻' },
  { code: '+961', country: 'لبنان', flag: '🇱🇧' },
  { code: '+266', country: 'ليسوتو', flag: '🇱🇸' },
  { code: '+231', country: 'ليبيريا', flag: '🇱🇷' },
  { code: '+218', country: 'ليبيا', flag: '🇱🇾' },
  { code: '+423', country: 'ليختنشتاين', flag: '🇱🇮' },
  { code: '+370', country: 'ليتوانيا', flag: '🇱🇹' },
  { code: '+352', country: 'لوكسمبورغ', flag: '🇱🇺' },
  { code: '+853', country: 'ماكاو', flag: '🇲🇴' },
  { code: '+389', country: 'مقدونيا الشمالية', flag: '🇲🇰' },
  { code: '+261', country: 'مدغشقر', flag: '🇲🇬' },
  { code: '+265', country: 'مالاوي', flag: '🇲🇼' },
  { code: '+60', country: 'ماليزيا', flag: '🇲🇾' },
  { code: '+960', country: 'المالديف', flag: '🇲🇻' },
  { code: '+223', country: 'مالي', flag: '🇲🇱' },
  { code: '+356', country: 'مالطا', flag: '🇲🇹' },
  { code: '+692', country: 'جزر مارشال', flag: '🇲🇭' },
  { code: '+596', country: 'مارتينيك', flag: '🇲🇶' },
  { code: '+222', country: 'موريتانيا', flag: '🇲🇷' },
  { code: '+230', country: 'موريشيوس', flag: '🇲🇺' },
  { code: '+52', country: 'المكسيك', flag: '🇲🇽' },
  { code: '+691', country: 'ميكرونيزيا', flag: '🇫🇲' },
  { code: '+373', country: 'مولدوفا', flag: '🇲🇩' },
  { code: '+377', country: 'موناكو', flag: '🇲🇨' },
  { code: '+976', country: 'منغوليا', flag: '🇲🇳' },
  { code: '+382', country: 'الجبل الأسود', flag: '🇲🇪' },
  { code: '+1664', country: 'مونتسيرات', flag: '🇲🇸' },
  { code: '+212', country: 'المغرب', flag: '🇲🇦' },
  { code: '+258', country: 'موزمبيق', flag: '🇲🇿' },
  { code: '+95', country: 'ميانمار', flag: '🇲🇲' },
  { code: '+264', country: 'ناميبيا', flag: '🇳🇦' },
  { code: '+674', country: 'ناورو', flag: '🇳🇷' },
  { code: '+977', country: 'نيبال', flag: '🇳🇵' },
  { code: '+31', country: 'هولندا', flag: '🇳🇱' },
  { code: '+64', country: 'نيوزيلندا', flag: '🇳🇿' },
  { code: '+505', country: 'نيكاراغوا', flag: '🇳🇮' },
  { code: '+227', country: 'النيجر', flag: '🇳🇪' },
  { code: '+234', country: 'نيجيريا', flag: '🇳🇬' },
  { code: '+683', country: 'نيوي', flag: '🇳🇺' },
  { code: '+47', country: 'النرويج', flag: '🇳🇴' },
  { code: '+968', country: 'عمان', flag: '🇴🇲' },
  { code: '+92', country: 'باكستان', flag: '🇵🇰' },
  { code: '+680', country: 'بالاو', flag: '🇵🇼' },
  { code: '+970', country: 'فلسطين', flag: '🇵🇸' },
  { code: '+507', country: 'بنما', flag: '🇵🇦' },
  { code: '+675', country: 'بابوا غينيا الجديدة', flag: '🇵🇬' },
  { code: '+595', country: 'باراغواي', flag: '🇵🇾' },
  { code: '+51', country: 'بيرو', flag: '🇵🇪' },
  { code: '+63', country: 'الفلبين', flag: '🇵🇭' },
  { code: '+48', country: 'بولندا', flag: '🇵🇱' },
  { code: '+351', country: 'البرتغال', flag: '🇵🇹' },
  { code: '+1787', country: 'بورتوريكو', flag: '🇵🇷' },
  { code: '+974', country: 'قطر', flag: '🇶🇦' },
  { code: '+262', country: 'ريونيون', flag: '🇷🇪' },
  { code: '+40', country: 'رومانيا', flag: '🇷🇴' },
  { code: '+7', country: 'روسيا', flag: '🇷🇺' },
  { code: '+250', country: 'رواندا', flag: '🇷🇼' },
  { code: '+290', country: 'سانت هيلينا', flag: '🇸🇭' },
  { code: '+1869', country: 'سانت كيتس ونيفيس', flag: '🇰🇳' },
  { code: '+1758', country: 'سانت لوسيا', flag: '🇱🇨' },
  { code: '+508', country: 'سان بيير وميكلون', flag: '🇵🇲' },
  { code: '+1784', country: 'سانت فينسنت والغرينادين', flag: '🇻🇨' },
  { code: '+685', country: 'ساموا', flag: '🇼🇸' },
  { code: '+378', country: 'سان مارينو', flag: '🇸🇲' },
  { code: '+239', country: 'ساو تومي وبرينسيبي', flag: '🇸🇹' },
  { code: '+966', country: 'السعودية', flag: '🇸🇦' },
  { code: '+221', country: 'السنغال', flag: '🇸🇳' },
  { code: '+381', country: 'صربيا', flag: '🇷🇸' },
  { code: '+248', country: 'سيشل', flag: '🇸🇨' },
  { code: '+232', country: 'سيراليون', flag: '🇸🇱' },
  { code: '+65', country: 'سنغافورة', flag: '🇸🇬' },
  { code: '+421', country: 'سلوفاكيا', flag: '🇸🇰' },
  { code: '+386', country: 'سلوفينيا', flag: '🇸🇮' },
  { code: '+677', country: 'جزر سليمان', flag: '🇸🇧' },
  { code: '+252', country: 'الصومال', flag: '🇸🇴' },
  { code: '+27', country: 'جنوب أفريقيا', flag: '🇿🇦' },
  { code: '+211', country: 'جنوب السودان', flag: '🇸🇸' },
  { code: '+34', country: 'إسبانيا', flag: '🇪🇸' },
  { code: '+94', country: 'سريلانكا', flag: '🇱🇰' },
  { code: '+249', country: 'السودان', flag: '🇸🇩' },
  { code: '+597', country: 'سورينام', flag: '🇸🇷' },
  { code: '+268', country: 'إسواتيني', flag: '🇸🇿' },
  { code: '+46', country: 'السويد', flag: '🇸🇪' },
  { code: '+41', country: 'سويسرا', flag: '🇨🇭' },
  { code: '+963', country: 'سوريا', flag: '🇸🇾' },
  { code: '+886', country: 'تايوان', flag: '🇹🇼' },
  { code: '+992', country: 'طاجيكستان', flag: '🇹🇯' },
  { code: '+255', country: 'تنزانيا', flag: '🇹🇿' },
  { code: '+66', country: 'تايلاند', flag: '🇹🇭' },
  { code: '+670', country: 'تيمور الشرقية', flag: '🇹🇱' },
  { code: '+228', country: 'توغو', flag: '🇹🇬' },
  { code: '+690', country: 'توكيلاو', flag: '🇹🇰' },
  { code: '+676', country: 'تونغا', flag: '🇹🇴' },
  { code: '+1868', country: 'ترينيداد وتوباغو', flag: '🇹🇹' },
  { code: '+216', country: 'تونس', flag: '🇹🇳' },
  { code: '+90', country: 'تركيا', flag: '🇹🇷' },
  { code: '+993', country: 'تركمانستان', flag: '🇹🇲' },
  { code: '+1649', country: 'جزر تركس وكايكوس', flag: '🇹🇨' },
  { code: '+688', country: 'توفالو', flag: '🇹🇻' },
  { code: '+256', country: 'أوغندا', flag: '🇺🇬' },
  { code: '+380', country: 'أوكرانيا', flag: '🇺🇦' },
  { code: '+971', country: 'الإمارات', flag: '🇦🇪' },
  { code: '+44', country: 'المملكة المتحدة', flag: '🇬🇧' },
  { code: '+1', country: 'الولايات المتحدة', flag: '🇺🇸' },
  { code: '+598', country: 'أوروغواي', flag: '🇺🇾' },
  { code: '+998', country: 'أوزبكستان', flag: '🇺🇿' },
  { code: '+678', country: 'فانواتو', flag: '🇻🇺' },
  { code: '+379', country: 'الفاتيكان', flag: '🇻🇦' },
  { code: '+58', country: 'فنزويلا', flag: '🇻🇪' },
  { code: '+84', country: 'فيتنام', flag: '🇻🇳' },
  { code: '+1284', country: 'جزر العذراء البريطانية', flag: '🇻🇬' },
  { code: '+1340', country: 'جزر العذراء الأمريكية', flag: '🇻🇮' },
  { code: '+681', country: 'واليس وفوتونا', flag: '🇼🇫' },
  { code: '+212', country: 'الصحراء الغربية', flag: '🇪🇭' },
  { code: '+967', country: 'اليمن', flag: '🇾🇪' },
  { code: '+260', country: 'زامبيا', flag: '🇿🇲' },
  { code: '+263', country: 'زيمبابوي', flag: '🇿🇼' },
];

export const PhoneInput = ({ value, onChange, className, placeholder }: PhoneInputProps) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('+964');
  const [phoneNumber, setPhoneNumber] = useState('');

  React.useEffect(() => {
    if (value) {
      const country = countryCodes.find(c => value.startsWith(c.code));
      if (country) {
        setSelectedCountryCode(country.code);
        setPhoneNumber(value.substring(country.code.length));
      }
    }
  }, [value]);

  const handleCountryCodeChange = (newCode: string) => {
    setSelectedCountryCode(newCode);
    onChange(newCode + phoneNumber);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(newNumber);
    onChange(selectedCountryCode + newNumber);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={selectedCountryCode} onValueChange={handleCountryCodeChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-60 overflow-y-auto">
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span className="text-xs">{country.code}</span>
                <span className="text-xs text-muted-foreground">{country.country}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        placeholder={placeholder || "رقم الهاتف"}
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        className="flex-1"
      />
    </div>
  );
};
