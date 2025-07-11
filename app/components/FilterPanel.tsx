import { FilterState, railwayTypes, infrastructureTypes, FeatureTypeInfo } from '../types';

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

const FilterPanel = ({
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
  return (
    <>
      {/* Filter Control Button */}
      <div className="absolute top-4 right-4 z-[1000]">
        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className="bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border p-3 hover:bg-white transition-colors"
        >
          <span className="text-sm font-medium">🔍 Filters</span>
        </button>
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="absolute top-4 right-20 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border p-4 max-h-[80vh] overflow-y-auto">
          <div className="w-80">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Layer Filters</h3>
            
            {/* Railway Lines Filters */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Railway Lines</h4>
                <div className="space-x-2">
                  <button
                    onClick={() => toggleAllRailway(true)}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    All
                  </button>
                  <button
                    onClick={() => toggleAllRailway(false)}
                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {Object.keys(railwayFilters).map(type => {
                  const typeInfo = getFeatureTypeInfo(type, true);
                  return (
                    <label key={type} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={railwayFilters[type] || false}
                        onChange={() => toggleRailwayFilter(type)}
                        className="rounded"
                      />
                      <span className="text-lg">{typeInfo.icon}</span>
                      <div className="w-3 h-2 rounded" style={{ backgroundColor: typeInfo.color }}></div>
                      <span className="text-gray-700">{typeInfo.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Infrastructure Points Filters */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Infrastructure Points</h4>
                <div className="space-x-2">
                  <button
                    onClick={() => toggleAllInfrastructure(true)}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    All
                  </button>
                  <button
                    onClick={() => toggleAllInfrastructure(false)}
                    className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {Object.keys(infrastructureFilters).map(type => {
                  const typeInfo = getFeatureTypeInfo(type, false);
                  return (
                    <label key={type} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={infrastructureFilters[type] || false}
                        onChange={() => toggleInfrastructureFilter(type)}
                        className="rounded"
                      />
                      <span className="text-lg">{typeInfo.icon}</span>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: typeInfo.color }}></div>
                      <span className="text-gray-700">{typeInfo.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="border-t pt-3 text-xs text-gray-600">
              <div>Railways: {railwayCount} / {totalRailwayCount}</div>
              <div>Infrastructure: {infrastructureCount} / {totalInfrastructureCount}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterPanel; 