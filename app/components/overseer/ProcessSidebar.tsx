"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/Icon';
import { ProcessFilters } from './ProcessFilters';
import { TaskPriority } from '@/types/workflow';
import { cn, getPriorityIcon } from '@/lib/utils';

interface ProcessSidebarProps {
  onFilterChange: (filters: {
    processType?: string;
    status?: string;
    entityType?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
  onSearchChange: (searchQuery: string) => void;
  onPriorityChange?: (priority: TaskPriority | null) => void;
  onStatusChange?: (status: string | null) => void;
}

export function ProcessSidebar({ 
  onFilterChange, 
  onSearchChange,
  onPriorityChange,
  onStatusChange 
}: ProcessSidebarProps) {
  const [activeMenu, setActiveMenu] = useState<TaskPriority | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleMenuClick = (priority: TaskPriority) => {
    const newActiveMenu = activeMenu === priority ? null : priority;
    setActiveMenu(newActiveMenu);
    onPriorityChange?.(newActiveMenu);
  };

  const handleCategoryClick = (status: string) => {
    const newActiveCategory = activeCategory === status ? null : status;
    setActiveCategory(newActiveCategory);
    onStatusChange?.(newActiveCategory);
  };

  // Menu items are now priorities
  const menuItems: { id: TaskPriority; label: string; icon: string }[] = [
    { id: 'Urgent', label: 'Urgent', icon: getPriorityIcon('Urgent').icon },
    { id: 'Overdue', label: 'Overdue', icon: getPriorityIcon('Overdue').icon },
    { id: 'Important', label: 'Important', icon: getPriorityIcon('Important').icon },
    { id: 'Can do Later', label: 'Can do Later', icon: getPriorityIcon('Can do Later').icon },
    { id: 'Not important', label: 'Not important', icon: getPriorityIcon('Not important').icon },
  ];

  // Categories are now instance statuses
  const categories: { id: string; label: string; color: string }[] = [
    { id: 'Overdue', label: 'Overdue', color: 'bg-red-500' },
    { id: 'Delayed', label: 'Delayed', color: 'bg-orange-500' },
    { id: 'InProgress', label: 'In Progress', color: 'bg-blue-500' },
    { id: 'Stashed', label: 'Stashed', color: 'bg-gray-500' },
    { id: 'Completed', label: 'Completed', color: 'bg-green-500' },
    { id: 'Pending', label: 'Pending', color: 'bg-yellow-500' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r">
      {/* Search Field */}
      <div className="p-4 border-b">
        <div className="relative">
          <Icon 
            name="search-line" 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
          />
          <Input
            type="text"
            placeholder="Search processes..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-2">
      <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Priority
            </span>
          </div>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                activeMenu === item.id
                  ? "bg-teal-100 text-teal-700"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon name={item.icon} className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Categories Section (Statuses) */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">
              Status
            </span>
          </div>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  activeCategory === category.id
                    ? "bg-gray-100"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full", category.color)} />
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div className="mt-6 border-t pt-4">
          <ProcessFilters onFilterChange={onFilterChange} />
        </div>
      </div>

      {/* Bottom Icons */}
      <div className="p-4 border-t flex items-center justify-center gap-4">
        <button className="text-gray-400 hover:text-gray-600">
          <Icon name="settings-3-line" className="w-5 h-5" />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <Icon name="delete-bin-line" className="w-5 h-5" />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <Icon name="smartphone-line" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

