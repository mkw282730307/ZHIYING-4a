// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Filter, Plus, User } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function TabBar({
  currentPage,
  onNavigate
}) {
  const tabs = [{
    id: 'index',
    label: '首页',
    icon: Filter,
    active: currentPage === 'index'
  }, {
    id: 'upload',
    label: '上传',
    icon: Plus,
    active: currentPage === 'upload'
  }, {
    id: 'profile',
    label: '我的',
    icon: User,
    active: currentPage === 'profile'
  }];
  return <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-100 z-50">
      <div className="flex justify-around py-2">
        {tabs.map(tab => <Button key={tab.id} variant="ghost" className={`flex-col h-auto py-2 px-3 ${tab.active ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`} onClick={() => onNavigate(tab.id)}>
            <tab.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{tab.label}</span>
          </Button>)}
      </div>
    </div>;
}