import { Product } from '../types';

export const mockProducts: Product[] = [
  // 🥣 Staples / Grains
  {
    id: 1,
    name: "Basmati Rice",
    price: 85.00,
    category: "staples",
    inStock: true,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    description: "Premium quality Basmati rice, 1kg",
    rating: 4.6
  },
  {
    id: 2,
    name: "Normal Rice",
    price: 45.00,
    category: "staples",
    inStock: true,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    description: "Regular quality rice, 1kg",
    rating: 4.3
  },
  {
    id: 3,
    name: "Wheat (Atta)",
    price: 42.00,
    category: "staples",
    inStock: true,
    image: "https://images.unsplash.com/photo-1593111774240-d529f1b47f97?w=400",
    description: "Whole wheat flour (Atta), 1kg",
    rating: 4.5
  },
  {
    id: 4,
    name: "Maida",
    price: 38.00,
    category: "staples",
    inStock: true,
    image: "https://images.unsplash.com/photo-1593111774240-d529f1b47f97?w=400",
    description: "Refined flour (Maida), 1kg",
    rating: 4.2
  },
  {
    id: 5,
    name: "Sooji (Rava)",
    price: 55.00,
    category: "staples",
    inStock: true,
    image: "https://images.unsplash.com/photo-1593111774240-d529f1b47f97?w=400",
    description: "Semolina (Sooji), 500g",
    rating: 4.4
  },
  {
    id: 6,
    name: "Poha",
    price: 48.00,
    category: "staples",
    inStock: true,
    image: "https://images.unsplash.com/photo-1593111774240-d529f1b47f97?w=400",
    description: "Flattened rice (Poha), 500g",
    rating: 4.3
  },
  {
    id: 7,
    name: "Vermicelli (Seviyan)",
    price: 65.00,
    category: "staples",
    inStock: true,
    image: "https://images.unsplash.com/photo-1593111774240-d529f1b47f97?w=400",
    description: "Vermicelli noodles, 500g",
    rating: 4.5
  },

  // 🌱 Pulses / Dal
  {
    id: 8,
    name: "Arhar dal, Toor dal, Tuvar dal",
    price: 120.00,
    category: "pulses",
    inStock: true,
    image: "/images/split_pigeon_peas_arhar_toor_types_of_lentils_list_in_english_hindi.jpg",
    description: "Premium quality Arhar dal (Toor dal/Tuvar dal), 1kg",
    rating: 4.6
  },
  {
    id: 9,
    name: "Moong dal",
    price: 110.00,
    category: "pulses",
    inStock: true,
    image: "/images/yellow_lentils_moong_mung_types_of_lentils_list_in_english_hindi.jpg",
    description: "Premium quality yellow moong dal, 1kg",
    rating: 4.5
  },
  {
    id: 10,
    name: "Lal masoor dal",
    price: 95.00,
    category: "pulses",
    inStock: true,
    image: "/images/red_lentil_lal_masoor_types_of_lentils_list_in_english_hindi.jpg",
    description: "Red lentil (Lal masoor dal), 1kg",
    rating: 4.4
  },
  {
    id: 11,
    name: "Chana dal",
    price: 105.00,
    category: "pulses",
    inStock: true,
    image: "/images/split_bengal_gram_chana_dal_types_of_lentils_list_in_english_hindi.jpg",
    description: "Split chickpea dal (Chana dal), 1kg",
    rating: 4.5
  },
  {
    id: 12,
    name: "Urad dal",
    price: 130.00,
    category: "pulses",
    inStock: true,
    image: "/images/split_black_gram_urad_dal_chilka_types_of_lentils_list_in_english_hindi-1.jpg",
    description: "Black gram dal (Urad dal), 1kg",
    rating: 4.6
  },
  {
    id: 13,
    name: "Rajma",
    price: 140.00,
    category: "pulses",
    inStock: true,
    image: "/images/kidney-beans-dark.webp",
    description: "Kidney beans (Rajma), 1kg",
    rating: 4.5
  },
  {
    id: 14,
    name: "Chole (Kabuli Chana)",
    price: 125.00,
    category: "pulses",
    inStock: true,
    image: "/images/white-chickpeas.webp",
    description: "White chickpeas (Chole), 1kg",
    rating: 4.5
  },
  {
    id: 61,
    name: "Black Beans",
    price: 145.00,
    category: "pulses",
    inStock: true,
    image: "/images/black-bean.jpg",
    description: "Black beans, 1kg",
    rating: 4.5
  },
  {
    id: 62,
    name: "Black Chickpeas (Kala Chana)",
    price: 135.00,
    category: "pulses",
    inStock: true,
    image: "/images/black-chickpeas.jpg",
    description: "Black chickpeas (Kala chana), 1kg",
    rating: 4.6
  },
  {
    id: 63,
    name: "Black Eyed Beans (Lobia)",
    price: 120.00,
    category: "pulses",
    inStock: true,
    image: "/images/black-eyed-beans.webp",
    description: "Black eyed beans (Lobia), 1kg",
    rating: 4.4
  },
  {
    id: 64,
    name: "Green Chana (Hara Chana)",
    price: 130.00,
    category: "pulses",
    inStock: true,
    image: "/images/green-chana.webp",
    description: "Green chickpeas (Hara chana), 1kg",
    rating: 4.5
  },
  {
    id: 65,
    name: "Green Peas (Matar)",
    price: 90.00,
    category: "pulses",
    inStock: true,
    image: "/images/green-peas.webp",
    description: "Green peas (Matar), 1kg",
    rating: 4.4
  },
  {
    id: 66,
    name: "Pinto Beans",
    price: 150.00,
    category: "pulses",
    inStock: true,
    image: "/images/pinto-bean.jpg",
    description: "Pinto beans, 1kg",
    rating: 4.5
  },
  {
    id: 67,
    name: "Red Cow Peas (Rongi)",
    price: 115.00,
    category: "pulses",
    inStock: true,
    image: "/images/red-cow-peas.webp",
    description: "Red cow peas (Rongi), 1kg",
    rating: 4.4
  },
  {
    id: 68,
    name: "Roasted Chana (Bhuna Chana)",
    price: 140.00,
    category: "pulses",
    inStock: true,
    image: "/images/roasted-chana-with-husk.webp",
    description: "Roasted chickpeas with husk (Bhuna chana), 500g",
    rating: 4.6
  },
  {
    id: 69,
    name: "White Peas (Safed Matar)",
    price: 95.00,
    category: "pulses",
    inStock: true,
    image: "/images/white-peas.webp",
    description: "White peas (Safed matar), 1kg",
    rating: 4.4
  },
  {
    id: 70,
    name: "Whole Moong Beans (Sabut Moong)",
    price: 125.00,
    category: "pulses",
    inStock: true,
    image: "/images/whole-moong-beans.jpg",
    description: "Whole green moong beans (Sabut moong), 1kg",
    rating: 4.5
  },
  {
    id: 71,
    name: "Hari Toor (Green Pigeon Peas)",
    price: 118.00,
    category: "pulses",
    inStock: true,
    image: "/images/split_green_pigeon_peas_hari_toor_types_of_lentils_list_in_english_hindi.jpg",
    description: "Green pigeon peas (Hari toor), 1kg",
    rating: 4.5
  },
  {
    id: 72,
    name: "Urad Dal (Skinned)",
    price: 135.00,
    category: "pulses",
    inStock: true,
    image: "/images/split_skinned_black_gram_urad_dal_types_of_lentils_list_in_english_hindi.jpg",
    description: "Skinned black gram dal (Urad dal), 1kg",
    rating: 4.6
  },

  // 🧂 Spices & Masala
  {
    id: 15,
    name: "Salt",
    price: 18.00,
    category: "spices",
    inStock: true,
    image: "https://images.unsplash.com/photo-1608039829570-1c3c4458c4d5?w=400",
    description: "Iodized salt, 1kg",
    rating: 4.7
  },
  {
    id: 16,
    name: "Turmeric Powder (Haldi)",
    price: 180.00,
    category: "spices",
    inStock: true,
    image: "https://images.unsplash.com/photo-1608039829570-1c3c4458c4d5?w=400",
    description: "Pure turmeric powder, 200g",
    rating: 4.6
  },
  {
    id: 17,
    name: "Red Chilli Powder",
    price: 150.00,
    category: "spices",
    inStock: true,
    image: "https://images.unsplash.com/photo-1608039829570-1c3c4458c4d5?w=400",
    description: "Red chilli powder, 200g",
    rating: 4.5
  },
  {
    id: 18,
    name: "Coriander Powder",
    price: 120.00,
    category: "spices",
    inStock: true,
    image: "https://images.unsplash.com/photo-1608039829570-1c3c4458c4d5?w=400",
    description: "Coriander powder, 200g",
    rating: 4.4
  },
  {
    id: 19,
    name: "Garam Masala",
    price: 95.00,
    category: "spices",
    inStock: true,
    image: "https://images.unsplash.com/photo-1608039829570-1c3c4458c4d5?w=400",
    description: "Garam masala powder, 100g",
    rating: 4.6
  },
  {
    id: 20,
    name: "Cumin Seeds (Jeera)",
    price: 200.00,
    category: "spices",
    inStock: true,
    image: "https://images.unsplash.com/photo-1608039829570-1c3c4458c4d5?w=400",
    description: "Cumin seeds, 200g",
    rating: 4.5
  },
  {
    id: 21,
    name: "Mustard Seeds (Rai)",
    price: 85.00,
    category: "spices",
    inStock: true,
    image: "https://images.unsplash.com/photo-1608039829570-1c3c4458c4d5?w=400",
    description: "Mustard seeds, 200g",
    rating: 4.4
  },
  {
    id: 22,
    name: "Chat Masala",
    price: 75.00,
    category: "spices",
    inStock: true,
    image: "https://images.unsplash.com/photo-1608039829570-1c3c4458c4d5?w=400",
    description: "Chat masala powder, 100g",
    rating: 4.5
  },
  {
    id: 73,
    name: "Dry Ginger Powder (Sonth)",
    price: 195.00,
    category: "spices",
    inStock: true,
    image: "/images/Catch-Dry-Ginger-Powder1.webp",
    description: "Dry ginger powder (Sonth), 200g",
    rating: 4.6
  },
  {
    id: 74,
    name: "Fennel Powder (Saunf Powder)",
    price: 110.00,
    category: "spices",
    inStock: true,
    image: "/images/Catch-Saunf-Powder.webp",
    description: "Fennel powder (Saunf powder), 200g",
    rating: 4.5
  },
  {
    id: 75,
    name: "Yellow Chilli Powder",
    price: 145.00,
    category: "spices",
    inStock: true,
    image: "/images/Catch-Yellow-Chilli-Powder1.webp",
    description: "Yellow chilli powder, 200g",
    rating: 4.5
  },

  // 🫙 Oil, Ghee & Condiments
  {
    id: 23,
    name: "Mustard Oil",
    price: 135.00,
    category: "oil",
    inStock: true,
    image: "https://images.unsplash.com/photo-1474979266404-7ea8b4d0e65e?w=400",
    description: "Pure mustard oil, 1 liter",
    rating: 4.5
  },
  {
    id: 24,
    name: "Sunflower Oil",
    price: 125.00,
    category: "oil",
    inStock: true,
    image: "https://images.unsplash.com/photo-1474979266404-7ea8b4d0e65e?w=400",
    description: "Refined sunflower oil, 1 liter",
    rating: 4.4
  },
  {
    id: 25,
    name: "Ghee",
    price: 580.00,
    category: "oil",
    inStock: true,
    image: "https://images.unsplash.com/photo-1474979266404-7ea8b4d0e65e?w=400",
    description: "Pure desi ghee, 1kg",
    rating: 4.7
  },
  {
    id: 26,
    name: "Butter",
    price: 85.00,
    category: "oil",
    inStock: true,
    image: "https://images.unsplash.com/photo-1474979266404-7ea8b4d0e65e?w=400",
    description: "Amul butter, 100g",
    rating: 4.6
  },
  {
    id: 27,
    name: "Tomato Ketchup",
    price: 65.00,
    category: "oil",
    inStock: true,
    image: "https://images.unsplash.com/photo-1474979266404-7ea8b4d0e65e?w=400",
    description: "Tomato ketchup, 500g",
    rating: 4.5
  },
  {
    id: 28,
    name: "Pickles (Achar)",
    price: 95.00,
    category: "oil",
    inStock: true,
    image: "https://images.unsplash.com/photo-1474979266404-7ea8b4d0e65e?w=400",
    description: "Mixed pickle, 500g",
    rating: 4.4
  },

  // 🍪 Snacks & Biscuits
  {
    id: 34,
    name: "Biscuits",
    price: 45.00,
    category: "snacks",
    inStock: true,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
    description: "Assorted biscuits, 200g",
    rating: 4.5
  },
  {
    id: 35,
    name: "Namkeen",
    price: 85.00,
    category: "snacks",
    inStock: true,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
    description: "Mixed namkeen, 250g",
    rating: 4.4
  },
  {
    id: 36,
    name: "Chips",
    price: 20.00,
    category: "snacks",
    inStock: true,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
    description: "Potato chips, 50g",
    rating: 4.3
  },
  {
    id: 37,
    name: "Kurkure",
    price: 20.00,
    category: "snacks",
    inStock: true,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
    description: "Kurkure snack, 50g",
    rating: 4.4
  },
  {
    id: 38,
    name: "Bread",
    price: 35.00,
    category: "snacks",
    inStock: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    description: "White bread, 400g",
    rating: 4.3
  },
  {
    id: 39,
    name: "Rusk",
    price: 55.00,
    category: "snacks",
    inStock: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    description: "Butter rusk, 200g",
    rating: 4.5
  },

  // 🍫 Tea, Coffee & Beverages
  {
    id: 40,
    name: "Tea",
    price: 120.00,
    category: "beverages",
    inStock: true,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    description: "Premium tea leaves, 250g",
    rating: 4.6
  },
  {
    id: 41,
    name: "Coffee",
    price: 280.00,
    category: "beverages",
    inStock: true,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    description: "Instant coffee powder, 200g",
    rating: 4.5
  },
  {
    id: 42,
    name: "Sugar",
    price: 48.00,
    category: "beverages",
    inStock: true,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    description: "White sugar, 1kg",
    rating: 4.4
  },
  {
    id: 43,
    name: "Jaggery (Gur)",
    price: 65.00,
    category: "beverages",
    inStock: true,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    description: "Organic jaggery, 500g",
    rating: 4.5
  },
  {
    id: 44,
    name: "Soft Drinks",
    price: 35.00,
    category: "beverages",
    inStock: true,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
    description: "Cold drink, 750ml",
    rating: 4.2
  },
  {
    id: 45,
    name: "Fruit Juice",
    price: 85.00,
    category: "beverages",
    inStock: true,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
    description: "Mixed fruit juice, 1 liter",
    rating: 4.4
  },

  // 🧼 Household & Cleaning
  {
    id: 46,
    name: "Detergent Powder",
    price: 180.00,
    category: "household",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Washing detergent powder, 1kg",
    rating: 4.5
  },
  {
    id: 47,
    name: "Washing Soap",
    price: 25.00,
    category: "household",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Laundry soap bar, 125g",
    rating: 4.4
  },
  {
    id: 48,
    name: "Dishwash Liquid",
    price: 95.00,
    category: "household",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Dishwashing liquid, 750ml",
    rating: 4.5
  },
  {
    id: 49,
    name: "Floor Cleaner",
    price: 120.00,
    category: "household",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Floor cleaning liquid, 1 liter",
    rating: 4.4
  },
  {
    id: 50,
    name: "Garbage Bags",
    price: 85.00,
    category: "household",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Garbage bags, pack of 20",
    rating: 4.3
  },

  // 🪥 Personal Care
  {
    id: 51,
    name: "Soap",
    price: 35.00,
    category: "personal-care",
    inStock: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    description: "Bathing soap bar, 125g",
    rating: 4.5
  },
  {
    id: 52,
    name: "Shampoo",
    price: 180.00,
    category: "personal-care",
    inStock: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    description: "Hair shampoo, 400ml",
    rating: 4.5
  },
  {
    id: 53,
    name: "Toothpaste",
    price: 95.00,
    category: "personal-care",
    inStock: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    description: "Toothpaste, 200g",
    rating: 4.6
  },
  {
    id: 54,
    name: "Toothbrush",
    price: 45.00,
    category: "personal-care",
    inStock: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    description: "Soft bristle toothbrush",
    rating: 4.4
  },
  {
    id: 55,
    name: "Hair Oil",
    price: 120.00,
    category: "personal-care",
    inStock: true,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    description: "Coconut hair oil, 200ml",
    rating: 4.5
  },

  // 🧴 Miscellaneous
  {
    id: 56,
    name: "Matchbox",
    price: 2.00,
    category: "miscellaneous",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Safety matchbox",
    rating: 4.3
  },
  {
    id: 57,
    name: "Candles",
    price: 45.00,
    category: "miscellaneous",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Pack of 6 candles",
    rating: 4.2
  },
  {
    id: 58,
    name: "Agarbatti",
    price: 25.00,
    category: "miscellaneous",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Incense sticks, pack of 2",
    rating: 4.4
  },
  {
    id: 59,
    name: "Aluminium Foil",
    price: 85.00,
    category: "miscellaneous",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Aluminium foil, 25 meters",
    rating: 4.3
  },
  {
    id: 60,
    name: "Paper Napkins",
    price: 35.00,
    category: "miscellaneous",
    inStock: true,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
    description: "Paper napkins, pack of 2",
    rating: 4.4
  }
];
