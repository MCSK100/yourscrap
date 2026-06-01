import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://yourscrap.vercel.app';
const DEFAULT_IMAGE = 'https://yourscrap.vercel.app/og-scrap.png';

export default function SeoHead({
  title = 'YourScrap - #1 Scrap Pickup Service in Coimbatore | Free Doorstep Collection',
  description = 'Book free scrap pickup in Coimbatore. Top-rated scrap buyer for Iron, Steel, Copper, Aluminum, Plastic, Paper & E-Waste. Same-day pickup. Instant cash payment. 10,000+ happy customers.',
  keywords = 'scrap pickup Coimbatore, scrap buyer Coimbatore, free scrap pickup',
  canonical = '/',
  image = DEFAULT_IMAGE,
  type = 'website',
  publishedTime,
  schema,
  robots,
}) {
  const fullUrl = `${SITE_URL}${canonical}`;

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

      {robots && <meta name="robots" content={robots} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}

      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
