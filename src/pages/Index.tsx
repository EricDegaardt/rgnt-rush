import MobileOptimizedGame from "../components/game/MobileOptimizedGame";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 bg-gradient-to-br from-purple-900 via-black to-indigo-900">
      {/* Responsive game window: 100vh on mobile, max-h-[600px] on desktop */}
      <div
        className="w-full max-w-sm aspect-[2/3] h-[100vh] max-h-[600px] shadow-2xl rounded-xl overflow-hidden border border-purple-800"
        style={{ background: '#18181b' }}
      >
        <MobileOptimizedGame />
      </div>
    </div>
  );
};

export default Index;