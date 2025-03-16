import PunktTokenizer from "../punkt.js";

const testIta = () => {
  const totalStartTime = performance.now();
  const tokenizer = new PunktTokenizer("it");

  // Memory usage tracking
  let memoryUsages: number[] = [];
  let maxMemory = 0;
  let minMemory = Infinity;
  let totalMemory = 0;

  const trackMemory = () => {
    if (global.gc) {
      global.gc(); // Force garbage collection if available
    }
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB
    memoryUsages.push(memoryUsage);
    maxMemory = Math.max(maxMemory, memoryUsage);
    minMemory = Math.min(minMemory, memoryUsage);
    totalMemory += memoryUsage;
    return memoryUsage;
  };

  const testCases = [
    "Ciao, mi chiamo Mario. Sono italiano e vivo a Roma.",
    "L'Italia è un paese bellissimo. Ha molte città storiche come Firenze, Venezia e Roma.",
    "Dott. Rossi ha visitato il paziente ieri. Oggi sta molto meglio.",
    "Ho comprato mele, pere, banane, ecc. Domani comprerò anche del pane.",
    "Hai visto il film? È stato fantastico!",
    "La sig.ra Bianchi insegna matematica. I suoi studenti la adorano.",
    "Leonardo da Vinci nacque nel 1452. Fu un grande artista e inventore del Rinascimento italiano.",
    "Il Prof. Verdi tiene lezioni all'università ogni lunedì e mercoledì. Gli studenti apprezzano molto il suo metodo di insegnamento. Spesso rimane dopo le lezioni per rispondere alle domande.",
    "Ho incontrato l'Avv. Martini ieri sera alla conferenza. Mi ha parlato del suo ultimo caso. È stato molto interessante ascoltare la sua esperienza professionale.",
    "La S.p.A. Italiana ha aumentato il fatturato del 15% nell'ultimo trimestre. I dirigenti sono molto soddisfatti. Gli investitori prevedono ulteriori crescite per il prossimo anno.",
    "Maria è andata dal dott. Bianchi per un controllo. Le ha prescritto degli antibiotici. Dovrà prenderli per una settimana, mattina e sera.",
    "Visiteremo Roma, Firenze, Milano, ecc. durante il nostro viaggio in Italia. Abbiamo prenotato degli hotel in centro. Il tour durerà due settimane e includerà anche alcune zone rurali.",
    "L'Ing. Ferrari ha progettato il nuovo ponte. La costruzione inizierà il mese prossimo. Si prevede che i lavori dureranno circa due anni. Il costo totale sarà di 5 mln. di euro.",
    "Nonostante la pioggia battente, il Dott. Ricci è arrivato puntuale all'appuntamento. Ha portato con sé tutti i documenti necessari. La riunione è durata più del previsto.",
    "La mostra d'arte contemporanea, inaugurata dal Prof. Belli il 15 apr. scorso, ha attirato migliaia di visitatori. I critici l'hanno definita rivoluzionaria. Resterà aperta fino a settembre.",
    "Il Sig. Rossi, amministratore delegato della società dal 2010, ha annunciato le sue dimissioni ieri. Il consiglio d'amministrazione si riunirà domani. Un nuovo A.D. sarà nominato entro fine mese.",
    "Durante il viaggio in treno da Milano a Roma, ho letto l'ultimo romanzo di Elena Ferrante. La trama è avvincente! Non vedo l'ora di leggere il seguito.",
    "L'azienda agricola dei fratelli Esposito produce olio d'oliva dal 1895. Il loro prodotto ha vinto numerosi premi internazionali. Esportano in più di 20 paesi, inclusi gli U.S.A. e il Giappone.",
    "La Dott.ssa Martini, specialista in neurologia, terrà una conferenza sul morbo di Alzheimer il prossimo ven. alle ore 18.00. L'ingresso è gratuito. Si consiglia la prenotazione.",
    "Il palazzo storico in via Garibaldi n. 12 sarà restaurato a partire dal mese prossimo. I lavori, finanziati dal Min. della Cultura, dureranno circa 18 mesi. L'edificio risale al XVI sec.",
    "Marco ha conseguito la laurea in Ingegneria con il massimo dei voti. Ha discusso una tesi innovativa sul risparmio energetico. Il Prof. Neri, suo relatore, gli ha offerto un posto nel suo team di ricerca.",
    "La ricetta della nonna prevede: 500 gr. di farina, 3 uova, 200 ml. di latte, ecc. Mescolare bene tutti gli ingredienti. Cuocere in forno a 180° per 45 min.",
    "Durante l'escursione sul Monte Bianco, abbiamo incontrato l'alpinista famoso, il Sig. Bianchi. Ci ha raccontato delle sue spedizioni sull'Everest. È stata un'esperienza indimenticabile!",
    "Il concerto dei Måneskin, previsto per il 15 giu. allo Stadio Olimpico, è stato posticipato a causa del maltempo. I biglietti rimarranno validi. La nuova data sarà comunicata entro 48 ore.",
    "La Biblioteca Nazionale ha acquisito un manoscritto raro del XV sec. Il documento, ritrovato in un monastero abbandonato, contiene poesie inedite. Gli studiosi lo stanno analizzando con grande interesse.",
    "L'On. Verdi ha presentato una proposta di legge sulla tutela ambientale. Il dibattito parlamentare è stato acceso. Si prevede che la votazione avverrà la prossima settimana.",
    'Il ristorante "Da Luigi", aperto nel centro storico nel 1967, ha ricevuto la sua prima stella Michelin. Lo chef è famoso per i suoi piatti a base di pesce. Le prenotazioni sono aumentate del 200% dopo l\'annuncio.',
    "Durante la conferenza internazionale sul clima, il Prof. Rossi ha presentato uno studio allarmante. Le temperature medie sono aumentate di 1,5°C negli ultimi 50 anni. Gli esperti prevedono conseguenze catastrofiche se non si interviene immediatamente.",
    "La mostra \"Arte e Tecnologia\" al Museo di Arte Moderna include opere di artisti internazionali come J. Smith, L. Chen, ecc. L'installazione più discussa utilizza l'intelligenza artificiale. I visitatori possono interagire con l'opera tramite un'app.",
    'Il Dott. Bianchi, primario di cardiologia all\'Ospedale San Raffaele, ha sviluppato una nuova tecnica chirurgica mini-invasiva. I risultati preliminari sono promettenti. La ricerca è stata pubblicata sulla rivista "Med. Journal" vol. 45, n. 3.',
    "La start-up fondata dall'Ing. Ferrari ha raccolto 2 mln. di euro di finanziamenti. Il loro prodotto rivoluzionerà il settore energetico. L'azienda prevede di assumere 50 nuovi dipendenti entro la fine dell'anno.",
    "Il festival cinematografico di Venezia, giunto alla sua 80ª ed., ospiterà registi da tutto il mondo. Il film d'apertura sarà diretto dal maestro G. Tornatore. La cerimonia di premiazione si terrà il 9 set.",
    "L'archeologa Dott.ssa Ricci ha scoperto un sito etrusco vicino a Tarquinia. Gli scavi hanno rivelato ceramiche ben conservate, gioielli in oro, ecc. Il ritrovamento potrebbe riscrivere la storia di questa antica civiltà.",
    "La nuova linea metropolitana, che collegherà l'aeroporto al centro città, sarà inaugurata il 20 dic. p.v. I lavori, iniziati nel 2015, sono costati oltre 300 mln. di euro. Si stima che servirà 50.000 passeggeri al giorno.",
    "Il libro \"Storia d'Italia\" del Prof. Verdi, pubblicato da Ed. Mondadori, è diventato un bestseller. L'autore ha impiegato 10 anni per completare la ricerca. Una versione aggiornata uscirà il prossimo anno.",
    "La Sig.ra Esposito, campionessa olimpica di scherma, ha annunciato il suo ritiro dalle competizioni. Durante la sua carriera ha vinto 5 medaglie d'oro. Continuerà a lavorare nel mondo sportivo come allenatrice.",
    "Il Comune di Milano ha approvato il progetto per un nuovo parco urbano di 15 ettari. L'area, precedentemente industriale, sarà bonificata. I lavori inizieranno a gen. 2024 e dureranno circa 30 mesi.",
  ];

  console.log("Starting Italian tokenization tests...");

  // Initial memory measurement
  console.log(`Initial memory usage: ${trackMemory().toFixed(2)} MB`);

  testCases.forEach((text, index) => {
    console.log(`\nTest case ${index + 1}:`);
    console.log("Original text:");
    console.log(text);

    const sentenceStartTime = performance.now();
    const sentences = tokenizer.tokenize(text);
    const sentenceEndTime = performance.now();
    const sentenceExecutionTime = sentenceEndTime - sentenceStartTime;

    const currentMemory = trackMemory();

    console.log("Tokenized sentences:");
    sentences.forEach((sent, i) => {
      console.log(`${i + 1}: "${sent.sentence}" (${sent.start}-${sent.end})`);
    });
    console.log(
      `Sentence execution time: ${sentenceExecutionTime.toFixed(2)} ms`
    );
    console.log(`Current memory usage: ${currentMemory.toFixed(2)} MB`);
    console.log("--------------------------------");
  });

  const totalEndTime = performance.now();
  const totalExecutionTime = totalEndTime - totalStartTime;

  // Calculate average memory usage
  const avgMemory = totalMemory / memoryUsages.length;

  console.log(`\nTotal execution time: ${totalExecutionTime.toFixed(2)} ms`);
  console.log("\nMemory Usage Statistics:");
  console.log(`- Max: ${maxMemory.toFixed(2)} MB`);
  console.log(`- Min: ${minMemory.toFixed(2)} MB`);
  console.log(`- Average: ${avgMemory.toFixed(2)} MB`);
};

// Run the test when this file is executed directly
testIta();

export default testIta;
