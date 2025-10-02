import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, url, image }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Social */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Google Search Console verification */}
      <meta
        name="google-site-verification"
        content="v4HAo6qLysy3J6jnJvDOn81xHBqZTZpoxs2ssYGMCRg"
      />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "VedAI",
          url: url,
          description: description,
          publisher: { "@type": "Organization", name: "VedAI" },
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
