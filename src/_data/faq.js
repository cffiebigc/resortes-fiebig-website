// FAQ page. Copy approved by the workshop; the FAQPage structured data is built from this same data.
const site = require("./site");

module.exports = [
  {
    group: "Cotización, plazos y pago",
    items: [
      {
        q: "¿Cuánto cuesta reparar o fabricar un paquete de resortes?",
        a: "Revisamos el paquete y te damos un presupuesto estimado. El valor final puede variar según lo que aparezca al desarmar; si cambia, te avisamos de inmediato, antes de seguir.",
      },
      {
        q: "¿Cuánto demoran?",
        a: "Una camioneta o un camión normal suele quedar listo durante el día, según la carga del taller y el material disponible. Los vehículos más grandes o los trabajos complicados toman más.",
      },
      {
        q: "¿Qué pasa si el paquete falla después del trabajo?",
        a: "Tráelo al taller y evaluamos la falla. Si es de material, y no por sobrecarga o mal uso, respondemos por el repuesto. Si la causa no está clara, lo conversamos.",
      },
      { q: "¿Cómo se paga?", a: "Por transferencia o con tarjeta." },
      {
        q: "¿Puedo cotizar por foto?",
        a: "Sí. Manda una foto del paquete por WhatsApp y te orientamos; el presupuesto se confirma al revisarlo.",
      },
    ],
  },
  {
    group: "El paquete de resortes",
    items: [
      {
        q: "¿Cómo sé si mi paquete está vencido?",
        a: "El vehículo queda más bajo de lo normal, la suspensión golpea contra los topes en los baches, un lado queda más bajo que el otro o las hojas se ven planas.",
      },
      {
        q: "¿Conviene reparar o cambiar el paquete completo?",
        a: "Depende de cómo estén las demás hojas. Si el resto está sano, reparar suele bastar; si varias hojas están vencidas o quebradas, te lo decimos en la revisión.",
      },
      {
        q: "¿Fabrican paquetes que ya no vienen de fábrica?",
        a: "Sí, a medida o según muestra, para cualquier marca y modelo.",
      },
      {
        q: "¿Hacen refuerzos para cargar más?",
        a: "Sí: agregamos hojas o subimos el calibre. El refuerzo no cambia el peso máximo que el fabricante y la ley permiten para el vehículo.",
      },
      {
        q: "¿Trabajan resortes espirales?",
        a: "No, solo paquetes de resortes de hojas.",
      },
      {
        q: "¿Con qué marcas trabajan?",
        a: "Con todas. Entre las más comunes: Mercedes-Benz, Volvo, Scania, Hino y Volkswagen en camiones, y Toyota Hilux, Mitsubishi L200, Ford Ranger y GWM Poer en camionetas.",
      },
    ],
  },
  {
    group: "El taller",
    items: [
      {
        q: "¿Tengo que llevar el vehículo o basta con el paquete?",
        a: "Sirven las dos: traes el vehículo y lo desmontamos, o traes solo el paquete.",
      },
      {
        q: "¿Dónde están?",
        a: `En ${site.address.street}, ${site.address.city}. Es nuestro único taller.`,
      },
      {
        q: "¿Cuál es el horario?",
        a: "Lunes a viernes, de 8:00 a 12:00 y de 14:00 a 18:00. Sábados, domingos y festivos no atendemos.",
      },
      {
        q: "¿Atienden a clientes de Osorno, Chiloé u otras ciudades?",
        a: "Sí. Recibimos clientes de toda la Región de Los Lagos en el taller de Puerto Montt. Si vienes de lejos, avisa por WhatsApp antes y coordinamos.",
      },
    ],
  },
];
