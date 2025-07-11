import React, { useState, useRef, useEffect } from 'react';
import { FilterState, railwayTypes, infrastructureTypes, FeatureTypeInfo } from '../types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Train, MapPin, Filter, CheckSquare, Square } from 'lucide-react';

interface FilterPanelProps {
  showFilterPanel: boolean;
  setShowFilterPanel: (show: boolean) => void;
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

// Get feature type info with fallback
const getFeatureTypeInfo = (type: string, isRailway: boolean = false): FeatureTypeInfo => {
  const typeMap = isRailway ? railwayTypes : infrastructureTypes;
  return typeMap[type as keyof typeof typeMap] || { 
    label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
    color: '#ef4444', 
    icon: '📍' 
  };
};

interface ScrollFadeContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollFadeContainer = ({ children, className = '' }: ScrollFadeContainerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  const checkScrollPosition = () => {
    const element = scrollRef.current;
    if (!element) return;

    const { scrollTop, scrollHeight, clientHeight } = element;
    setCanScrollUp(scrollTop > 0);
    setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
  };

  useEffect(() => {
    checkScrollPosition();
  }, [children]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    element.addEventListener('scroll', checkScrollPosition);
    window.addEventListener('resize', checkScrollPosition);

    return () => {
      element.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, []);

  return (
    <div className="relative">
      {/* Top fade */}
      {canScrollUp && (
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      )}
      
      <div
        ref={scrollRef}
        className={className}
        onScroll={checkScrollPosition}
      >
        {children}
      </div>
      
      {/* Bottom fade */}
      {canScrollDown && (
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      )}
    </div>
  );
};

const FilterPanel = React.memo(({
  showFilterPanel,
  setShowFilterPanel,
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
}: FilterPanelProps) => {
  const railwayFilterCount = Object.values(railwayFilters).filter(Boolean).length;
  const infrastructureFilterCount = Object.values(infrastructureFilters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-base font-semibold text-foreground">Layer Filters</h3>
      </div>
      
      {/* Railway Lines Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Train className="h-4 w-4 text-blue-600" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Railway Lines
              </h4>
              <p className="text-xs text-muted-foreground">
                {railwayFilterCount} of {Object.keys(railwayFilters).length} enabled
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {railwayCount.toLocaleString()}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAllRailway(true)}
            className="flex-1 h-8 text-xs"
          >
            <CheckSquare className="h-3 w-3 mr-1" />
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAllRailway(false)}
            className="flex-1 h-8 text-xs"
          >
            <Square className="h-3 w-3 mr-1" />
            None
          </Button>
        </div>
        
        <ScrollFadeContainer className="space-y-2 max-h-64 overflow-y-auto">
          {Object.keys(railwayFilters).map(type => {
            const typeInfo = getFeatureTypeInfo(type, true);
            return (
              <div key={type} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`railway-${type}`}
                  checked={railwayFilters[type] || false}
                  onCheckedChange={() => toggleRailwayFilter(type)}
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm">{typeInfo.icon}</span>
                  <div 
                    className="w-3 h-2 rounded-sm flex-shrink-0" 
                    style={{ backgroundColor: typeInfo.color }}
                  />
                  <label 
                    htmlFor={`railway-${type}`}
                    className="text-sm text-foreground cursor-pointer truncate"
                  >
                    {typeInfo.label}
                  </label>
                </div>
              </div>
            );
          })}
        </ScrollFadeContainer>
      </div>

      <Separator />

      {/* Infrastructure Points Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-green-600" />
            <div>
              <h4 className="text-sm font-medium text-foreground">
                Infrastructure Points
              </h4>
              <p className="text-xs text-muted-foreground">
                {infrastructureFilterCount} of {Object.keys(infrastructureFilters).length} enabled
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {infrastructureCount.toLocaleString()}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAllInfrastructure(true)}
            className="flex-1 h-8 text-xs"
          >
            <CheckSquare className="h-3 w-3 mr-1" />
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleAllInfrastructure(false)}
            className="flex-1 h-8 text-xs"
          >
            <Square className="h-3 w-3 mr-1" />
            None
          </Button>
        </div>
        
        <ScrollFadeContainer className="space-y-2 max-h-64 overflow-y-auto">
          {Object.keys(infrastructureFilters).map(type => {
            const typeInfo = getFeatureTypeInfo(type, false);
            return (
              <div key={type} className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={`infrastructure-${type}`}
                  checked={infrastructureFilters[type] || false}
                  onCheckedChange={() => toggleInfrastructureFilter(type)}
                />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm">{typeInfo.icon}</span>
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: typeInfo.color }}
                  />
                  <label 
                    htmlFor={`infrastructure-${type}`}
                    className="text-sm text-foreground cursor-pointer truncate"
                  >
                    {typeInfo.label}
                  </label>
                </div>
              </div>
            );
          })}
        </ScrollFadeContainer>
      </div>
    </div>
  );
});

export default FilterPanel; 