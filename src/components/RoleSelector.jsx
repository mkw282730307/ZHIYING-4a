// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { X, Plus, ChevronDown } from 'lucide-react';
// @ts-ignore;
import { Input, Button, Popover, PopoverContent, PopoverTrigger } from '@/components/ui';

export function RoleSelector({
  roles,
  onChange,
  placeholder = "选择角色"
}) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState(['木之本樱', '李小狼', '大道寺知世', '小可', '月城雪兔']);
  const handleAddRole = () => {
    if (inputValue.trim() && !roles.includes(inputValue.trim())) {
      onChange([...roles, inputValue.trim()]);
      if (!availableRoles.includes(inputValue.trim())) {
        setAvailableRoles([...availableRoles, inputValue.trim()]);
      }
      setInputValue('');
    }
  };
  const handleRemoveRole = roleToRemove => {
    onChange(roles.filter(role => role !== roleToRemove));
  };
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRole();
    }
  };
  const toggleRole = role => {
    if (roles.includes(role)) {
      handleRemoveRole(role);
    } else {
      onChange([...roles, role]);
    }
  };
  return <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {roles.map(role => <span key={role} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-700">
            {role}
            <button type="button" className="ml-2 text-pink-500 hover:text-pink-700" onClick={() => handleRemoveRole(role)}>
              <X className="w-3 h-3" />
            </button>
          </span>)}
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>{roles.length > 0 ? `${roles.length}个角色已选` : placeholder}</span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="p-2">
            {availableRoles.length > 0 ? <div className="space-y-1">
                {availableRoles.map(role => <label key={role} className="flex items-center space-x-2 p-2 hover:bg-pink-50 rounded cursor-pointer">
                    <input type="checkbox" checked={roles.includes(role)} onChange={() => toggleRole(role)} className="rounded text-pink-500" />
                    <span className="text-sm">{role}</span>
                  </label>)}
              </div> : <p className="text-sm text-gray-500 p-2">暂无角色</p>}
            <div className="border-t pt-2 mt-2">
              <div className="flex gap-2">
                <Input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="添加新角色" maxLength={20} className="flex-1" />
                <Button type="button" size="sm" onClick={handleAddRole}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>;
}