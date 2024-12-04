import { v4 } from 'uuid';
import ShortUniqueId from 'short-unique-id';

const ShortId = new ShortUniqueId();

export function uuidV4() {
  return v4();
}

export function shortId(size: number = 10) {
  return ShortId.rnd(size);
}

export function generateImageId(name: string) {
  return `${shortId(10)}-${name}`;
}
