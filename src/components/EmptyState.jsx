// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Package } from 'lucide-react';

export function EmptyState({
  title,
  description
}) {
  return <div className="text-center py-12">
      <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>;
}