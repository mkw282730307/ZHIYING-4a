// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Heart, ShoppingBag, Star } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, CardFooter, Button } from '@/components/ui';

export function GoodsCard({
  goods,
  onCollect,
  onOwn,
  $w
}) {
  const handleCardClick = () => {
    $w.utils.navigateTo({
      pageId: 'detail',
      params: {
        id: goods._id
      }
    });
  };
  return <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-0" onClick={handleCardClick}>
        <div className="aspect-square relative">
          <img src={goods.image || 'https://via.placeholder.com/300x300'} alt={goods.name} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold">
            ¥{goods.price}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2">{goods.name}</h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{goods.description}</p>
          <div className="flex items-center mt-2">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs ml-1">{goods.rating || 0}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={e => {
        e.stopPropagation();
        onCollect();
      }}>
          <Heart className="w-3 h-3 mr-1" />
          收藏
        </Button>
        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={e => {
        e.stopPropagation();
        onOwn();
      }}>
          <ShoppingBag className="w-3 h-3 mr-1" />
          拥有
        </Button>
      </CardFooter>
    </Card>;
}