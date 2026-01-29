import { Category } from '../types';

export function formatCategoryName(category: Category | 'all'): string {
  if (category === 'all') return 'All';
  
  const categoryMap: Record<Category, string> = {
    'staples': 'Staples & Grains',
    'pulses': 'Pulses & Dal',
    'spices': 'Spices & Masala',
    'oil': 'Oil & Condiments',
    'snacks': 'Snacks & Biscuits',
    'beverages': 'Tea, Coffee & Beverages',
    'household': 'Household & Cleaning',
    'personal-care': 'Personal Care',
    'miscellaneous': 'Miscellaneous'
  };

  return categoryMap[category] || category;
}

export function formatCategoryNameShort(category: Category | 'all'): string {
  if (category === 'all') return 'All';

  const shortMap: Record<Category, string> = {
    'staples': 'Staples',
    'pulses': 'Pulses',
    'spices': 'Spices',
    'oil': 'Oil',
    'snacks': 'Snacks',
    'beverages': 'Beverages',
    'household': 'Household',
    'personal-care': 'Personal',
    'miscellaneous': 'Misc',
  };

  return shortMap[category] || category;
}
