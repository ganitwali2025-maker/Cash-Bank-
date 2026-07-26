import React from 'react';
import { 
  Bell, 
  Shield, 
  HelpCircle, 
  FileText, 
  Info, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function MoreTab() {
  const menuItems = [
    { icon: <Bell className="w-5 h-5" />, label: 'Notification' },
    { icon: <Shield className="w-5 h-5" />, label: 'Privacy Policy' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support' },
    { icon: <FileText className="w-5 h-5" />, label: 'Terms & Conditions' },
    { icon: <Info className="w-5 h-5" />, label: 'About Us' },
  ];

  return (
    <div className="bg-[#FFFDF8] min-h-screen pb-24">
      {/* Top App Bar */}
      <div className="bg-[#5A0000] text-white px-4 py-4 flex items-center sticky top-0 z-10 justify-center">
        <h1 className="text-lg font-bold tracking-wider uppercase font-display">More</h1>
      </div>

      <div className="p-4 pt-6 space-y-4">
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden divide-y divide-gray-50">
          {menuItems.map((item, idx) => (
            <button key={idx} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-gray-400">
                  {item.icon}
                </div>
                <span className="font-bold text-sm text-gray-700">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          ))}
          
          <button className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="text-red-500">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-red-500">Logout</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
