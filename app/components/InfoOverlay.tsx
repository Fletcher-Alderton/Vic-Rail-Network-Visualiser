interface InfoOverlayProps {
  railwayCount: number;
  infrastructureCount: number;
}

const InfoOverlay = ({ railwayCount, infrastructureCount }: InfoOverlayProps) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border p-3">
      <h2 className="text-sm font-semibold text-gray-800 mb-2">Vic Rail Network Visualiser</h2>
      <div className="text-xs text-gray-600">
        <div>Showing {railwayCount} railways</div>
        <div>Showing {infrastructureCount} infrastructure points</div>
      </div>
    </div>
  );
};

export default InfoOverlay; 