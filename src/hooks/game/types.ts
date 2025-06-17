
export interface ObstacleType {
    id: number;
    x: number;
    width: number;
    height: number;
}

export interface CollectibleType {
    id: number;
    x: number;
    y: number;
}

export interface CollectionEffectType {
    id: number;
    x: number;
    y: number;
}

export interface SplashEffectType {
    id: number;
    x: number;
    y: number;
}

export interface GameState {
    distance: number;
    energy: number;
    playerY: number;
    obstacles: ObstacleType[];
    collectibles: CollectibleType[];
    collectionEffects: CollectionEffectType[];
    splashEffects: SplashEffectType[];
    isSpinning: boolean;
}
