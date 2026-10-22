export interface Poster {
  id: string;
  title: string;
  shortTitle: string;
  category: string;
  categorySlug: 'security' | 'equality' | 'investigation' | 'governance' | 'leadership';
  quote: string;
  description: string;
  detailPoints: string[];
  impactStat: string;
  imagePath: string;
  suggestedShareText: string;
  altText: string;
}

export type CategoryFilter = 'all' | 'security' | 'equality' | 'investigation' | 'governance' | 'leadership';
