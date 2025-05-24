
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  fullNameAr: string;
  fullNameEn: string;
  universityName: string;
  major: string;
}

interface PersonalInfoFieldsProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData & { 
    additionalNotes: string;
    passportFile: File | null;
    certificateFile: File | null;
    visaFile: File | null;
  }>>;
}

const PersonalInfoFields = ({ formData, setFormData }: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="full-name-ar">الاسم الكامل بالعربية *</Label>
        <Input
          id="full-name-ar"
          placeholder="أدخل الاسم الكامل بالعربية"
          value={formData.fullNameAr}
          onChange={(e) => setFormData(prev => ({ ...prev, fullNameAr: e.target.value }))}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full-name-en">الاسم الكامل بالإنجليزية *</Label>
        <Input
          id="full-name-en"
          placeholder="Enter full name in English"
          value={formData.fullNameEn}
          onChange={(e) => setFormData(prev => ({ ...prev, fullNameEn: e.target.value }))}
          required
          className="w-full"
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">اسم الجامعة *</Label>
        <Input
          id="university"
          placeholder="أدخل اسم الجامعة"
          value={formData.universityName}
          onChange={(e) => setFormData(prev => ({ ...prev, universityName: e.target.value }))}
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="major">التخصص *</Label>
        <Input
          id="major"
          placeholder="أدخل التخصص"
          value={formData.major}
          onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
          required
          className="w-full"
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;
