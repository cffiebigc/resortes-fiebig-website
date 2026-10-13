// Structured data built from the same data the pages render, so both always say the same.
function serviceSchema(service, site) {
  const url = `${site.url}servicios/${service.slug}/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#servicio`,
        name: service.h1,
        description: service.description,
        url,
        serviceType: service.card,
        areaServed: site.address.region,
        provider: {
          "@type": "AutoRepair",
          "@id": `${site.url}#taller`,
          name: site.name,
          url: site.url,
          telephone: site.phone.e164,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
          { "@type": "ListItem", position: 2, name: service.h1, item: url },
        ],
      },
    ],
  };
}

module.exports = { serviceSchema };
