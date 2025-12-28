
import { SnailData } from './types.ts';

const BASE_URL = 'https://github.com/fraffee/snail-sanctuary/blob/main/';

export const ASSETS = {
  background: `${BASE_URL}background.png?raw=true`, 
  sounds: {
    nature: 'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
    // Satisfying "pop" click sound
    snailClick: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  }
};

// a-z is 26, aa-ee is 5. Total 31.
const SUFFIXES = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'aa', 'bb', 'cc', 'dd', 'ee'
];

export const SNAILS_CONFIG: SnailData[] = SUFFIXES.map((suffix, index) => ({
  id: index + 1,
  image: `${BASE_URL}snail_${suffix}.png?raw=true`,
  cardImage: `${BASE_URL}card_${suffix}.png?raw=true`
}));

export const MOVEMENT_SETTINGS = {
  MIN_SPEED: 0.1, 
  MAX_SPEED: 0.35,
  BOUNDARY_PADDING: -150, // Allow them to wander well off-screen for a "passing through" feel
  SNAIL_RADIUS: 30, // Reduced radius for fewer collisions
};
