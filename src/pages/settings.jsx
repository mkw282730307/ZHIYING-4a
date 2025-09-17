// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ArrowLeft, User, Shield, Bell, Info, ChevronRight } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

export default function SettingsPage(props) {
  const {
    $w
  } = props;
  const {
    toast
  } = useToast();

  // 设置选项列表
  const settingsOptions = [{
    id: 'profile',
    title: '个人资料',
    description: '编辑个人信息和头像',
    icon: User,
    pageId: 'edit-profile'
  }, {
    id: 'security',
    title: '账号安全',
    description: '修改密码和安全设置',
    icon: Shield,
    pageId: 'security'
  }, {
    id: 'notifications',
    title: '通知设置',
    description: '管理消息通知偏好',
    icon: Bell,
    pageId: 'notifications'
  }, {
    id: 'about',
    title: '关于我们',
    description: '了解应用信息和版本',
    icon: Info,
    pageId: 'about'
  }];

  // 处理选项点击
  const handleOptionClick = pageId => {
    $w.utils.navigateTo({
      pageId
    });
  };
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center">
          <button onClick={() => $w.utils.navigateBack()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold ml-4">设置</h1>
        </div>
      </div>

      {/* 设置选项列表 */}
      <div className="p-4 space-y-2">
        {settingsOptions.map(option => {
        const Icon = option.icon;
        return <button key={option.id} onClick={() => handleOptionClick(option.pageId)} className="w-full bg-white rounded-lg p-4 flex items-center hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                <Icon className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">{option.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>;
      })}
      </div>

      {/* 版本信息 */}
      <div className="p-4 mt-8">
        <div className="text-center text-sm text-gray-500">
          <p>谷子集市 v1.0.0</p>
          <p className="mt-1">让谷子交易更简单</p>
        </div>
      </div>
    </div>;
}