import { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Globe, Camera, MessageCircle, Smartphone, ChevronDown, ChevronUp } from 'lucide-react';

const getAppInfo = (packageName) => {
  if (!packageName) return { name: 'Unknown App', icon: Smartphone, color: 'text-gray-400', bg: 'bg-gray-800' };
  
  const pkg = packageName.toLowerCase();
  
  if (pkg.includes('whatsapp')) {
    return { name: 'WhatsApp', icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-500/10' };
  }
  if (pkg.includes('chrome')) {
    return { name: 'Chrome', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10' };
  }
  if (pkg.includes('instagram')) {
    return { name: 'Instagram', icon: Camera, color: 'text-pink-500', bg: 'bg-pink-500/10' };
  }
  
  return { name: packageName, icon: Smartphone, color: 'text-gray-300', bg: 'bg-gray-700/30' };
};

export default function LogCard({ log }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const appInfo = getAppInfo(log.package_name);
  
  const formattedTime = log.captured_at 
    ? formatDistanceToNow(new Date(log.captured_at), { addSuffix: true }) 
    : 'Unknown time';
    
  const exactTime = log.captured_at 
    ? format(new Date(log.captured_at), 'PPpp')
    : '';

  const Icon = appInfo.icon;

  const isLongContent = log.content && log.content.length > 150;
  const displayContent = isExpanded || !isLongContent 
    ? log.content 
    : `${log.content?.substring(0, 150)}...`;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors shadow-lg shadow-black/20 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${appInfo.bg} ${appInfo.color}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="text-gray-100 font-medium">{appInfo.name}</h3>
            <p className="text-xs text-gray-500 font-medium" title={exactTime}>
              {formattedTime}
            </p>
          </div>
        </div>
        
        {/* Subtle hover effect id or copy button could go here */}
      </div>

      <div className="mt-3">
        <p className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-gray-950 p-3 rounded-lg border border-gray-800/50">
          {displayContent || (
            <span className="italic text-gray-600">No content captured</span>
          )}
        </p>
        
        {isLongContent && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            {isExpanded ? (
              <><span>Show less</span><ChevronUp size={14} /></>
            ) : (
              <><span>Read more</span><ChevronDown size={14} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
