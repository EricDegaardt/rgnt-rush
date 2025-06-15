
import Game from "@/components/game/Game";

const Index = () => {
  return (
    <div className="w-screen h-screen font-press-start bg-black flex items-center justify-center overflow-hidden p-2">
      <div className="w-full h-full max-w-md max-h-full">
        <Game />
      </div>
    </div>
  );
};

export default Index;
