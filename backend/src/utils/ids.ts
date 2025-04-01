import { v4 } from 'uuid';
import ShortUniqueId from 'short-unique-id';
import { randomBytes } from 'crypto';

const ShortId = new ShortUniqueId();

export function uuidV4() {
  return v4();
}

export function shortId(size: number = 10) {
  // return ShortId.rnd(size); // deprecated
  return generateShortId(size);
}

export function generateImageId(name: string) {
  return `${shortId(10)}-${name}`;
}

export function generateShortId(length: number = 14): string {
  if (length < 10) {
    throw new Error(
      'Length must be at least 10 characters for reasonable uniqueness',
    );
  }

  // Usa alta resolução de tempo (nanosegundos) em base 36
  const timestamp = process.hrtime.bigint().toString(36);

  // Calcula quantos caracteres sobram para a parte aleatória
  const randomLength = length - timestamp.length - 1;

  // Gera bytes aleatórios com crypto e converte para base 36
  const randomPart = randomBytes(Math.ceil(randomLength / 2)) // Ajusta o número de bytes
    .toString('base64') // Usa base64 para mais densidade de caracteres
    .replace(/[^a-zA-Z0-9]/g, '') // Remove caracteres inválidos como +, /
    .slice(0, randomLength > 0 ? randomLength : 1); // Garante pelo menos 1 caractere

  // Combina timestamp e parte aleatória
  const fullId = `${timestamp}${randomPart}`;

  // Retorna o ID cortado para o comprimento desejado
  return fullId.slice(0, length);
}
