import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: string;
}

const SITE_NAME = "Let's Skydive HK";
const BASE_URL = 'https://letskydivehk.com';
const DEFAULT_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/YIBNqLgbMzXE1mF8E9QRc5LQB1d2/social-images/social-1769577669200-We operate in.png.PNG';
const DEFAULT_DESCRIPTION = "Asia's premier skydiving experience. Professional tandem jumps, A-Licence courses & group events across Thailand and China. Book your adventure today!";

export function SEO({ title, description, path = '/', image, type = 'website' }: SEOProps) {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Skydiving Adventures Across Asia`;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const pageUrl = `${BASE_URL}${path}`;
  const pageImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
    </Helmet>
  );
}
