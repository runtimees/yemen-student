
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
  { code: '+964', country: 'العراق', flag: '🇮🇶' },
  { code: '+967', country: 'اليمن', flag: '🇾🇪' },
  { code: '+966', country: 'السعودية', flag: '🇸🇦' },
  { code: '+971', country: 'الإمارات', flag: '🇦🇪' },
  { code: '+965', country: 'الكويت', flag: '🇰🇼' },
  { code: '+974', country: 'قطر', flag: '🇶🇦' },
  { code: '+973', country: 'البحرين', flag: '🇧🇭' },
  { code: '+968', country: 'عمان', flag: '🇴🇲' },
  { code: '+962', country: 'الأردن', flag: '🇯🇴' },
  { code: '+961', country: 'لبنان', flag: '🇱🇧' },
  { code: '+963', country: 'سوريا', flag: '🇸🇾' },
  { code: '+20', country: 'مصر', flag: '🇪🇬' },
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
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.code}</span>
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
