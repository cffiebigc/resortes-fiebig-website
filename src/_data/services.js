// Service pages. Copy approved by the workshop; order matches the home cards.
const QUOTE_AND_TURNAROUND =
  "Revisamos el paquete y te damos un presupuesto estimado. El valor final puede variar según lo que aparezca al desarmar; si cambia, te avisamos de inmediato. Una camioneta o un camión normal suele quedar listo durante el día, según la carga del taller y el material disponible.";

module.exports = [
  {
    slug: "fabricacion-de-paquetes-de-resortes",
    card: "Fabricación de paquetes completos",
    cardText: "A medida o según muestra, para cualquier marca y modelo. También paquetes que ya no vienen de fábrica.",
    title: "Fabricación de paquetes de resortes en Puerto Montt",
    h1: "Fabricación de paquetes de resortes en Puerto Montt",
    description:
      "Fabricamos paquetes de resortes a medida o según muestra, para cualquier marca y modelo, incluso los que ya no vienen de fábrica.",
    whatsapp: "Hola, quiero cotizar la fabricación de un paquete de resortes",
    intro:
      "Fabricamos paquetes de resortes completos en nuestro taller de Puerto Montt, a medida o copiando una muestra, para camiones, camionetas, buses, remolques y maquinaria. Sirve cuando el paquete original ya no se consigue, cuando ya no conviene repararlo o cuando necesitas uno con otras medidas.",
    sections: [
      {
        heading: "Cuándo conviene fabricar uno nuevo",
        items: [
          "El paquete original ya no viene de fábrica o el repuesto no llega.",
          "El paquete está muy vencido, con varias hojas quebradas.",
          "Un remolque o carro hecho a pedido que no tiene paquete de catálogo.",
          "Necesitas más capacidad de carga (ver refuerzos).",
        ],
      },
      {
        heading: "Cómo lo hacemos",
        steps: [
          "Tomamos las medidas del paquete o de la muestra: largo, ancho y espesor de cada hoja, cantidad de hojas, arco y ojos.",
          "Cortamos, curvamos y armamos las hojas en el taller.",
          "Armamos el paquete con perno centro, abrazaderas y bujes nuevos, y lo montamos.",
        ],
      },
      {
        heading: "Qué necesitamos para cotizar",
        text: "El paquete viejo, una muestra o sus medidas, y la marca y el modelo del vehículo.",
      },
      {
        heading: "Marcas",
        text: "Trabajamos con todas. Entre las más comunes en camiones están Mercedes-Benz, Volvo, Scania, Chevrolet, Volkswagen, Hino, Fuso, JAC, Foton, Renault, International, Iveco y Freightliner; en camionetas, Toyota Hilux, Mitsubishi L200, GWM Poer, Ford Ranger, Maxus T60, Ford F-150, Chevrolet Silverado y Colorado, Mazda BT-50 y JMC Grand Avenue.",
      },
      {
        heading: "Cotización y plazo",
        text: "Te damos un presupuesto estimado con la muestra o las medidas. El plazo depende del paquete y te lo confirmamos al cotizar.",
      },
    ],
    faqs: [
      {
        q: "¿Fabrican paquetes que ya no vienen de fábrica?",
        a: "Sí. Los hacemos a medida o según muestra, para cualquier marca y modelo.",
      },
      {
        q: "¿Pueden hacer un paquete con más capacidad de carga?",
        a: "Sí: agregamos hojas o subimos el calibre. Lo vemos contigo según lo que carga el vehículo.",
      },
      {
        q: "¿Tengo que traer el paquete viejo?",
        a: "Es lo ideal, porque sirve de muestra. Si no lo tienes, con las medidas también se puede.",
      },
    ],
    related: ["refuerzo-de-resortes", "hojas-de-resorte-a-medida", "reparacion-de-paquetes-de-resortes"],
  },
  {
    slug: "reparacion-de-paquetes-de-resortes",
    card: "Reparación de paquetes",
    cardText: "Cambio de hojas quebradas, hoja madre, perno centro y abrazaderas. Reemplazamos solo lo que falla.",
    title: "Reparación de paquetes de resortes en Puerto Montt",
    h1: "Reparación de paquetes de resortes en Puerto Montt",
    description:
      "Cambiamos hojas quebradas, hoja madre, perno centro y abrazaderas, y reparamos solo lo que falla. Taller en Puerto Montt desde 1994.",
    whatsapp: "Hola, quiero cotizar la reparación de un paquete de resortes",
    intro:
      "Reparamos paquetes de resortes de camiones, camionetas, buses y remolques en nuestro taller del Parque Industrial Recondo, en Puerto Montt. Cambiamos la hoja quebrada, la hoja madre, el perno centro o las abrazaderas que fallan, sin reemplazar el paquete completo cuando no hace falta.",
    sections: [
      {
        heading: "Cuándo conviene revisarlo",
        items: [
          "Una hoja quebrada o trizada a la vista.",
          "El vehículo quedó más bajo o se inclina hacia un lado.",
          "Golpes o crujidos en la suspensión al pasar por ripio o baches.",
          "Las hojas se corrieron hacia un costado, señal de un perno centro cortado.",
          "Juego en los ojos o en los bujes.",
        ],
      },
      {
        heading: "Cómo lo hacemos",
        steps: [
          "Revisamos el paquete: hojas, ojos, bujes y accesorios.",
          "Te damos un presupuesto estimado con lo que conviene reparar y lo que conviene reemplazar.",
          "Desarmamos el paquete, cambiamos lo que falla y curvamos las hojas nuevas al arco del paquete. Si al desarmar aparece otra hoja quebrada, te avisamos antes de seguir.",
          "Armamos el paquete, lo montamos y queda listo para cargar.",
        ],
      },
      {
        heading: "Vehículos",
        text: "Camiones pesados y tractocamiones, camiones ¾ y livianos, camionetas y 4x4, buses y minibuses, remolques y semirremolques, y maquinaria agrícola y forestal.",
      },
      { heading: "Cotización y plazo", text: QUOTE_AND_TURNAROUND },
    ],
    faqs: [
      {
        q: "¿Conviene reparar o cambiar el paquete completo?",
        a: "Depende de cómo estén las demás hojas. Si el resto está sano, reparar suele bastar; si varias hojas están vencidas o quebradas, te lo decimos en la revisión.",
      },
      {
        q: "¿Tengo que llevar el vehículo o basta con el paquete?",
        a: "Sirven las dos: traes el vehículo y lo desmontamos, o traes solo el paquete.",
      },
      {
        q: "¿Puedo cotizar por foto?",
        a: "Sí. Manda una foto del paquete por WhatsApp y te orientamos; el presupuesto se confirma al revisarlo.",
      },
    ],
    related: ["rearqueo-de-resortes", "hojas-de-resorte-a-medida", "bujes-pernos-y-abrazaderas"],
  },
  {
    slug: "rearqueo-de-resortes",
    card: "Re-arqueo de paquetes vencidos",
    cardText: "Le devolvemos la curvatura original a un paquete aplastado, sin cambiar todas las hojas.",
    title: "Rearqueo de paquetes de resortes en Puerto Montt",
    h1: "Rearqueo de paquetes de resortes en Puerto Montt",
    description:
      "Le devolvemos la curvatura original a un paquete de resortes vencido o aplastado, sin cambiar todas las hojas. Taller en Puerto Montt desde 1994.",
    whatsapp: "Hola, quiero cotizar el rearqueo de un paquete de resortes",
    intro:
      "Un paquete vencido perdió su arco: el vehículo queda bajo y la suspensión llega al tope con poca carga. El rearqueo le devuelve la curvatura original sin cambiar todas las hojas. Lo hacemos en nuestro taller de Puerto Montt para camiones, camionetas, buses y remolques.",
    sections: [
      {
        heading: "Señales de un paquete vencido",
        items: [
          "El vehículo está más bajo de lo normal, incluso vacío.",
          "La suspensión golpea contra los topes en los baches.",
          "Un lado queda más bajo que el otro.",
          "Las hojas se ven planas o con el arco invertido.",
        ],
      },
      {
        heading: "Cómo lo hacemos",
        steps: [
          "Revisamos el paquete y vemos si las hojas se pueden recuperar.",
          "Desarmamos y curvamos cada hoja al arco original.",
          "Cambiamos las hojas que no se pueden recuperar.",
          "Armamos el paquete, lo montamos y queda listo para cargar.",
        ],
      },
      {
        heading: "Cuándo no conviene",
        text: "Si hay hojas trizadas o el acero está muy fatigado, es mejor cambiarlas. Te lo decimos en la revisión, antes de empezar.",
      },
      { heading: "Cotización y plazo", text: QUOTE_AND_TURNAROUND },
    ],
    faqs: [
      {
        q: "¿Es mejor rearquear o cambiar el paquete?",
        a: "Si las hojas están sanas, el rearqueo recupera el paquete sin cambiarlas todas. Si hay hojas quebradas o muy gastadas, conviene reemplazarlas.",
      },
      {
        q: "¿Sirve para camionetas?",
        a: "Sí, para camionetas, camiones, buses y remolques.",
      },
    ],
    related: ["reparacion-de-paquetes-de-resortes", "refuerzo-de-resortes", "fabricacion-de-paquetes-de-resortes"],
  },
  {
    slug: "refuerzo-de-resortes",
    card: "Refuerzos para más carga",
    cardText: "Agregamos hojas o subimos el calibre cuando el vehículo carga más de lo que traía de fábrica.",
    title: "Refuerzo de resortes para camioneta y camión | Puerto Montt",
    h1: "Refuerzo de resortes para camionetas y camiones",
    description:
      "Agregamos hojas o subimos el calibre del paquete cuando la camioneta o el camión carga más de lo que traía de fábrica. Taller en Puerto Montt.",
    whatsapp: "Hola, quiero cotizar un refuerzo de resortes",
    intro:
      "Si tu camioneta o camión carga más de lo que traía de fábrica (una camper, un equipo fijo o la carga de todos los días), el paquete se aplasta y se vence antes. Lo reforzamos agregando hojas o subiendo el calibre, en nuestro taller de Puerto Montt.",
    sections: [
      {
        heading: "Cuándo conviene reforzar",
        items: [
          "El vehículo queda muy bajo con la carga habitual.",
          "Le instalaste una camper, una grúa, un estanque u otro equipo fijo.",
          "El paquete se vence seguido.",
          "La carga queda desnivelada hacia un lado.",
        ],
      },
      {
        heading: "Cómo lo hacemos",
        steps: [
          "Vemos cuánto carga el vehículo y cómo lo usas.",
          "Definimos cuántas hojas agregar o qué calibre usar.",
          "Fabricamos las hojas en el taller y armamos el paquete reforzado.",
        ],
      },
      {
        heading: "Importante",
        text: "El refuerzo mejora cómo el paquete aguanta la carga, pero no cambia el peso máximo que el fabricante y la ley permiten para el vehículo.",
      },
      {
        heading: "Cotización y plazo",
        text: "Te damos un presupuesto estimado; si al desarmar aparece algo más, te avisamos de inmediato. Una camioneta o un camión normal suele quedar listo durante el día, según la carga del taller y el material disponible.",
      },
    ],
    faqs: [
      {
        q: "¿El refuerzo deja más dura la suspensión?",
        a: "Algo más firme, sobre todo sin carga. Por eso lo ajustamos a lo que realmente cargas.",
      },
      {
        q: "¿Sirve para Hilux, L200, Ranger y otras camionetas?",
        a: "Sí, para camionetas con paquete de resortes atrás. Las que usan resortes espirales no las trabajamos.",
      },
    ],
    related: ["fabricacion-de-paquetes-de-resortes", "rearqueo-de-resortes", "hojas-de-resorte-a-medida"],
  },
  {
    slug: "hojas-de-resorte-a-medida",
    card: "Hojas de resorte a medida",
    cardText: "Cortadas, curvadas y adaptadas en el taller, con el largo, ancho y espesor que necesitas.",
    title: "Hojas de resorte a medida en Puerto Montt",
    h1: "Hojas de resorte a medida en Puerto Montt",
    description:
      "Cortamos, curvamos y adaptamos hojas de resorte con el largo, ancho y espesor que necesitas, para camiones, camionetas, buses y remolques.",
    whatsapp: "Hola, quiero cotizar hojas de resorte a medida",
    intro:
      "Fabricamos hojas de resorte sueltas en nuestro taller de Puerto Montt: la hoja madre, una hoja graduada o las que te falten, con el largo, ancho y espesor que necesitas. Así no dependes de un repuesto que no llega.",
    sections: [
      {
        heading: "Cuándo sirve",
        items: [
          "Se quebró una hoja y el resto del paquete está bien.",
          "La hoja madre se quebró o tiene los ojos gastados.",
          "El repuesto original no se consigue o demora semanas.",
        ],
      },
      {
        heading: "Cómo lo hacemos",
        steps: [
          "Tomamos las medidas de la hoja quebrada o de la que va al lado.",
          "Cortamos la hoja, le damos el arco del paquete y, si es hoja madre, le formamos los ojos.",
          "La montamos en el paquete o te la entregamos lista para instalar.",
        ],
      },
      {
        heading: "Qué necesitamos para cotizar",
        text: "La hoja quebrada o sus medidas (largo, ancho y espesor), y la marca y el modelo del vehículo.",
      },
      {
        heading: "Cotización y plazo",
        text: "Te damos un presupuesto estimado. El plazo depende de la hoja y de la carga del taller; te lo confirmamos al cotizar.",
      },
    ],
    faqs: [
      {
        q: "¿Venden hojas sueltas o solo las instalan?",
        a: "Hacemos las dos cosas: la instalamos en el paquete o te la entregamos para que la montes tú.",
      },
      {
        q: "¿Hacen la hoja madre con los ojos?",
        a: "Sí, la hoja madre se fabrica con sus ojos.",
      },
    ],
    related: [
      "reparacion-de-paquetes-de-resortes",
      "fabricacion-de-paquetes-de-resortes",
      "bujes-pernos-y-abrazaderas",
    ],
  },
  {
    slug: "bujes-pernos-y-abrazaderas",
    card: "Bujes, pernos y accesorios",
    cardText:
      "Bujes, pernos centro, abrazaderas y abrazaderas de eje (pernos U) para dejar el paquete montado y listo.",
    title: "Cambio de bujes, perno centro y pernos U | Puerto Montt",
    h1: "Cambio de bujes, pernos y abrazaderas de paquetes de resortes",
    description:
      "Cambiamos bujes, pernos centro, abrazaderas y pernos U para dejar el paquete de resortes firme y bien sujeto al eje. Taller en Puerto Montt.",
    whatsapp: "Hola, quiero cotizar el cambio de bujes, pernos o abrazaderas de un paquete de resortes",
    intro:
      "Un paquete sano igual falla si sus accesorios están gastados. En nuestro taller de Puerto Montt cambiamos bujes, pernos centro, abrazaderas y abrazaderas de eje (pernos U), para que el paquete quede firme, alineado y bien sujeto al eje. Para la reparación usamos los repuestos más comunes, que tenemos en el taller, y también fabricamos abrazaderas a medida.",
    sections: [
      {
        heading: "Qué hace cada pieza",
        items: [
          {
            term: "Bujes",
            text: "van en los ojos del paquete, donde se fija al chasis. Gastados, dejan juego y ruido.",
          },
          {
            term: "Perno centro",
            text: "mantiene las hojas firmes y unidas. Cortado, las hojas se corren y el eje se desalinea.",
          },
          {
            term: "Abrazaderas",
            text: "evitan que las hojas se abran hacia los lados.",
          },
          {
            term: "Abrazaderas de eje (pernos U)",
            text: "sujetan el paquete al eje.",
          },
        ],
      },
      {
        heading: "Cuándo cambiarlos",
        items: [
          "Ruidos o golpes en la suspensión.",
          "Juego en los ojos del paquete.",
          "Hojas corridas o un eje que tira hacia un lado.",
          "Pernos U sueltos o estirados.",
        ],
      },
      {
        heading: "Cotización y plazo",
        text: "Te damos un presupuesto estimado. Si al revisar aparece algo más, te avisamos de inmediato. Normalmente es un trabajo del mismo día, según la carga del taller y el material disponible.",
      },
    ],
    faqs: [
      {
        q: "¿Venden bujes o pernos sueltos?",
        a: "Por lo general no: los instalamos como parte del trabajo en el paquete. También fabricamos abrazaderas a medida.",
      },
      {
        q: "¿Qué es un perno U?",
        a: "Es la abrazadera de eje: el perno en forma de U que sujeta el paquete de resortes al eje del vehículo.",
      },
    ],
    related: ["reparacion-de-paquetes-de-resortes", "hojas-de-resorte-a-medida", "rearqueo-de-resortes"],
  },
];
