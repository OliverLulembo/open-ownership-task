"use client"

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getProcesses } from '@/lib/dataService';

interface ProcessFiltersProps {
  onFilterChange: (filters: {
    processType?: string;
    entityType?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
}

export function ProcessFilters({ onFilterChange }: ProcessFiltersProps) {
  const [filters, setFilters] = useState({
    processType: '',
    entityType: '',
    dateFrom: '',
    dateTo: '',
  });

  const processes = getProcesses();
  const processTypes = Array.from(new Set(processes.map(p => p.type)));

  const handleFilterChange = (key: string, value: string) => {
    // Convert "all" special value to empty string for filter logic
    const filterValue = value === 'all' ? '' : value;
    const newFilters = { ...filters, [key]: filterValue };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const emptyFilters = {
      processType: '',
      entityType: '',
      dateFrom: '',
      dateTo: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase px-3 mb-2">
        Filters
      </h3>
      <div className="space-y-3 px-2">
        <div>
          <label className="text-xs font-medium mb-1.5 block text-gray-700">Process Type</label>
          <Select
            value={filters.processType || 'all'}
            onValueChange={(value) => handleFilterChange('processType', value)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {processTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium mb-1.5 block text-gray-700">Entity Type</label>
          <Select
            value={filters.entityType || 'all'}
            onValueChange={(value) => handleFilterChange('entityType', value)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All entities</SelectItem>
              <SelectItem value="Company">Company</SelectItem>
              <SelectItem value="Person">Person</SelectItem>
              <SelectItem value="Trust">Trust</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium mb-1.5 block text-gray-700">Date From</label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium mb-1.5 block text-gray-700">Date To</label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="h-9 text-sm"
          />
        </div>

        <div className="pt-2">
          <Button onClick={handleReset} variant="outline" size="sm" className="w-full text-xs">
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

