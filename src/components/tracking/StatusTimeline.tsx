
import { getStatusColor } from '@/utils/requestUtils';

interface StatusTimelineItem {
  status: string;
  date: string;
  complete: boolean;
}

interface StatusTimelineProps {
  timeline: StatusTimelineItem[];
}

const StatusTimeline = ({ timeline }: StatusTimelineProps) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-bold text-lg mb-4">مراحل معالجة الطلب</h3>
      <div className="space-y-4">
        {timeline.map((item, index) => (
          <div className="flex items-center" key={index}>
            <div className={`w-8 h-8 ${getStatusColor(item.status, item.complete)} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
              {item.complete ? '✓' : index + 1}
            </div>
            <div className="ms-3 flex-1">
              <p className={`font-bold ${item.complete ? 'text-gray-900' : 'text-gray-400'}`}>{item.status}</p>
              <p className={`text-sm ${item.complete ? 'text-gray-600' : 'text-gray-400'}`}>{item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusTimeline;
