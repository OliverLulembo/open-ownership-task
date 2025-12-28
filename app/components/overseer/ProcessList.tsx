"use client"

import { useState, useEffect } from 'react';
import { WorkflowInstance, TaskPriority } from '@/types/workflow';
import { getInstances, filterInstances, getProcess, getTasksByInstance } from '@/lib/dataService';
import { TaskDrawer } from '@/components/shared/TaskDrawer';
import { ProcessSidebar } from './ProcessSidebar';
import { InstanceListItem } from './InstanceListItem';
import { InstanceDetailView } from './InstanceDetailView';
import { WorkflowTask } from '@/types/workflow';
import { Icon } from '@/components/ui/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function ProcessList() {
  const [instances, setInstances] = useState<WorkflowInstance[]>([]);
  const [filteredInstances, setFilteredInstances] = useState<WorkflowInstance[]>([]);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<{
    processType?: string;
    status?: string;
    entityType?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  useEffect(() => {
    loadInstances();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [instances, searchQuery, appliedFilters, selectedPriority, selectedStatus]);

  const loadInstances = () => {
    const allInstances = getInstances();
    setInstances(allInstances);
    if (allInstances.length > 0 && !selectedInstanceId) {
      setSelectedInstanceId(allInstances[0].id);
    }
  };

  const applyFiltersAndSearch = () => {
    // First apply filters
    let filtered = filterInstances(appliedFilters);
    
    // Apply priority filter
    if (selectedPriority) {
      filtered = filtered.filter(instance => instance.priority === selectedPriority);
    }
    
    // Apply status filter
    if (selectedStatus) {
      filtered = filtered.filter(instance => instance.status === selectedStatus);
    }
    
    // Then apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(instance => {
        const process = getProcess(instance.processId);
        const processName = process?.name || '';
        const entityType = instance.entityType || '';
        const entityId = instance.entityId || '';
        const instanceId = instance.id || '';
        const status = instance.status || '';
        
        return (
          processName.toLowerCase().includes(query) ||
          entityType.toLowerCase().includes(query) ||
          entityId.toLowerCase().includes(query) ||
          instanceId.toLowerCase().includes(query) ||
          status.toLowerCase().includes(query)
        );
      });
    }
    
    setFilteredInstances(filtered);
    
    // Maintain selected instance if it still exists after filtering/searching
    if (selectedInstanceId && !filtered.find(i => i.id === selectedInstanceId)) {
      // If selected instance is no longer in filtered list, select first one or clear
      if (filtered.length > 0) {
        setSelectedInstanceId(filtered[0].id);
      } else {
        setSelectedInstanceId(null);
      }
    } else if (!selectedInstanceId && filtered.length > 0) {
      // If no instance was selected, select the first one
      setSelectedInstanceId(filtered[0].id);
    }
  };

  const handleFilterChange = (filters: {
    processType?: string;
    status?: string;
    entityType?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    setAppliedFilters(filters);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePriorityChange = (priority: TaskPriority | null) => {
    setSelectedPriority(priority);
  };

  const handleStatusChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  const handleInstanceClick = (instanceId: string) => {
    setSelectedInstanceId(instanceId);
  };

  const handleTaskClick = (task: WorkflowTask) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const selectedInstance = filteredInstances.find(i => i.id === selectedInstanceId) || null;
  const selectedProcess = selectedInstance ? getProcess(selectedInstance.processId) : undefined;
  const selectedInstanceTasks = selectedInstance ? getTasksByInstance(selectedInstance.id) : [];

  return (
    <div className="h-[calc(100vh)] flex">
      {/* First Column: Sidebar with Filters and Menu */}
      <div className={cn(
        "flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-r",
        sidebarVisible ? "w-64" : "w-0"
      )}>
        <div className={cn(
          "w-64 h-full transition-all duration-300 ease-in-out",
          sidebarVisible ? "translate-x-0" : "-translate-x-full"
        )}>
          <ProcessSidebar 
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            onPriorityChange={handlePriorityChange}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Second Column: Instance List */}
      <div className="w-80 flex-shrink-0 border-r bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">Active Processes</h2>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip content={sidebarVisible ? "Hide filters and menu" : "Show filters and menu"}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={toggleSidebar}
              >
                <Icon name={sidebarVisible ? "eye-off-line" : "filter-line"} className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        </div>

        {/* Instance List */}
        <div className="flex-1 overflow-y-auto">
          {filteredInstances.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 text-sm">
              No active processes found
            </div>
          ) : (
            filteredInstances.map(instance => {
              const process = getProcess(instance.processId);
              
              return (
                <InstanceListItem
                  key={instance.id}
                  instance={instance}
                  process={process}
                  onClick={() => handleInstanceClick(instance.id)}
                  isSelected={selectedInstanceId === instance.id}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Third Column: Instance Details */}
      <div className="flex-1 overflow-y-auto bg-white">
        <InstanceDetailView
          instance={selectedInstance}
          process={selectedProcess}
          tasks={selectedInstanceTasks}
          onTaskClick={handleTaskClick}
        />
      </div>

      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          showActions={false}
        />
      )}
    </div>
  );
}

