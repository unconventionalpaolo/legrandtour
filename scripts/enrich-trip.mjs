import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const tripPath = path.join(root, "public", "data", "trip.json");
const imagesDir = path.join(root, "public", "images", "places");

const googleMaps = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const food = {
  "La Toussuire": [
    {
      name: "Le Tonneau",
      city: "La Toussuire",
      style: "savoiardo semplice",
      budget: "€€",
      note: "Da tenere come opzione montagna: piatti caldi, formaggi, zero bisogno di fare i critici gastronomici.",
      mapsUrl: googleMaps("Le Tonneau La Toussuire restaurant"),
      sourceUrl: "https://www.la-toussuire.com/"
    },
    {
      name: "L'Alpage",
      city: "La Toussuire",
      style: "cucina di montagna",
      budget: "€€",
      note: "Raclette/fonduta o qualcosa di molto vicino allo spirito: buono quando fuori l'aria ricorda che siamo in quota.",
      mapsUrl: googleMaps("L'Alpage La Toussuire restaurant"),
      sourceUrl: "https://www.la-toussuire.com/"
    }
  ],
  Lyon: [
    {
      name: "Chez Hugon",
      city: "Lione",
      style: "bouchon lionese",
      budget: "€€",
      note: "Tradizionale, concreto, più sostanza che scena. Da prenotare se ispira.",
      mapsUrl: googleMaps("Chez Hugon Lyon"),
      sourceUrl: "https://www.lesbouchonslyonnais.org/"
    },
    {
      name: "Café des Fédérations",
      city: "Lione",
      style: "bouchon storico",
      budget: "€€",
      note: "Classico bouchon: perfetto se volete dire 'abbiamo mangiato a Lione' senza troppi giri.",
      mapsUrl: googleMaps("Café des Fédérations Lyon"),
      sourceUrl: "https://www.lesbouchonslyonnais.org/"
    }
  ],
  Moulins: [
    {
      name: "Le Grand Café",
      city: "Moulins",
      style: "brasserie storica",
      budget: "€€",
      note: "Brasserie bella ma non impostata come una cerimonia. Buona sosta se il percorso passa comodo.",
      mapsUrl: googleMaps("Le Grand Café Moulins"),
      sourceUrl: "https://www.moulins-tourisme.com/"
    },
    {
      name: "Mercato o boulangerie del centro",
      city: "Moulins",
      style: "pausa furba",
      budget: "€",
      note: "Panino, quiche, dolce e via: spesso la scelta più compatibile con Atti.",
      mapsUrl: googleMaps("boulangerie centre Moulins"),
      sourceUrl: "https://www.moulins-tourisme.com/"
    }
  ],
  "Tours / Loira": [
    {
      name: "Bigot",
      city: "Amboise",
      style: "pasticceria e pranzo leggero",
      budget: "€€",
      note: "Dolce strategico ad Amboise. Non risolve la fame da pranzo serio, ma migliora l'umore.",
      mapsUrl: googleMaps("Bigot Amboise pâtisserie"),
      sourceUrl: "https://www.amboise-valdeloire.com/"
    },
    {
      name: "Crêperie Anne de Bretagne",
      city: "Tours",
      style: "crêperie",
      budget: "€€",
      note: "Opzione semplice quando serve sedersi senza inventarsi una degustazione.",
      mapsUrl: googleMaps("Crêperie Anne de Bretagne Tours"),
      sourceUrl: "https://www.tours-tourisme.fr/"
    }
  ],
  Rouen: [
    {
      name: "La Couronne",
      city: "Rouen",
      style: "auberge storica",
      budget: "€€€",
      note: "Non è la più economica, ma è un pezzo di storia gastronomica. Da valutare più per il pranzo memorabile che per il budget.",
      mapsUrl: googleMaps("La Couronne Rouen"),
      sourceUrl: "https://www.lacouronne-rouen.fr/"
    },
    {
      name: "Crêperie Rouennaise",
      city: "Rouen",
      style: "crêperie comoda",
      budget: "€€",
      note: "Più leggera e pratica: galette, crêpe, bambino gestibile e nessuna liturgia.",
      mapsUrl: googleMaps("Crêperie Rouennaise Rouen"),
      sourceUrl: "https://www.visiterouen.com/"
    }
  ],
  "Normandia costa": [
    {
      name: "Le Marché aux Poissons",
      city: "Étretat",
      style: "pesce semplice",
      budget: "€€",
      note: "Pesce e costa, senza trasformare il pranzo in un matrimonio.",
      mapsUrl: googleMaps("Le Marché aux Poissons Étretat restaurant"),
      sourceUrl: "https://www.lehavre-etretat-tourisme.com/"
    },
    {
      name: "Boulangerie / snack vista mare",
      city: "Étretat",
      style: "piano pratico",
      budget: "€",
      note: "Se vento e parcheggio fanno i protagonisti, vince qualcosa di rapido e caldo.",
      mapsUrl: googleMaps("boulangerie Étretat centre"),
      sourceUrl: "https://www.lehavre-etretat-tourisme.com/"
    }
  ],
  Rennes: [
    {
      name: "Marché des Lices",
      city: "Rennes",
      style: "galette-saucisse",
      budget: "€",
      note: "La scelta più locale e meno fighetta: galette-saucisse e via, se è giorno di mercato.",
      mapsUrl: googleMaps("Marché des Lices Rennes galette saucisse"),
      sourceUrl: "https://www.tourisme-rennes.com/"
    },
    {
      name: "Crêperie Saint-Georges",
      city: "Rennes",
      style: "galette bretone",
      budget: "€€",
      note: "Più seduti, più comodi, ancora molto Bretagna. Buona opzione con passeggino se c'è posto.",
      mapsUrl: googleMaps("Crêperie Saint-Georges Rennes"),
      sourceUrl: "https://www.tourisme-rennes.com/"
    }
  ],
  "Saint-Malo": [
    {
      name: "Bergamote",
      city: "Saint-Malo",
      style: "crêperie intra-muros",
      budget: "€€",
      note: "Galette e crêpe nel centro murato: turistico sì, ma nel modo utile.",
      mapsUrl: googleMaps("Bergamote Saint-Malo crêperie"),
      sourceUrl: "https://www.saint-malo-tourisme.com/"
    },
    {
      name: "Marché aux huîtres",
      city: "Cancale",
      style: "ostriche super dirette",
      budget: "€",
      note: "Se vi va il mare nel piatto: ostriche al porto, zero fronzoli, molto Cancale.",
      mapsUrl: googleMaps("Marché aux huîtres Cancale"),
      sourceUrl: "https://www.saint-malo-tourisme.com/"
    }
  ],
  Dinan: [
    {
      name: "Crêperie Ahna",
      city: "Dinan",
      style: "crêperie bretone",
      budget: "€€",
      note: "Galette classica, centro storico, scelta sensata senza farla lunga.",
      mapsUrl: googleMaps("Crêperie Ahna Dinan"),
      sourceUrl: "https://www.dinan-capfrehel.com/"
    },
    {
      name: "La Lycorne",
      city: "Dinan",
      style: "crêperie / cucina locale",
      budget: "€€",
      note: "Opzione tipica se siete già dentro le vie medievali e non volete riprendere l'auto.",
      mapsUrl: googleMaps("La Lycorne Dinan restaurant"),
      sourceUrl: "https://www.dinan-capfrehel.com/"
    }
  ],
  Blois: [
    {
      name: "Les Banquettes Rouges",
      city: "Blois",
      style: "bistrot",
      budget: "€€",
      note: "Cucina francese concreta e centrale. Da controllare disponibilità, ma come idea ci sta.",
      mapsUrl: googleMaps("Les Banquettes Rouges Blois"),
      sourceUrl: "https://www.bloischambord.com/"
    },
    {
      name: "Comptoir de Mamie Bigoude",
      city: "Blois",
      style: "crêpes e piatti facili",
      budget: "€€",
      note: "Colorato e poco solenne: utile se serve mangiare senza trattative infinite.",
      mapsUrl: googleMaps("Comptoir de Mamie Bigoude Blois"),
      sourceUrl: "https://www.bloischambord.com/"
    }
  ],
  Bourges: [
    {
      name: "Le Cercle",
      city: "Bourges",
      style: "bistrot",
      budget: "€€",
      note: "Pausa più seduta se la tappa a Bourges diventa reale.",
      mapsUrl: googleMaps("Le Cercle Bourges restaurant"),
      sourceUrl: "https://www.bourgesberrytourisme.com/"
    },
    {
      name: "Boulangerie del centro",
      city: "Bourges",
      style: "pranzo rapido",
      budget: "€",
      note: "Per la giornata lunga: panino buono, dolce, caffè e si riparte.",
      mapsUrl: googleMaps("boulangerie centre Bourges"),
      sourceUrl: "https://www.bourgesberrytourisme.com/"
    }
  ],
  Laval: [
    {
      name: "Bistrot de quartier in centro",
      city: "Laval",
      style: "pausa semplice",
      budget: "€€",
      note: "Da scegliere sul momento vicino al parcheggio: qui conta non perdere il ritmo del trasferimento.",
      mapsUrl: googleMaps("bistrot centre Laval Mayenne"),
      sourceUrl: "https://www.laval-tourisme.com/"
    },
    {
      name: "Boulangerie / salon de thé",
      city: "Laval",
      style: "dolce e pratico",
      budget: "€",
      note: "Pausa breve, bambino fuori dall'auto, morale ripristinato.",
      mapsUrl: googleMaps("boulangerie salon de thé Laval Mayenne"),
      sourceUrl: "https://www.laval-tourisme.com/"
    }
  ]
};

const parking = {
  "La Toussuire": [
    {
      name: "Parking centre station La Toussuire",
      area: "centro",
      hasCharging: null,
      note: "Comodo per passeggiata breve; ricarica da controllare live.",
      mapsUrl: googleMaps("parking La Toussuire borne recharge")
    }
  ],
  Lyon: [
    {
      name: "LPA Saint-Georges",
      area: "Vieux Lyon",
      hasCharging: true,
      note: "Comodo per Vieux Lyon/Fourvière via funicolare; controllare stalli EV prima di entrare.",
      mapsUrl: googleMaps("LPA Saint-Georges Lyon recharge électrique")
    },
    {
      name: "LPA Cité Internationale",
      area: "Parc de la Tête d'Or",
      hasCharging: true,
      note: "Utile per giornata parco, più semplice del centro storico.",
      mapsUrl: googleMaps("LPA Cité Internationale Lyon recharge électrique")
    }
  ],
  Moulins: [
    {
      name: "Parking centre Moulins",
      area: "centro",
      hasCharging: null,
      note: "Per sosta breve: scegliere in base alla colonnina disponibile live.",
      mapsUrl: googleMaps("parking recharge électrique Moulins centre")
    }
  ],
  "Tours / Loira": [
    {
      name: "Parking Château de Chenonceau",
      area: "Chenonceaux",
      hasCharging: null,
      note: "Parcheggio visita; controllare servizi e ricarica sul sito il giorno prima.",
      mapsUrl: googleMaps("Parking Château de Chenonceau borne recharge")
    },
    {
      name: "Parking des Tanneurs",
      area: "Tours centro",
      hasCharging: true,
      note: "Utile se passate da Tours/Saint-Avertin; ricarica da controllare live.",
      mapsUrl: googleMaps("Parking des Tanneurs Tours recharge électrique")
    }
  ],
  Rouen: [
    {
      name: "Parking du Vieux-Marché",
      area: "centro storico",
      hasCharging: true,
      note: "Molto centrale per cattedrale e Gros-Horloge; controllare altezza/colonnine live.",
      mapsUrl: googleMaps("Parking Vieux Marché Rouen recharge électrique")
    },
    {
      name: "Parking Cathédrale - Office",
      area: "cattedrale",
      hasCharging: null,
      note: "Comodo, ma il centro può essere stretto: verificare accessi e disponibilità.",
      mapsUrl: googleMaps("Parking Cathédrale Rouen recharge électrique")
    }
  ],
  "Normandia costa": [
    {
      name: "Parking du Grand Val",
      area: "Étretat",
      hasCharging: null,
      note: "Da preferire se il centro è pieno; controllare navetta e accesso il giorno prima.",
      mapsUrl: googleMaps("Parking Grand Val Étretat recharge électrique")
    }
  ],
  Rennes: [
    {
      name: "Parking Vilaine",
      area: "centro Rennes",
      hasCharging: true,
      note: "Centrale per passeggiata; ricarica da controllare live.",
      mapsUrl: googleMaps("Parking Vilaine Rennes recharge électrique")
    },
    {
      name: "Parking Parc des Gayeulles",
      area: "parco/camping",
      hasCharging: null,
      note: "Comodo per una giornata lenta vicino alla base.",
      mapsUrl: googleMaps("Parking Parc des Gayeulles Rennes borne recharge")
    }
  ],
  "Saint-Malo": [
    {
      name: "Parking Paul Féval",
      area: "Saint-Malo",
      hasCharging: true,
      note: "Parcheggio relais spesso più sensato dell'intra-muros in alta stagione.",
      mapsUrl: googleMaps("Parking Paul Féval Saint-Malo recharge électrique")
    },
    {
      name: "Parking du Port",
      area: "Cancale",
      hasCharging: null,
      note: "Comodo per ostriche/porto; controllare affollamento e maree.",
      mapsUrl: googleMaps("Parking port Cancale recharge électrique")
    }
  ],
  Dinan: [
    {
      name: "Parking Centre Historique",
      area: "Dinan",
      hasCharging: null,
      note: "Scegliere un parcheggio alto: con passeggino le salite contano.",
      mapsUrl: googleMaps("parking centre historique Dinan recharge électrique")
    }
  ],
  Blois: [
    {
      name: "Parking Château de Blois",
      area: "centro",
      hasCharging: null,
      note: "Comodo per una passeggiata breve e il castello.",
      mapsUrl: googleMaps("Parking Château de Blois recharge électrique")
    }
  ],
  Bourges: [
    {
      name: "Parking Séraucourt",
      area: "Bourges centro",
      hasCharging: null,
      note: "Buona base per una pausa vicino al centro; controllare ricarica live.",
      mapsUrl: googleMaps("Parking Séraucourt Bourges recharge électrique")
    }
  ],
  Laval: [
    {
      name: "Parking centre Laval",
      area: "centro",
      hasCharging: null,
      note: "Per pausa breve: priorità a bagno, ombra e rientro facile in auto.",
      mapsUrl: googleMaps("parking centre Laval recharge électrique")
    }
  ]
};

const tickets = {
  Lyon: [
    { name: "TCL - biglietti metro/funicolare", url: "https://www.tcl.fr/", note: "Per salire a Fourvière senza litigare con la collina." },
    { name: "Musée Cinéma et Miniature", url: "https://www.museeminiatureetcinema.fr/", note: "Piano B indoor sfizioso nel Vieux Lyon." }
  ],
  "Tours / Loira": [
    { name: "Château de Chenonceau", url: "https://www.chenonceau.com/", note: "Biglietti e orari ufficiali." },
    { name: "Château et Jardins de Villandry", url: "https://www.chateauvillandry.fr/", note: "Biglietti e info giardini." },
    { name: "Château Royal d'Amboise", url: "https://www.chateau-amboise.com/", note: "Solo se la giornata ha margine." }
  ],
  Rouen: [
    { name: "Gros-Horloge", url: "https://www.visiterouen.com/", note: "Verificare visita interna e orari sul turismo ufficiale." },
    { name: "Musée des Beaux-Arts de Rouen", url: "https://mbarouen.fr/", note: "Piano B indoor serio ma non punitivo." }
  ],
  "Normandia costa": [
    { name: "Le Havre Étretat Tourisme", url: "https://www.lehavre-etretat-tourisme.com/", note: "Controllare parcheggi, accessi e meteo costa." }
  ],
  Rennes: [
    { name: "Musée de Bretagne", url: "https://www.musee-bretagne.fr/", note: "Piano B indoor con storia locale." },
    { name: "Les Champs Libres", url: "https://www.leschampslibres.fr/", note: "Utile se piove e serve un posto gestibile." }
  ],
  "Saint-Malo": [
    { name: "Saint-Malo Tourisme", url: "https://www.saint-malo-tourisme.com/", note: "Maree, remparts, visite e info pratiche." }
  ],
  Dinan: [
    { name: "Dinan Cap Fréhel Tourisme", url: "https://www.dinan-capfrehel.com/", note: "Controllare Cap Fréhel, parcheggi e vento." }
  ],
  Blois: [
    { name: "Château Royal de Blois", url: "https://www.chateaudeblois.fr/", note: "Biglietti ufficiali se resta energia." }
  ],
  Bourges: [
    { name: "Bourges Berry Tourisme", url: "https://www.bourgesberrytourisme.com/", note: "Info centro, cattedrale e soste." }
  ]
};

const narratives = {
  "La Toussuire":
    "La Toussuire è una stazione di montagna della Maurienne: niente museo obbligatorio, più aria buona e logistica morbida. Qui il valore storico della giornata è semplice: rallentare, guardare le Alpi e ricordarsi che anche una passeggiata breve può essere una gita intera con un bimbo piccolo.",
  Lyon:
    "Lione è cresciuta tra Rodano e Saona, con radici romane sulla collina di Fourvière e un centro storico diventato patrimonio UNESCO. La cosa bella è che la città non chiede per forza una visita enciclopedica: Vieux Lyon, funicolare e parco bastano per assaggiare la capitale dei bouchon senza trasformarla in una maratona.",
  Moulins:
    "Moulins è l'antica capitale del Bourbonnais: una tappa tranquilla, più da brasserie e centro storico che da lista infinita di monumenti. È perfetta per una pausa di trasferimento: due passi, qualcosa di buono e poi si riparte senza fingere di essere freschissimi.",
  "Tours / Loira":
    "La Loira è la zona dove i castelli hanno deciso di esagerare con grazia. Chenonceau attraversa il Cher come se fosse normale costruire sull'acqua, Amboise racconta un pezzo di Rinascimento francese, Villandry mette i giardini in ordine geometrico. Bellissimo, ma una visita grande al giorno resta la scelta più adulta.",
  Rouen:
    "Rouen è Normandia in formato città: cattedrale gotica, case a graticcio, Jeanne d'Arc e Monet che ha dipinto la facciata come se fosse una serie TV. Il centro è compatto ma pieno di pavé: bello da guardare, meno da spingere se il passeggino è in modalità trattore.",
  "Normandia costa":
    "La costa normanna è scenografica e poco interessata ai capelli in ordine. Étretat vive di falesie, archi naturali e vento; Honfleur è più raccolta, porto e case alte. Qui la regola è guardare il meteo e non sfidare le scale con il passeggino solo per orgoglio.",
  Rennes:
    "Rennes è una città universitaria e bretone con case a graticcio, piazze vive e una specialità che dice tutto: galette-saucisse. Dopo un trasferimento, il bello è usarla piano: centro storico al mattino, Parc des Gayeulles quando serve spazio e ombra.",
  "Saint-Malo":
    "Saint-Malo è città corsara, mura, maree e vento; Cancale è ostriche e porto. La giornata può essere bellissima o molto affollata, quindi meglio pensarla a moduli: mura se si riesce, spiaggia o porto se serve semplicità.",
  Dinan:
    "Dinan è medievale sul serio: case a graticcio, vie ripide, pietra e scorci da cartolina. Bellissima, ma con un passeggino va trattata con rispetto. Cap Fréhel aggiunge costa e panorama, solo se traffico e vento sono dalla nostra parte.",
  Blois:
    "Blois è una porta morbida sulla Loira: castello reale, centro storico e vista sul fiume. Dopo tanti chilometri è più una passeggiata intelligente che una giornata da museo completo.",
  Bourges:
    "Bourges è una pausa nobile: cattedrale gotica, case antiche e centro compatto. In un trasferimento lungo non deve diventare una visita seria: basta usarla come sosta bella, con bagno, ombra e qualcosa da mangiare.",
  Laval:
    "Laval è una tappa di mezzo utile: castello, Mayenne e centro gestibile. Non serve innamorarsene in un'ora; basta far scendere Atti, sgranchire gambe e prendere qualcosa di buono."
};

const wikiTitles = {
  "2026-07-31": "La Toussuire",
  "2026-08-01": "La Toussuire",
  "2026-08-02": "La Toussuire",
  "2026-08-03": "Chambéry",
  "2026-08-04": "Lyon",
  "2026-08-05": "Moulins, Allier",
  "2026-08-06": "Bourges",
  "2026-08-07": "Château de Chenonceau",
  "2026-08-08": "Château de Villandry",
  "2026-08-09": "Chartres",
  "2026-08-10": "Rouen Cathedral",
  "2026-08-11": "Étretat",
  "2026-08-12": "Fougères",
  "2026-08-13": "Rennes",
  "2026-08-14": "Saint-Malo",
  "2026-08-15": "Dinan",
  "2026-08-16": "Laval, Mayenne",
  "2026-08-17": "Bourges",
  "2026-08-18": "La Toussuire",
  "2026-08-19": "La Toussuire",
  "2026-08-20": "La Toussuire",
  "2026-08-21": "La Toussuire",
  "2026-08-22": "La Toussuire"
};

function areaFor(day) {
  const text = `${day.base} ${day.subtitle} ${day.title}`;
  if (/Saint-Malo|Cancale/.test(text)) return "Saint-Malo";
  if (/Dinan|Fréhel/.test(text)) return "Dinan";
  if (/Rennes|Gayeulles/.test(text)) return "Rennes";
  if (/Rouen/.test(text)) return "Rouen";
  if (/Étretat|Honfleur|Normandia/.test(text)) return "Normandia costa";
  if (/Chenonceau|Amboise|Villandry|Saint-Avertin|Loira|Tours/.test(text)) return "Tours / Loira";
  if (/Blois/.test(text)) return "Blois";
  if (/Bourges/.test(text)) return "Bourges";
  if (/Laval/.test(text)) return "Laval";
  if (/Moulins|Montegout/.test(text)) return "Moulins";
  if (/Lione|Lyon/.test(text)) return "Lyon";
  return "La Toussuire";
}

function carMinutes(day) {
  if (day.route?.segments?.length) {
    const max = Math.max(...day.route.segments.map((segment) => segment.drivingMinutes));
    const total = day.route.segments.reduce((sum, segment) => sum + segment.drivingMinutes, 0);
    return `${total} minuti stimati totali, tratta più lunga ${max} minuti. Se supera 90, pausa obbligatoria prima.`;
  }
  if (day.route?.drivingMinutes) return `${day.route.drivingMinutes} minuti stimati totali, da spezzare se Atti lo chiede.`;
  return "0-30 minuti: giornata locale, l'auto può anche non diventare protagonista.";
}

function pauseIdeas(day, area) {
  const stops = day.route?.segments?.map((segment) => segment.stop).filter(Boolean) ?? [];
  if (stops.length) return stops.join("; ");
  const place = day.places?.[0]?.name;
  if (place) return `${place}: pausa all'aperto o caffè vicino, da scegliere sul posto in base a ombra e bagni.`;
  if (area === "La Toussuire") return "Casa di Eveline o passeggiata breve in paese, senza complicarsi la giornata.";
  return "Pausa comoda vicino alla base, con bagno e posto tranquillo per far riposare Atti.";
}

function bringList(day, area) {
  const items = ["cambio completo", "telo leggero", "acqua", "cappellino", "salviette"];
  if (day.type === "transfer") items.push("giochino da auto", "copertina", "snack per adulti in crisi");
  if (/Saint-Malo|Dinan|Normandia costa/.test(area)) items.push("antivento leggero");
  if (/La Toussuire/.test(area)) items.push("strato caldo");
  if (/Tours \/ Loira|Blois/.test(area)) items.push("marsupio per scale e interni");
  if (/Lyon|Rouen|Rennes/.test(area)) items.push("marsupio di backup per pavé e centro storico");
  return items;
}

async function downloadHero(day) {
  const title = wikiTitles[day.id];
  if (!title) return null;
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const response = await fetch(summaryUrl, { headers: { "User-Agent": "BonjourMurMurLocal/1.0" } });
  if (!response.ok) return null;
  const summary = await response.json();
  const imageUrl = summary.thumbnail?.source ?? summary.originalimage?.source;
  if (!imageUrl) return null;
  const imageResponse = await fetch(imageUrl, { headers: { "User-Agent": "BonjourMurMurLocal/1.0" } });
  if (!imageResponse.ok) return null;
  const contentType = imageResponse.headers.get("content-type") ?? "image/jpeg";
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const filename = `${day.id}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.${ext}`;
  const relative = `/images/places/${filename}`;
  const filePath = path.join(imagesDir, filename);
  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  await fs.writeFile(filePath, buffer);
  return {
    src: relative,
    alt: summary.description ? `${summary.title}: ${summary.description}` : `Fotografia di ${summary.title}`,
    author: "Wikimedia contributors",
    sourceName: "Wikipedia / Wikimedia Commons",
    sourceUrl: summary.content_urls?.desktop?.page ?? summaryUrl,
    license: "Uso privato locale; fonte Wikimedia indicata",
    status: "ready"
  };
}

const trip = JSON.parse(await fs.readFile(tripPath, "utf8"));
await fs.mkdir(imagesDir, { recursive: true });

for (const day of trip.days) {
  const area = areaFor(day);
  day.foodRecommendations = food[area] ?? food["La Toussuire"];
  day.parkingOptions = parking[area] ?? [];
  day.ticketLinks = tickets[area] ?? [];
  day.practicalInfo = {
    ...day.practicalInfo,
    narrative: narratives[area] ?? narratives["La Toussuire"]
  };
  day.babyNotes = {
    carMinutes: carMinutes(day),
    pauseIdeas: pauseIdeas(day, area),
    whatToBring: bringList(day, area)
  };

  try {
    const hero = await downloadHero(day);
    if (hero) day.heroImage = hero;
  } catch (error) {
    console.warn(`Immagine non scaricata per ${day.id}: ${error.message}`);
  }
}

await fs.writeFile(tripPath, `${JSON.stringify(trip, null, 2)}\n`);
