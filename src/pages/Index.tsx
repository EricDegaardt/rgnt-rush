import MobileOptimizedGame from "../components/game/MobileOptimizedGame";

const Index = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Consistent mobile-optimized size for all devices */}
      <div className="w-full max-w-sm aspect-[4/5] h-full max-h-[80vh]">
        <MobileOptimizedGame />
      </div>
    </div>
  );
};

export default Index;