import { Product, Unit } from '../types';

export type UnitKind = 'weight' | 'volume' | 'count' | 'none';

export function getUnitKind(unit?: Unit): UnitKind {
  if (!unit) return 'none';
  if (unit === 'kg' || unit === 'gram') return 'weight';
  if (unit === 'litre' || unit === 'ml') return 'volume';
  return 'count';
}

export function toBaseAmount(amount: number, unit: Unit): number {
  const qty = Number.isFinite(amount) ? amount : 0;
  if (unit === 'kg') return Math.round(qty * 1000); // grams
  if (unit === 'gram') return Math.round(qty); // grams
  if (unit === 'litre') return Math.round(qty * 1000); // ml
  if (unit === 'ml') return Math.round(qty); // ml
  // count-like units
  return Math.max(0, Math.floor(qty));
}

export function getPackBaseAmount(product: Product): number {
  const unit = product.unit;
  const qty = product.quantity ?? 1;
  if (!unit) return Math.max(1, Math.floor(qty));
  const base = toBaseAmount(qty, unit);
  return base > 0 ? base : 1;
}

export function normalizeCartQuantity(product: Product, raw: number): number {
  const unit = product.unit;
  const kind = getUnitKind(unit);

  if (kind === 'weight' || kind === 'volume') {
    const q = Math.round(Number.isFinite(raw) ? raw : 0);
    return Math.max(1, q);
  }

  // count or none
  const q = Math.floor(Number.isFinite(raw) ? raw : 0);
  return Math.max(1, q);
}

export function formatCartQuantity(
  product: Product,
  baseAmount: number,
  t: (key: string) => string
): string {
  const unit = product.unit;
  const kind = getUnitKind(unit);

  if (kind === 'weight') {
    const grams = Math.max(0, Math.round(baseAmount));
    const kg = Math.floor(grams / 1000);
    const g = grams % 1000;
    if (kg > 0 && g > 0) return `${kg} ${t('unit.kg')} ${g} ${t('unit.gram')}`;
    if (kg > 0) return `${kg} ${t('unit.kg')}`;
    return `${g} ${t('unit.gram')}`;
  }

  if (kind === 'volume') {
    const ml = Math.max(0, Math.round(baseAmount));
    const litre = Math.floor(ml / 1000);
    const rem = ml % 1000;
    if (litre > 0 && rem > 0) return `${litre} ${t('unit.litre')} ${rem} ${t('unit.ml')}`;
    if (litre > 0) return `${litre} ${t('unit.litre')}`;
    return `${rem} ${t('unit.ml')}`;
  }

  // count or none
  const count = Math.max(0, Math.floor(baseAmount));
  if (unit) return `${count} ${t(`unit.${unit}`)}`;
  return `${count}`;
}

export function formatCartQuantityPlain(product: Product, baseAmount: number): string {
  const unit = product.unit;
  const kind = getUnitKind(unit);

  if (kind === 'weight') {
    const grams = Math.max(0, Math.round(baseAmount));
    const kg = Math.floor(grams / 1000);
    const g = grams % 1000;
    if (kg > 0 && g > 0) return `${kg} kg ${g} g`;
    if (kg > 0) return `${kg} kg`;
    return `${g} g`;
  }

  if (kind === 'volume') {
    const ml = Math.max(0, Math.round(baseAmount));
    const litre = Math.floor(ml / 1000);
    const rem = ml % 1000;
    if (litre > 0 && rem > 0) return `${litre} litre ${rem} ml`;
    if (litre > 0) return `${litre} litre`;
    return `${rem} ml`;
  }

  const count = Math.max(0, Math.floor(baseAmount));
  if (unit === 'packet') return `${count} packets`;
  if (unit === 'piece') return `${count} pcs`;
  if (unit === 'box') return `${count} boxes`;
  if (unit === 'dozen') return `${count} dozen`;
  return unit ? `${count} ${unit}` : `${count}`;
}

export function getLineTotal(product: Product, cartQuantityBase: number): number {
  const packBase = getPackBaseAmount(product);
  const multiplier = cartQuantityBase / packBase;
  return product.price * multiplier;
}

