import MobileOptimizedGame from "../components/game/MobileOptimizedGame";

const Index = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Mobile Portrait: 9:16 ratio, Desktop/Landscape: 3:2 ratio with max width 600px */}
      <div className="w-full h-full max-w-sm aspect-[9/16] md:max-w-[600px] md:aspect-[3/2] md:max-h-screen">
        <MobileOptimizedGame />
      </div>
    </div>
  );
};

export default Index;