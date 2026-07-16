import fs from "node:fs/promises";
import path from "node:path";

const tripPath = path.join(process.cwd(), "public", "data", "trip.json");

const copyByName = {
  "Centro di La Toussuire": {
    story:
      "Il centro di La Toussuire è una base di montagna senza troppe complicazioni: negozietti, aria fresca e quelle viste che fanno sembrare intelligente anche una passeggiata di venti minuti.",
    curiosity:
      "La stazione fa parte del comprensorio Les Sybelles, uno dei grandi domini alpini francesi. D'estate cambia ritmo: meno sci, più panorami e gambe che chiedono pietà con educazione.",
    matiAngle:
      "Per Mati: natura facile, aria buona e possibilità concreta di intercettare formaggi savoiardi senza dover scalare una cima."
  },
  "Belvedere o passeggiata locale": {
    story:
      "Qui l'idea è semplice: trovare un punto panoramico vicino, guardare le Aiguilles d'Arves e fingere per un attimo che la giornata non abbia orari.",
    curiosity:
      "Le montagne sopra la Maurienne hanno nomi e profili molto scenografici: sono il tipo di panorama che non ha bisogno di filtri, anche se Paolo ci proverà comunque.",
    matiAngle:
      "Per Mati: tanta natura, zero museo, e una buona scusa per dire 'facciamo solo due passi' sapendo che non saranno mai solo due."
  },
  "Passeggiata panoramica locale": {
    story:
      "Una passeggiata panoramica qui è più una terapia che un'attività: verde, aria sottile e vista larga, da prendere senza spirito olimpico.",
    curiosity:
      "In estate le piste diventano sentieri e pascoli: stesso posto, tutt'altro rumore di fondo.",
    matiAngle:
      "Per Mati: natura in formato morbido e alta probabilità di desiderare qualcosa con formaggio al rientro."
  },
  Chambéry: {
    story:
      "Chambéry è una sosta furba tra montagna e città: centro storico elegante, portici, piazzette e un'aria savoiarda che dice 'fermatevi un attimo, ma senza fare una tesi'.",
    curiosity:
      "È stata capitale storica della Savoia: quindi sì, una pausa caffè qui ha più pedigree di quanto ammetteremo in macchina.",
    matiAngle:
      "Per Mati: storia compatta, passeggiata piacevole e Savoia sullo sfondo. Il formaggio non è obbligatorio, ma sarebbe scortese ignorarlo."
  },
  "Vieux Lyon": {
    story:
      "Vieux Lyon è un labirinto rinascimentale di cortili, passaggi e facciate calde. È bello perché sembra antico senza diventare pesante, a patto di non voler entrare in ogni portone.",
    curiosity:
      "Le traboules erano passaggi interni usati per attraversare isolati e cortili; a Lione anche una scorciatoia può avere un passato serio.",
    matiAngle:
      "Per Mati: storia, case belle, stradine da esplorare e un bouchon nelle vicinanze. La cultura qui arriva con contorno."
  },
  Fourvière: {
    story:
      "Fourvière è la collina da cui Lione si mette in posa. Sotto c'è la città, sopra c'è la basilica, in mezzo una funicolare che salva gambe e umore.",
    curiosity:
      "La collina era già importante in epoca romana: Lione, prima di fare la capitale gastronomica, si chiamava Lugdunum e faceva la seria.",
    matiAngle:
      "Per Mati: panorama, storia romana e zero bisogno di conquistare la salita a piedi. Questa è civiltà."
  },
  "Parc de la Tête d'Or": {
    story:
      "Il Parc de la Tête d'Or è il grande polmone verde di Lione: lago, alberi, prati e spazio per far respirare tutti, soprattutto chi viaggia con un neonato.",
    curiosity:
      "È uno dei parchi urbani più grandi di Francia. Traduzione pratica: se serve rallentare, qui non manca posto.",
    matiAngle:
      "Per Mati: natura in città, pausa morbida e possibilità di camminare senza pavé medievale sotto le ruote."
  },
  Charlieu: {
    story:
      "Charlieu è una cittadina piccola ma con carattere: pietra, abbazia, case antiche e il vantaggio enorme di non sembrare una tappa urlata.",
    curiosity:
      "La sua abbazia benedettina racconta un pezzo di Medioevo locale, quello bello da vedere senza dover leggere venti pannelli.",
    matiAngle:
      "Per Mati: storia raccolta, pausa vera e il tipo di borgo dove un panino buono sembra già un piano."
  },
  Bourges: {
    story:
      "Bourges è una pausa nobile: cattedrale gotica, case antiche e centro compatto. Noi la usiamo con rispetto, non come se avessimo sei ore e un documentario da girare.",
    curiosity:
      "La cattedrale di Saint-Étienne è patrimonio UNESCO ed è enorme. Talmente enorme che anche una visita esterna conta.",
    matiAngle:
      "Per Mati: storia gotica, vie belle e pausa trasferimento che non sa di area di servizio. Upgrade morale notevole."
  },
  "Château de Chenonceau": {
    story:
      "Chenonceau è il castello che attraversa il fiume Cher con una certa disinvoltura. Elegante, teatrale, ma ancora abbastanza umano da visitare senza perdersi dentro.",
    curiosity:
      "È chiamato spesso il castello delle dame, perché molte donne importanti ne hanno segnato la storia. Finalmente un castello che sa a chi deve molto.",
    matiAngle:
      "Per Mati: storia, acqua, giardini e una dose di bellezza molto alta. Formaggio non incluso, ma recuperabile a pranzo."
  },
  Amboise: {
    story:
      "Amboise è una cittadina della Loira con castello, fiume e una misura giusta per il pomeriggio: bella da passeggiare senza pretendere di fare tutto.",
    curiosity:
      "Leonardo da Vinci passò qui gli ultimi anni della sua vita, al Clos Lucé. Insomma: anche lui aveva capito che la Loira non era male.",
    matiAngle:
      "Per Mati: storia rinascimentale, scorci sul fiume e pausa dolce quasi moralmente obbligatoria."
  },
  "Château et Jardins de Villandry": {
    story:
      "Villandry è il posto dove i giardini hanno deciso di mettersi in ordine. Geometrie, orti decorativi e colori: natura, ma con righello e autostima.",
    curiosity:
      "I giardini sono famosi quanto il castello, forse di più. È raro che un cavolo decorativo riesca a sembrare così aristocratico.",
    matiAngle:
      "Per Mati: natura curata, storia leggera e ottimo materiale per dire 'questo lo vorrei anche io', ignorando la manutenzione."
  },
  Chambord: {
    story:
      "Chambord è il castello che non conosce la parola 'sobrio'. Grande, scenografico, con tetti e torri che sembrano progettati da qualcuno molto preso bene.",
    curiosity:
      "La celebre scala a doppia elica è attribuita all'influenza di Leonardo. Due persone possono salire senza incontrarsi: utile anche in certe mattine familiari.",
    matiAngle:
      "Per Mati: storia gigante, bosco intorno e un livello di wow piuttosto onesto."
  },
  Chartres: {
    story:
      "Chartres è soprattutto la sua cattedrale: una presenza enorme, blu vetrate e medioevo in formato verticale. Perfetta come tappa se serve una cosa bella e una sola.",
    curiosity:
      "Il blu delle vetrate di Chartres è talmente famoso da avere quasi una sua reputazione personale.",
    matiAngle:
      "Per Mati: storia, luce colorata e una pausa che sembra culturale anche se dura poco."
  },
  "Cathédrale Notre-Dame de Rouen": {
    story:
      "La cattedrale di Rouen è gotica, alta, piena di dettagli e assolutamente consapevole di essere fotogenica. Monet l'ha dipinta più volte: noi possiamo limitarci a guardarla bene.",
    curiosity:
      "La facciata cambia tantissimo con la luce, motivo per cui Monet ci ha costruito una serie intera. Paolo probabilmente farà lo stesso con il telefono.",
    matiAngle:
      "Per Mati: storia potente, pietra scenografica e centro storico subito intorno per una pausa meno solenne."
  },
  "Gros-Horloge": {
    story:
      "Il Gros-Horloge è un grande orologio astronomico incastonato nel cuore di Rouen. È il tipo di monumento che dice 'siamo in centro' meglio di qualunque cartello.",
    curiosity:
      "Il meccanismo è medievale e la decorazione è rinascimentale: praticamente un accessorio urbano con secoli di personalità.",
    matiAngle:
      "Per Mati: storia compatta, case a graticcio intorno e zero bisogno di camminare chilometri per sentirsi in Normandia."
  },
  Étretat: {
    story:
      "Étretat è falesie bianche, archi naturali e mare che fa scena anche quando il vento decide di partecipare troppo. Bellissima, ma da prendere con rispetto.",
    curiosity:
      "Le sue scogliere hanno ispirato pittori e scrittori, e si capisce: sembrano fatte apposta per far dire 'ok, fermiamoci un attimo'.",
    matiAngle:
      "Per Mati: natura spettacolare, aria di mare e panorama forte. Marsupio consigliato se il passeggino inizia a guardarti male."
  },
  Honfleur: {
    story:
      "Honfleur è porto, case strette e luce morbida. Più raccolta di Étretat, più urbana, perfetta se serve costa senza trasformare tutto in escursione.",
    curiosity:
      "Il Vieux Bassin è stato amato dagli impressionisti: acqua, barche e facciate alte fanno il loro lavoro ancora oggi.",
    matiAngle:
      "Per Mati: storia portuale, atmosfera bella e possibilità concreta di mangiare qualcosa di buono senza sabbia nelle scarpe."
  },
  Fougères: {
    story:
      "Fougères ha un castello medievale vero, con torri e mura che sembrano uscire da un libro, ma senza bisogno di trombe e cavalieri.",
    curiosity:
      "La fortezza è una delle più grandi d'Europa nel suo genere. Una tappa piccola solo sulla carta.",
    matiAngle:
      "Per Mati: storia medievale, pietra scenografica e pausa bretone con abbastanza carattere da meritare la deviazione."
  },
  "Centro storico di Rennes": {
    story:
      "Il centro di Rennes è case a graticcio, piazze vive e un'energia universitaria che tiene tutto leggero. È storico, ma non polveroso.",
    curiosity:
      "Dopo un grande incendio nel 1720, Rennes è diventata un mix curioso: medioevo sopravvissuto e città ricostruita con più ordine.",
    matiAngle:
      "Per Mati: storia colorata, galette-saucisse nei paraggi e una città che sembra presa bene senza sforzarsi."
  },
  "Parc des Gayeulles": {
    story:
      "Il Parc des Gayeulles è il piano intelligente dopo giorni di auto: alberi, sentieri, acqua e spazio per respirare. Non tutto deve essere monumento.",
    curiosity:
      "È uno dei grandi spazi verdi di Rennes, usato dai locali per correre, passeggiare e fare cose sane che noi osserveremo con rispetto.",
    matiAngle:
      "Per Mati: natura facile, ombra, pausa per Atti e zero rischio di dover fingere interesse per una sala piena di armature."
  },
  "Saint-Malo": {
    story:
      "Saint-Malo è mura, mare e spirito corsaro. Sta lì compatta sull'acqua e sembra dire: sì, siamo turistici, ma con ottime ragioni.",
    curiosity:
      "La città fu pesantemente distrutta nel 1944 e ricostruita con grande fedeltà. Quindi sembra antica perché ha scelto di tornare sé stessa.",
    matiAngle:
      "Per Mati: mare, storia, vento nei capelli e possibilità di crêpe. Difficile chiedere più Bretagna in una sola tappa."
  },
  Cancale: {
    story:
      "Cancale è porto, maree e ostriche. Una tappa piccola ma molto precisa: qui il mare finisce direttamente nel piatto.",
    curiosity:
      "Le ostriche di Cancale sono famose da secoli e hanno pure un'aria molto poco modesta. Comprensibile.",
    matiAngle:
      "Per Mati: natura marina, cibo locale e sfiziosità vera. Anche solo guardare il porto vale una pausa."
  },
  Dinan: {
    story:
      "Dinan è medioevo in salita: case a graticcio, pietra, botteghe e strade che non hanno pensato moltissimo ai passeggini moderni.",
    curiosity:
      "La Rue du Jerzual collega il porto al centro storico ed è bellissima, ma anche una piccola dichiarazione di guerra ai polpacci.",
    matiAngle:
      "Per Mati: storia, scorci romantici ma non sdolcinati, e crêperie come motivazione scientifica."
  },
  "Cap Fréhel": {
    story:
      "Cap Fréhel è costa bretone in versione ampia: scogliere, faro, vento e orizzonte. Qui la natura non fa la timida.",
    curiosity:
      "Le falesie arrivano a circa 70 metri e ospitano uccelli marini. Traduzione: panorama potente, cappellino ben fermo.",
    matiAngle:
      "Per Mati: natura pura, mare e vento. Portare entusiasmo e uno strato in più, anche se il cielo sembra collaborare."
  },
  Laval: {
    story:
      "Laval è una pausa di trasferimento con dignità: castello, fiume Mayenne e centro gestibile. Non deve conquistare la giornata, solo migliorarla.",
    curiosity:
      "Il castello domina la città e racconta il passato medievale della Mayenne. Una sosta breve può comunque avere una torre.",
    matiAngle:
      "Per Mati: storia senza fatica, passeggiata sul fiume e pausa pratica prima di rimettersi in strada."
  }
};

function genericCopy(place) {
  return {
    story:
      `${place.name} è una tappa pensata per dare ritmo alla giornata: abbastanza interessante da meritare una sosta, abbastanza semplice da non trasformarsi in impresa.`,
    curiosity:
      "Dettaglio da approfondire quando aggiornerai il programma: qui ci sta bene una chicca storica o locale.",
    matiAngle:
      "Per Mati: da tarare tra natura, storia e qualcosa di buono appena troviamo il dettaglio giusto."
  };
}

const trip = JSON.parse(await fs.readFile(tripPath, "utf8"));

for (const day of trip.days) {
  for (const place of day.places ?? []) {
    const copy = copyByName[place.name] ?? genericCopy(place);
    place.story = copy.story;
    place.curiosity = copy.curiosity;
    place.matiAngle = copy.matiAngle;
  }
}

await fs.writeFile(tripPath, `${JSON.stringify(trip, null, 2)}\n`);
