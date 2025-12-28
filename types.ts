
export interface SnailData {
  id: number;
  image: string;
  cardImage: string;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface SnailState {
  id: number;
  position: Vector2;
  laneY: number;      // Fixed Y position (lane)
  speed: number;      // Horizontal velocity
  direction: number;  // 1 for Right, -1 for Left
}
