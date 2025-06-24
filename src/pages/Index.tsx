import MobileOptimizedGame from "../components/game/MobileOptimizedGame";

const Index = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Mobile Portrait: 2:3 ratio, Desktop/Landscape: 16:9 ratio */}
      <div className="w-full h-full max-w-sm aspect-[2/3] md:max-w-none md:aspect-video md:max-h-screen">
        <MobileOptimizedGame />
      </div>
    </div>
  );
};

export default Index;