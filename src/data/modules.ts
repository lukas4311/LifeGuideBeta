// Life Coaching Modules Data - Czech Language
export interface Module {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  content: ModuleContent;
}

export interface ModuleContent {
  intro: string;
  keyPoints: string[];
  exercises: Exercise[];
  affirmations: string[];
}

export interface Exercise {
  title: string;
  description: string;
  type: 'reflection' | 'quiz' | 'journal' | 'practice';
}

export interface FingerRule {
  finger: string;
  title: string;
  description: string;
  color: string;
}

export const fingerRules: FingerRule[] = [
  {
    finger: 'Palec',
    title: 'Vše je dobré',
    description: 'Každá výzva je příležitost. Lekce. Život je škola ducha. Duchovního růstu.',
    color: '#F4D47C'
  },
  {
    finger: 'Ukazováček',
    title: 'Ty jsi autor',
    description: 'Ty jsi zodpovědný za vše, co se ve tvém životě děje. Za své zdraví, práci, myšlenky, emoce, energii, za to co přinášíš do vztahu.',
    color: '#7DD4D4'
  },
  {
    finger: 'Prostředníček',
    title: 'Máš poslání',
    description: 'Máš jiskru. Něco, čím jsi přišel obohatit svět. Prospět vesmírnému organismu. Máš zde svou jedinečnou funkci. Talent a dar.',
    color: '#7B68BE'
  },
  {
    finger: 'Prsteníček',
    title: 'Miluj SEBE MILUJ druhé',
    description: 'Kvalita tvého života odpovídá kvalitě tvých vztahů. Zlepši dovednost komunikace a soucitu a zlepšíš svůj život.',
    color: '#F4A89F'
  },
  {
    finger: 'Malíček',
    title: 'Tady a teď',
    description: 'Radost a vděčnost z maličkostí. Raduj se v každém TADY A TEĎ.',
    color: '#90EE90'
  }
];

export const modules: Module[] = [
  {
    id: 1,
    title: 'Identita',
    subtitle: 'Vzpomeň si, kdo opravdu jsi',
    description: 'Zapomeň, kdo si myslíš, že máš být. A kdo ses naučil být, abys ve světě obstál.',
    color: '#7B68BE',
    bgColor: '#F5F3FF',
    icon: 'identity',
    content: {
      intro: 'Rozhodni se, čemu chceš věřit. Buď autentický. Authenticos - pravý, opravdový, nefalšovaný. Naučil ses, že musíš a nemůžeš. Je čas vrátit se k nemusím a mohu.',
      keyPoints: [
        'Authenticos - pravý, opravdový, nefalšovaný',
        'Od "musím" k "mohu"',
        'Od "nemůžu" k "nemusím"',
        'Buď tím, kým opravdu jsi',
        'Získej pozornost a přijetí autenticitou'
      ],
      exercises: [
        {
          title: 'Kdo opravdu jsem?',
          description: 'Zamysli se a zapiš 10 věcí, které tě definují bez ohledu na očekávání ostatních.',
          type: 'reflection'
        },
        {
          title: 'Musím vs. Mohu',
          description: 'Přepiš své "musím" na "mohu" a sleduj, jak se mění tvůj pocit.',
          type: 'journal'
        },
        {
          title: 'Maska vs. Já',
          description: 'Identifikuj masky, které nosíš, a rozhodni se, které chceš sundat.',
          type: 'reflection'
        }
      ],
      affirmations: [
        'Jsem autentický/á a pravdivý/á',
        'Nemusím být nikým jiným než sebou',
        'Mohu být tím, kým opravdu jsem',
        'Přijímám sebe takového/takovou, jaký/á jsem',
        'Moje jedinečnost je můj dar světu'
      ]
    }
  },
  {
    id: 2,
    title: 'Pravidla',
    subtitle: 'Nauč se pravidla jedné ruky',
    description: 'Nechceš v životě bourat? Nauč se pravidla. Srdce na dlani.',
    color: '#F4D47C',
    bgColor: '#FFFBEB',
    icon: 'hand',
    content: {
      intro: 'Pravidla jedné ruky ti pomohou navigovat životem s moudrostí a láskou. Každý prst představuje klíčový princip pro spokojený život.',
      keyPoints: [
        'Palec - Vše je dobré, každá výzva je příležitost',
        'Ukazováček - Ty jsi autor svého života',
        'Prostředníček - Máš poslání a jedinečný dar',
        'Prsteníček - Kvalita vztahů = kvalita života',
        'Malíček - Radost z maličkostí, tady a teď'
      ],
      exercises: [
        {
          title: 'Pravidla na dlani',
          description: 'Nakresli svou ruku a ke každému prstu napiš, jak pravidlo aplikuješ ve svém životě.',
          type: 'practice'
        },
        {
          title: 'Denní reflexe',
          description: 'Každý den si vyber jeden prst a vědomě praktikuj jeho pravidlo.',
          type: 'journal'
        },
        {
          title: 'Výzva jako příležitost',
          description: 'Vzpomeň si na obtížnou situaci a najdi v ní lekci a příležitost.',
          type: 'reflection'
        }
      ],
      affirmations: [
        'Vše je dobré, i výzvy jsou příležitosti',
        'Jsem autorem svého života',
        'Mám jedinečné poslání',
        'Mé vztahy jsou plné lásky a soucitu',
        'Užívám si každý okamžik'
      ]
    }
  },
  {
    id: 3,
    title: 'Navigace',
    subtitle: 'Nastav navigaci mysli',
    description: 'ABRAKADABRA - Tvořím, jak mluvím. Včetně zvuku.',
    color: '#7DD4D4',
    bgColor: '#F0FDFA',
    icon: 'compass',
    content: {
      intro: 'Udržuj krb svých myšlenek čistý. Založíš tak mír a budeš šťastný. Kontrola slov a myšlenek je klíčem k bohatému životu.',
      keyPoints: [
        'Poor mindset vs. Rich mindset',
        'Slova tvoří realitu - ABRAKADABRA',
        'Udržuj krb myšlenek čistý',
        'Jsem DOST DOBRÁ, taková jaká jsem',
        'Všechno hraje v můj prospěch',
        'Život mě miluje'
      ],
      exercises: [
        {
          title: 'Slovník transformace',
          description: 'Vytvoř si seznam slov, která chceš přestat používat, a jejich pozitivní alternativy.',
          type: 'journal'
        },
        {
          title: 'Poor vs. Rich mindset',
          description: 'Identifikuj své "chudé" myšlenky a transformuj je na "bohaté".',
          type: 'reflection'
        },
        {
          title: 'Denní afirmace',
          description: 'Ráno a večer opakuj pozitivní afirmace nahlas.',
          type: 'practice'
        }
      ],
      affirmations: [
        'Jsem DOST DOBRÁ, taková jaká jsem',
        'Jsem zdravá, šťastná, spokojená',
        'Jsem láskyhodná a všechno se mi daří',
        'Všechno hraje v můj prospěch',
        'Život mě miluje',
        'Do cíle se dostanu snadno a lehce'
      ]
    }
  },
  {
    id: 4,
    title: 'Energie',
    subtitle: 'Udržuj rovnováhu',
    description: 'Po cestě životem potřebuješ mít natankováno. Musíš se o svou energii starat.',
    color: '#90EE90',
    bgColor: '#F0FDF4',
    icon: 'energy',
    content: {
      intro: 'Tělo, mysl, duše - tři pilíře tvé energie. Nízká nebo vysoká vibrace? Co si vybereš? Své potřeby znej a naplňuj. A konstruktivně komunikuj.',
      keyPoints: [
        'Tělo - pečuj, trénuj',
        'Mysl - vyprázdni, myšlenky vybírej',
        'Duše - čti, tanči, tvoř, zpívej...',
        'Své potřeby - znej a naplňuj',
        'Kvalitní strava, spánek, dech, pohyb, dotek',
        'Kvalitní myšlenky, inspirace'
      ],
      exercises: [
        {
          title: 'Energetický audit',
          description: 'Ohodnoť svou energii v oblasti těla, mysli a duše na škále 1-10.',
          type: 'reflection'
        },
        {
          title: 'Plán péče o sebe',
          description: 'Vytvoř si týdenní plán aktivit pro tělo, mysl a duši.',
          type: 'practice'
        },
        {
          title: 'Co mi bere/dává energii',
          description: 'Sepiš, co ti energii bere a co ji dává. Optimalizuj svůj den.',
          type: 'journal'
        }
      ],
      affirmations: [
        'Pečuji o své tělo s láskou',
        'Moje mysl je čistá a jasná',
        'Moje duše zpívá radostí',
        'Znám své potřeby a naplňuji je',
        'Vibruji na vysoké frekvenci',
        'Mám dostatek energie pro vše, co chci'
      ]
    }
  },
  {
    id: 5,
    title: 'Vztahy',
    subtitle: 'Jeď, směj se, rozdávej',
    description: 'Užij si cestu světem s druhými. Dávej a přijímej. Otevřeně se zajímej a sdílej.',
    color: '#F4A89F',
    bgColor: '#FFF1F2',
    icon: 'heart',
    content: {
      intro: 'V životě budeš úměrně šťasten tomu, jak budeš nápomocen světu. Cti otce svého a matku svou. Harmonické vztahy udržuj. A budeš šťastný a naplněný. Tvůj život bude smysluplný.',
      keyPoints: [
        'Pracuj',
        'Směj se',
        'Buď prospěšný',
        'Sdílej',
        'Dávej a přijímej',
        'Cti otce svého a matku svou'
      ],
      exercises: [
        {
          title: 'Mapa vztahů',
          description: 'Nakresli mapu svých nejdůležitějších vztahů a zhodnoť jejich kvalitu.',
          type: 'reflection'
        },
        {
          title: 'Deník vděčnosti',
          description: 'Každý den zapiš 3 věci, za které jsi vděčný/á ve svých vztazích.',
          type: 'journal'
        },
        {
          title: 'Akt laskavosti',
          description: 'Každý den udělej jeden laskavý čin pro někoho jiného.',
          type: 'practice'
        }
      ],
      affirmations: [
        'Jsem obklopen/a láskou',
        'Dávám a přijímám s otevřeným srdcem',
        'Mé vztahy jsou harmonické',
        'Jsem prospěšný/á světu',
        'Sdílím svou radost s ostatními',
        'Můj život je smysluplný'
      ]
    }
  }
];

export const testimonials = [
  {
    name: 'Petra K.',
    text: 'Program mi pomohl najít sebe samu. Konečně vím, kdo opravdu jsem.',
    module: 'Identita'
  },
  {
    name: 'Martin S.',
    text: 'Pravidla jedné ruky používám každý den. Změnilo to můj pohled na život.',
    module: 'Pravidla'
  },
  {
    name: 'Jana M.',
    text: 'Naučila jsem se kontrolovat své myšlenky a slova. Cítím se mnohem lépe.',
    module: 'Navigace'
  },
  {
    name: 'Tomáš R.',
    text: 'Energetická rovnováha je klíč. Teď mám energii na vše, co chci.',
    module: 'Energie'
  },
  {
    name: 'Eva L.',
    text: 'Mé vztahy se zlepšily. Jsem šťastnější a naplněnější.',
    module: 'Vztahy'
  }
];
