// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { ArrowLeft } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function GoodsHeader({
  image,
  name,
  onBack
}) {
  return <div className="relative">
      <img src={image} alt={name} className="w-full h-64 object-cover" />
      <Button variant="ghost" className="absolute top-4 left-4 bg-white/80 hover:bg-white" onClick={onBack}>
        <ArrowLeft className="w-4 h-4" />
      </Button>
    </div>;
}