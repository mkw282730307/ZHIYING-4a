// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Heart, Bookmark } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function GoodsInfo({
  goods,
  isCollected,
  onLike,
  onCollect
}) {
  if (!goods) return null;
  return <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">{goods.name}</h1>
        <p className="text-pink-600 mt-1">{goods.ip} · {(goods.characters || []).join('、')}</p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold text-pink-500">
            {goods.currency === 'CNY' ? '¥' : goods.currency === 'JPY' ? '¥' : goods.currency === 'USD' ? '$' : goods.currency === 'EUR' ? '€' : goods.currency === 'GBP' ? '£' : goods.currency === 'KRW' ? '₩' : '¥'}
            {goods.price}
          </span>
          {goods.currency && <span className="text-sm text-gray-500 ml-1">{goods.currency}</span>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onLike} className="hover:bg-pink-50">
            <Heart className={`w-4 h-4 mr-1 ${goods.likes > 0 ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
            {goods.likes || 0}
          </Button>
          <Button variant={isCollected ? "default" : "outline"} size="sm" onClick={onCollect} className="hover:bg-pink-50">
            <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-white' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        {goods.barcode && <div className="flex justify-between">
            <span className="text-sm text-gray-600">商品条码</span>
            <span className="text-sm font-medium">{goods.barcode}</span>
          </div>}
      </div>
    </div>;
}