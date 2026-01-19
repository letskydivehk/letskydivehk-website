// Static location data - will be replaced with Firebase later
export interface Location {
  id: string;
  slug: string;
  name: string;
  country: 'Thailand' | 'China';
  city: string;
  hasAFF: boolean;
  hasGroupEvents: boolean;
  comingSoon: boolean;
  imageUrl: string;
  description: string;
  displayOrder: number;
}

export const locations: Location[] = [
  // Thailand Locations
  {
    id: 'pattaya',
    slug: 'pattaya',
    name: 'Thai Sky Adventures Pattaya',
    country: 'Thailand',
    city: 'Pattaya',
    hasAFF: true,
    hasGroupEvents: true,
    comingSoon: false,
    imageUrl: 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=800&h=600&fit=crop',
    description: 'Experience breathtaking views of the Gulf of Thailand with our premier dropzone in Pattaya.',
    displayOrder: 1
  },
  {
    id: 'chiang-mai',
    slug: 'chiang-mai',
    name: 'Northern Sky Chiang Mai',
    country: 'Thailand',
    city: 'Chiang Mai',
    hasAFF: true,
    hasGroupEvents: true,
    comingSoon: false,
    imageUrl: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800&h=600&fit=crop',
    description: 'Jump over the stunning mountains and temples of Northern Thailand.',
    displayOrder: 2
  },
  // China Locations
  {
    id: 'huizhou',
    slug: 'huizhou',
    name: 'Huizhou Skydive Center',
    country: 'China',
    city: 'Huizhou',
    hasAFF: false,
    hasGroupEvents: true,
    comingSoon: false,
    imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&h=600&fit=crop',
    description: 'Scenic coastal views and perfect weather conditions year-round.',
    displayOrder: 3
  },
  {
    id: 'hainan',
    slug: 'hainan',
    name: 'Hainan Island Skydive',
    country: 'China',
    city: 'Hainan',
    hasAFF: true,
    hasGroupEvents: true,
    comingSoon: false,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    description: 'Tropical paradise skydiving with crystal clear ocean views.',
    displayOrder: 4
  },
  {
    id: 'luoding',
    slug: 'luoding',
    name: 'Luoding Sky Sports',
    country: 'China',
    city: 'Luoding',
    hasAFF: false,
    hasGroupEvents: true,
    comingSoon: true,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    description: 'Coming soon - A new adventure destination in Guangdong province.',
    displayOrder: 5
  },
  {
    id: 'zhuhai',
    slug: 'zhuhai',
    name: 'Zhuhai Coastal Skydive',
    country: 'China',
    city: 'Zhuhai',
    hasAFF: false,
    hasGroupEvents: true,
    comingSoon: true,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    description: 'Coming soon - Stunning coastal views near Macau.',
    displayOrder: 6
  }
];

export const getLocationsByCountry = (country: 'Thailand' | 'China') => {
  return locations.filter(loc => loc.country === country).sort((a, b) => a.displayOrder - b.displayOrder);
};

export const getActiveLocations = () => {
  return locations.filter(loc => !loc.comingSoon).sort((a, b) => a.displayOrder - b.displayOrder);
};
