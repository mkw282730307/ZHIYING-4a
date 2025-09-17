// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Heart, Star, MessageCircle, ShoppingBag, ArrowLeft, Share2 } from 'lucide-react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';

import { GoodsHeader } from '@/components/GoodsHeader';
import { GoodsInfo } from '@/components/GoodsInfo';
import { RatingSection } from '@/components/RatingSection';
import { CommentsSection } from '@/components/CommentsSection';
export default function DetailPage(props) {
  const {
    $w
  } = props;
  const [goods, setGoods] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollected, setIsCollected] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [commentText, setCommentText] = useState('');
  const {
    toast
  } = useToast();
  const goodsId = $w.page.dataset.params?.id;

  // 加载商品详情
  const loadGoodsDetail = async () => {
    try {
      setLoading(true);
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'anime_goods',
        methodName: 'wedaGetItemV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: goodsId
              }
            }
          },
          select: {
            $master: true
          }
        }
      });
      setGoods(result);
    } catch (error) {
      console.error('加载商品详情失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载商品详情",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // 加载评论
  const loadComments = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'goods_comments',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              goodsId: {
                $eq: goodsId
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
      setComments(result.records || []);
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  // 检查收藏状态
  const checkCollectionStatus = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_collections',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: $w.auth.currentUser.userId
              },
              goodsId: {
                $eq: goodsId
              }
            }
          }
        }
      });
      setIsCollected(result.records && result.records.length > 0);
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  };

  // 检查点赞状态
  const checkLikeStatus = async () => {
    try {
      const result = await $w.cloud.callDataSource({
        dataSourceName: 'user_ratings',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: $w.auth.currentUser.userId
              },
              goodsId: {
                $eq: goodsId
              }
            }
          }
        }
      });
      if (result.records && result.records.length > 0) {
        setIsLiked(true);
        setUserRating(result.records[0].rating || 0);
      }
    } catch (error) {
      console.error('检查点赞状态失败:', error);
    }
  };

  // 处理收藏
  const handleCollect = async () => {
    try {
      if (isCollected) {
        // 取消收藏
        await $w.cloud.callDataSource({
          dataSourceName: 'user_collections',
          methodName: 'wedaDeleteV2',
          params: {
            filter: {
              where: {
                userId: {
                  $eq: $w.auth.currentUser.userId
                },
                goodsId: {
                  $eq: goodsId
                }
              }
            }
          }
        });
        setIsCollected(false);
        toast({
          title: "已取消收藏"
        });
      } else {
        // 添加收藏
        await $w.cloud.callDataSource({
          dataSourceName: 'user_collections',
          methodName: 'wedaCreateV2',
          params: {
            data: {
              userId: $w.auth.currentUser.userId,
              goodsId: goodsId,
              createdAt: new Date().toISOString()
            }
          }
        });
        setIsCollected(true);
        toast({
          title: "收藏成功"
        });
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      toast({
        title: "操作失败",
        description: "无法完成收藏操作",
        variant: "destructive"
      });
    }
  };

  // 处理点赞
  const handleLike = async rating => {
    try {
      if (isLiked && rating === userRating) {
        // 取消点赞
        await $w.cloud.callDataSource({
          dataSourceName: 'user_ratings',
          methodName: 'wedaDeleteV2',
          params: {
            filter: {
              where: {
                userId: {
                  $eq: $w.auth.currentUser.userId
                },
                goodsId: {
                  $eq: goodsId
                }
              }
            }
          }
        });
        setIsLiked(false);
        setUserRating(0);
        toast({
          title: "已取消点赞"
        });
      } else {
        // 添加或更新点赞
        await $w.cloud.callDataSource({
          dataSourceName: 'user_ratings',
          methodName: 'wedaUpsertV2',
          params: {
            filter: {
              where: {
                userId: {
                  $eq: $w.auth.currentUser.userId
                },
                goodsId: {
                  $eq: goodsId
                }
              }
            },
            update: {
              rating: rating
            },
            create: {
              userId: $w.auth.currentUser.userId,
              goodsId: goodsId,
              rating: rating
            }
          }
        });
        setIsLiked(true);
        setUserRating(rating);
        toast({
          title: "点赞成功"
        });
      }
    } catch (error) {
      console.error('点赞操作失败:', error);
      toast({
        title: "操作失败",
        description: "无法完成点赞操作",
        variant: "destructive"
      });
    }
  };

  // 处理添加评论
  const handleAddComment = async () => {
    if (!commentText.trim()) {
      toast({
        title: "请输入评论内容",
        variant: "destructive"
      });
      return;
    }
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'goods_comments',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            goodsId: goodsId,
            userId: $w.auth.currentUser.userId,
            userName: $w.auth.currentUser.name || '匿名用户',
            content: commentText,
            createdAt: new Date().toISOString()
          }
        }
      });
      setCommentText('');
      loadComments();
      toast({
        title: "评论成功"
      });
    } catch (error) {
      console.error('评论失败:', error);
      toast({
        title: "评论失败",
        description: "无法添加评论",
        variant: "destructive"
      });
    }
  };

  // 处理拥有谷子
  const handleOwnGoods = async () => {
    try {
      // 检查是否已拥有
      const existing = await $w.cloud.callDataSource({
        dataSourceName: 'user_owned_goods',
        methodName: 'wedaGetRecordsV2',
        params: {
          filter: {
            where: {
              userId: {
                $eq: $w.auth.currentUser.userId
              },
              goodsId: {
                $eq: goodsId
              }
            }
          }
        }
      });
      if (existing.records && existing.records.length > 0) {
        toast({
          title: "已拥有",
          description: "该谷子已在您的拥有列表中"
        });
        return;
      }

      // 添加到拥有的谷子
      await $w.cloud.callDataSource({
        dataSourceName: 'user_owned_goods',
        methodName: 'wedaCreateV2',
        params: {
          data: {
            userId: $w.auth.currentUser.userId,
            goodsId: goodsId,
            createdAt: new Date().toISOString()
          }
        }
      });
      toast({
        title: "成功",
        description: "已添加到拥有的谷子"
      });
    } catch (error) {
      console.error('添加拥有的谷子失败:', error);
      toast({
        title: "失败",
        description: "无法添加拥有的谷子",
        variant: "destructive"
      });
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    if (goodsId) {
      loadGoodsDetail();
      loadComments();
      checkCollectionStatus();
      checkLikeStatus();
    }
  }, [goodsId]);
  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>;
  }
  if (!goods) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-2">商品不存在</h2>
          <Button onClick={() => $w.utils.navigateBack()}>返回</Button>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center">
          <button onClick={() => $w.utils.navigateBack()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold ml-4">商品详情</h1>
          <button className="ml-auto p-2 hover:bg-gray-100 rounded-lg">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 商品内容 */}
      <div className="pb-20">
        <GoodsHeader goods={goods} />
        <GoodsInfo goods={goods} />
        <RatingSection rating={userRating} onRate={handleLike} isLiked={isLiked} />
        <CommentsSection comments={comments} onAddComment={handleAddComment} commentText={commentText} onCommentChange={setCommentText} />
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <button onClick={handleCollect} className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg ${isCollected ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-700'}`}>
            <Heart className={`w-5 h-5 ${isCollected ? 'fill-current' : ''}`} />
            <span>{isCollected ? '已收藏' : '收藏'}</span>
          </button>
          <button onClick={handleOwnGoods} className="flex-1 bg-pink-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <span>拥有谷子</span>
          </button>
        </div>
      </div>
    </div>;
}