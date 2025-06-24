import MobileOptimizedGame from "../components/game/MobileOptimizedGame";
import { useIsMobile } from "../hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  return (
    <div
      className={
        isMobile
          ? "fixed inset-0 overflow-hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800"
          : "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-purple-800"
      }
    >
      <div
        className={
          isMobile
            ? "w-full max-w-[430px] h-[90vh] m-4 rounded-2xl shadow-2xl bg-black flex items-center justify-center aspect-[9/16]"
            : "w-full max-w-[400px] max-h-[500px] m-4 rounded-2xl shadow-2xl bg-black flex items-center justify-center aspect-[9/16]"
        }
        style={{ boxSizing: "border-box" }}
      >
        <MobileOptimizedGame isMobile={isMobile} />
      </div>
    </div>
  );
};

export default Index;