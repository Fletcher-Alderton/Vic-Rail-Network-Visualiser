'use client';

import React, { useState } from 'react';
import { FilterState } from '../types';
import FilterPanel from './FilterPanel';
import InfoOverlay from './InfoOverlay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Train } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  railwayFilters: FilterState;
  infrastructureFilters: FilterState;
  toggleRailwayFilter: (type: string) => void;
  toggleInfrastructureFilter: (type: string) => void;
  toggleAllRailway: (enabled: boolean) => void;
  toggleAllInfrastructure: (enabled: boolean) => void;
  railwayCount: number;
  totalRailwayCount: number;
  infrastructureCount: number;
  totalInfrastructureCount: number;
}

const Sidebar = React.memo(({
  railwayFilters,
  infrastructureFilters,
  toggleRailwayFilter,
  toggleInfrastructureFilter,
  toggleAllRailway,
  toggleAllInfrastructure,
  railwayCount,
  totalRailwayCount,
  infrastructureCount,
  totalInfrastructureCount,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar Container */}
      <div 
        className={`fixed top-0 left-0 h-full z-[1000] bg-background/95 backdrop-blur-md border-r transition-all duration-300 ease-in-out ${
          isCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ width: '400px' }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <Card className="rounded-none border-0 border-b shadow-none">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Train className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Vic Rail Network Visualiser</CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(true)}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Info Section */}
          <Card className="rounded-none border-0 border-b shadow-none">
            <CardContent className="pt-6">
              <InfoOverlay 
                railwayCount={railwayCount} 
                infrastructureCount={infrastructureCount} 
              />
            </CardContent>
          </Card>

          {/* Filters Section */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <Card className="rounded-none border-0 shadow-none">
                <CardContent className="pt-6">
                  <FilterPanel
                    railwayFilters={railwayFilters}
                    infrastructureFilters={infrastructureFilters}
                    toggleRailwayFilter={toggleRailwayFilter}
                    toggleInfrastructureFilter={toggleInfrastructureFilter}
                    toggleAllRailway={toggleAllRailway}
                    toggleAllInfrastructure={toggleAllInfrastructure}
                    railwayCount={railwayCount}
                    infrastructureCount={infrastructureCount}
                  />
                </CardContent>
              </Card>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Expand button when collapsed */}
      {isCollapsed && (
        <Button
          onClick={() => setIsCollapsed(false)}
          className="fixed top-4 left-4 z-[1000] h-12 w-12 rounded-xl shadow-lg"
          size="icon"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar; 