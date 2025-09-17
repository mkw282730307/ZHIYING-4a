// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Camera, ArrowLeft } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Textarea, useToast } from '@/components/ui';

export default function EditProfilePage(props) {
  const {
    $w
  } = props;
  const [profileData, setProfileData] = useState({
    nickname: '',
    avatar: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const {
    toast
  } = useToast();

  // 加载用户资料
  const loadUserProfile = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_profiles',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: $w.auth.currentUser.userId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (result.records && result.records.length > 0) {
        setProfileData({
          nickname: result.records[0].nickname || '',
          avatar: result.records[0].avatar || '',
          bio: result.records[0].bio || ''
        });
      } else {
        setProfileData({
          nickname: $w.auth.currentUser.name || '',
          avatar: '',
          bio: ''
        });
      }
    } catch (error) {
      console.error('加载用户资料失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载用户资料",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理保存
  const handleSave = async () => {
    try {
      setSaving(true);

      // 检查是否已存在用户资料
      const existing = await $w.cloud.callDataSource({
        dataSourceName: 'user_profiles',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: $w.auth.currentUser.userId
              }
            }
          }
        }
      });
      if (existing.records && existing.records.length > 0) {
        // 更新现有资料
        await $w.cloud.callDataSource({
          dataSourceName: 'user_profiles',
          methodName: 'wedaUpdateV2',
          params: {
            data: {
              nickname: profileData.nickname,
              avatar: profileData.avatar,
              bio: profileData.bio
            },
            filter: {
              where: {
                userId: {
                  $eq: $w.auth.currentUser.userId
                }
              }
            }
          }
        });
      } else {
        // 创建新资料
        await $w.cloud.callDataSource({
          dataSourceName: 'user_profiles',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              userId: $w.auth.currentUser.userId,
              nickname: profileData.nickname,
              avatar: profileData.avatar,
              bio: profileData.bio
            }
          }
        });
      }
      toast({
        title: "保存成功",
        description: "个人资料已更新"
      });

      // 返回上一页
      setTimeout(() => {
        $w.utils.navigateBack();
      }, 1000);
    } catch (error) {
      console.error('保存失败:', error);
      toast({
        title: "保存失败",
        description: "无法保存个人资料",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // 处理头像选择
  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setProfileData(prev => ({
          ...prev,
          avatar: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadUserProfile();
  }, []);
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 flex items-center">
          <button onClick={() => $w.utils.navigateBack()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold ml-4">编辑个人资料</h1>
        </div>
      </div>

      {/* 编辑表单 */}
      <div className="p-4 space-y-6">
        {/* 头像上传 */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profileData.avatar ? <img src={profileData.avatar} alt="头像" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-gray-400" />}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center cursor-pointer">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        {/* 昵称输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
          <Input value={profileData.nickname} onChange={e => setProfileData(prev => ({
          ...prev,
          nickname: e.target.value
        }))} placeholder="请输入昵称" maxLength={20} />
        </div>

        {/* 简介输入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">个人简介</label>
          <Textarea value={profileData.bio} onChange={e => setProfileData(prev => ({
          ...prev,
          bio: e.target.value
        }))} placeholder="介绍一下自己吧..." maxLength={100} rows={4} />
        </div>

        {/* 保存按钮 */}
        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? '保存中...' : '保存'}
        </Button>
      </div>
    </div>;
}