import { Helmet } from 'react-helmet-async';

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Let's Skydive HK",
    url: 'https://letskydivehk.lovable.app',
    logo: 'https://storage.googleapis.com/gpt-engineer-file-uploads/YIBNqLgbMzXE1mF8E9QRc5LQB1d2/uploads/1769564707933-We operate in.png.PNG',
    description: "Asia's premier skydiving experience provider. Professional tandem jumps, AFF courses & group events across Thailand and China.",
    sameAs: [
      'https://www.instagram.com/letsskydivehk/',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'letskydivehk@gmail.com',
      availableLanguage: ['English', 'Chinese'],
    },
    areaServed: [
      { '@type': 'Country', name: 'Thailand' },
      { '@type': 'Country', name: 'China' },
      { '@type': 'Country', name: 'Hong Kong' },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

interface LocalBusinessJsonLdProps {
  name: string;
  description: string;
  city: string;
  country: string;
  url: string;
  image?: string;
}

export function LocalBusinessJsonLd({ name, description, city, country, url, image }: LocalBusinessJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name,
    description,
    url,
    ...(image && { image }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: country,
    },
    sport: 'Skydiving',
    parentOrganization: {
      '@type': 'Organization',
      name: "Let's Skydive HK",
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
