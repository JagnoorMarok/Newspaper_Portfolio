import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  type?: string;
  name?: string;
  image?: string;
}

export default function SEO({ 
  title, 
  description, 
  type = 'website',
  name = 'Jagnoor Singh Marok',
  image = '/favicon.svg'
}: SEOProps) {
  const fullTitle = title ? `${title} | ${name}` : `The Marok Gazette | ${name}`;
  const metaDescription = description || "The personal portfolio and chronicle of Jagnoor Singh Marok: Computer Scientist, Designer, and Sketcher of Worlds.";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={metaDescription} />
      
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
