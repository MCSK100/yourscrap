import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://yourscrap.vercel.app';
const DEFAULT_IMAGE = 'https://yourscrap.vercel.app/og-scrap.png';

const BASE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  'name': 'YourScrap',
  'description': 'Premium scrap pickup and recycling service in Coimbatore. We buy Iron, Steel, Copper, Aluminum, Brass, Plastic, Paper, and E-Waste at best market rates.',
  'url': SITE_URL,
  'telephone': '+919080405581',
  'image': DEFAULT_IMAGE,
  'priceRange': '₹',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Coimbatore',
    'addressRegion': 'Tamilnadu',
    'addressCountry': 'IN'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': '11.0168',
    'longitude': '76.9558'
  },
  'openingHoursSpecification': [
    {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      'opens': '09:00',
      'closes': '19:00'
    }
  ]
};

export default function SeoHead({
  title = 'YourScrap - #1 Scrap Pickup Service in Coimbatore | Free Doorstep Collection',
  description = 'Book free scrap pickup in Coimbatore. Top-rated scrap buyer for Iron, Steel, Copper, Aluminum, Plastic, Paper & E-Waste. Same-day pickup. Instant cash payment. 10,000+ happy customers.',
  keywords = 'scrap pickup Coimbatore, scrap buyer Coimbatore, scrap collection Coimbatore, waste pickup Coimbatore, iron scrap price, copper scrap buyer, paper scrap buyer, e-waste collection Coimbatore',
  canonical = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  schema = [],
  robots = 'index, follow',
}) {
  const fullUrl = `${SITE_URL}${canonical}`;
  const combinedSchema = Array.isArray(schema) ? [BASE_SCHEMA, ...schema] : [BASE_SCHEMA, schema];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="YourScrap" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="robots" content={robots} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {combinedSchema.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
