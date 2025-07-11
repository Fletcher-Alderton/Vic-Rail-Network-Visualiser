import { Badge } from '@/components/ui/badge';
import { Train, MapPin, Activity } from 'lucide-react';

interface InfoOverlayProps {
  railwayCount: number;
  infrastructureCount: number;
}

const InfoOverlay = ({ railwayCount, infrastructureCount }: InfoOverlayProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-medium text-foreground">Network Overview</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Train className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-muted-foreground">Railway Lines</span>
          </div>
          <div className="text-xl font-bold text-foreground">{railwayCount.toLocaleString()}</div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="text-xs font-medium text-muted-foreground">Infrastructure</span>
          </div>
          <div className="text-xl font-bold text-foreground">{infrastructureCount.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-muted-foreground">Total Features</span>
        <Badge variant="secondary" className="font-mono">
          {(railwayCount + infrastructureCount).toLocaleString()}
        </Badge>
      </div>
    </div>
  );
};

export default InfoOverlay; 