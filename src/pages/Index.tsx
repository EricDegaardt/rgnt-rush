import MobileOptimizedGame from "../components/game/MobileOptimizedGame";

const Index = () => {
  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="w-full h-full max-w-sm">
        <MobileOptimizedGame />
      </div>
    </div>
  );
};

export default Index;