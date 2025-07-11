import MobileOptimizedGame from "../components/game/MobileOptimizedGame";
import BoltBadge from "../components/ui/BoltBadge";
import { useIsMobile } from "../hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  return (
    <div
      className={
        isMobile
          ? "fixed inset-0 overflow-hidden w-full h-full flex items-center justify-center bg-black"
          : "min-h-screen w-full flex items-center justify-center"
      }
      style={{
        backgroundImage: "url('/lovable-uploads/rgnt-start-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Bolt.new Badge */}
      <BoltBadge />
      
      <div
        className={
          isMobile
            ? "w-full h-full max-w-[430px] max-h-[100dvh] flex items-center justify-center"
            : "w-full max-w-[546px] max-h-[700px] m-4 rounded-2xl shadow-2xl bg-black flex items-center justify-center aspect-[9/16]"
        }
        style={{ boxSizing: "border-box" }}
      >
        <MobileOptimizedGame isMobile={isMobile} />
      </div>
    </div>
  );
};

export default Index;