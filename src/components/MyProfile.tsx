import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  User, 
  Users, 
  MapPin, 
  Landmark, 
  Lock, 
  Settings,
  ChevronRight,
  Phone,
  Mail
} from 'lucide-react';

export default function MyProfile() {
  const navigate = useNavigate();

  const profileItems = [
    { icon: <User className="w-5 h-5" />, label: 'Personal Information' },
    { icon: <Users className="w-5 h-5" />, label: 'Nominee Details' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Address Details' },
    { icon: <Landmark className="w-5 h-5" />, label: 'Bank Details' },
    { icon: <Lock className="w-5 h-5" />, label: 'Change Password' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <div className="bg-[#FFFDF8] min-h-screen pb-24">
      {/* Top App Bar */}
      <div className="bg-[#5A0000] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-white/10 transition">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold tracking-wider uppercase font-display">My Profile</h1>
        </div>
        <button className="p-1 rounded-full hover:bg-white/10 transition">
          <Edit2 className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-5 pt-6">
        {/* Profile Card */}
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <img 
              src="https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=D4AF37" 
              alt="Admin"
              className="w-24 h-24 rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.1)] border-4 border-white mb-4"
            />
          </div>
          <h2 className="text-xl font-bold font-serif text-gray-900 mb-1">Ramesh Kumar</h2>
          
          <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mb-4">
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> ID: MB1001</span>
          </div>

          <div className="w-full bg-white rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex justify-between items-center mb-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <Phone className="w-3.5 h-3.5 text-gray-400" /> +91 9876543210
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <Mail className="w-3.5 h-3.5 text-gray-400" /> ramesh@gmail.com
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-[9px] font-bold uppercase tracking-wider rounded-full">
              KYC Verified
            </span>
          </div>
        </div>

        {/* Options List */}
        <div className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden divide-y divide-gray-50">
          {profileItems.map((item, idx) => (
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
        </div>
      </div>
    </div>
  );
}
