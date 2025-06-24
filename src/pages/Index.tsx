import MobileOptimizedGame from "../components/game/MobileOptimizedGame";
import { useIsMobile } from "../hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800">
      <div
        className={
          isMobile
            ? "w-full h-[90vh] m-4 rounded-2xl shadow-2xl bg-black flex items-center justify-center"
            : "max-h-[500px] max-w-[700px] w-full h-full m-4 rounded-2xl shadow-2xl bg-black flex items-center justify-center"
        }
        style={{ boxSizing: "border-box" }}
      >
        <MobileOptimizedGame isMobile={isMobile} />
      </div>
    </div>
  );
};

export default Index;