import MobileOptimizedGame from "../components/game/MobileOptimizedGame";

const Index = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* 2:3 aspect ratio for taller portrait experience */}
      <div className="w-full max-w-sm aspect-[2/3]">
        <MobileOptimizedGame />
      </div>
    </div>
  );
};

export default Index;