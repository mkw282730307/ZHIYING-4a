// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ShoppingBag, Upload, Heart, Star } from 'lucide-react';

export function ProfileTabs({
  activeTab,
  onTabChange
}) {
  const tabs = [{
    id: 'owned',
    label: '拥有',
    icon: ShoppingBag,
    count: 0
  }, {
    id: 'uploads',
    label: '上传',
    icon: Upload,
    count: 0
  }, {
    id: 'collections',
    label: '收藏',
    icon: Heart,
    count: 0
  }, {
    id: 'liked',
    label: '点赞',
    icon: Star,
    count: 0
  }];
  return <div className="bg-white border-b">
      <div className="flex">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} onClick={() => onTabChange(tab.id)} className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${isActive ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500 hover:text-gray-700'}`}>
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-pink-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>;
      })}
      </div>
    </div>;
}