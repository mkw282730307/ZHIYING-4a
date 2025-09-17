// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Search, Filter, ShoppingBag } from 'lucide-react';
// @ts-ignore;
import { Input, useToast } from '@/components/ui';

import { GoodsGrid } from '@/components/GoodsGrid';
import { TabBar } from '@/components/TabBar';
export default function IndexPage(props) {
  const {
    $w
  } = props;
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const {
    toast
  } = useToast();

  // 加载商品列表
  const loadGoods = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'anime_goods',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }],
          pageSize: 50
        }
      });
      setGoods(result.records || []);

      // 提取分类
      const uniqueCategories = [...new Set(result.records?.map(item => item.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('加载商品失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载商品列表",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 搜索商品
  const searchGoods = async query => {
    if (!query.trim()) {
      loadGoods();
      return;
    }
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'anime_goods',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              $or: [{
                name: {
                  $search: query
                }
              }, {
                description: {
                  $search: query
                }
              }, {
                character: {
                  $search: query
                }
              }, {
                series: {
                  $search: query
                }
              }]
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });
      setGoods(result.records || []);
    } catch (error) {
      console.error('搜索失败:', error);
      toast({
        title: "搜索失败",
        description: "无法搜索商品",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 筛选商品
  const filterGoods = async category => {
    if (category === 'all') {
      loadGoods();
      return;
    }
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'anime_goods',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              category: {
                $eq: category
              }
            }
          },
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });
      setGoods(result.records || []);
    } catch (error) {
      console.error('筛选失败:', error);
      toast({
        title: "筛选失败",
        description: "无法筛选商品",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = () => {
    searchGoods(searchQuery);
  };

  // 处理分类筛选
  const handleCategoryFilter = category => {
    setSelectedCategory(category);
    filterGoods(category);
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadGoods();
  }, []);

  // 移除搜索延迟触发（V37 新增）
  // 移除 useEffect 监听 searchQuery 变化
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部搜索栏 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="搜索谷子、角色、系列..." className="pl-10 pr-4" />
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 overflow-x-auto">
            <button onClick={() => handleCategoryFilter('all')} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${selectedCategory === 'all' ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
              全部
            </button>
            {categories.map(category => <button key={category} onClick={() => handleCategoryFilter(category)} className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${selectedCategory === category ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                {category}
              </button>)}
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="p-4">
        {loading ? <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div> : goods.length > 0 ? <GoodsGrid goods={goods} $w={$w} /> : <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无商品</p>
            <p className="text-sm text-gray-400 mt-2">还没有商品，快去上传吧</p>
          </div>}
      </div>

      {/* 底部导航 */}
      <TabBar currentPage="index" onNavigate={pageId => {
      if (pageId !== 'index') {
        $w.utils.navigateTo({
          pageId
        });
      }
    }} />
    </div>;
}