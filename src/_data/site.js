const ADDRESS_QUERY = "G%C3%A9nesis+39%2C+Parque+Industrial+Recondo%2C+Puerto+Montt";

module.exports = {
  origin: "https://www.resortesfiebig.cl",
  url: "https://www.resortesfiebig.cl/",
  name: "Resortes Fiebig",
  phone: {
    display: "(65) 226 3566",
    international: "+56 65 226 3566",
    href: "tel:+56652263566",
  },
  whatsapp: "https://wa.me/56995190145?text=Hola%2C%20quiero%20cotizar%20un%20paquete%20de%20resortes",
  email: "contacto@resortesfiebig.cl",
  address: {
    street: "Génesis 39, Parque Industrial Recondo",
    city: "Puerto Montt",
    region: "Región de Los Lagos",
  },
  maps: {
    directions: `https://www.google.com/maps/dir/?api=1&destination=${ADDRESS_QUERY}`,
    search: `https://www.google.com/maps/search/?api=1&query=${ADDRESS_QUERY}`,
    embed: `https://www.google.com/maps?q=${ADDRESS_QUERY}&z=15&output=embed`,
  },
  hours: "Lunes a viernes, 8:00 a 12:00 y 14:00 a 18:00",
};
