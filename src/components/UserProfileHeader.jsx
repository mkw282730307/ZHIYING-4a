// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Camera, User, Settings } from 'lucide-react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';

export function UserProfileHeader({
  $w,
  onEditProfile,
  profileData,
  onRefresh
}) {
  const [profile, setProfile] = useState({
    nickname: '',
    avatar: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();

  // 使用传入的 profileData 或从 props 获取
  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
      setLoading(false);
    } else {
      // 如果没有传入 profileData，则自己加载
      loadUserProfile();
    }
  }, [profileData]);

  // 加载用户资料
  const loadUserProfile = async () => {
    try {
      setLoading(true);
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
        const userProfile = result.records[0];
        setProfile({
          nickname: userProfile.nickname || $w.auth.currentUser.name || '用户',
          avatar: userProfile.avatar || '',
          bio: userProfile.bio || ''
        });
      } else {
        setProfile({
          nickname: $w.auth.currentUser.name || '用户',
          avatar: '',
          bio: ''
        });
      }
    } catch (error) {
      console.error('获取用户资料失败:', error);
      toast({
        title: "获取资料失败",
        description: "无法加载用户资料",
        variant: "destructive"
      });
      setProfile({
        nickname: $w.auth.currentUser.name || '用户',
        avatar: '',
        bio: ''
      });
    } finally {
      setLoading(false);
    }
  };

  // 监听页面返回事件
  useEffect(() => {
    const handlePageShow = () => {
      if (!profileData && onRefresh) {
        onRefresh();
      } else if (!profileData) {
        loadUserProfile();
      }
    };
    const handleProfileUpdate = () => {
      if (!profileData && onRefresh) {
        onRefresh();
      } else if (!profileData) {
        loadUserProfile();
      }
    };
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [profileData, onRefresh]);
  return <div className="bg-gradient-to-b from-pink-500 to-pink-600 text-white">
      <div className="px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
              {profile.avatar ? <img src={profile.avatar} alt="头像" className="w-full h-full object-cover" onError={e => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'block';
            }} /> : null}
              <User className={`w-10 h-10 text-white/80 ${profile.avatar ? 'hidden' : ''}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {loading ? '加载中...' : profile.nickname}
              </h2>
              <p className="text-sm text-white/80">
                {loading ? '' : profile.bio || '暂无简介'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onEditProfile}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>;
}