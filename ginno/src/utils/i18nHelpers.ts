import { Product, Category, QuickEntry, BlindBox, Language } from '../types';

export function getProductTitle(product: Product | undefined | null, lang: Language): string {
  if (!product) return '';
  if (lang === 'ZH' && product.titleZh) return product.titleZh;
  if (lang === 'TL' && product.titleTl) return product.titleTl;
  return product.titleEn || '';
}

export function getCategoryName(category: Category | undefined | null, lang: Language): string {
  if (!category) return '';
  if (lang === 'ZH' && category.nameZh) return category.nameZh;
  if (lang === 'TL' && category.nameTl) return category.nameTl;
  return category.nameEn || '';
}

export function getQuickEntryTitle(entry: QuickEntry | undefined | null, lang: Language): string {
  if (!entry) return '';
  if (lang === 'ZH' && entry.titleZh) return entry.titleZh;
  if (lang === 'TL' && entry.titleTl) return entry.titleTl;
  return entry.titleEn || '';
}

export function getBlindBoxTitle(box: BlindBox | undefined | null, lang: Language): string {
  if (!box) return '';
  if (lang === 'ZH' && box.titleZh) return box.titleZh;
  if (lang === 'TL' && box.titleTl) return box.titleTl;
  return box.titleEn || '';
}
