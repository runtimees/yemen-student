
import React from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const AddNewsButton = () => {
  const { toast } = useToast();

  const addNewsItem = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('add-news', {
        body: {
          title: 'لقاء سفارة الجمهورية اليمنية مع الطلبة اليمنيين في العراق',
          content: `في إطار اهتمام سفارة الجمهورية اليمنية في جمهورية العراق بأوضاع الطلبة اليمنيين، عقد سعادة السفير الخضر مرمش، وسعادة القنصل العام، لقاء مع عدد من الطلبة اليمنيين المقيمين في العراق.

وقد استهل سعادة السفير اللقاء بالترحيب بالحضور، معبّرا عن بالغ شكره وامتنانه لتفاعلهم وحرصهم على التواصل مع السفارة، مؤكداً حرص البعثة الدبلوماسية على متابعة قضايا الطلبة والوقوف إلى جانبهم بما يسهم في تذليل التحديات التي قد تواجههم خلال فترة دراستهم.

وخلال اللقاء، تم التطرق إلى جملة من القضايا المهمة، من أبرزها البدء في إجراءات الدورة الثالثة للكيان الطلابي، وسبل تعزيز دوره كممثل رسمي للطلبة اليمنيين، إلى جانب مناقشة ملف التحويلات المالية والصعوبات المرتبطة به، والبحث في إمكانية التواصل مع جهات مانحة أو داعمة يمكن أن تسهم في تقديم الدعم للطلبة، سواء بشكل مباشر أو عبر الكيان الطلابي.

كما ناقش اللقاء سبل دعم الكيان الطلابي من خلال توفير الوسائل اللازمة للقيام بمهامه، بالإضافة إلى عدد من القضايا الأخرى ذات الصلة بالوضع الطلابي العام، مؤكدين جميعاً على أهمية العمل المشترك بما يخدم مصلحة الطلبة ويوحد جهودهم في هذا الإطار.

وكان في اللقاء ممثلا عبد الرحمن الحداد،وثلة من الزملاء الأفاضل.`,
          image_url: '/lovable-uploads/d4acfcfe-3b86-48ad-93ef-dbd3590b3545.png'
        }
      });

      if (error) {
        toast({
          title: "خطأ",
          description: "فشل في إضافة الخبر",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "تم بنجاح",
        description: "تم إضافة الخبر بنجاح",
      });

      // Refresh the page to show the new news item
      window.location.reload();
    } catch (error) {
      console.error('Error adding news:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة الخبر",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={addNewsItem}
      className="bg-yemen-blue hover:bg-blue-700 text-white"
    >
      إضافة خبر السفارة
    </Button>
  );
};

export default AddNewsButton;
