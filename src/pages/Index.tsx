import MobileOptimizedGame from "../components/game/MobileOptimizedGame";

const Index = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* 4:5 aspect ratio for consistent mobile experience */}
      <div className="w-full max-w-sm aspect-[4/5]">
        <MobileOptimizedGame />
      </div>
    </div>
  );
};

export default Index;