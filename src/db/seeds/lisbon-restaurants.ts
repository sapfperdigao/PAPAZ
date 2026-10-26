import type { Category, RatingSource, PriceRange } from '@/domain';
import type { EditorialSignals } from '@/scoring/consensus';

export interface SeedRating {
  source: RatingSource | 'opentable';
  score: number; // already on the 0–10 axis
  max_score?: number;
  review_count?: number;
}

export interface SeedRestaurant {
  name: string;
  category: Category;
  zone?: string;
  city?: string;
  region?: string;
  country?: string;
  price_range?: PriceRange;
  latitude?: number;
  longitude?: number;
  dish_notes?: string;
  ratings?: SeedRating[];
  editorial?: EditorialSignals;
}

// Generated from the user's curated eat-list + Lisbon_Restaurant_Ratings.md
// (docs/research/gen_seed.py). Ratings are derived from the .md's per-source
// key scores; editorial from its notes. Restaurants without ratings are the
// ones still pending web research.
export const lisbonSeed: SeedRestaurant[] = [
  {
    "name": "Adega das Gravatas",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.2,
        "max_score": 5,
        "review_count": 1002
      }
    ]
  },
  {
    "name": "Cervejaria Trindade",
    "category": "cervejaria",
    "zone": "Chiado",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.1,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 7.0,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Omakase WA",
    "category": "other",
    "zone": "Alfama",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.9,
        "max_score": 10,
        "review_count": 86
      }
    ]
  },
  {
    "name": "Natraj Tandoori",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.6,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Potzalia / RePotzalia",
    "category": "other",
    "zone": "São Sebastião",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 6.8,
        "max_score": 5
      },
      {
        "source": "google",
        "score": 9.4,
        "max_score": 5
      }
    ],
    "editorial": {
      "pressMentions": 1
    }
  },
  {
    "name": "Gambrinus",
    "category": "other",
    "zone": "Baixa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.2,
        "max_score": 5
      },
      {
        "source": "google",
        "score": 8.8,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Kungfu Noodles",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.4,
        "max_score": 10,
        "review_count": 574
      }
    ]
  },
  {
    "name": "Delphi Cheesesteak",
    "category": "other",
    "zone": "Baixa/Chiado",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.4,
        "max_score": 5,
        "review_count": 40
      }
    ],
    "editorial": {
      "best101": true
    }
  },
  {
    "name": "Essencial",
    "category": "other",
    "zone": "Bairro Alto",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "editorial": {
      "best101": true
    }
  },
  {
    "name": "Sushisaito",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "editorial": {
      "pressMentions": 1
    }
  },
  {
    "name": "Cortesia",
    "category": "other",
    "zone": "Campo de Ourique",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.3,
        "max_score": 10,
        "review_count": 2534
      },
      {
        "source": "tripadvisor",
        "score": 6.8,
        "max_score": 5
      }
    ]
  },
  {
    "name": "JNcQUOI Avenida",
    "category": "other",
    "zone": "Av. Liberdade",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "cozido (monthly Cozido à Portuguesa event, last Sunday, €45)",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.6,
        "max_score": 10,
        "review_count": 3563
      }
    ]
  },
  {
    "name": "O Nobre",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "cozido",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.5,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 8.2,
        "max_score": 5
      }
    ],
    "editorial": {
      "best101": true
    }
  },
  {
    "name": "Solar dos Presuntos",
    "category": "other",
    "zone": "Restauradores",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "cozido",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.4,
        "max_score": 5,
        "review_count": 6600
      },
      {
        "source": "google",
        "score": 8.8,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Pap'Açorda",
    "category": "other",
    "zone": "Cais do Sodré",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.3,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 7.4,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Imperial de Campo de Ourique",
    "category": "other",
    "zone": "Campo de Ourique",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.4,
        "max_score": 5,
        "review_count": 75
      }
    ]
  },
  {
    "name": "Fismuler",
    "category": "other",
    "zone": "São Sebastião",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "pão chinês com tártaro de carabineiro",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.8,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Turvo",
    "category": "other",
    "zone": "Areeiro/Alameda",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.4,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Quack Shack",
    "category": "other",
    "zone": "Alvalade",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 10.0,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Fogo by Alexandre Silva",
    "category": "other",
    "zone": "Príncipe Real",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.1,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 9.4,
        "max_score": 5
      }
    ],
    "editorial": {
      "best101": true
    }
  },
  {
    "name": "Libertà Kitchen",
    "category": "other",
    "zone": "Av. Liberdade",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 8.7,
        "max_score": 10,
        "review_count": 95
      },
      {
        "source": "tripadvisor",
        "score": 8.6,
        "max_score": 5,
        "review_count": 88
      },
      {
        "source": "google",
        "score": 9.0,
        "max_score": 5
      }
    ],
    "editorial": {
      "timeOut": true,
      "pressMentions": 1
    }
  },
  {
    "name": "Soya Noodle Bar",
    "category": "other",
    "zone": "Saldanha",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Teimar",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.1,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 8.6,
        "max_score": 5
      }
    ],
    "editorial": {
      "best101": true
    }
  },
  {
    "name": "Alfredo",
    "category": "other",
    "zone": "Beato/Arroios",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "google",
        "score": 9.0,
        "max_score": 5
      }
    ],
    "editorial": {
      "pressMentions": 1
    }
  },
  {
    "name": "Jaguar (Tasco)",
    "category": "other",
    "zone": "Avenidas Novas",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.0,
        "max_score": 5,
        "review_count": 125
      }
    ]
  },
  {
    "name": "Gohan",
    "category": "other",
    "zone": "Cais do Sodré",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "sushi",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 10.0,
        "max_score": 5,
        "review_count": 23
      }
    ]
  },
  {
    "name": "Paloma Negra",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "mexicano",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 10.0,
        "max_score": 5,
        "review_count": 3
      }
    ]
  },
  {
    "name": "Restaurante Cerqueira",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.6,
        "max_score": 5,
        "review_count": 921
      }
    ],
    "editorial": {
      "best101": true,
      "pressMentions": 1
    }
  },
  {
    "name": "Sabores do Sichuan",
    "category": "other",
    "zone": "Martim Moniz",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.0,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Canalha",
    "category": "other",
    "zone": "Alvalade",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.3,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 8.0,
        "max_score": 5
      }
    ],
    "editorial": {
      "inMichelinGuide": true,
      "repsolSoles": 1,
      "best101": true
    }
  },
  {
    "name": "Polémico",
    "category": "other",
    "zone": "Rato",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "editorial": {
      "timeOut": true,
      "pressMentions": 1
    }
  },
  {
    "name": "Vida de Tasca",
    "category": "tasca",
    "zone": "Alvalade",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.4,
        "max_score": 5,
        "review_count": 6
      }
    ]
  },
  {
    "name": "Sophia Pizzoteca",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.2,
        "max_score": 10,
        "review_count": 206
      }
    ]
  },
  {
    "name": "Sihi Mama Dumplings",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "dumplings",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.6,
        "max_score": 5,
        "review_count": 10
      }
    ]
  },
  {
    "name": "Lá Joya Cantina",
    "category": "other",
    "zone": "São Bento",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 7.0,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Kureiji Izakaya",
    "category": "other",
    "zone": "Cais do Sodré",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.5,
        "max_score": 10
      }
    ]
  },
  {
    "name": "Galeto",
    "category": "other",
    "zone": "Saldanha",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 7.0,
        "max_score": 5,
        "review_count": 713
      }
    ]
  },
  {
    "name": "Sky City Sichuan",
    "category": "other",
    "zone": "Areeiro",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Bairro do Avillez",
    "category": "other",
    "zone": "Chiado",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "arroz de limão",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.2,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 7.8,
        "max_score": 5
      },
      {
        "source": "google",
        "score": 8.4,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Santa Joana",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.4,
        "max_score": 10
      },
      {
        "source": "opentable",
        "score": 9.8,
        "max_score": 5
      }
    ],
    "editorial": {
      "inMichelinGuide": true
    }
  },
  {
    "name": "O Galito",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.0,
        "max_score": 5,
        "review_count": 146
      }
    ]
  },
  {
    "name": "Cervejaria Sem Vergonha",
    "category": "cervejaria",
    "zone": "Chiado",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.0,
        "max_score": 10,
        "review_count": 1685
      }
    ]
  },
  {
    "name": "As Parreiras",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "google",
        "score": 9.2,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Restaurante A Gina",
    "category": "other",
    "zone": "Parque Mayer",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "google",
        "score": 8.4,
        "max_score": 5,
        "review_count": 4297
      }
    ]
  },
  {
    "name": "Retasco",
    "category": "other",
    "zone": "Benfica",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "google",
        "score": 9.4,
        "max_score": 5,
        "review_count": 1130
      }
    ]
  },
  {
    "name": "Marítima de Xabregas",
    "category": "other",
    "zone": "Xabregas",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "bacalhau",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.1,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 7.8,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Ryōshi",
    "category": "other",
    "zone": "Cais do Sodré",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.5,
        "max_score": 10,
        "review_count": 1014
      }
    ],
    "editorial": {
      "best101": true
    }
  },
  {
    "name": "Kau Pastrami House",
    "category": "other",
    "zone": "Saldanha",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Snob",
    "category": "other",
    "zone": "Chiado/C. Sodré",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.5,
        "max_score": 10
      }
    ],
    "editorial": {
      "best101": true
    }
  },
  {
    "name": "Pils",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.8,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Uma (Marisqueira Uma)",
    "category": "marisqueira",
    "zone": "Baixa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.0,
        "max_score": 5,
        "review_count": 3200
      }
    ]
  },
  {
    "name": "Tasca Abaladiça",
    "category": "tasca",
    "zone": "Rego",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "google",
        "score": 9.4,
        "max_score": 5,
        "review_count": 65
      }
    ]
  },
  {
    "name": "Bica do Sapato",
    "category": "other",
    "zone": "Santa Apolónia",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.2,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 8.4,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Duna Kebab",
    "category": "other",
    "zone": "Saldanha",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Barbela C.P.M.",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "peixe, snites",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.6,
        "max_score": 10
      }
    ]
  },
  {
    "name": "Fófó grelhados",
    "category": "other",
    "zone": "Benfica",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "sardinhas, pratos tugas",
    "ratings": [
      {
        "source": "google",
        "score": 8.0,
        "max_score": 5,
        "review_count": 674
      }
    ]
  },
  {
    "name": "Lucimar",
    "category": "other",
    "zone": "São Sebastião",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "google",
        "score": 9.4,
        "max_score": 5,
        "review_count": 4977
      }
    ],
    "editorial": {
      "timeOut": true
    }
  },
  {
    "name": "A Galé dos Manos",
    "category": "other",
    "zone": "Benfica",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 7.6,
        "max_score": 5
      },
      {
        "source": "google",
        "score": 8.8,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Dom Leitão",
    "category": "other",
    "zone": "Pina Manique",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "leitão",
    "ratings": [
      {
        "source": "google",
        "score": 8.2,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Tonga",
    "category": "other",
    "zone": "Benfica",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "frango à passarinho",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 7.0,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Magano",
    "category": "other",
    "zone": "Campo de Ourique",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "google",
        "score": 9.4,
        "max_score": 5,
        "review_count": 829
      }
    ]
  },
  {
    "name": "Gancho",
    "category": "other",
    "zone": "Alfama",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 10.0,
        "max_score": 5
      }
    ],
    "editorial": {
      "best101": true,
      "timeOut": true
    }
  },
  {
    "name": "Coelho da Rocha",
    "category": "other",
    "zone": "Campo de Ourique",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.4,
        "max_score": 5
      },
      {
        "source": "google",
        "score": 8.6,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Tinto e Brasa",
    "category": "other",
    "zone": "Rato/Amoreiras",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.5,
        "max_score": 10,
        "review_count": 2100
      },
      {
        "source": "tripadvisor",
        "score": 9.8,
        "max_score": 5
      },
      {
        "source": "google",
        "score": 9.6,
        "max_score": 5,
        "review_count": 1180
      }
    ],
    "editorial": {
      "timeOut": true
    }
  },
  {
    "name": "Belmiro",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "ovos à Belmiro, arroz de perdiz",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.1,
        "max_score": 10,
        "review_count": 800
      },
      {
        "source": "tripadvisor",
        "score": 7.6,
        "max_score": 5,
        "review_count": 43
      }
    ]
  },
  {
    "name": "Do Beco padaria e brunch",
    "category": "other",
    "zone": "Estefânia",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "google",
        "score": 9.4,
        "max_score": 5,
        "review_count": 1075
      }
    ]
  },
  {
    "name": "Browers Beato",
    "category": "other",
    "zone": "Beato",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "sports & beer hall",
    "ratings": [
      {
        "source": "thefork",
        "score": 8.7,
        "max_score": 10,
        "review_count": 1024
      },
      {
        "source": "tripadvisor",
        "score": 6.0,
        "max_score": 5,
        "review_count": 21
      }
    ]
  },
  {
    "name": "O Lâmina",
    "category": "other",
    "zone": "Avenidas Novas",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.4,
        "max_score": 10,
        "review_count": 316
      }
    ],
    "editorial": {
      "pressMentions": 2
    }
  },
  {
    "name": "Gunpowder",
    "category": "other",
    "zone": "Chiado",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.4,
        "max_score": 10,
        "review_count": 650
      },
      {
        "source": "tripadvisor",
        "score": 9.2,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Pinóquio",
    "category": "other",
    "zone": "Restauradores",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 7.8,
        "max_score": 5
      },
      {
        "source": "google",
        "score": 8.6,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Da Noi",
    "category": "other",
    "zone": "Lapa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Copo Largo",
    "category": "other",
    "zone": "Alfama/Mouraria",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "tasca",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.0,
        "max_score": 5,
        "review_count": 33
      }
    ],
    "editorial": {
      "pressMentions": 1
    }
  },
  {
    "name": "Boteco Arandu",
    "category": "other",
    "zone": "Entrecampos",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Palms Pizzeria",
    "category": "other",
    "zone": "Chiado/C. Sodré",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "NY slice",
    "editorial": {
      "timeOut": true
    }
  },
  {
    "name": "Maria Peixeira",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.0,
        "max_score": 10
      },
      {
        "source": "tripadvisor",
        "score": 9.2,
        "max_score": 5
      }
    ]
  },
  {
    "name": "L-Meat by Maria Peixeira",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "meat-focused",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.4,
        "max_score": 10,
        "review_count": 1252
      }
    ]
  },
  {
    "name": "A Carvoaria",
    "category": "other",
    "zone": "Arroios",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "posta mirandesa",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.8,
        "max_score": 5,
        "review_count": 850
      }
    ]
  },
  {
    "name": "Taberna do Quelha",
    "category": "tasca",
    "zone": "Avenidas Novas",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "açorda",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.0,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Maruoko",
    "category": "other",
    "zone": "Belém",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "okonomiyaki"
  },
  {
    "name": "Asitique",
    "category": "other",
    "zone": "Avenidas Novas",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.4,
        "max_score": 10,
        "review_count": 190
      }
    ],
    "editorial": {
      "timeOut": true
    }
  },
  {
    "name": "Regabofe",
    "category": "other",
    "zone": "São Sebastião",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Kerala",
    "category": "other",
    "zone": "Anjos",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.4,
        "max_score": 5,
        "review_count": 142
      }
    ],
    "editorial": {
      "timeOut": true
    }
  },
  {
    "name": "Ramen Joe",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "ramen",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.4,
        "max_score": 5
      }
    ],
    "editorial": {
      "timeOut": true
    }
  },
  {
    "name": "Mitsu",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "omakase",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.8,
        "max_score": 5
      }
    ],
    "editorial": {
      "best101": true
    }
  },
  {
    "name": "Faminto",
    "category": "other",
    "zone": "Santos",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "fire/parrilla steakhouse",
    "ratings": [
      {
        "source": "thefork",
        "score": 8.8,
        "max_score": 10
      }
    ]
  },
  {
    "name": "Vá-Vá Cervejaria",
    "category": "cervejaria",
    "zone": "Alvalade",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 6.0,
        "max_score": 5
      }
    ]
  },
  {
    "name": "Mammarua",
    "category": "other",
    "zone": "Beato",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "Sardinian"
  },
  {
    "name": "Petisco Saloio",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.4,
        "max_score": 5,
        "review_count": 256
      }
    ],
    "editorial": {
      "timeOut": true
    }
  },
  {
    "name": "Grenache",
    "category": "other",
    "zone": "Alfama",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.4,
        "max_score": 5,
        "review_count": 280
      }
    ],
    "editorial": {
      "michelinStars": 1
    }
  },
  {
    "name": "Alpendre",
    "category": "other",
    "zone": "Alfama",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 9.0,
        "max_score": 5,
        "review_count": 1681
      },
      {
        "source": "google",
        "score": 9.0,
        "max_score": 5,
        "review_count": 2374
      }
    ],
    "editorial": {
      "pressMentions": 1
    }
  },
  {
    "name": "Iru (IRÚ) Omakase",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "omakase"
  },
  {
    "name": "Ueno Omakase",
    "category": "other",
    "zone": "Campo Grande",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "omakase",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.7,
        "max_score": 10
      }
    ]
  },
  {
    "name": "Katsu Asian Bistro",
    "category": "other",
    "zone": "Cais do Sodré",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "katsu sandos",
    "ratings": [
      {
        "source": "google",
        "score": 9.6,
        "max_score": 5,
        "review_count": 1600
      }
    ]
  },
  {
    "name": "Yokocho",
    "category": "other",
    "zone": "São Bento",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "ramen",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.4,
        "max_score": 10,
        "review_count": 22
      }
    ]
  },
  {
    "name": "Scusa",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "Italian",
    "ratings": [
      {
        "source": "thefork",
        "score": 9.1,
        "max_score": 10,
        "review_count": 1800
      }
    ]
  },
  {
    "name": "Cantinho da Ameixoeira",
    "category": "other",
    "zone": "Ameixoeira",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "google",
        "score": 9.0,
        "max_score": 5,
        "review_count": 291
      }
    ],
    "editorial": {
      "timeOut": true
    }
  },
  {
    "name": "Pateo 13",
    "category": "other",
    "zone": "Alfama",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.8,
        "max_score": 5,
        "review_count": 103
      },
      {
        "source": "google",
        "score": 8.8,
        "max_score": 5,
        "review_count": 1540
      }
    ]
  },
  {
    "name": "ÀCosta by Olivier",
    "category": "other",
    "zone": "Santa Maria Maior",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "seafood, river views",
    "ratings": [
      {
        "source": "google",
        "score": 8.8,
        "max_score": 5,
        "review_count": 775
      }
    ]
  },
  {
    "name": "Cantina Hindu",
    "category": "other",
    "zone": "Lumiar",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "vegetarian buffet",
    "ratings": [
      {
        "source": "tripadvisor",
        "score": 8.4,
        "max_score": 5,
        "review_count": 71
      }
    ]
  },
  {
    "name": "Tomorrow at 9",
    "category": "other",
    "zone": "Rua Viriato 9B",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Mourense",
    "category": "other",
    "zone": "Sete Rios",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal",
    "dish_notes": "take away"
  },
  {
    "name": "Tasquinha de Benfica",
    "category": "tasca",
    "zone": "Benfica",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Nepal (unresolved)",
    "category": "other",
    "zone": "Lisboa",
    "city": "Lisbon",
    "region": "lisbon-city",
    "country": "Portugal"
  },
  {
    "name": "Casa Galega",
    "category": "other",
    "zone": "Paço de Arcos",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Blitz Costa Pizza",
    "category": "other",
    "zone": "Costa da Caparica",
    "city": "Almada",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Relento",
    "category": "other",
    "zone": "Algés",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Damasqino",
    "category": "other",
    "zone": "Almada",
    "city": "Almada",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Bogotá (Cervejaria Bogotá)",
    "category": "cervejaria",
    "zone": "Rua Santos Mattos",
    "city": "Amadora",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "O Pescador (Lagamecas)",
    "category": "other",
    "zone": "Lagameças",
    "city": "Palmela",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Honor Sushi",
    "category": "other",
    "zone": "Charneca da Caparica",
    "city": "Almada",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "sushi"
  },
  {
    "name": "Churrasco da Amoreirinha",
    "category": "other",
    "zone": "Santo Estêvão, Benavente",
    "city": "Santarém",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Tasca do Toninho",
    "category": "tasca",
    "zone": "Setúbal",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Kappo",
    "category": "other",
    "zone": "Cascais",
    "city": "Cascais",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Tasquinha da Costa",
    "category": "tasca",
    "zone": "Costa da Caparica",
    "city": "Almada",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "peixe"
  },
  {
    "name": "Kau Barbecue",
    "category": "other",
    "zone": "Malveira",
    "city": "Mafra",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "churrasco"
  },
  {
    "name": "Velho Lídia",
    "category": "other",
    "zone": "Setúbal",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Casa Piano",
    "category": "other",
    "zone": "Cabanas de Viriato",
    "city": "Viseu",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "enguias"
  },
  {
    "name": "Genoma Sushi",
    "category": "other",
    "zone": "São Domingos de Rana",
    "city": "Cascais",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "sushi"
  },
  {
    "name": "3 Marmelos",
    "category": "other",
    "zone": "Évora",
    "city": "Évora",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Taberna Lura",
    "category": "tasca",
    "zone": "Baião",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Pensão Borges",
    "category": "other",
    "zone": "Baião",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Tasquinha do Fumo",
    "category": "tasca",
    "zone": "Baião",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Manjar do Marquês",
    "category": "other",
    "zone": "Pombal",
    "city": "Pombal",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "arroz de pato"
  },
  {
    "name": "Casa Espresso",
    "category": "other",
    "zone": "Porto",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "sandes de rojão"
  },
  {
    "name": "Garagem 33",
    "category": "other",
    "zone": "Braga",
    "city": "Braga",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Ninho",
    "category": "other",
    "zone": "Montijo",
    "city": "Montijo",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Páteo Real",
    "category": "other",
    "zone": "Alter do Chão",
    "city": "Alter do Chão",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Sabores do Campo",
    "category": "other",
    "zone": "Pegões",
    "city": "Montijo",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "A Casa do Pescador",
    "category": "other",
    "zone": "Montijo",
    "city": "Montijo",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Girassol (Alcochete)",
    "category": "other",
    "zone": "Alcochete",
    "city": "Alcochete",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Girassol (Sarilhos)",
    "category": "other",
    "zone": "Sarilhos",
    "city": "Moita",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Grelha da Barra",
    "category": "other",
    "zone": "Oeiras",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Yuko",
    "category": "other",
    "zone": "Porto",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Romeu e Julieta Hamburger",
    "category": "other",
    "zone": "Oeiras",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "hamburger"
  },
  {
    "name": "Tasquinha do Bento",
    "category": "tasca",
    "zone": "São Marcos",
    "city": "Sintra",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Mato à Vista",
    "category": "other",
    "zone": "Paderne",
    "city": "Albufeira",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "pratos de caça, feijoadas, cataplanas, peixe rei e peixe aranha frito"
  },
  {
    "name": "Restaurante Ramires",
    "category": "other",
    "zone": "Guia",
    "city": "Albufeira",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "frango piri-piri"
  },
  {
    "name": "O Landim",
    "category": "other",
    "zone": "Alcobaça",
    "city": "Alcobaça",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Tia Isabel",
    "category": "other",
    "zone": "Braga",
    "city": "Braga",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "O Golfinho",
    "category": "other",
    "zone": "Barranco das Belharucas",
    "city": "Albufeira",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Praia do Rey",
    "category": "other",
    "zone": "Charneca da Caparica",
    "city": "Almada",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Parrilha Natural",
    "category": "other",
    "zone": "Algarve",
    "city": "Algarve",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "Uruguayan parrilla"
  },
  {
    "name": "Bovino (Quinta do Lago)",
    "category": "other",
    "zone": "Quinta do Lago",
    "city": "Loulé",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Verde e Branco",
    "category": "other",
    "zone": "Setúbal",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "O Açude",
    "category": "other",
    "zone": "Coimbra",
    "city": "Coimbra",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Sierra Tramontana",
    "category": "other",
    "zone": "Palma",
    "city": "Mallorca",
    "region": "abroad",
    "country": "Spain"
  },
  {
    "name": "LPA",
    "category": "other",
    "zone": "Ayamonte",
    "city": "Ayamonte",
    "region": "abroad",
    "country": "Spain"
  },
  {
    "name": "Meraqi",
    "category": "other",
    "zone": "Ayamonte",
    "city": "Ayamonte",
    "region": "abroad",
    "country": "Spain"
  },
  {
    "name": "Mosteiro do Leitão",
    "category": "other",
    "zone": "Batalha",
    "city": "Batalha",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "leitão"
  },
  {
    "name": "O Cruzamento",
    "category": "other",
    "zone": "Grândola",
    "city": "Grândola",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Aldêa",
    "category": "other",
    "zone": "Cabanas",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Punch",
    "category": "other",
    "zone": "Oeiras",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Almina",
    "category": "other",
    "zone": "Cascais",
    "city": "Cascais",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Zé Varunca",
    "category": "other",
    "zone": "Paço de Arcos",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Intemporal",
    "category": "other",
    "zone": "Paço de Arcos",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Bodega Brava",
    "category": "other",
    "zone": "Cascais",
    "city": "Cascais",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Srikaya",
    "category": "other",
    "zone": "Setúbal",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Casa Ideal",
    "category": "other",
    "zone": "Trafaria",
    "city": "Almada",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Restaurante Toninho",
    "category": "other",
    "zone": "Montijo",
    "city": "Montijo",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Voraz",
    "category": "other",
    "zone": "Barreiro",
    "city": "Barreiro",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Calma Calma",
    "category": "other",
    "zone": "Setúbal",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "Italian"
  },
  {
    "name": "Mar Azul 2",
    "category": "other",
    "zone": "Setúbal",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "peixe"
  },
  {
    "name": "Delícia",
    "category": "other",
    "zone": "Setúbal",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "bitoque"
  },
  {
    "name": "Chapa 7",
    "category": "other",
    "zone": "Santarém",
    "city": "Santarém",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Atrevo",
    "category": "other",
    "zone": "Porto",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Retiro do Capitanga",
    "category": "other",
    "zone": "Sintra",
    "city": "Sintra",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Baco Coffee Lab",
    "category": "other",
    "zone": "Porto",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "O Cantinho do João",
    "category": "other",
    "zone": "Odivelas",
    "city": "Odivelas",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Sushi Pearl",
    "category": "other",
    "zone": "Algarve",
    "city": "Algarve",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "sushi"
  },
  {
    "name": "O Vitor (Póvoa de Lanhoso)",
    "category": "other",
    "zone": "Póvoa de Lanhoso",
    "city": "Póvoa de Lanhoso",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "O Típico da Bairrada",
    "category": "other",
    "zone": "Bairrada",
    "city": "Bairrada",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "leitão"
  },
  {
    "name": "Parreirinha de Algés",
    "category": "other",
    "zone": "Algés",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "sardinhas"
  },
  {
    "name": "Enigma dos Mariscos",
    "category": "marisqueira",
    "zone": "Azeitão",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "mariscos"
  },
  {
    "name": "Deselegante",
    "category": "other",
    "zone": "Santarém",
    "city": "Santarém",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Restaurante António",
    "category": "other",
    "zone": "Porto",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Fava Tonka",
    "category": "other",
    "zone": "Porto",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "O Victor (Montijo)",
    "category": "other",
    "zone": "Montijo",
    "city": "Montijo",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "peixe assado"
  },
  {
    "name": "Os Martins",
    "category": "other",
    "zone": "Amadora",
    "city": "Amadora",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Oficina dos Rissóis",
    "category": "other",
    "zone": "Porto",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "rissóis"
  },
  {
    "name": "Tasquinha do Butes",
    "category": "tasca",
    "zone": "Charneca da Caparica",
    "city": "Almada",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Marisqueira do Samouco",
    "category": "marisqueira",
    "zone": "Samouco",
    "city": "Alcochete",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "mariscos"
  },
  {
    "name": "Restaurante Tia Alice",
    "category": "other",
    "zone": "Negrais",
    "city": "Sintra",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "leitão"
  },
  {
    "name": "Restaurante Ti Silvina",
    "category": "other",
    "zone": "Alcácer do Sal",
    "city": "Alcácer do Sal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Pérola da Mourisca",
    "category": "other",
    "zone": "Mourisca",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Constantino (Benfica do Ribatejo)",
    "category": "other",
    "zone": "Benfica do Ribatejo",
    "city": "Almeirim",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Bugalho",
    "category": "other",
    "zone": "Guimarães",
    "city": "Guimarães",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Canalha Comporta",
    "category": "other",
    "zone": "Comporta",
    "city": "Alcácer do Sal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "O Farol",
    "category": "other",
    "zone": "Arrábida",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Zé Manel dos Ossos",
    "category": "other",
    "zone": "Coimbra",
    "city": "Coimbra",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Pear",
    "category": "other",
    "zone": "Faro",
    "city": "Faro",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Capa Negra",
    "category": "other",
    "zone": "Porto",
    "city": "Porto",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "francesinha"
  },
  {
    "name": "Parea",
    "category": "other",
    "zone": "Oeiras",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Tasca do Isaías",
    "category": "tasca",
    "zone": "Sesimbra",
    "city": "Sesimbra",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Costa Nossa",
    "category": "other",
    "zone": "Sesimbra",
    "city": "Sesimbra",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "O Rastilho",
    "category": "other",
    "zone": "Barcarena",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Tia Rosa",
    "category": "other",
    "zone": "Melides",
    "city": "Grândola",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Alcides",
    "category": "other",
    "zone": "Ponta Delgada, São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Bom Pesqueiro",
    "category": "other",
    "zone": "Ponta Delgada, São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Quinta dos Sabores",
    "category": "other",
    "zone": "Rabo de Peixe, São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "dinner"
  },
  {
    "name": "Galego",
    "category": "other",
    "zone": "São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Casa de Pasto o Amaral",
    "category": "other",
    "zone": "São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Gastrónomo",
    "category": "other",
    "zone": "São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Otaka",
    "category": "other",
    "zone": "São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "Japanese/Peruvian"
  },
  {
    "name": "Abel",
    "category": "other",
    "zone": "São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Aliança",
    "category": "other",
    "zone": "São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Bar Caloura",
    "category": "other",
    "zone": "Caloura, São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "lapas"
  },
  {
    "name": "Saca Rolhas",
    "category": "other",
    "zone": "São Miguel",
    "city": "Azores",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Tua Madre",
    "category": "other",
    "zone": "Évora",
    "city": "Évora",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Floresta (Caxias)",
    "category": "other",
    "zone": "Caxias",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Rampa do Pragal",
    "category": "other",
    "zone": "Pragal",
    "city": "Almada",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Austa",
    "category": "other",
    "zone": "Algarve",
    "city": "Algarve",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Mezé",
    "category": "other",
    "zone": "Setúbal",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Muchacho",
    "category": "other",
    "zone": "Barcarena",
    "city": "Oeiras",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Taberna da Maré",
    "category": "tasca",
    "zone": "Portimão",
    "city": "Portimão",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "St. John",
    "category": "other",
    "zone": "London",
    "city": "London",
    "region": "abroad",
    "country": "UK"
  },
  {
    "name": "Feito no Zambujal",
    "category": "other",
    "zone": "Zambujal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Restaurante Garrafeira Veneza",
    "category": "other",
    "zone": "Algarve",
    "city": "Algarve",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "galinha cerejada"
  },
  {
    "name": "Tasca do Celso",
    "category": "tasca",
    "zone": "Vila Nova de Milfontes",
    "city": "Odemira",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Lamelas",
    "category": "other",
    "zone": "Porto Covo",
    "city": "Sines",
    "region": "portugal-other",
    "country": "Portugal",
    "dish_notes": "arroz de peixe"
  },
  {
    "name": "Restaurante Sul",
    "category": "other",
    "zone": "Burgau",
    "city": "Vila do Bispo",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Trafaria na Brasa",
    "category": "other",
    "zone": "Trafaria",
    "city": "Almada",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Soce",
    "category": "other",
    "zone": "Setúbal",
    "city": "Setúbal",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "As Colunas",
    "category": "other",
    "zone": "Amadora",
    "city": "Amadora",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Sala do Chef",
    "category": "other",
    "zone": "Montijo",
    "city": "Montijo",
    "region": "portugal-other",
    "country": "Portugal"
  },
  {
    "name": "Casa do Lavrador",
    "category": "other",
    "zone": "Baião",
    "city": "Baião",
    "region": "portugal-other",
    "country": "Portugal"
  }
];
