// @ts-ignore;
import React from 'react';

// @ts-ignore;
import { GoodsCard } from '@/components/GoodsCard';
// @ts-ignore;
import { EmptyState } from '@/components/EmptyState';
export function GoodsGrid({
  goods,
  onItemClick,
  loading
}) {
  // 添加空值检查
  if (!goods || !Array.isArray(goods)) {
    return <EmptyState message="暂无商品" />;
  }
  if (goods.length === 0) {
    return <EmptyState message="暂无商品" />;
  }
  return <div className="grid grid-cols-2 gap-4">
      {goods.map(item => <GoodsCard key={item?._id || Math.random()} goods={item} onClick={() => onItemClick && onItemClick(item?._id)} />)}
    </div>;
}