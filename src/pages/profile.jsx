// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { User, ShoppingBag, Upload, Heart, Star, Settings, Share2 } from 'lucide-react';
// @ts-ignore;
import { useToast } from '@/components/ui';

import { UserProfileHeader } from '@/components/UserProfileHeader';
import { ProfileTabs } from '@/components/ProfileTabs';
import { GoodsGrid } from '@/components/GoodsGrid';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
export default function ProfilePage(props) {
  const {
    $w
  } = props;
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('owned');
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGoods, setLoadingGoods] = useState(false);
  const {
    toast
  } = useToast();
  const userId = $w.auth.currentUser.userId;

  // 加载用户资料
  const loadUserProfile = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_profiles',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: userId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      if (result) {
        setUserProfile(result);
      } else {
        // 如果没有用户资料，创建默认资料
        const defaultProfile = {
          userId: userId,
          nickname: $w.auth.currentUser.name || '用户' + userId.slice(-4),
          avatar: '',
          bio: '这个人很懒，什么都没写',
          createdAt: new Date().toISOString()
        };
        const newProfile = await $w.cloud.callDataSource({
          dataSourceName: 'user_profiles',
          methodName: 'wedaCreateV2',
          params: {
            data: defaultProfile
          }
        });
        setUserProfile({
          ...defaultProfile,
          _id: newProfile.id
        });
      }
    } catch (error) {
      console.error('加载用户资料失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载用户资料",
        variant: "destructive"
      });
    }
  };

  // 加载商品数据
  const loadGoods = async tab => {
    try {
      setLoadingGoods(true);
      let dataSourceName = '';
      let filter = {};
      switch (tab) {
        case 'owned':
          dataSourceName = 'user_owned_goods';
          filter = {
            where: {
              userId: {
                $eq: userId
              }
            }
          };
          break;
        case 'uploads':
          dataSourceName = 'anime_goods';
          filter = {
            where: {
              ownerId: {
                $eq: userId
              }
            }
          };
          break;
        case 'collections':
          dataSourceName = 'user_collections';
          filter = {
            where: {
              userId: {
                $eq: userId
              }
            }
          };
          break;
        case 'liked':
          dataSourceName = 'user_ratings';
          filter = {
            where: {
              userId: {
                $eq: userId
              }
            }
          };
          break;
      }
      const result = await $w.cloud.callDataSource({
        dataSourceName: dataSourceName,
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: filter,
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });
      let goodsList = [];
      if (tab === 'owned' || tab === 'collections' || tab === 'liked') {
        // 获取关联的商品信息
        const goodsIds = result.records?.map(item => item.goodsId) || [];
        if (goodsIds.length > 0) {
          const goodsResult = await $w.cloud.callDataSource({
            dataSourceName: 'anime_goods',
            methodName: 'wedaGetRecordsV2',
            params: {
              filter: {
                where: {
                  _id: {
                    $in: goodsIds
                  }
                }
              },
              select: {
                $master: true
              }
            }
          });
          goodsList = goodsResult.records || [];
        }
      } else {
        goodsList = result.records || [];
      }
      setGoods(goodsList);
    } catch (error) {
      console.error('加载商品失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载商品列表",
        variant: "destructive"
      });
    } finally {
      setLoadingGoods(false);
    }
  };

  // 处理标签切换
  const handleTabChange = tab => {
    setActiveTab(tab);
    loadGoods(tab);
  };

  // 处理设置按钮点击
  const handleSettingsClick = () => {
    $w.utils.navigateTo({
      pageId: 'settings'
    });
  };

  // 处理分享按钮点击
  const handleShare = async () => {
    try {
      // 构建分享内容
      const shareData = {
        title: `${userProfile?.nickname || '用户'}的个人主页`,
        text: `来看看${userProfile?.nickname || '用户'}在谷子集市的收藏吧！`,
        url: `${window.location.origin}/profile/${userId}`
      };

      // 使用 Web Share API
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "分享成功",
          description: "已分享个人主页",
          variant: "default"
        });
      } else {
        // 降级处理：复制链接
        await navigator.clipboard.writeText(shareData.url);
        toast({
          title: "链接已复制",
          description: "个人主页链接已复制到剪贴板",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('分享失败:', error);
      if (error.name !== 'AbortError') {
        toast({
          title: "分享失败",
          description: "无法分享个人主页",
          variant: "destructive"
        });
      }
    }
  };

  // 初始加载
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await loadUserProfile();
      await loadGoods(activeTab);
      setLoading(false);
    };
    loadInitialData();
  }, []);

  // 监听页面可见性变化，实现数据同步
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // 页面重新可见，重新加载数据
        loadUserProfile();
        loadGoods(activeTab);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeTab]);
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>;
  }
  if (!userProfile) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState icon={User} title="用户不存在" description="无法加载用户信息" />
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 用户资料头部 */}
      <UserProfileHeader user={userProfile} onSettingsClick={handleSettingsClick} />

      {/* 标签页 */}
      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 商品列表 */}
      <div className="p-4">
        {loadingGoods ? <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div> : goods.length > 0 ? <GoodsGrid goods={goods} $w={$w} /> : <EmptyState icon={ShoppingBag} title="暂无商品" description={`还没有${activeTab === 'owned' ? '拥有的' : activeTab === 'uploads' ? '上传的' : activeTab === 'collections' ? '收藏的' : '点赞的'}谷子`} />}
      </div>

      {/* 分享按钮 - 悬浮在底部导航上方 */}
      <button onClick={handleShare} className="fixed bottom-24 right-4 w-12 h-12 bg-pink-500 text-white rounded-full shadow-lg hover:bg-pink-600 hover:scale-110 transition-all duration-200 flex items-center justify-center z-50">
        <Share2 className="w-5 h-5" />
      </button>

      {/* 底部导航 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex">
          <button onClick={() => $w.utils.navigateTo({
          pageId: 'index'
        })} className="flex-1 py-3 text-gray-500">
            <ShoppingBag className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">首页</span>
          </button>
          <button onClick={() => $w.utils.navigateTo({
          pageId: 'upload'
        })} className="flex-1 py-3 text-gray-500">
            <Upload className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">上传</span>
          </button>
          <button className="flex-1 py-3 text-pink-600">
            <User className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">我的</span>
          </button>
        </div>
      </div>
    </div>;
}