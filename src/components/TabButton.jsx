// @ts-ignore;
import React from 'react';

export function TabButton({
  active,
  onClick,
  icon: Icon,
  children
}) {
  return <button className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-pink-500 text-white' : 'bg-white text-gray-600 border border-pink-200'}`} onClick={onClick}>
      <Icon className="w-4 h-4 mr-1" />
      {children}
    </button>;
}