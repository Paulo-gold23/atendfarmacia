/**
 * Sofia Medicines Database
 * Contains baseline medicines and scraped products from Drogasil.
 * Cleaned of dosage/posology and contraindications for legal compliance.
 */

const MEDICINES_DB = [
  {
    "name": "Dipirona Gotas",
    "aliases": [
      "dipirona",
      "dipirona gotas",
      "dipirona liquida",
      "novalgina"
    ],
    "price": 12.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "frasco de 20ml",
    "unitName": "frasco",
    "activeIngredient": "Dipirona Sódica",
    "manufacturer": "EMS Genéricos",
    "isGeneric": true,
    "tags": [
      "dor",
      "febre",
      "cabeça",
      "corpo",
      "colica",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Novalgina 1g",
    "aliases": [
      "novalgina",
      "novalgina 1g",
      "novalgina comprimido"
    ],
    "price": 18.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 10 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Dipirona Sódica",
    "manufacturer": "Sanofi-Aventis",
    "isGeneric": false,
    "tags": [
      "dor",
      "febre",
      "cabeça",
      "corpo",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Paracetamol 500mg",
    "aliases": [
      "paracetamol",
      "paracetamol comprimido"
    ],
    "price": 7.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Paracetamol",
    "manufacturer": "Medley Genéricos",
    "isGeneric": true,
    "tags": [
      "dor",
      "febre",
      "cabeça",
      "corpo",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Tylenol 750mg",
    "aliases": [
      "tylenol",
      "tylenol 750mg"
    ],
    "price": 15,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Paracetamol",
    "manufacturer": "Kenvue S.A.",
    "isGeneric": false,
    "tags": [
      "dor",
      "febre",
      "cabeça",
      "corpo",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Buscopan Composto",
    "aliases": [
      "buscopan",
      "buscopan composto",
      "buscopan comprimido"
    ],
    "price": 18.5,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Butilbrometo de Escopolamina + Dipirona",
    "manufacturer": "Boehringer Ingelheim",
    "isGeneric": false,
    "tags": [
      "dor",
      "colica",
      "estomago",
      "abdominal",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Butilbrometo de Escopolamina",
    "aliases": [
      "butilbrometo",
      "escopolamina",
      "buscopan generico"
    ],
    "price": 9.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Butilbrometo de Escopolamina",
    "manufacturer": "Neo Química",
    "isGeneric": true,
    "tags": [
      "dor",
      "colica",
      "estomago",
      "abdominal",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Neosaldina",
    "aliases": [
      "neosaldina",
      "neosa",
      "neosaldina comprimido"
    ],
    "price": 21.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Dipirona + Mucato de Isometepteno + Cafeína",
    "manufacturer": "Takeda Pharma",
    "isGeneric": false,
    "tags": [
      "dor",
      "cabeça",
      "enxaqueca",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Neosoro",
    "aliases": [
      "neosoro",
      "sorine",
      "descongestionante",
      "rinosoro"
    ],
    "price": 8.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "frasco de 30ml",
    "unitName": "frasco",
    "activeIngredient": "Cloridrato de Naftazolina",
    "manufacturer": "Neo Química",
    "isGeneric": false,
    "tags": [
      "nariz",
      "descongestionante",
      "alergia",
      "rinite",
      "gripe",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Dorflex",
    "aliases": [
      "dorflex",
      "dorflex comprimido"
    ],
    "price": 14.5,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 36 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Dipirona + Citrato de Orfenadrina + Cafeína Anidra",
    "manufacturer": "Sanofi-Aventis",
    "isGeneric": false,
    "tags": [
      "dor",
      "muscular",
      "corpo",
      "costas",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Advil 400mg",
    "aliases": [
      "advil",
      "ibuprofeno comprimido"
    ],
    "price": 18.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 8 cápsulas gelatinosas",
    "unitName": "caixa",
    "activeIngredient": "Ibuprofeno",
    "manufacturer": "Haleon Brasil",
    "isGeneric": false,
    "tags": [
      "dor",
      "inflamação",
      "garganta",
      "muscular",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Ibuprofeno 600mg",
    "aliases": [
      "ibuprofeno",
      "ibuprofeno generico"
    ],
    "price": 10.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Ibuprofeno",
    "manufacturer": "Prati-Donaduzzi",
    "isGeneric": true,
    "tags": [
      "dor",
      "inflamação",
      "garganta",
      "muscular",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Eno Efervescente",
    "aliases": [
      "eno",
      "sal de fruta eno",
      "sal de fruta"
    ],
    "price": 6.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "envelope de 5g",
    "unitName": "envelope",
    "activeIngredient": "Bicarbonato de Sódio + Carbonato de Sódio + Ácido Cítrico",
    "manufacturer": "Haleon Brasil",
    "isGeneric": false,
    "tags": [
      "azia",
      "queimação",
      "estomago",
      "digestao",
      "refluxo",
      "antiacido",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sonrisal",
    "aliases": [
      "sonrisal"
    ],
    "price": 5.5,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 2 comprimidos efervescentes",
    "unitName": "caixa",
    "activeIngredient": "Ácido Acetilsalicílico + Carbonato de Sódio",
    "manufacturer": "Haleon Brasil",
    "isGeneric": false,
    "tags": [
      "azia",
      "queimação",
      "estomago",
      "dor",
      "cabeça",
      "antiacido",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Estomazil",
    "aliases": [
      "estomazil"
    ],
    "price": 7.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 6 envelopes",
    "unitName": "caixa",
    "activeIngredient": "Bicarbonato de Sódio + Carbonato de Cálcio",
    "manufacturer": "Hypera Pharma",
    "isGeneric": false,
    "tags": [
      "azia",
      "queimação",
      "estomago",
      "digestao",
      "refluxo",
      "antiacido",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Luftal Gotas",
    "aliases": [
      "luftal",
      "simeticona",
      "luftal gotas"
    ],
    "price": 16.2,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "frasco de 15ml",
    "unitName": "frasco",
    "activeIngredient": "Simeticona",
    "manufacturer": "Reckitt Benckiser",
    "isGeneric": false,
    "tags": [
      "gases",
      "estufado",
      "barriga",
      "abdominal",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Benegrip",
    "aliases": [
      "benegrip",
      "antigripal"
    ],
    "price": 14.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 12 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Dipirona + Maleato de Clorfeniramina + Cafeína",
    "manufacturer": "Hypera Pharma",
    "isGeneric": false,
    "tags": [
      "gripe",
      "resfriado",
      "coriza",
      "espirro",
      "febre",
      "dor",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cimegripe",
    "aliases": [
      "cimegripe"
    ],
    "price": 10.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Paracetamol + Maleato de Clorfeniramina + Fenilefrina",
    "manufacturer": "Cimed Indústria",
    "isGeneric": false,
    "tags": [
      "gripe",
      "resfriado",
      "coriza",
      "espirro",
      "febre",
      "dor",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Resfenol",
    "aliases": [
      "resfenol"
    ],
    "price": 13.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Paracetamol + Clorfeniramina + Cloridrato de Fenilefrina",
    "manufacturer": "Kley Hertz",
    "isGeneric": false,
    "tags": [
      "gripe",
      "resfriado",
      "coriza",
      "espirro",
      "febre",
      "dor",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Strepsils pastilha",
    "aliases": [
      "strepsils",
      "pastilha para garganta"
    ],
    "price": 18.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 8 pastilhas",
    "unitName": "caixa",
    "activeIngredient": "Flurbiprofeno",
    "manufacturer": "Reckitt Benckiser",
    "isGeneric": false,
    "tags": [
      "tosse",
      "garganta",
      "dor",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Benalet pastilhas",
    "aliases": [
      "benalet"
    ],
    "price": 14.5,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 12 pastilhas",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Difenhidramina",
    "manufacturer": "Kenvue S.A.",
    "isGeneric": false,
    "tags": [
      "tosse",
      "garganta",
      "dor",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Flogoral Spray",
    "aliases": [
      "flogoral"
    ],
    "price": 26.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "frasco spray de 30ml",
    "unitName": "frasco",
    "activeIngredient": "Cloridrato de Benzidamina",
    "manufacturer": "Aché Laboratórios",
    "isGeneric": false,
    "tags": [
      "tosse",
      "garganta",
      "dor",
      "spray",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cataflan Emulgel",
    "aliases": [
      "cataflan",
      "cataflan emulgel",
      "pomada cataflan"
    ],
    "price": 29.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "bisnaga de 60g",
    "unitName": "bisnaga",
    "activeIngredient": "Diclofenaco Dietilamônio",
    "manufacturer": "Novartis Pharma",
    "isGeneric": false,
    "tags": [
      "dor",
      "muscular",
      "costas",
      "torçao",
      "pomada",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Lubrificante KY",
    "aliases": [
      "ky",
      "lubrificante ky",
      "gel ky",
      "lubrificante"
    ],
    "price": 24.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "bisnaga de 50g",
    "unitName": "bisnaga",
    "activeIngredient": "Glicerol + Água",
    "manufacturer": "Kenvue S.A.",
    "isGeneric": false,
    "tags": [
      "lubrificante",
      "íntimo",
      "higiene"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Preservativo Jontex",
    "aliases": [
      "jontex",
      "camisinha",
      "preservativo"
    ],
    "price": 12,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "pacote com 3 unidades",
    "unitName": "pacote",
    "activeIngredient": "Látex Natural",
    "manufacturer": "Reckitt Benckiser",
    "isGeneric": false,
    "tags": [
      "camisinha",
      "preservativo",
      "higiene"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Sundown SPF 50",
    "aliases": [
      "sundown",
      "protetor solar"
    ],
    "price": 49.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "frasco de 120ml",
    "unitName": "frasco",
    "activeIngredient": "Filtros químicos UVA/UVB",
    "manufacturer": "Kenvue S.A.",
    "isGeneric": false,
    "tags": [
      "solar",
      "protetor",
      "pele",
      "beleza"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Xantinon",
    "aliases": [
      "xantinon",
      "xantinon comprimido",
      "xanitinom"
    ],
    "price": 16.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Citrato de Colina + Metionina",
    "manufacturer": "Mensa S.A.",
    "isGeneric": false,
    "tags": [
      "figado",
      "digestao",
      "ressaca",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Imosec 2mg",
    "aliases": [
      "imosec",
      "loperamida",
      "imosec comprimido"
    ],
    "price": 18.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 12 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Loperamida",
    "manufacturer": "Janssen-Cilag",
    "isGeneric": false,
    "tags": [
      "diarreia",
      "intestino",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Floratil 200mg",
    "aliases": [
      "floratil",
      "floratil capsula",
      "floratil sachê"
    ],
    "price": 29.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 6 cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Saccharomyces boulardii",
    "manufacturer": "Biocodex",
    "isGeneric": false,
    "tags": [
      "diarreia",
      "flora",
      "intestino",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Dramin B6",
    "aliases": [
      "dramin",
      "dramin b6",
      "dramin comprimido"
    ],
    "price": 15.5,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Dimenidrinato + Piridoxina",
    "manufacturer": "Takeda Pharma",
    "isGeneric": false,
    "tags": [
      "enjoo",
      "nausea",
      "vomito",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vonau Flash 4mg",
    "aliases": [
      "vonau",
      "vonau flash",
      "ondansetrona"
    ],
    "price": 32.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 10 comprimidos sublinguais",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Ondansetrona",
    "manufacturer": "Biolab",
    "isGeneric": false,
    "tags": [
      "enjoo",
      "nausea",
      "vomito",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Nebacetin",
    "aliases": [
      "nebacetin",
      "pomada nebacetin",
      "neomicina"
    ],
    "price": 19.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "bisnaga de 15g",
    "unitName": "bisnaga",
    "activeIngredient": "Sulfato de Neomicina + Bacitracina Zíncica",
    "manufacturer": "Takeda Pharma",
    "isGeneric": false,
    "tags": [
      "infecção",
      "pele",
      "pomada",
      "cortes",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Tandrilax",
    "aliases": [
      "tandrilax",
      "tandrilax comprimido",
      "tandrilas"
    ],
    "price": 28.5,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Carisoprodol + Cafeína + Diclofenaco Sódico + Paracetamol",
    "manufacturer": "Aché Laboratórios",
    "isGeneric": false,
    "tags": [
      "dor",
      "muscular",
      "costas",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Loratadina 10mg",
    "aliases": [
      "loratadina",
      "loratadina comprimido"
    ],
    "price": 14.2,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 12 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Loratadina",
    "manufacturer": "Eurofarma Genéricos",
    "isGeneric": true,
    "tags": [
      "alergia",
      "rinite",
      "espirro",
      "coceira",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Engov",
    "aliases": [
      "engov",
      "engov comprimido"
    ],
    "price": 9.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 6 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Maleato de Mepiramina + AAS + Hidróxido de Alumínio + Cafeína",
    "manufacturer": "Hypera Pharma",
    "isGeneric": false,
    "tags": [
      "ressaca",
      "cabeça",
      "dor",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Epocler",
    "aliases": [
      "epocler",
      "flaconete epocler"
    ],
    "price": 3.5,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "flaconete de 10ml",
    "unitName": "flaconete",
    "activeIngredient": "Citrato de Colina + Betaina + Metionina",
    "manufacturer": "Hypera Pharma",
    "isGeneric": false,
    "tags": [
      "figado",
      "ressaca",
      "digestao",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Aspirina 500mg",
    "aliases": [
      "aspirina",
      "acido acetilsalicilico"
    ],
    "price": 11.5,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "caixa com 10 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Ácido Acetilsalicílico",
    "manufacturer": "Bayer S.A.",
    "isGeneric": false,
    "tags": [
      "dor",
      "febre",
      "cabeça",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Bepantol Derma",
    "aliases": [
      "bepantol",
      "bepantol derma",
      "pomada bepantol"
    ],
    "price": 34.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "bisnaga de 20g",
    "unitName": "bisnaga",
    "activeIngredient": "Dexpantenol",
    "manufacturer": "Bayer S.A.",
    "isGeneric": false,
    "tags": [
      "assadura",
      "pele",
      "cicatrizante",
      "hidratante",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hipoglós Amêndoas",
    "aliases": [
      "hipoglos",
      "pomada hipoglos"
    ],
    "price": 18.9,
    "category": "MIP",
    "needsRecipe": false,
    "allowsDelivery": true,
    "presentation": "bisnaga de 40g",
    "unitName": "bisnaga",
    "activeIngredient": "Óxido de Zinco + Vitaminas A e D + Óleo de Amêndoas",
    "manufacturer": "Johnson & Johnson",
    "isGeneric": false,
    "tags": [
      "assadura",
      "bebe",
      "pele",
      "pomada",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Losartana 50mg",
    "aliases": [
      "losartana",
      "losartana 50mg",
      "losartana comprimido"
    ],
    "price": 14.9,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Losartana Potássica",
    "manufacturer": "EMS Genéricos",
    "isGeneric": true,
    "tags": [
      "pressao",
      "hipertensao",
      "coraçao",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Omeprazol 20mg",
    "aliases": [
      "omeprazol",
      "omeprazol 20mg"
    ],
    "price": 22,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 28 cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Omeprazol",
    "manufacturer": "EMS Genéricos",
    "isGeneric": true,
    "tags": [
      "azia",
      "gastrite",
      "refluxo",
      "estomago",
      "queimação",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Pantoprazol 40mg",
    "aliases": [
      "pantoprazol",
      "pantoprazol 40mg"
    ],
    "price": 38,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 28 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Pantoprazol",
    "manufacturer": "Eurofarma Genéricos",
    "isGeneric": true,
    "tags": [
      "azia",
      "gastrite",
      "refluxo",
      "estomago",
      "queimação",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Allegra 120mg",
    "aliases": [
      "allegra",
      "allegra 120mg",
      "desalex",
      "antialergico",
      "claritin"
    ],
    "price": 34.9,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 10 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Fexofenadina",
    "manufacturer": "Sanofi-Aventis",
    "isGeneric": false,
    "tags": [
      "alergia",
      "rinite",
      "espirro",
      "coceira",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Nimesulida 100mg",
    "aliases": [
      "nimesulida",
      "nimesulida 100mg"
    ],
    "price": 12.5,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 12 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Nimesulida",
    "manufacturer": "Medley Genéricos",
    "isGeneric": true,
    "tags": [
      "dor",
      "inflamação",
      "garganta",
      "febre",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Meloxicam 15mg",
    "aliases": [
      "meloxicam",
      "meloxicam 15mg"
    ],
    "price": 18.9,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 10 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Meloxicam",
    "manufacturer": "Eurofarma Genéricos",
    "isGeneric": true,
    "tags": [
      "dor",
      "inflamação",
      "articulacao",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sinvastatina 20mg",
    "aliases": [
      "sinvastatina",
      "remedio de colesterol"
    ],
    "price": 16,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Sinvastatina",
    "manufacturer": "Medley Genéricos",
    "isGeneric": true,
    "tags": [
      "colesterol",
      "gordura",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Puran T4 50mcg",
    "aliases": [
      "puran",
      "puran t4",
      "levotiroxina",
      "remedio de tireoide"
    ],
    "price": 19.5,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Levotiroxina Sódica",
    "manufacturer": "Sanofi-Aventis",
    "isGeneric": false,
    "tags": [
      "tireoide",
      "hormonio",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sertralina 50mg",
    "aliases": [
      "sertralina",
      "sertralina 50mg"
    ],
    "price": 35,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Sertralina",
    "manufacturer": "Teuto Genéricos",
    "isGeneric": true,
    "tags": [
      "depressão",
      "ansiedade",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fluoxetina 20mg",
    "aliases": [
      "fluoxetina",
      "fluoxetina 20mg"
    ],
    "price": 28,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Fluoxetina",
    "manufacturer": "Neo Química Genéricos",
    "isGeneric": true,
    "tags": [
      "depressão",
      "ansiedade",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Escitalopram 10mg",
    "aliases": [
      "escitalopram",
      "escitalopram 10mg"
    ],
    "price": 48,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Oxalato de Escitalopram",
    "manufacturer": "Eurofarma Genéricos",
    "isGeneric": true,
    "tags": [
      "depressão",
      "ansiedade",
      "panico",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Metformina 850mg",
    "aliases": [
      "metformina",
      "glifage",
      "glifage xr",
      "metformina 850mg"
    ],
    "price": 15,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Metformina",
    "manufacturer": "EMS Genéricos",
    "isGeneric": true,
    "tags": [
      "diabetes",
      "acucar",
      "glicemia",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Aerolin Spray",
    "aliases": [
      "aerolin",
      "aerolin spray",
      "bombinha aerolin",
      "salbutamol"
    ],
    "price": 26.5,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "frasco spray de 200 doses",
    "unitName": "frasco",
    "activeIngredient": "Sulfato de Salbutamol",
    "manufacturer": "GlaxoSmithKline (GSK)",
    "isGeneric": false,
    "tags": [
      "asma",
      "bombinha",
      "falta de ar",
      "bronquite",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Tadalafila 5mg",
    "aliases": [
      "tadalafila",
      "tadalafina",
      "tadalafila 5mg"
    ],
    "price": 29.9,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Tadalafila",
    "manufacturer": "Eurofarma Genéricos",
    "isGeneric": true,
    "tags": [
      "ereção",
      "disfunção",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Amoxicilina 500mg",
    "aliases": [
      "amoxicilina",
      "amoxicilina 500mg",
      "amoxilina"
    ],
    "price": 28,
    "category": "Antibiótico",
    "needsRecipe": true,
    "recipeType": "retida",
    "allowsDelivery": true,
    "presentation": "caixa com 21 cápsulas",
    "unitName": "caixa",
    "unitPills": 21,
    "activeIngredient": "Amoxicilina tri-hidratada",
    "manufacturer": "Eurofarma Genéricos",
    "isGeneric": true,
    "tags": [
      "antibiotico",
      "infecção",
      "garganta",
      "bacteria",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Azitromicina 500mg",
    "aliases": [
      "azitromicina",
      "azitromicina 500mg",
      "zitromax"
    ],
    "price": 24.5,
    "category": "Antibiótico",
    "needsRecipe": true,
    "recipeType": "retida",
    "allowsDelivery": true,
    "presentation": "caixa com 5 comprimidos",
    "unitName": "caixa",
    "unitPills": 5,
    "activeIngredient": "Azitromicina di-hidratada",
    "manufacturer": "EMS Genéricos",
    "isGeneric": true,
    "tags": [
      "antibiotico",
      "infecção",
      "garganta",
      "bacteria",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cefalexina 500mg",
    "aliases": [
      "cefalexina",
      "cefalexina 500mg"
    ],
    "price": 39.9,
    "category": "Antibiótico",
    "needsRecipe": true,
    "recipeType": "retida",
    "allowsDelivery": true,
    "presentation": "caixa com 40 comprimidos",
    "unitName": "caixa",
    "unitPills": 40,
    "activeIngredient": "Cefalexina monoidratada",
    "manufacturer": "Medley Genéricos",
    "isGeneric": true,
    "tags": [
      "antibiotico",
      "infecção",
      "pele",
      "bacteria",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Ciprofloxacino 500mg",
    "aliases": [
      "ciprofloxacino",
      "cipro"
    ],
    "price": 32,
    "category": "Antibiótico",
    "needsRecipe": true,
    "recipeType": "retida",
    "allowsDelivery": true,
    "presentation": "caixa com 14 comprimidos",
    "unitName": "caixa",
    "unitPills": 14,
    "activeIngredient": "Cloridrato de Ciprofloxacino",
    "manufacturer": "Eurofarma Genéricos",
    "isGeneric": true,
    "tags": [
      "antibiotico",
      "infecção",
      "urinaria",
      "bacteria",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Bactrim",
    "aliases": [
      "bactrim",
      "bactrim comprimido"
    ],
    "price": 21,
    "category": "Antibiótico",
    "needsRecipe": true,
    "recipeType": "retida",
    "allowsDelivery": true,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "unitPills": 20,
    "activeIngredient": "Sulfametoxazol + Trimetoprima",
    "manufacturer": "Roche S.A.",
    "isGeneric": false,
    "tags": [
      "antibiotico",
      "infecção",
      "respiratoria",
      "bacteria",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Rivotril 2mg",
    "aliases": [
      "rivotril",
      "clonazepam",
      "rivotril 2mg"
    ],
    "price": 19.9,
    "category": "Tarja Preta",
    "needsRecipe": true,
    "recipeType": "azul",
    "allowsDelivery": false,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Clonazepam",
    "manufacturer": "Roche S.A.",
    "isGeneric": false,
    "tags": [
      "dormir",
      "sono",
      "ansiedade",
      "calmante",
      "insonia",
      "tarja preta",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Ritalina 10mg",
    "aliases": [
      "ritalina",
      "ritalina 10mg",
      "metilfenidato"
    ],
    "price": 45,
    "category": "Tarja Preta",
    "needsRecipe": true,
    "recipeType": "azul",
    "allowsDelivery": false,
    "presentation": "caixa com 60 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Metilfenidato",
    "manufacturer": "Novartis Pharma",
    "isGeneric": false,
    "tags": [
      "tdah",
      "concentraçao",
      "deficit de atençao",
      "tarja preta",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Lexotan 3mg",
    "aliases": [
      "lexotan",
      "bromazepam",
      "lexotan 3mg"
    ],
    "price": 26.9,
    "category": "Tarja Preta",
    "needsRecipe": true,
    "recipeType": "azul",
    "allowsDelivery": false,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Bromazepam",
    "manufacturer": "Roche S.A.",
    "isGeneric": false,
    "tags": [
      "dormir",
      "sono",
      "ansiedade",
      "calmante",
      "insonia",
      "tarja preta",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Frontal 0.5mg",
    "aliases": [
      "frontal",
      "alprazolam",
      "frontal 0.5mg"
    ],
    "price": 38.5,
    "category": "Tarja Preta",
    "needsRecipe": true,
    "recipeType": "azul",
    "allowsDelivery": false,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Alprazolam",
    "manufacturer": "Pfizer Brasil",
    "isGeneric": false,
    "tags": [
      "dormir",
      "sono",
      "ansiedade",
      "calmante",
      "panico",
      "insonia",
      "tarja preta",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Diazepam 10mg",
    "aliases": [
      "diazepam",
      "diazepam 10mg"
    ],
    "price": 15,
    "category": "Tarja Preta",
    "needsRecipe": true,
    "recipeType": "azul",
    "allowsDelivery": false,
    "presentation": "caixa com 30 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Diazepam",
    "manufacturer": "Eurofarma Genéricos",
    "isGeneric": true,
    "tags": [
      "dormir",
      "sono",
      "ansiedade",
      "calmante",
      "insonia",
      "tarja preta",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Stilnox 10mg",
    "aliases": [
      "stilnox",
      "zolpidem",
      "stilnox 10mg"
    ],
    "price": 62,
    "category": "Tarja Preta",
    "needsRecipe": true,
    "recipeType": "azul",
    "allowsDelivery": false,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Hemitartarato de Zolpidem",
    "manufacturer": "Sanofi-Aventis",
    "isGeneric": false,
    "tags": [
      "dormir",
      "sono",
      "insonia",
      "tarja preta",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Venvanse 30mg",
    "aliases": [
      "venvanse",
      "lisdexanfetamina",
      "venvanse 30mg"
    ],
    "price": 390,
    "category": "Tarja Preta",
    "needsRecipe": true,
    "recipeType": "azul",
    "allowsDelivery": false,
    "presentation": "caixa com 28 cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Dimesilato de Lisdexanfetamina",
    "manufacturer": "Takeda Pharma",
    "isGeneric": false,
    "tags": [
      "tdah",
      "concentraçao",
      "deficit de atençao",
      "tarja preta",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sibutramina 15mg",
    "aliases": [
      "sibutramina",
      "sibutramina 15mg"
    ],
    "price": 54,
    "category": "Tarja Preta",
    "needsRecipe": true,
    "recipeType": "azul",
    "allowsDelivery": false,
    "presentation": "caixa com 30 cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Sibutramina",
    "manufacturer": "Eurofarma Genéricos",
    "isGeneric": true,
    "tags": [
      "emagrecer",
      "peso",
      "obesidade",
      "tarja preta",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gardenal 100mg",
    "aliases": [
      "gardenal",
      "fenobarbital",
      "gardenal 100mg"
    ],
    "price": 14.2,
    "category": "Tarja Preta",
    "needsRecipe": true,
    "recipeType": "azul",
    "allowsDelivery": false,
    "presentation": "caixa com 20 comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Fenobarbital",
    "manufacturer": "Sanofi-Aventis",
    "isGeneric": false,
    "tags": [
      "convulsao",
      "epilepsia",
      "tarja preta",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Roacutan 20mg",
    "aliases": [
      "roacutan",
      "isotretinoina",
      "roacutan 20mg"
    ],
    "price": 150,
    "category": "Especial",
    "needsRecipe": true,
    "recipeType": "especial",
    "allowsDelivery": false,
    "presentation": "caixa com 30 cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Isotretinoína",
    "manufacturer": "Roche S.A.",
    "isGeneric": false,
    "tags": [
      "acne",
      "espinha",
      "pele",
      "rosto",
      "remedio",
      "medicamento"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Glifage XR 500mg 30 comprimidos",
    "aliases": [
      "glifage xr 500mg 30 comprimidos",
      "glifage xr",
      "cloridrato de metformina"
    ],
    "price": 12.2,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Comprimido de liberação prolongada",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Metformina",
    "manufacturer": "Glifage Xr",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para diabetes",
      "diabetes",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Soro Fisiológico Cloreto de Sódio 0,9% Needs 500ml",
    "aliases": [
      "soro fisiológico cloreto de sódio 0,9% needs 500ml",
      "soro fisiológico cloreto de sódio",
      "needs"
    ],
    "price": 10.59,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "500ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "soros"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Losartana Potássica 50mg 30 comprimidos Medley Genérico",
    "aliases": [
      "losartana potássica 50mg 30 comprimidos medley genérico",
      "losartana potássica",
      "medley"
    ],
    "price": 19.85,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Comprimidos revestidos",
    "unitName": "caixa",
    "activeIngredient": "Losartana Potássica",
    "manufacturer": "Medley",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "para pressão alta",
      "pressao",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Dipirona Monoidratada 1g 10 comprimidos Cimed Genérico",
    "aliases": [
      "dipirona monoidratada 1g 10 comprimidos cimed genérico",
      "dipirona monoidratada",
      "dipirona sodica"
    ],
    "price": 27.08,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dipirona Sodica",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para dor e febre",
      "dor",
      "febre",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Dipirona Monoidratada 500mg 10 comprimidos EMS Genérico",
    "aliases": [
      "dipirona monoidratada 500mg 10 comprimidos ems genérico",
      "dipirona monoidratada",
      "dipirona sodica"
    ],
    "price": 9.55,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dipirona Sodica",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para dor e febre",
      "dor",
      "febre",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hemifumarato de Quetiapina 25mg 30 comprimidos EMS Genérico",
    "aliases": [
      "hemifumarato de quetiapina 25mg 30 comprimidos ems genérico",
      "hemifumarato de quetiapina",
      "ems"
    ],
    "price": 61.25,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Comprimidos revestidos",
    "unitName": "caixa",
    "activeIngredient": "Hemifumarato de Quetiapina",
    "manufacturer": "EMS",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "antidepressivos",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Mounjaro Tirzepatida 5mg Solução Injetável 0,5ml + 4 Canetas Aplicadoras",
    "aliases": [
      "mounjaro tirzepatida 5mg solução injetável 0,5ml + 4 canetas aplicadoras",
      "mounjaro tirzepatida",
      "mounjaro"
    ],
    "price": 2411.28,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "1un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Mounjaro",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para diabetes",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Tadalafila 5mg 30 comprimidos EMS Genérico",
    "aliases": [
      "tadalafila 5mg 30 comprimidos ems genérico",
      "tadalafila",
      "ems"
    ],
    "price": 120.86,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Comprimidos revestidos",
    "unitName": "caixa",
    "activeIngredient": "Tadalafila",
    "manufacturer": "EMS",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "remédios",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Neosoro Cloridrato de Nafazolina 0,5mg/ml Solução Nasal Gotas 30ml",
    "aliases": [
      "neosoro cloridrato de nafazolina 0,5mg/ml solução nasal gotas 30ml",
      "neosoro cloridrato de nafazolina",
      "neosoro",
      "cloridrato de naftazolina"
    ],
    "price": 12.27,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30ml",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Naftazolina",
    "manufacturer": "Neosoro",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para gripe e resfriado",
      "gotas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Nimesulida 100mg 12 comprimidos Eurofarma Genérico",
    "aliases": [
      "nimesulida 100mg 12 comprimidos eurofarma genérico",
      "nimesulida",
      "eurofarma"
    ],
    "price": 17.38,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "12 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Nimesulida",
    "manufacturer": "Eurofarma",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "anti-inflamatórios",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Pregabalina 75mg 30 cápsulas Medley Genérico",
    "aliases": [
      "pregabalina 75mg 30 cápsulas medley genérico",
      "pregabalina",
      "medley"
    ],
    "price": 108.76,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Pregabalina",
    "manufacturer": "Medley",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "antidepressivos",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Dipirona Monoidratada 1g 10 Comprimidos Medley Genérico",
    "aliases": [
      "dipirona monoidratada 1g 10 comprimidos medley genérico",
      "dipirona monoidratada",
      "dipirona sodica"
    ],
    "price": 21.44,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dipirona Sodica",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para dor e febre",
      "dor",
      "febre",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hidroclorotiazida 25mg 30 comprimidos Medley Genérico",
    "aliases": [
      "hidroclorotiazida 25mg 30 comprimidos medley genérico",
      "hidroclorotiazida",
      "medley"
    ],
    "price": 6.2,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Hidroclorotiazida",
    "manufacturer": "Medley",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "para pressão alta",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cloridrato de Sertralina 50mg 30 comprimidos Medley Genérico",
    "aliases": [
      "cloridrato de sertralina 50mg 30 comprimidos medley genérico",
      "cloridrato de sertralina",
      "medley"
    ],
    "price": 50.57,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Comprimidos revestidos",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Sertralina",
    "manufacturer": "Medley",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "calmantes",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fluconazol 150mg 2 cápsulas Cimed Genérico",
    "aliases": [
      "fluconazol 150mg 2 cápsulas cimed genérico",
      "fluconazol",
      "cimed"
    ],
    "price": 22.47,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "2 Cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Fluconazol",
    "manufacturer": "Cimed",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "para infecções",
      "micose",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Simeticona 125mg 10 cápsulas Medley Genérico",
    "aliases": [
      "simeticona 125mg 10 cápsulas medley genérico",
      "simeticona"
    ],
    "price": 7.26,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10 Cápsulas gelatinosas",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Simeticona",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para azia e má digestão",
      "gases",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Mounjaro Tirzepatida 2,5mg Solução Injetável 0,5ml + 4 Canetas Aplicadoras",
    "aliases": [
      "mounjaro tirzepatida 2,5mg solução injetável 0,5ml + 4 canetas aplicadoras",
      "mounjaro tirzepatida",
      "mounjaro"
    ],
    "price": 1928.84,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "1un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Mounjaro",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para diabetes",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Besilato de Anlodipino 5mg 30 comprimidos Cimed Genérico",
    "aliases": [
      "besilato de anlodipino 5mg 30 comprimidos cimed genérico",
      "besilato de anlodipino",
      "cimed"
    ],
    "price": 29.79,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Besilato de Anlodipino",
    "manufacturer": "Cimed",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "para pressão alta",
      "pressao",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Loratamed Loratadina 10mg 12 comprimidos",
    "aliases": [
      "loratamed loratadina 10mg 12 comprimidos",
      "loratamed loratadina",
      "loratamed"
    ],
    "price": 23.3,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "12 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Loratamed",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para rinite e sinusite",
      "alergia",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Glyxambi 25mg + 5mg 30 comprimidos",
    "aliases": [
      "glyxambi 25mg + 5mg 30 comprimidos",
      "glyxambi"
    ],
    "price": 506.16,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30 Comprimidos revestidos",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Glyxambi",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para diabetes",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Dorflex Analgésico e Relaxante Muscular 10 comprimidos",
    "aliases": [
      "dorflex analgésico e relaxante muscular 10 comprimidos",
      "dorflex analgésico e relaxante muscular",
      "dorflex",
      "dipirona + citrato de orfenadrina + cafeína anidra",
      "dipirona"
    ],
    "price": 8.51,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Dipirona + Citrato de Orfenadrina + Cafeína Anidra",
    "manufacturer": "Dorflex",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para dor e febre",
      "dor",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Tadalafila 20mg 8 comprimidos Legrand Genérico",
    "aliases": [
      "tadalafila 20mg 8 comprimidos legrand genérico",
      "tadalafila",
      "legrand"
    ],
    "price": 83.61,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "8 Comprimidos revestidos",
    "unitName": "caixa",
    "activeIngredient": "Tadalafila",
    "manufacturer": "Legrand",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "remédios",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cimegripe Cloridrato Fenillefrina 4mg + Paracetamol 400mg + Maleato de Clorfeniramina 4mg 20 cápsulas",
    "aliases": [
      "cimegripe cloridrato fenillefrina 4mg + paracetamol 400mg + maleato de clorfeniramina 4mg 20 cápsulas",
      "cimegripe cloridrato fenillefrina",
      "cimegripe",
      "paracetamol + maleato de clorfeniramina + fenilefrina",
      "paracetamol"
    ],
    "price": 30.56,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20 Cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Paracetamol + Maleato de Clorfeniramina + Fenilefrina",
    "manufacturer": "Cimegripe",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para gripe e resfriado",
      "dor",
      "febre",
      "gripe",
      "micose",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sal de Fruta Eno Laranja Pó Efervescente 5g 2 envelopes",
    "aliases": [
      "sal de fruta eno laranja pó efervescente 5g 2 envelopes",
      "sal de fruta eno laranja pó efervescente",
      "eno",
      "bicarbonato de sódio + carbonato de sódio + ácido cítrico",
      "bicarbonato de sódio"
    ],
    "price": 5.16,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10g",
    "unitName": "caixa",
    "activeIngredient": "Bicarbonato de Sódio + Carbonato de Sódio + Ácido Cítrico",
    "manufacturer": "Eno",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para azia e má digestão",
      "azia",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Soro Fisiológico Cloreto de Sódio 0,9% Needs 250ml",
    "aliases": [
      "soro fisiológico cloreto de sódio 0,9% needs 250ml",
      "soro fisiológico cloreto de sódio",
      "needs"
    ],
    "price": 7.19,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "soros"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Pregabalina 150mg 30 cápsulas Medley Genérico",
    "aliases": [
      "pregabalina 150mg 30 cápsulas medley genérico",
      "pregabalina",
      "medley"
    ],
    "price": 161.3,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Pregabalina",
    "manufacturer": "Medley",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "antidepressivos",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Aerolin Sulfato de Salbutamol 100mcg Spray 200 Doses",
    "aliases": [
      "aerolin sulfato de salbutamol 100mcg spray 200 doses",
      "aerolin sulfato de salbutamol",
      "aerolin",
      "sulfato de salbutamol"
    ],
    "price": 27.15,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "200doses",
    "unitName": "caixa",
    "activeIngredient": "Sulfato de Salbutamol",
    "manufacturer": "Aerolin",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para asma",
      "tosse",
      "spray"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cloridrato de Fluoxetina 20mg 30 comprimidos Legrand Genérico",
    "aliases": [
      "cloridrato de fluoxetina 20mg 30 comprimidos legrand genérico",
      "cloridrato de fluoxetina",
      "legrand"
    ],
    "price": 61.52,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Fluoxetina",
    "manufacturer": "Legrand",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "calmantes",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cloridrato de Venlafaxina 150mg 30 cápsulas EMS Genérico",
    "aliases": [
      "cloridrato de venlafaxina 150mg 30 cápsulas ems genérico",
      "cloridrato de venlafaxina",
      "ems"
    ],
    "price": 210.47,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Cápsulas de liberação prolongada",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Venlafaxina",
    "manufacturer": "EMS",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "antidepressivos",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Ibuprofeno 600mg 20 comprimidos Farmaco Prati Genérico",
    "aliases": [
      "ibuprofeno 600mg 20 comprimidos farmaco prati genérico",
      "ibuprofeno",
      "prati donaduzzi",
      "bicarbonato de sódio + carbonato de sódio + ácido cítrico",
      "bicarbonato de sódio"
    ],
    "price": 22.67,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20 Comprimidos revestidos",
    "unitName": "caixa",
    "activeIngredient": "Bicarbonato de Sódio + Carbonato de Sódio + Ácido Cítrico",
    "manufacturer": "Prati Donaduzzi",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "anti-inflamatórios",
      "dor",
      "azia",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Maxalgina Dipirona Sódica 500mg/ml Solução Gotas 20ml",
    "aliases": [
      "maxalgina dipirona sódica 500mg/ml solução gotas 20ml",
      "maxalgina dipirona sódica",
      "maxalgina"
    ],
    "price": 4.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Maxalgina",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para dor e febre",
      "dor",
      "febre",
      "gotas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Pantoprazol Sódico Sesqui-Hidratado 40mg Medley 28 comprimidos - Genérico",
    "aliases": [
      "pantoprazol sódico sesqui-hidratado 40mg medley 28 comprimidos - genérico",
      "pantoprazol sódico sesqui-hidratado",
      "medley",
      "pantoprazol"
    ],
    "price": 47.49,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "28 Comprimidos revestidos",
    "unitName": "caixa",
    "activeIngredient": "Pantoprazol",
    "manufacturer": "Medley",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "para gastrite",
      "azia",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cetoprofeno 150mg 10 comprimidos Eurofarma Genérico",
    "aliases": [
      "cetoprofeno 150mg 10 comprimidos eurofarma genérico",
      "cetoprofeno",
      "eurofarma",
      "bicarbonato de sódio + carbonato de sódio + ácido cítrico",
      "bicarbonato de sódio"
    ],
    "price": 42.64,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "10 Comprimido de liberação prolongada",
    "unitName": "caixa",
    "activeIngredient": "Bicarbonato de Sódio + Carbonato de Sódio + Ácido Cítrico",
    "manufacturer": "Eurofarma",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "anti-inflamatórios",
      "azia",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Maxalgina Dipirona Monoidratada 1g 10 comprimidos",
    "aliases": [
      "maxalgina dipirona monoidratada 1g 10 comprimidos",
      "maxalgina dipirona monoidratada",
      "maxalgina"
    ],
    "price": 12.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Maxalgina",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para dor e febre",
      "dor",
      "febre",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Lamotrigina 100mg 30 comprimidos Teuto Genérico",
    "aliases": [
      "lamotrigina 100mg 30 comprimidos teuto genérico",
      "lamotrigina",
      "teuto"
    ],
    "price": 88.86,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "30 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Lamotrigina",
    "manufacturer": "Teuto",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "antidepressivos",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Durateston Propionato de Testosterona + Associações 250mg/ml 1 ampola de 1ml",
    "aliases": [
      "durateston propionato de testosterona + associações 250mg/ml 1 ampola de 1ml",
      "durateston propionato de testosterona + associações",
      "durateston"
    ],
    "price": 61.35,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "1ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Durateston",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "remédios"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cloridrato de Ondansetrona 8mg 10 comprimidos Althaia Genérico",
    "aliases": [
      "cloridrato de ondansetrona 8mg 10 comprimidos althaia genérico",
      "cloridrato de ondansetrona",
      "althaia"
    ],
    "price": 42.83,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10 Comprimidos orodispersíveis",
    "unitName": "caixa",
    "activeIngredient": "Cloridrato de Ondansetrona",
    "manufacturer": "Althaia",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "para gastrite",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Solomed Seringa Descartável 3ml com Agulha 25mm x 7mm",
    "aliases": [
      "solomed seringa descartável 3ml com agulha 25mm x 7mm",
      "solomed seringa descartável",
      "solomed"
    ],
    "price": 2.59,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "1un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Solomed",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "seringas descartáveis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cefalexina 500mg 10 cápsulas União Química Genérico",
    "aliases": [
      "cefalexina 500mg 10 cápsulas união química genérico",
      "cefalexina",
      "união química",
      "cefalexina monoidratada"
    ],
    "price": 40.3,
    "category": "Antibiótico",
    "needsRecipe": true,
    "recipeType": "retida",
    "allowsDelivery": true,
    "presentation": "10 Cápsulas",
    "unitName": "caixa",
    "activeIngredient": "Cefalexina monoidratada",
    "manufacturer": "União Química",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "para infecções",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "MecoBe Mecobalamina 1.000mcg 30 comprimidos sublinguais",
    "aliases": [
      "mecobe mecobalamina 1.000mcg 30 comprimidos sublinguais",
      "mecobe mecobalamina",
      "mecobe"
    ],
    "price": 32.02,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30 Comprimido sublingual",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Mecobe",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para azia e má digestão",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Expec Tripla Ação Oxomemazina 0,4mg/ml + Iodeto de Potássio 20mg/ml + Benzoato de Sódio 4mg/ml + Guaifenesina 6mg/ml Sabor Framboesa e Caramelo Xarope 120ml",
    "aliases": [
      "expec tripla ação oxomemazina 0,4mg/ml + iodeto de potássio 20mg/ml + benzoato de sódio 4mg/ml + guaifenesina 6mg/ml sabor framboesa e caramelo xarope 120ml",
      "expec tripla ação oxomemazina",
      "expec"
    ],
    "price": 53.82,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "120ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Expec",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para gripe e resfriado",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Teste de Gravidez Needs em Tira 1 unidade",
    "aliases": [
      "teste de gravidez needs em tira 1 unidade",
      "teste de gravidez needs em tira",
      "needs"
    ],
    "price": 9.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "1un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "testes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Prednisona 20mg 10 comprimidos Neo Química Genérico",
    "aliases": [
      "prednisona 20mg 10 comprimidos neo química genérico",
      "prednisona",
      "neo química"
    ],
    "price": 27.07,
    "category": "Tarja Vermelha",
    "needsRecipe": true,
    "recipeType": "simples",
    "allowsDelivery": true,
    "presentation": "10 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": "Prednisona",
    "manufacturer": "Neo Química",
    "isGeneric": true,
    "tags": [
      "remedio",
      "medicamento",
      "remédios",
      "generico",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Pastilhas para Garganta Strepsils Sabor Mel e Limão 8 unidades",
    "aliases": [
      "pastilhas para garganta strepsils sabor mel e limão 8 unidades",
      "pastilhas para garganta strepsils sabor mel e limão",
      "strepsils",
      "flurbiprofeno"
    ],
    "price": 18.66,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "8un",
    "unitName": "caixa",
    "activeIngredient": "Flurbiprofeno",
    "manufacturer": "Strepsils",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para dor de garganta",
      "tosse"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Tylenol Sinus Paracetamol 500mg + Cloridrato de Pseudoefedrina 30mg 24 comprimidos",
    "aliases": [
      "tylenol sinus paracetamol 500mg + cloridrato de pseudoefedrina 30mg 24 comprimidos",
      "tylenol sinus paracetamol",
      "tylenol",
      "paracetamol"
    ],
    "price": 24.79,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "24 Comprimidos revestidos",
    "unitName": "caixa",
    "activeIngredient": "Paracetamol",
    "manufacturer": "Tylenol",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "para gripe e resfriado",
      "dor",
      "febre",
      "azia",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Suplemento Vitamínico Adeforte Turbo + Biotina 3ml",
    "aliases": [
      "suplemento vitamínico adeforte turbo + biotina 3ml",
      "suplemento vitamínico adeforte turbo + biotina",
      "adeforte"
    ],
    "price": 36.93,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "3ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Adeforte",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "vitamina e"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Zerolac 10.000 FCC Enzima Lactase 30 Cápsulas",
    "aliases": [
      "zerolac 10.000 fcc enzima lactase 30 cápsulas",
      "zerolac"
    ],
    "price": 41,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Zerolac",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Polivitamínico Adeforte 8.000UI 1 ampola de 3ml",
    "aliases": [
      "polivitamínico adeforte 8.000ui 1 ampola de 3ml",
      "polivitamínico adeforte",
      "adeforte"
    ],
    "price": 25.76,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "3ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Adeforte",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "vitamina e"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C + Zinco bwell 30 Comprimidos Efervescentes",
    "aliases": [
      "vitamina c + zinco bwell 30 comprimidos efervescentes",
      "vitamina c + zinco bwell",
      "bwell"
    ],
    "price": 26.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30 Comprimidos efervescentes",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "bwell",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "óleos",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C 1g bwell 30 Comprimidos Efervescentes",
    "aliases": [
      "vitamina c 1g bwell 30 comprimidos efervescentes",
      "vitamina c",
      "bwell"
    ],
    "price": 23.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30 Comprimidos efervescentes",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "bwell",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "vitamina c",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Peg-Lax 8,5g em Pó Sem Sabor com 14 envelopes",
    "aliases": [
      "peg-lax 8,5g em pó sem sabor com 14 envelopes",
      "peg-lax",
      "peg lax"
    ],
    "price": 42.69,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "14sache",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Peg Lax",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C 1g bwell 10 Comprimidos Efervescentes",
    "aliases": [
      "vitamina c 1g bwell 10 comprimidos efervescentes",
      "vitamina c",
      "bwell"
    ],
    "price": 7.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10 Comprimidos efervescentes",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "bwell",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "vitamina c",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "YoPRO Bebida Láctea UHT Chocolate 15g de Proteínas 250ml",
    "aliases": [
      "yopro bebida láctea uht chocolate 15g de proteínas 250ml",
      "yopro bebida láctea uht chocolate",
      "yopro"
    ],
    "price": 9.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "YoPRO",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "suplementos e alimentos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Água Mineral Lindoya Verão Sem Gás 1,5L",
    "aliases": [
      "água mineral lindoya verão sem gás 1,5l",
      "água mineral lindoya verão sem gás",
      "lindoya verão"
    ],
    "price": 9.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "1500ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Lindoya Verão",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "bebidas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Probiótico Enterogermina 10 frascos de 5ml",
    "aliases": [
      "probiótico enterogermina 10 frascos de 5ml",
      "probiótico enterogermina",
      "enterogermina"
    ],
    "price": 51.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Enterogermina",
    "isGeneric": false,
    "tags": [
      "vitaminas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Probiótico Enterogermina Plus 5ml 10 frascos",
    "aliases": [
      "probiótico enterogermina plus 5ml 10 frascos",
      "probiótico enterogermina plus",
      "enterogermina"
    ],
    "price": 83.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "5un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Enterogermina",
    "isGeneric": false,
    "tags": [
      "vitaminas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Di-Magnésio Malato 500mg bwell 60 Cápsulas",
    "aliases": [
      "di-magnésio malato 500mg bwell 60 cápsulas",
      "di-magnésio malato",
      "bwell"
    ],
    "price": 34.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60 Cápsulas",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "bwell",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "minerais",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Barra de Proteína Integralmedica Protein Crisp Ovomaltine Whey Protein 45g",
    "aliases": [
      "barra de proteína integralmedica protein crisp ovomaltine whey protein 45g",
      "barra de proteína integralmedica protein crisp ovomaltine whey protein",
      "protein"
    ],
    "price": 12.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "45g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Protein",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "proteínas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C Targifor Cewin 500mg 30 comprimidos",
    "aliases": [
      "vitamina c targifor cewin 500mg 30 comprimidos",
      "vitamina c targifor cewin",
      "targifor"
    ],
    "price": 41.19,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Targifor",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "óleos",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Bebida Proteica Piracanjuba ProForce Cacau 23g Proteínas Zero Lactose 250ml",
    "aliases": [
      "bebida proteica piracanjuba proforce cacau 23g proteínas zero lactose 250ml",
      "bebida proteica piracanjuba proforce cacau",
      "piracanjuba"
    ],
    "price": 10.79,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Piracanjuba",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "bebidas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "YoPRO Bebida Láctea UHT Chocolate 23g de Proteínas 250ml",
    "aliases": [
      "yopro bebida láctea uht chocolate 23g de proteínas 250ml",
      "yopro bebida láctea uht chocolate",
      "yopro"
    ],
    "price": 10.79,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "YoPRO",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "bebidas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Melatonina 0,21mg bwell 60 Comprimidos",
    "aliases": [
      "melatonina 0,21mg bwell 60 comprimidos",
      "melatonina",
      "bwell"
    ],
    "price": 21.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60 Comprimidos",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "bwell",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Suplemento Vitamínico Triade Ampola 3mL",
    "aliases": [
      "suplemento vitamínico triade ampola 3ml",
      "suplemento vitamínico triade ampola",
      "triade"
    ],
    "price": 17.6,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "3ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Triade",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "vitamina e"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Melatonina Neo Química 90 Comprimidos",
    "aliases": [
      "melatonina neo química 90 comprimidos",
      "melatonina neo química",
      "neo química"
    ],
    "price": 32.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "90s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Neo Química",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Regulador Intestinal Colact Sabor Ameixa Xarope com 120ml",
    "aliases": [
      "regulador intestinal colact sabor ameixa xarope com 120ml",
      "regulador intestinal colact sabor ameixa xarope com",
      "colact"
    ],
    "price": 22.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "120ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Colact",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "dor",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C Efervescente em Pó Centrum Imunidade Vitaminas C, D e Zinco Laranja 5g",
    "aliases": [
      "vitamina c efervescente em pó centrum imunidade vitaminas c, d e zinco laranja 5g",
      "vitamina c efervescente em pó centrum imunidade vitaminas c, d e zinco laranja",
      "centrum"
    ],
    "price": 3.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "5g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Centrum",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "multivitamínicos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina B12 Bwell Frutas Vermelhas 60 Comprimidos Mastigáveis",
    "aliases": [
      "vitamina b12 bwell frutas vermelhas 60 comprimidos mastigáveis",
      "vitamina b12 bwell frutas vermelhas",
      "bwell"
    ],
    "price": 35.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60 Comprimido mastigável",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "bwell",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "vitamina b",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Água Mineral Lindoya Verão Com Gás com 510ml",
    "aliases": [
      "água mineral lindoya verão com gás com 510ml",
      "água mineral lindoya verão com gás com",
      "lindoya verão"
    ],
    "price": 6.25,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "510ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Lindoya Verão",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "bebidas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Pantogar Neo 90 cápsulas",
    "aliases": [
      "pantogar neo 90 cápsulas",
      "pantogar neo",
      "pantogar"
    ],
    "price": 213.01,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "90 Cápsulas",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Pantogar",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "colágeno",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C bwell Tripla Ação 30 Comprimidos Efervescentes",
    "aliases": [
      "vitamina c bwell tripla ação 30 comprimidos efervescentes",
      "vitamina c bwell tripla ação",
      "bwell"
    ],
    "price": 36.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30 Comprimidos efervescentes",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "bwell",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "óleos",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C + Arginina Efervescente Targifor+C 16 comprimidos",
    "aliases": [
      "vitamina c + arginina efervescente targifor+c 16 comprimidos",
      "vitamina c + arginina efervescente targifor+c",
      "targifor"
    ],
    "price": 49.02,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "16s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Targifor",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "óleos",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Suplemento Alimentar de Ômega 3 Vitaminas Neo Quimica com 60 Cápsulas",
    "aliases": [
      "suplemento alimentar de ômega 3 vitaminas neo quimica com 60 cápsulas",
      "suplemento alimentar de ômega",
      "neo química"
    ],
    "price": 32.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Neo Química",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "homeopatia",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Probiótico Enterogermina Criança e Adulto 5 Frascos 5ml",
    "aliases": [
      "probiótico enterogermina criança e adulto 5 frascos 5ml",
      "probiótico enterogermina criança e adulto",
      "enterogermina"
    ],
    "price": 36.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "25ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Enterogermina",
    "isGeneric": false,
    "tags": [
      "vitaminas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Polivitamínico PuraVit ADZ Gotas 10ml",
    "aliases": [
      "polivitamínico puravit adz gotas 10ml",
      "polivitamínico puravit adz gotas",
      "puravit"
    ],
    "price": 71.81,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Puravit",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "multivitamínicos",
      "gotas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "YoPRO Bebida Láctea UHT Morango 15g de Proteínas 250ml",
    "aliases": [
      "yopro bebida láctea uht morango 15g de proteínas 250ml",
      "yopro bebida láctea uht morango",
      "yopro"
    ],
    "price": 9.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "YoPRO",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "fitness"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Probiótico Enterogermina Plus 5ml 5 frascos",
    "aliases": [
      "probiótico enterogermina plus 5ml 5 frascos",
      "probiótico enterogermina plus",
      "enterogermina"
    ],
    "price": 53.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "5un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Enterogermina",
    "isGeneric": false,
    "tags": [
      "vitaminas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Energético Red Bull Energy Drink 250ml",
    "aliases": [
      "energético red bull energy drink 250ml",
      "energético red bull energy drink",
      "red bull"
    ],
    "price": 11.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Red Bull",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "energéticos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Isotônico Sorox Frutas Vermelhas 550ml",
    "aliases": [
      "isotônico sorox frutas vermelhas 550ml",
      "isotônico sorox frutas vermelhas",
      "sorox"
    ],
    "price": 12.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "550ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Sorox",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "bebidas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Isotônico Sorox Tangerina 550ml",
    "aliases": [
      "isotônico sorox tangerina 550ml",
      "isotônico sorox tangerina",
      "sorox"
    ],
    "price": 12.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "550ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Sorox",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "bebidas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Ferro Ferronil Teuto 40mg 50 comprimidos",
    "aliases": [
      "ferro ferronil teuto 40mg 50 comprimidos",
      "ferro ferronil teuto",
      "ferronil"
    ],
    "price": 17.59,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Ferronil",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "minerais",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Isotônico Sorox Uva 550ml",
    "aliases": [
      "isotônico sorox uva 550ml",
      "isotônico sorox uva",
      "sorox"
    ],
    "price": 12.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "550ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Sorox",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "bebidas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Polivitamínico Ogestan Gold para Gestantes e Lactantes 30 cápsulas",
    "aliases": [
      "polivitamínico ogestan gold para gestantes e lactantes 30 cápsulas",
      "polivitamínico ogestan gold para gestantes e lactantes",
      "ogestan"
    ],
    "price": 144.1,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Ogestan",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "minerais",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C Cenevit 1g Laranja 10 comprimidos",
    "aliases": [
      "vitamina c cenevit 1g laranja 10 comprimidos",
      "vitamina c cenevit",
      "cenevit"
    ],
    "price": 9.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cenevit",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "óleos",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Suplemento Alimentar Melatonina Dr. Good Fini 0,21mg Morango 60 Gomas",
    "aliases": [
      "suplemento alimentar melatonina dr. good fini 0,21mg morango 60 gomas",
      "suplemento alimentar melatonina dr. good fini",
      "dr. good"
    ],
    "price": 62.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dr. Good",
    "isGeneric": false,
    "tags": [
      "vitaminas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Novvo Pré Drink 3 cápsulas",
    "aliases": [
      "novvo pré drink 3 cápsulas",
      "novvo pré drink",
      "novvo"
    ],
    "price": 17.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "3s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Novvo",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "termogênicos",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Laxante Peg-Lax 17g Limão Pó para Solução Oral com 14 envelopes",
    "aliases": [
      "laxante peg-lax 17g limão pó para solução oral com 14 envelopes",
      "laxante peg-lax",
      "peg lax"
    ],
    "price": 73.97,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "14sache",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Peg Lax",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Lactase 10.000 FCC bwell 4 Comprimidos Mastigáveis",
    "aliases": [
      "lactase 10.000 fcc bwell 4 comprimidos mastigáveis",
      "lactase",
      "bwell"
    ],
    "price": 8.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "4 Comprimido mastigável",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "bwell",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C Efervescente em Pó Centrum Energia Vitamina B12 e B6 + Magnésio Guaraná 5g",
    "aliases": [
      "vitamina c efervescente em pó centrum energia vitamina b12 e b6 + magnésio guaraná 5g",
      "vitamina c efervescente em pó centrum energia vitamina b12 e b6 + magnésio guaraná",
      "centrum"
    ],
    "price": 3.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "5g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Centrum",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "multivitamínicos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Melatonina 0,21mg bwell Gotas 30ml",
    "aliases": [
      "melatonina 0,21mg bwell gotas 30ml",
      "melatonina",
      "bwell"
    ],
    "price": 33.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "bwell",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "gotas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Vitamina C Efervescente + Zinco Cenevit Laranja 10 comprimidos",
    "aliases": [
      "vitamina c efervescente + zinco cenevit laranja 10 comprimidos",
      "vitamina c efervescente + zinco cenevit laranja",
      "cenevit"
    ],
    "price": 11.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10 Comprimidos efervescentes",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cenevit",
    "isGeneric": false,
    "tags": [
      "vitaminas",
      "vitamina c",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Pomada para Assaduras Nistatina 100000UI/g + Óxido de Zinco 200mg/g Neo Química Genérico 60g",
    "aliases": [
      "pomada para assaduras nistatina 100000ui/g + óxido de zinco 200mg/g neo química genérico 60g",
      "pomada para assaduras nistatina",
      "nistatina + oxido de zinco"
    ],
    "price": 31.08,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nistatina + Oxido De Zinco",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "assaduras",
      "assadura",
      "micose",
      "generico",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Colírio Hyabak 0,15% 10ml",
    "aliases": [
      "colírio hyabak 0,15% 10ml",
      "colírio hyabak",
      "hyabak"
    ],
    "price": 80.79,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Hyabak",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "bem estar"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cetoconazol 20mg/ml Shampoo Anticaspa 100ml Cimed Genérico",
    "aliases": [
      "cetoconazol 20mg/ml shampoo anticaspa 100ml cimed genérico",
      "cetoconazol"
    ],
    "price": 33.74,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cetoconazol",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "micoses de pele e unha",
      "micose",
      "generico"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Azelan 150mg/g Gel 30g",
    "aliases": [
      "azelan 150mg/g gel 30g",
      "azelan"
    ],
    "price": 94.78,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Azelan",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "antiacne",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Camisinha Prudence Lubrificada com 8 unidades",
    "aliases": [
      "camisinha prudence lubrificada com 8 unidades",
      "camisinha prudence lubrificada com",
      "prudence"
    ],
    "price": 13.13,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "8un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Prudence",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "preservativos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Curativo Hidrocoloide para Acne Needs Controle de Oleosidade 24 Unidades",
    "aliases": [
      "curativo hidrocoloide para acne needs controle de oleosidade 24 unidades",
      "curativo hidrocoloide para acne needs controle de oleosidade",
      "needs"
    ],
    "price": 26.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "24un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "acne"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Intimus Noturno Toda Protegida Cobertura Suave Com Abas 30 unidades",
    "aliases": [
      "absorvente intimus noturno toda protegida cobertura suave com abas 30 unidades",
      "absorvente intimus noturno toda protegida cobertura suave com abas",
      "intimus"
    ],
    "price": 31.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Intimus",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Needs DryCare Incontinência Urinária Intensa 20 Unidades",
    "aliases": [
      "absorvente needs drycare incontinência urinária intensa 20 unidades",
      "absorvente needs drycare incontinência urinária intensa",
      "needs"
    ],
    "price": 27.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorvente adulto"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Líquido Íntimo Nivea Suave 250ml",
    "aliases": [
      "sabonete líquido íntimo nivea suave 250ml",
      "sabonete líquido íntimo nivea suave",
      "nivea"
    ],
    "price": 25.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nivea",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "hígiene intima"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Líquido Íntimo Feminino Kronel Original 250ml",
    "aliases": [
      "sabonete líquido íntimo feminino kronel original 250ml",
      "sabonete líquido íntimo feminino kronel original",
      "kronel"
    ],
    "price": 40.65,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Kronel",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "hígiene intima"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Intimus Toda Protegida Cobertura Suave Com Abas com 32 unidades",
    "aliases": [
      "absorvente intimus toda protegida cobertura suave com abas com 32 unidades",
      "absorvente intimus toda protegida cobertura suave com abas com",
      "intimus"
    ],
    "price": 21.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "32un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Intimus",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorvente adulto"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente para Incontinência Urinária DryMan Masculino Absorção Leve a Moderada 10 unidades",
    "aliases": [
      "absorvente para incontinência urinária dryman masculino absorção leve a moderada 10 unidades",
      "absorvente para incontinência urinária dryman masculino absorção leve a moderada",
      "dry man"
    ],
    "price": 25,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dry Man",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorvente adulto"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Sempre Livre Adapt Cobertura Suave Com Abas com 32 unidades",
    "aliases": [
      "absorvente sempre livre adapt cobertura suave com abas com 32 unidades",
      "absorvente sempre livre adapt cobertura suave com abas com",
      "sempre livre"
    ],
    "price": 20.89,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "32un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Sempre Livre",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorvente adulto"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Creme para Assaduras Bepantol Baby 30g",
    "aliases": [
      "creme para assaduras bepantol baby 30g",
      "creme para assaduras bepantol baby",
      "bepantol baby"
    ],
    "price": 26.91,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bepantol Baby",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "assaduras",
      "assadura",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sensor de Monitoramento de Glicose FreeStyle Libre 2 Plus Sistema Flash",
    "aliases": [
      "sensor de monitoramento de glicose freestyle libre 2 plus sistema flash",
      "sensor de monitoramento de glicose freestyle libre",
      "freestyle libre"
    ],
    "price": 329.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "1un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Freestyle Libre",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "diabetes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Roupa Íntima Descartável Tena Pants Noturna G/EG 32 unidades",
    "aliases": [
      "roupa íntima descartável tena pants noturna g/eg 32 unidades",
      "roupa íntima descartável tena pants noturna g/eg",
      "tena"
    ],
    "price": 145.3,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "32un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Tena",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "fralda adulta"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Intimus Toda Protegida Cobertura Suave Com Abas com 16 unidades",
    "aliases": [
      "absorvente intimus toda protegida cobertura suave com abas com 16 unidades",
      "absorvente intimus toda protegida cobertura suave com abas com",
      "intimus"
    ],
    "price": 10.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "16un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Intimus",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Interno OB Sempre Livre  ProComfort Super 16 unidades",
    "aliases": [
      "absorvente interno ob sempre livre  procomfort super 16 unidades",
      "absorvente interno ob sempre livre  procomfort super",
      "ob"
    ],
    "price": 24.79,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "16un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Ob",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Creme Hidratante Principia Skincare CH-01 5% Manteiga de Karité + 5% Glicerina + 2% Niacinamida 50g",
    "aliases": [
      "creme hidratante principia skincare ch-01 5% manteiga de karité + 5% glicerina + 2% niacinamida 50g",
      "creme hidratante principia skincare ch-01",
      "principia"
    ],
    "price": 39,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Principia",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "acne",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Acnezil Gel Antiacne com 20g",
    "aliases": [
      "acnezil gel antiacne com 20g",
      "acnezil gel antiacne com",
      "acnezil"
    ],
    "price": 12.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Acnezil",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "acne",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Diário Intimus Tecnologia Antibacteriana 80 Unidades",
    "aliases": [
      "protetor diário intimus tecnologia antibacteriana 80 unidades",
      "protetor diário intimus tecnologia antibacteriana",
      "intimus"
    ],
    "price": 21.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "80un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Intimus",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel Lubrificante Íntimo K-MED 2 em 1 203g",
    "aliases": [
      "gel lubrificante íntimo k-med 2 em 1 203g",
      "gel lubrificante íntimo k-med",
      "k-med"
    ],
    "price": 39.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "203g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "K-Med",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "lubrificantes",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Camisinha Prudence Ultra Sensível com 8 unidades",
    "aliases": [
      "camisinha prudence ultra sensível com 8 unidades",
      "camisinha prudence ultra sensível com",
      "prudence"
    ],
    "price": 19.69,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "8un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Prudence",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "preservativos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Colírio Lacrifilm Solução Oftálmica 15ml",
    "aliases": [
      "colírio lacrifilm solução oftálmica 15ml",
      "colírio lacrifilm solução oftálmica",
      "lacrifilm"
    ],
    "price": 48.7,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "15ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Lacrifilm",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "bem estar"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Sempre Livre Adapt Cobertura Suave Com Abas com 16 unidades",
    "aliases": [
      "absorvente sempre livre adapt cobertura suave com abas com 16 unidades",
      "absorvente sempre livre adapt cobertura suave com abas com",
      "sempre livre"
    ],
    "price": 12.09,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "16un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Sempre Livre",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hiluropt Hialuronato de Sódio 0,15% Solução Oftálmica 10ml",
    "aliases": [
      "hiluropt hialuronato de sódio 0,15% solução oftálmica 10ml",
      "hiluropt hialuronato de sódio",
      "hiluropt"
    ],
    "price": 52.41,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Hiluropt",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "bem estar"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Lenço de Papel Kleenex com 100 Unidades",
    "aliases": [
      "lenço de papel kleenex com 100 unidades",
      "lenço de papel kleenex com",
      "kleenex"
    ],
    "price": 16.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Kleenex",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "lenços de papel",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Diário Carefree Tododia Sem Perfume 80 unidades",
    "aliases": [
      "protetor diário carefree tododia sem perfume 80 unidades",
      "protetor diário carefree tododia sem perfume",
      "carefree"
    ],
    "price": 32.39,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "80un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Carefree",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Creme Hidratante Facial Creamy Skincare Calming Cream 40g",
    "aliases": [
      "creme hidratante facial creamy skincare calming cream 40g",
      "creme hidratante facial creamy skincare calming cream",
      "creamy"
    ],
    "price": 59.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "40g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Creamy",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "acne",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Thealoz Duo Trealose 3g + Hialuronato de Sódio 0,15g Frasco 10ml",
    "aliases": [
      "thealoz duo trealose 3g + hialuronato de sódio 0,15g frasco 10ml",
      "thealoz duo trealose",
      "thealoz duo"
    ],
    "price": 90.8,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Thealoz Duo",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "bem estar"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Always Noite Ultra Suave com Abas 16 unidades",
    "aliases": [
      "absorvente always noite ultra suave com abas 16 unidades",
      "absorvente always noite ultra suave com abas",
      "always"
    ],
    "price": 22.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "16un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Always",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Diário Intimus Tecnologia Antibacteriana 15 Unidades",
    "aliases": [
      "protetor diário intimus tecnologia antibacteriana 15 unidades",
      "protetor diário intimus tecnologia antibacteriana",
      "intimus"
    ],
    "price": 5.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "15un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Intimus",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Creme para Assaduras Hipoglós Original Trata e Previne 40g",
    "aliases": [
      "creme para assaduras hipoglós original trata e previne 40g",
      "creme para assaduras hipoglós original trata e previne",
      "hipoglós"
    ],
    "price": 32.79,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "40g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Hipoglós",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "assadura",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Colírio Optive Solução Oftálmica 10ml",
    "aliases": [
      "colírio optive solução oftálmica 10ml",
      "colírio optive solução oftálmica",
      "optive"
    ],
    "price": 63.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Optive",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "bem estar"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Camisinha Skyn Original Sensação Natural 8 unidades",
    "aliases": [
      "camisinha skyn original sensação natural 8 unidades",
      "camisinha skyn original sensação natural",
      "blowtex skyn"
    ],
    "price": 33.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "8un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Blowtex Skyn",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "preservativos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Renu Fresh para Lentes Solução 355ml + Solução com 120ml + Estojo para Lentes",
    "aliases": [
      "kit renu fresh para lentes solução 355ml + solução com 120ml + estojo para lentes",
      "kit renu fresh para lentes solução",
      "renu plus"
    ],
    "price": 71.5,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "475un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Renu Plus",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "bem estar"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Sempre Livre Conforto Noturno Cobertura Suave Com Abas 32 unidades",
    "aliases": [
      "absorvente sempre livre conforto noturno cobertura suave com abas 32 unidades",
      "absorvente sempre livre conforto noturno cobertura suave com abas",
      "sempre livre"
    ],
    "price": 38.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "32un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Sempre Livre",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Camisinha Olla Lubrificado com 8 unidades",
    "aliases": [
      "camisinha olla lubrificado com 8 unidades",
      "camisinha olla lubrificado com",
      "olla"
    ],
    "price": 16.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "8un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Olla",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "preservativos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Cetoconazol 20mg/g Creme Dermatológico 30g Cimed Genérico",
    "aliases": [
      "cetoconazol 20mg/g creme dermatológico 30g cimed genérico",
      "cetoconazol"
    ],
    "price": 23.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cetoconazol",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "micoses de pele e unha",
      "micose",
      "generico",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Interno Needs Super Fluxo Forte 16 Unidades",
    "aliases": [
      "absorvente interno needs super fluxo forte 16 unidades",
      "absorvente interno needs super fluxo forte",
      "needs"
    ],
    "price": 14.15,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "16un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorvente adulto",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Lenços de Papel de Bolso Kleenex Dia a Dia Folha Tripla com 4 pacotes de 10 folhas cada",
    "aliases": [
      "kit lenços de papel de bolso kleenex dia a dia folha tripla com 4 pacotes de 10 folhas cada",
      "kit lenços de papel de bolso kleenex dia a dia folha tripla com",
      "kleenex"
    ],
    "price": 11.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "4un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Kleenex",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "lenços e pomadas",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Absorvente Interno Intimus Discreto Super 16 unidades",
    "aliases": [
      "absorvente interno intimus discreto super 16 unidades",
      "absorvente interno intimus discreto super",
      "intimus"
    ],
    "price": 21.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "16un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Intimus",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "absorventes",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel Lubrificante Íntimo K-Med com 50g",
    "aliases": [
      "gel lubrificante íntimo k-med com 50g",
      "gel lubrificante íntimo k-med com",
      "k-med"
    ],
    "price": 19.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "K-Med",
    "isGeneric": false,
    "tags": [
      "remedio",
      "medicamento",
      "lubrificantes",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo Extraordinário Tratamento Reconstrutor L'Oréal Paris Elseve Finalizador Capilar Formulado com 6 Óleos Preciosos 100ml",
    "aliases": [
      "óleo extraordinário tratamento reconstrutor l'oréal paris elseve finalizador capilar formulado com 6 óleos preciosos 100ml",
      "óleo extraordinário tratamento reconstrutor l'oréal paris elseve finalizador capilar formulado com",
      "elseve"
    ],
    "price": 53.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Elseve",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento capilar",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Suplemento Vitamínico Exímia Fortalize Kera D - 30 Comprimidos",
    "aliases": [
      "suplemento vitamínico exímia fortalize kera d - 30 comprimidos",
      "suplemento vitamínico exímia fortalize kera d -",
      "eximia"
    ],
    "price": 173.68,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Eximia",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "pele, cabelos e unhas",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Polivitamínico Lavitan Cabelos e Unhas 60 cápsulas",
    "aliases": [
      "polivitamínico lavitan cabelos e unhas 60 cápsulas",
      "polivitamínico lavitan cabelos e unhas",
      "lavitan"
    ],
    "price": 45.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Lavitan",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "fortalecedor de cabelos e unhas",
      "micose",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sérum Leave-In Elseve Liso dos Sonhos Sérum Alisante Efeito Liquid Hair 100ml",
    "aliases": [
      "sérum leave-in elseve liso dos sonhos sérum alisante efeito liquid hair 100ml",
      "sérum leave-in elseve liso dos sonhos sérum alisante efeito liquid hair",
      "elseve"
    ],
    "price": 55.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Elseve",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento capilar"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Principia GL-01 13% Tensoativos + 2% Ácido Salicílico + 5% Glicerina 350g",
    "aliases": [
      "gel de limpeza principia gl-01 13% tensoativos + 2% ácido salicílico + 5% glicerina 350g",
      "gel de limpeza principia gl-01",
      "principia"
    ],
    "price": 54,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "350g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Principia",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Suave Principia Skincare GL-02 - 350g",
    "aliases": [
      "gel de limpeza suave principia skincare gl-02 - 350g",
      "gel de limpeza suave principia skincare gl-02 -",
      "principia"
    ],
    "price": 49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "350g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Principia",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Facial Darrow Actine Aquafluid Antioleosidade FPS 60 Sem Cor 120g",
    "aliases": [
      "protetor solar facial darrow actine aquafluid antioleosidade fps 60 sem cor 120g",
      "protetor solar facial darrow actine aquafluid antioleosidade fps",
      "darrow"
    ],
    "price": 59.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "120g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Darrow",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "protetor solar"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Reparador Labial Eucerin Lip Aquaphor 10ml",
    "aliases": [
      "reparador labial eucerin lip aquaphor 10ml",
      "reparador labial eucerin lip aquaphor",
      "eucerin"
    ],
    "price": 69.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "10ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Eucerin",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "lábios",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Líquido Dermatológico Darrow Suavié Pele Sensível 400ml",
    "aliases": [
      "sabonete líquido dermatológico darrow suavié pele sensível 400ml",
      "sabonete líquido dermatológico darrow suavié pele sensível",
      "darrow"
    ],
    "price": 109.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Darrow",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "assadura",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Leave-in Injeção de Massa Elseve Collagen Lifter Injeção de Massa Capilar com +61% de Volume 100ml",
    "aliases": [
      "leave-in injeção de massa elseve collagen lifter injeção de massa capilar com +61% de volume 100ml",
      "leave-in injeção de massa elseve collagen lifter injeção de massa capilar com +61% de volume",
      "elseve"
    ],
    "price": 53.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Elseve",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "creme para pentear"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Actine Darrow Gel de Limpeza 140g + Gel de Limpeza 40g",
    "aliases": [
      "kit actine darrow gel de limpeza 140g + gel de limpeza 40g",
      "kit actine darrow gel de limpeza",
      "darrow"
    ],
    "price": 49.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "180g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Darrow",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Facial La Roche-Posay Effaclar Alta Tolerância Antioleosidade Refil Refil do Gel de Limpeza Suave 240g",
    "aliases": [
      "gel de limpeza facial la roche-posay effaclar alta tolerância antioleosidade refil refil do gel de limpeza suave 240g",
      "gel de limpeza facial la roche-posay effaclar alta tolerância antioleosidade refil refil do gel de limpeza suave",
      "la roche-posay"
    ],
    "price": 85.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "240g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "La Roche-Posay",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Polivitamínico Neosil Attack Cabelo, Pele E Unha 90 comprimidos",
    "aliases": [
      "polivitamínico neosil attack cabelo, pele e unha 90 comprimidos",
      "polivitamínico neosil attack cabelo, pele e unha",
      "neosil"
    ],
    "price": 384.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "90 Cápsulas",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Neosil",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "pele, cabelos e unhas",
      "assadura",
      "micose",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Refil Gel de Limpeza Facial Actine Darrow 300g",
    "aliases": [
      "refil gel de limpeza facial actine darrow 300g",
      "refil gel de limpeza facial actine darrow",
      "darrow"
    ],
    "price": 69.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "300g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Darrow",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Líquido Dermotivin Soft com 300ml",
    "aliases": [
      "sabonete líquido dermotivin soft com 300ml",
      "sabonete líquido dermotivin soft com",
      "dermotivin"
    ],
    "price": 91.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "300ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dermotivin",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Antisséptico em barra Galderma Soapex com 80g",
    "aliases": [
      "sabonete antisséptico em barra galderma soapex com 80g",
      "sabonete antisséptico em barra galderma soapex com",
      "soapex"
    ],
    "price": 31.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "80g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Soapex",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Facial La Roche-Posay Effaclar Alta Tolerância Gel de Limpeza Facial para Peles Sensíveis 300g",
    "aliases": [
      "gel de limpeza facial la roche-posay effaclar alta tolerância gel de limpeza facial para peles sensíveis 300g",
      "gel de limpeza facial la roche-posay effaclar alta tolerância gel de limpeza facial para peles sensíveis",
      "la roche-posay"
    ],
    "price": 121.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "300g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "La Roche-Posay",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "assadura",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Refil Gel de Limpeza Facial La Roche-Posay Effaclar Concentrado Refil do Gel de Limpeza Antiacne 240g",
    "aliases": [
      "refil gel de limpeza facial la roche-posay effaclar concentrado refil do gel de limpeza antiacne 240g",
      "refil gel de limpeza facial la roche-posay effaclar concentrado refil do gel de limpeza antiacne",
      "la roche-posay"
    ],
    "price": 85.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "240g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "La Roche-Posay",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Facial Concentrado La Roche-Posay Effaclar para Pele Oleosa Gel de Limpeza Antiacne Embalagem Econômica 300g",
    "aliases": [
      "gel de limpeza facial concentrado la roche-posay effaclar para pele oleosa gel de limpeza antiacne embalagem econômica 300g",
      "gel de limpeza facial concentrado la roche-posay effaclar para pele oleosa gel de limpeza antiacne embalagem econômica",
      "la roche-posay"
    ],
    "price": 121.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "300g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "La Roche-Posay",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "assadura",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo de Ricino Needs 30ml",
    "aliases": [
      "óleo de ricino needs 30ml",
      "óleo de ricino needs",
      "needs"
    ],
    "price": 8.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "antiqueda"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Micelar Bioderma Sensibio Gel Moussant 500ml",
    "aliases": [
      "gel de limpeza micelar bioderma sensibio gel moussant 500ml",
      "gel de limpeza micelar bioderma sensibio gel moussant",
      "bioderma"
    ],
    "price": 169.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "500ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bioderma",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "hidratante",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo + Sérum Bifásico Dove Bond Intense Repair + Peptídeo110ml",
    "aliases": [
      "óleo + sérum bifásico dove bond intense repair + peptídeo110ml",
      "dove"
    ],
    "price": 49.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "110ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "secos e danificados",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Suplemento Alimentar Nouve Silício D Cabelo Pele e Unha 30 Cápsulas",
    "aliases": [
      "suplemento alimentar nouve silício d cabelo pele e unha 30 cápsulas",
      "suplemento alimentar nouve silício d cabelo pele e unha",
      "nouve"
    ],
    "price": 173.43,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nouve",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "anticelulite e firmadores",
      "assadura",
      "micose",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Darrow Actine 400g",
    "aliases": [
      "gel de limpeza darrow actine 400g",
      "gel de limpeza darrow actine",
      "darrow"
    ],
    "price": 94.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Darrow",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Facial Principia Skincare PS-05 14,5% Mix de Filtros Uv + 5% Niacinamida FPS 70 Cor 2.0 30ml",
    "aliases": [
      "protetor solar facial principia skincare ps-05 14,5% mix de filtros uv + 5% niacinamida fps 70 cor 2.0 30ml",
      "protetor solar facial principia skincare ps-05",
      "principia"
    ],
    "price": 49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Principia",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "protetores solares"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Reparador Labial Cicaplast Lábios La Roche-Posay 7,5ml Reparação e Proteção para Lábios Ressecados",
    "aliases": [
      "reparador labial cicaplast lábios la roche-posay 7,5ml reparação e proteção para lábios ressecados",
      "reparador labial cicaplast lábios la roche-posay",
      "la roche-posay"
    ],
    "price": 87.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "7ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "La Roche-Posay",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "lábios",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Espuma Cremosa de Limpeza Effaclar Reequilibrante La Roche-Posay Limpeza Equilibrante 100g",
    "aliases": [
      "espuma cremosa de limpeza effaclar reequilibrante la roche-posay limpeza equilibrante 100g",
      "espuma cremosa de limpeza effaclar reequilibrante la roche-posay limpeza equilibrante",
      "la roche-posay"
    ],
    "price": 84.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "La Roche-Posay",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo e Sérum Bifásico Dove UV Repair & Glow + Ferúlico Spray 110ml",
    "aliases": [
      "óleo e sérum bifásico dove uv repair & glow + ferúlico spray 110ml",
      "óleo e sérum bifásico dove uv repair & glow + ferúlico spray",
      "dove"
    ],
    "price": 49.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "110ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento capilar",
      "tosse",
      "spray"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Facial Avène Cleanance 300g",
    "aliases": [
      "gel de limpeza facial avène cleanance 300g",
      "gel de limpeza facial avène cleanance",
      "avène"
    ],
    "price": 109.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "300g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Avène",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Facial Principia Skincare PS-05 14,5% Mix de Filtros Uv + 5% Niacinamida FPS 70 Cor 3.0 30ml",
    "aliases": [
      "protetor solar facial principia skincare ps-05 14,5% mix de filtros uv + 5% niacinamida fps 70 cor 3.0 30ml",
      "protetor solar facial principia skincare ps-05",
      "principia"
    ],
    "price": 49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Principia",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "protetores solares"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Facial Cerave Antioleosidade Pele Normal a Oleosa Embalagem Econômica com Ceramidas para Limpeza Diária 454g",
    "aliases": [
      "gel de limpeza facial cerave antioleosidade pele normal a oleosa embalagem econômica com ceramidas para limpeza diária 454g",
      "gel de limpeza facial cerave antioleosidade pele normal a oleosa embalagem econômica com ceramidas para limpeza diária",
      "cerave"
    ],
    "price": 115.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "454g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cerave",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "assadura",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo de Banho Hidratante Bioderma Atoderm 200ml",
    "aliases": [
      "óleo de banho hidratante bioderma atoderm 200ml",
      "óleo de banho hidratante bioderma atoderm",
      "bioderma"
    ],
    "price": 129.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "200ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bioderma",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete em Barra Cetaphil Pele Sensível com 127g",
    "aliases": [
      "sabonete em barra cetaphil pele sensível com 127g",
      "sabonete em barra cetaphil pele sensível com",
      "cetaphil"
    ],
    "price": 36.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "127g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cetaphil",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "assadura",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Facial Principia Skincare PS-05 14,5% Mix de Filtros Uv + 5% Niacinamida FPS 70 Cor 4.0 30ml",
    "aliases": [
      "protetor solar facial principia skincare ps-05 14,5% mix de filtros uv + 5% niacinamida fps 70 cor 4.0 30ml",
      "protetor solar facial principia skincare ps-05",
      "principia"
    ],
    "price": 49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Principia",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "protetores solares"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sérum Capilar Mise En Scène Perfect Serum 30ml",
    "aliases": [
      "sérum capilar mise en scène perfect serum 30ml",
      "sérum capilar mise en scène perfect serum",
      "miseenscene"
    ],
    "price": 69.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Miseenscene",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "k-beauty",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Micelar Bioderma Sensibio Gel Moussant 100ml",
    "aliases": [
      "gel de limpeza micelar bioderma sensibio gel moussant 100ml",
      "gel de limpeza micelar bioderma sensibio gel moussant",
      "bioderma"
    ],
    "price": 71.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bioderma",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Líquido Dermatológico Darrow Suavié Pele Sensível 140ml",
    "aliases": [
      "sabonete líquido dermatológico darrow suavié pele sensível 140ml",
      "sabonete líquido dermatológico darrow suavié pele sensível",
      "darrow"
    ],
    "price": 69.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "140ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Darrow",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "assadura",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Água Micelar Demaquilante Bioderma Sensibio H2O com 100ml",
    "aliases": [
      "água micelar demaquilante bioderma sensibio h2o com 100ml",
      "água micelar demaquilante bioderma sensibio h2o com",
      "bioderma"
    ],
    "price": 69.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bioderma",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Imecap Hair Max Cabelos e Unhas 60 + 30 cápsulas",
    "aliases": [
      "kit imecap hair max cabelos e unhas 60 + 30 cápsulas",
      "kit imecap hair max cabelos e unhas",
      "imecap"
    ],
    "price": 118.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "90s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Imecap",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "fortalecedor de cabelos e unhas",
      "micose",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Suplemento Eximia Fortalize S com 90 Comprimidos",
    "aliases": [
      "suplemento eximia fortalize s com 90 comprimidos",
      "suplemento eximia fortalize s com",
      "eximia"
    ],
    "price": 469.81,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "90un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Eximia",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "antioxidante",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo de Limpeza Demaquilante 30% Óleo de Girassol + 15% Mix de Tensoativos + 1% Vitamina E Principia Skincare OL-01 com 200ml",
    "aliases": [
      "óleo de limpeza demaquilante 30% óleo de girassol + 15% mix de tensoativos + 1% vitamina e principia skincare ol-01 com 200ml",
      "óleo de limpeza demaquilante",
      "principia"
    ],
    "price": 59,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "200ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Principia",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo Finalizador Tresemmé Brilho Lamelar 60ml",
    "aliases": [
      "óleo finalizador tresemmé brilho lamelar 60ml",
      "óleo finalizador tresemmé brilho lamelar",
      "tresemmé"
    ],
    "price": 37.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Tresemmé",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "frizz",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Facial Eucerin Dermo Pure Concentrado 400g",
    "aliases": [
      "gel de limpeza facial eucerin dermo pure concentrado 400g",
      "gel de limpeza facial eucerin dermo pure concentrado",
      "eucerin"
    ],
    "price": 99.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Eucerin",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Suplemento Vitamínico Tacitá Unhas e Cabelos - 30 Comprimidos",
    "aliases": [
      "suplemento vitamínico tacitá unhas e cabelos - 30 comprimidos",
      "suplemento vitamínico tacitá unhas e cabelos -",
      "tacita"
    ],
    "price": 160.64,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30s",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Tacita",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "fortalecedor de cabelos e unhas",
      "micose",
      "comprimido"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Avène Cleanance Gel de Limpeza Purificante 150g + 40g",
    "aliases": [
      "kit avène cleanance gel de limpeza purificante 150g + 40g",
      "kit avène cleanance gel de limpeza purificante",
      "avène"
    ],
    "price": 79.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "190ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Avène",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Refil Óleo de Banho Hidratante Bioderma Atoderm 1L",
    "aliases": [
      "refil óleo de banho hidratante bioderma atoderm 1l",
      "refil óleo de banho hidratante bioderma atoderm",
      "bioderma"
    ],
    "price": 249.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "1000ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bioderma",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Espuma de Limpeza Cetaphil Pro AR Calm Control com 236ml",
    "aliases": [
      "espuma de limpeza cetaphil pro ar calm control com 236ml",
      "espuma de limpeza cetaphil pro ar calm control com",
      "cetaphil"
    ],
    "price": 93.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "236ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cetaphil",
    "isGeneric": false,
    "tags": [
      "cosmeticos",
      "tratamento facial",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Líquido Corporal Nivea Óleo de Banho 200ml",
    "aliases": [
      "sabonete líquido corporal nivea óleo de banho 200ml",
      "sabonete líquido corporal nivea óleo de banho",
      "nivea"
    ],
    "price": 44.89,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "200ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nivea",
    "isGeneric": false,
    "tags": [
      "higiene",
      "sabonetes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Líquido Infantil Granado Bebê Glicerina Tradicional Refil 250ml",
    "aliases": [
      "sabonete líquido infantil granado bebê glicerina tradicional refil 250ml",
      "sabonete líquido infantil granado bebê glicerina tradicional refil",
      "granado"
    ],
    "price": 23.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Granado",
    "isGeneric": false,
    "tags": [
      "higiene",
      "sabonetes",
      "assadura"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hastes Flexíveis Cotonetes Johnson & Johnson com 75 unidades",
    "aliases": [
      "hastes flexíveis cotonetes johnson & johnson com 75 unidades",
      "hastes flexíveis cotonetes johnson & johnson com",
      "cotonetes"
    ],
    "price": 7.29,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "75un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cotonetes",
    "isGeneric": false,
    "tags": [
      "higiene",
      "hastes flexíveis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete em Barra Granado Enxofre com 90g",
    "aliases": [
      "sabonete em barra granado enxofre com 90g",
      "sabonete em barra granado enxofre com",
      "granado"
    ],
    "price": 12.39,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "90g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Granado",
    "isGeneric": false,
    "tags": [
      "higiene",
      "banho"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Rexona Clinical Classic Feminino 96h 150ml",
    "aliases": [
      "desodorante antitranspirante aerosol rexona clinical classic feminino 96h 150ml",
      "desodorante antitranspirante aerosol rexona clinical classic feminino",
      "rexona"
    ],
    "price": 22.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Rexona",
    "isGeneric": false,
    "tags": [
      "higiene",
      "desodorantes",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete em Barra Phebo Limão Siciliano com 100g",
    "aliases": [
      "sabonete em barra phebo limão siciliano com 100g",
      "sabonete em barra phebo limão siciliano com",
      "phebo"
    ],
    "price": 7.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Phebo",
    "isGeneric": false,
    "tags": [
      "higiene",
      "limpeza da pele"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Creme Sérum Dove Previne Escurecimento Feminino 48h 50g",
    "aliases": [
      "desodorante antitranspirante creme sérum dove previne escurecimento feminino 48h 50g",
      "desodorante antitranspirante creme sérum dove previne escurecimento feminino",
      "dove"
    ],
    "price": 15.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "higiene",
      "desodorantes",
      "dor",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Dove Original Feminino 72h 150ml",
    "aliases": [
      "desodorante antitranspirante aerosol dove original feminino 72h 150ml",
      "desodorante antitranspirante aerosol dove original feminino",
      "dove"
    ],
    "price": 22.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "higiene",
      "desodorantes",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Dove Original Feminino 72h 250ml",
    "aliases": [
      "desodorante antitranspirante aerosol dove original feminino 72h 250ml",
      "desodorante antitranspirante aerosol dove original feminino",
      "dove"
    ],
    "price": 32.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "higiene",
      "banho",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Stick Creme Rexona Men Clinical Clean Masculino 96h 58g",
    "aliases": [
      "desodorante antitranspirante stick creme rexona men clinical clean masculino 96h 58g",
      "desodorante antitranspirante stick creme rexona men clinical clean masculino",
      "rexona"
    ],
    "price": 32.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "58g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Rexona",
    "isGeneric": false,
    "tags": [
      "higiene",
      "desodorantes",
      "dor",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Sabonete Dove Original em Barra 90g 6 unidades",
    "aliases": [
      "kit sabonete dove original em barra 90g 6 unidades",
      "kit sabonete dove original em barra",
      "dove"
    ],
    "price": 30.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "6un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "higiene",
      "banho"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Shampoo Infantil Johnson's Baby Regular 400ml",
    "aliases": [
      "shampoo infantil johnson's baby regular 400ml",
      "shampoo infantil johnson's baby regular",
      "johnson & johnson"
    ],
    "price": 34.69,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Johnson & Johnson",
    "isGeneric": false,
    "tags": [
      "higiene",
      "banho"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Rexona Men Active Dry Masculino 72h 150ml",
    "aliases": [
      "desodorante antitranspirante aerosol rexona men active dry masculino 72h 150ml",
      "desodorante antitranspirante aerosol rexona men active dry masculino",
      "rexona"
    ],
    "price": 19.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Rexona",
    "isGeneric": false,
    "tags": [
      "higiene",
      "desodorantes",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Algodão Disco Needs Beauty 50 Unidades",
    "aliases": [
      "algodão disco needs beauty 50 unidades",
      "algodão disco needs beauty",
      "needs"
    ],
    "price": 10.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "higiene",
      "algodão"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Shampoo Anticaspa Clear Men Ice Cool Menthol 400ml",
    "aliases": [
      "shampoo anticaspa clear men ice cool menthol 400ml",
      "shampoo anticaspa clear men ice cool menthol",
      "clear"
    ],
    "price": 32.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Clear",
    "isGeneric": false,
    "tags": [
      "higiene",
      "shampoo"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Algodão Quadrado Needs 250 Unidades",
    "aliases": [
      "algodão quadrado needs 250 unidades",
      "algodão quadrado needs",
      "needs"
    ],
    "price": 17.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "higiene",
      "algodão"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Líquido Lux Botanicals Orquídea Negra Refil com 200ml",
    "aliases": [
      "sabonete líquido lux botanicals orquídea negra refil com 200ml",
      "sabonete líquido lux botanicals orquídea negra refil com",
      "lux"
    ],
    "price": 8.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "200ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Lux",
    "isGeneric": false,
    "tags": [
      "higiene",
      "limpeza da pele"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Algodão Disco Needs Beauty 100 Unidades",
    "aliases": [
      "algodão disco needs beauty 100 unidades",
      "algodão disco needs beauty",
      "needs"
    ],
    "price": 17.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "higiene",
      "algodão"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete em Barra Nivea Leite 85g",
    "aliases": [
      "sabonete em barra nivea leite 85g",
      "sabonete em barra nivea leite",
      "nivea"
    ],
    "price": 3.83,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "85g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nivea",
    "isGeneric": false,
    "tags": [
      "higiene",
      "limpeza da pele"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete em Barra Lux Botanicals Buquê de Jasmim 85g",
    "aliases": [
      "sabonete em barra lux botanicals buquê de jasmim 85g",
      "sabonete em barra lux botanicals buquê de jasmim",
      "lux"
    ],
    "price": 2.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "85g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Lux",
    "isGeneric": false,
    "tags": [
      "higiene",
      "limpeza da pele"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Rexona Men Active Dry 72h 250ml",
    "aliases": [
      "desodorante antitranspirante aerosol rexona men active dry 72h 250ml",
      "desodorante antitranspirante aerosol rexona men active dry",
      "rexona"
    ],
    "price": 28.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Rexona",
    "isGeneric": false,
    "tags": [
      "higiene",
      "banho",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Shampoo Anticaspa Clear Men Limpeza Diária 2 em 1 400ml",
    "aliases": [
      "shampoo anticaspa clear men limpeza diária 2 em 1 400ml",
      "shampoo anticaspa clear men limpeza diária",
      "clear"
    ],
    "price": 32.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Clear",
    "isGeneric": false,
    "tags": [
      "higiene",
      "shampoo",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Líquido Dove Baby Hidratação Enriquecida Refil 180ml",
    "aliases": [
      "sabonete líquido dove baby hidratação enriquecida refil 180ml",
      "sabonete líquido dove baby hidratação enriquecida refil",
      "baby dove"
    ],
    "price": 14.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "180ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Baby Dove",
    "isGeneric": false,
    "tags": [
      "higiene",
      "sabonetes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Shampoo Antiqueda Estimulante Vichy Dercos Energy+ Cabelos Fracos Antiqueda Premium com Aminexil, Niacinamida e Vitamina E 400g",
    "aliases": [
      "shampoo antiqueda estimulante vichy dercos energy+ cabelos fracos antiqueda premium com aminexil, niacinamida e vitamina e 400g",
      "shampoo antiqueda estimulante vichy dercos energy+ cabelos fracos antiqueda premium com aminexil, niacinamida e vitamina e",
      "vichy"
    ],
    "price": 169.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Vichy",
    "isGeneric": false,
    "tags": [
      "higiene",
      "shampoo"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Rexona Men Impacto 72h 150ml",
    "aliases": [
      "desodorante antitranspirante aerosol rexona men impacto 72h 150ml",
      "desodorante antitranspirante aerosol rexona men impacto",
      "rexona"
    ],
    "price": 19.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Rexona",
    "isGeneric": false,
    "tags": [
      "higiene",
      "desodorantes",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Rexona Powder Dry Feminino 72h 150ml",
    "aliases": [
      "desodorante antitranspirante aerosol rexona powder dry feminino 72h 150ml",
      "desodorante antitranspirante aerosol rexona powder dry feminino",
      "rexona"
    ],
    "price": 19.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Rexona",
    "isGeneric": false,
    "tags": [
      "higiene",
      "desodorantes",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Dove Men +Care Invisible Dry 48h 250ml",
    "aliases": [
      "desodorante antitranspirante aerosol dove men +care invisible dry 48h 250ml",
      "desodorante antitranspirante aerosol dove men +care invisible dry",
      "dove"
    ],
    "price": 29.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "250ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "higiene",
      "desodorantes",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Elseve Glycolic Gloss Shampoo 375ml + Condicionador 170ml",
    "aliases": [
      "kit elseve glycolic gloss shampoo 375ml + condicionador 170ml",
      "kit elseve glycolic gloss shampoo",
      "elseve"
    ],
    "price": 35.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "545ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Elseve",
    "isGeneric": false,
    "tags": [
      "higiene",
      "condicionador",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hastes Flexíveis Cotonetes 150 Unidades",
    "aliases": [
      "hastes flexíveis cotonetes 150 unidades",
      "hastes flexíveis cotonetes",
      "cotonetes"
    ],
    "price": 13.39,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cotonetes",
    "isGeneric": false,
    "tags": [
      "higiene",
      "banho"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Roll-On Dove Original Feminino Sem Álcool 48h 50ml",
    "aliases": [
      "desodorante antitranspirante roll-on dove original feminino sem álcool 48h 50ml",
      "desodorante antitranspirante roll-on dove original feminino sem álcool",
      "dove"
    ],
    "price": 11.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "higiene",
      "banho",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Adidas Pro Invisible Masculino 72h 150ml",
    "aliases": [
      "desodorante antitranspirante aerosol adidas pro invisible masculino 72h 150ml",
      "desodorante antitranspirante aerosol adidas pro invisible masculino",
      "adidas"
    ],
    "price": 14.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Adidas",
    "isGeneric": false,
    "tags": [
      "higiene",
      "desodorantes",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Desodorante Antitranspirante Aerosol Dove Men +Care Sem Perfume 48h 150ml",
    "aliases": [
      "desodorante antitranspirante aerosol dove men +care sem perfume 48h 150ml",
      "desodorante antitranspirante aerosol dove men +care sem perfume",
      "dove"
    ],
    "price": 20.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "higiene",
      "banho",
      "dor",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete em Barra Johnson's Baby Original com 80g",
    "aliases": [
      "sabonete em barra johnson's baby original com 80g",
      "sabonete em barra johnson's baby original com",
      "johnson & johnson"
    ],
    "price": 6.89,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "80g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Johnson & Johnson",
    "isGeneric": false,
    "tags": [
      "higiene",
      "sabonetes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete em Barra João e Maria Bebê Glicerinado 75g",
    "aliases": [
      "sabonete em barra joão e maria bebê glicerinado 75g",
      "sabonete em barra joão e maria bebê glicerinado",
      "joão e maria"
    ],
    "price": 4.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "75g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "João e Maria",
    "isGeneric": false,
    "tags": [
      "higiene",
      "banho",
      "assadura"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Creme Multirreparador Calmante Cicaplast Baume B5+ La Roche-Posay Repara e Acalma Peles Irritadas 40ml",
    "aliases": [
      "creme multirreparador calmante cicaplast baume b5+ la roche-posay repara e acalma peles irritadas 40ml",
      "creme multirreparador calmante cicaplast baume b5+ la roche-posay repara e acalma peles irritadas",
      "la roche-posay"
    ],
    "price": 102.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "40ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "La Roche-Posay",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratante",
      "dor",
      "assadura",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Pomada Reparadora Intensiva Eucerin Aquaphor DuoPack com 2 Unidades",
    "aliases": [
      "kit pomada reparadora intensiva eucerin aquaphor duopack com 2 unidades",
      "kit pomada reparadora intensiva eucerin aquaphor duopack com",
      "eucerin"
    ],
    "price": 64.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Eucerin",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratantes",
      "dor",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sérum Hidratante Corporal Dove Niacinamida + Uniformizador 380ml",
    "aliases": [
      "sérum hidratante corporal dove niacinamida + uniformizador 380ml",
      "sérum hidratante corporal dove niacinamida + uniformizador",
      "dove"
    ],
    "price": 54.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "380ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dove",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratante",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Creme Multirreparador Calmante Cicaplast Baume B5+ La Roche-Posay Reparação Calmante Portátil 20ml",
    "aliases": [
      "creme multirreparador calmante cicaplast baume b5+ la roche-posay reparação calmante portátil 20ml",
      "creme multirreparador calmante cicaplast baume b5+ la roche-posay reparação calmante portátil",
      "la roche-posay"
    ],
    "price": 58.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "La Roche-Posay",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratantes",
      "dor",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Loção Hidratante Corporal CeraVe Pele Seca a Extra Seca Hidratação Prolongada para Pele Seca 473ml",
    "aliases": [
      "loção hidratante corporal cerave pele seca a extra seca hidratação prolongada para pele seca 473ml",
      "loção hidratante corporal cerave pele seca a extra seca hidratação prolongada para pele seca",
      "cerave"
    ],
    "price": 133.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "473ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cerave",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratante",
      "assadura",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hidratante Corporal Neutrogena Body Care Intensive Hidrata&Repara 400ml",
    "aliases": [
      "hidratante corporal neutrogena body care intensive hidrata&repara 400ml",
      "hidratante corporal neutrogena body care intensive hidrata&repara",
      "neutrogena"
    ],
    "price": 47.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Neutrogena",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratante"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Loção Hidratante Nivea Milk Pele Seca a Extrasseca 400ml",
    "aliases": [
      "loção hidratante nivea milk pele seca a extrasseca 400ml",
      "loção hidratante nivea milk pele seca a extrasseca",
      "nivea"
    ],
    "price": 28.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nivea",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratantes",
      "assadura",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Facial La Roche-Posay Anthelios Ultra Cover FPS 60 Cor 3.0 Cobertura e Proteção 30g",
    "aliases": [
      "protetor solar facial la roche-posay anthelios ultra cover fps 60 cor 3.0 cobertura e proteção 30g",
      "protetor solar facial la roche-posay anthelios ultra cover fps",
      "anthelios"
    ],
    "price": 99.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Anthelios",
    "isGeneric": false,
    "tags": [
      "beleza",
      "protetores solares"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hidratante Labial Nivea Original Care com 4,8g",
    "aliases": [
      "hidratante labial nivea original care com 4,8g",
      "hidratante labial nivea original care com",
      "nivea"
    ],
    "price": 26.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "4g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nivea",
    "isGeneric": false,
    "tags": [
      "beleza"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Creme Hidratante Corporal CeraVe para Pele Seca e Extra Seca Hidratação Prolongada com Ceramidas para Pele Seca 454g",
    "aliases": [
      "creme hidratante corporal cerave para pele seca e extra seca hidratação prolongada com ceramidas para pele seca 454g",
      "creme hidratante corporal cerave para pele seca e extra seca hidratação prolongada com ceramidas para pele seca",
      "cerave"
    ],
    "price": 133.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "454g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cerave",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratantes",
      "assadura",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Facial FPS 50 Bioré UV Perfect Milk 40ml",
    "aliases": [
      "protetor solar facial fps 50 bioré uv perfect milk 40ml",
      "protetor solar facial fps",
      "bioré"
    ],
    "price": 74.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "40ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bioré",
    "isGeneric": false,
    "tags": [
      "beleza",
      "protetores solares",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Removedor de Esmalte Needs com Acetona 100ml",
    "aliases": [
      "removedor de esmalte needs com acetona 100ml",
      "removedor de esmalte needs com acetona",
      "needs"
    ],
    "price": 5.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "beleza",
      "removedores",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Loção Hidratante Cetaphil Corpo e Rosto 473ml",
    "aliases": [
      "loção hidratante cetaphil corpo e rosto 473ml",
      "loção hidratante cetaphil corpo e rosto",
      "cetaphil"
    ],
    "price": 134.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "473ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Cetaphil",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratantes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Facial Suave Principia Skincare GL-02 11,5% Tensoativos + 10% Glicerina + 1% PCA Sódio 200g",
    "aliases": [
      "gel de limpeza facial suave principia skincare gl-02 11,5% tensoativos + 10% glicerina + 1% pca sódio 200g",
      "gel de limpeza facial suave principia skincare gl-02",
      "principia"
    ],
    "price": 39,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "200g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Principia",
    "isGeneric": false,
    "tags": [
      "beleza",
      "esfoliante",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Facial La Roche-Posay Anthelios Ultra Cover FPS 60 Cor 2.0 Proteção para Tom Claro 30g",
    "aliases": [
      "protetor solar facial la roche-posay anthelios ultra cover fps 60 cor 2.0 proteção para tom claro 30g",
      "protetor solar facial la roche-posay anthelios ultra cover fps",
      "anthelios"
    ],
    "price": 99.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Anthelios",
    "isGeneric": false,
    "tags": [
      "beleza",
      "protetores solares"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hidratante Multirrestaurador com Rosa Mosqueta Bepantol Derma 20g",
    "aliases": [
      "hidratante multirrestaurador com rosa mosqueta bepantol derma 20g",
      "hidratante multirrestaurador com rosa mosqueta bepantol derma",
      "bepantol"
    ],
    "price": 42.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bepantol",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratantes",
      "dor",
      "assadura"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Facial La Roche-Posay Anthelios Airlicium+ FPS 80 Alta Proteção Antioleosidade 40g",
    "aliases": [
      "protetor solar facial la roche-posay anthelios airlicium+ fps 80 alta proteção antioleosidade 40g",
      "protetor solar facial la roche-posay anthelios airlicium+ fps",
      "anthelios"
    ],
    "price": 109.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "40g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Anthelios",
    "isGeneric": false,
    "tags": [
      "beleza",
      "protetores solares"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Geléia de Vaselina Vasenol Original 100g",
    "aliases": [
      "geléia de vaselina vasenol original 100g",
      "geléia de vaselina vasenol original",
      "vasenol",
      "bicarbonato de sódio + carbonato de sódio + ácido cítrico",
      "bicarbonato de sódio"
    ],
    "price": 36.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100g",
    "unitName": "caixa",
    "activeIngredient": "Bicarbonato de Sódio + Carbonato de Sódio + Ácido Cítrico",
    "manufacturer": "Vasenol",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratante",
      "azia",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo Milagroso Finalizador e Leave-in Pantene Miracles Queratina 95ml",
    "aliases": [
      "óleo milagroso finalizador e leave-in pantene miracles queratina 95ml",
      "óleo milagroso finalizador e leave-in pantene miracles queratina",
      "pantene"
    ],
    "price": 49.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "95ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Pantene",
    "isGeneric": false,
    "tags": [
      "beleza",
      "creme para pentear",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hidratante Bepantol Derma Oil Free Pele Normal a Seca 30g",
    "aliases": [
      "hidratante bepantol derma oil free pele normal a seca 30g",
      "hidratante bepantol derma oil free pele normal a seca",
      "bepantol"
    ],
    "price": 53.09,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "30g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bepantol",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratante",
      "assadura",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hidratante Labial Nivea Amora Shine 4,8g",
    "aliases": [
      "hidratante labial nivea amora shine 4,8g",
      "hidratante labial nivea amora shine",
      "nivea"
    ],
    "price": 26.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "5g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nivea",
    "isGeneric": false,
    "tags": [
      "beleza"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Facial Solução FPS 60 Isdin Fusion Water 50ml",
    "aliases": [
      "protetor solar facial solução fps 60 isdin fusion water 50ml",
      "protetor solar facial solução fps",
      "isdin"
    ],
    "price": 114.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Isdin",
    "isGeneric": false,
    "tags": [
      "beleza",
      "protetor solar"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Labial Laby Lip Care Manteiga de Cacau Luxo FPS 8 3,3g",
    "aliases": [
      "protetor solar labial laby lip care manteiga de cacau luxo fps 8 3,3g",
      "protetor solar labial laby lip care manteiga de cacau luxo fps",
      "laby"
    ],
    "price": 2.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "3g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Laby",
    "isGeneric": false,
    "tags": [
      "beleza"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Hidratante Facial Neutrogena Hydro Boost Water Gel 50g",
    "aliases": [
      "hidratante facial neutrogena hydro boost water gel 50g",
      "hidratante facial neutrogena hydro boost water gel",
      "neutrogena"
    ],
    "price": 102.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Neutrogena",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratante",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Carmed SOS Lábios Algodão Doce Esfoliante Labial 10g + Gloss Labial Ultra Gloss 10g",
    "aliases": [
      "kit carmed sos lábios algodão doce esfoliante labial 10g + gloss labial ultra gloss 10g",
      "kit carmed sos lábios algodão doce esfoliante labial",
      "carmed"
    ],
    "price": 69.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Carmed",
    "isGeneric": false,
    "tags": [
      "beleza"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Creme Reparador Avène Cicalfate+ 20ml",
    "aliases": [
      "creme reparador avène cicalfate+ 20ml",
      "creme reparador avène cicalfate+",
      "avène"
    ],
    "price": 51.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "20ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Avène",
    "isGeneric": false,
    "tags": [
      "beleza",
      "hidratantes",
      "dor",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Protetor Solar Principia Skincare PS-01 FPS 60 40ml",
    "aliases": [
      "protetor solar principia skincare ps-01 fps 60 40ml",
      "protetor solar principia skincare ps-01 fps",
      "principia"
    ],
    "price": 49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "40ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Principia",
    "isGeneric": false,
    "tags": [
      "beleza",
      "protetores solares"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Água Oxigenada 40 Volumes Needs Beauty 100ml",
    "aliases": [
      "água oxigenada 40 volumes needs beauty 100ml",
      "água oxigenada",
      "needs"
    ],
    "price": 4.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "100ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "beleza",
      "descolorantes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Água Micelar L'Oréal Paris Solução de Limpeza 5 em 1 Limpeza Facial Suave Sem Enxágue 200ml",
    "aliases": [
      "água micelar l'oréal paris solução de limpeza 5 em 1 limpeza facial suave sem enxágue 200ml",
      "água micelar l'oréal paris solução de limpeza",
      "l'oréal"
    ],
    "price": 29.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "200ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "L'Oréal",
    "isGeneric": false,
    "tags": [
      "beleza",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete em Barra Phebo Odor de Rosas 90g",
    "aliases": [
      "sabonete em barra phebo odor de rosas 90g",
      "sabonete em barra phebo odor de rosas",
      "phebo"
    ],
    "price": 6.39,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "90g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Phebo",
    "isGeneric": false,
    "tags": [
      "beleza",
      "limpeza da pele",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Refil Sabonete Líquido Protex Nutri Protect Vitamina E 900ml",
    "aliases": [
      "refil sabonete líquido protex nutri protect vitamina e 900ml",
      "refil sabonete líquido protex nutri protect vitamina e",
      "protex"
    ],
    "price": 29.19,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "900ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Protex",
    "isGeneric": false,
    "tags": [
      "beleza",
      "sabonetes"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Algodão em Disco Needs Beauty 150 unidades",
    "aliases": [
      "algodão em disco needs beauty 150 unidades",
      "algodão em disco needs beauty",
      "needs"
    ],
    "price": 23.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "beleza",
      "algodão"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Algodão Bola Needs 50g",
    "aliases": [
      "algodão bola needs 50g",
      "algodão bola needs",
      "needs"
    ],
    "price": 7.49,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "50g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "beleza",
      "algodão e hastes flexíveis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Limpador Facial Antioleosidade Creamy Skincare 300ml",
    "aliases": [
      "limpador facial antioleosidade creamy skincare 300ml",
      "limpador facial antioleosidade creamy skincare",
      "creamy"
    ],
    "price": 54.89,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "300ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Creamy",
    "isGeneric": false,
    "tags": [
      "dermocosmeticos",
      "tratamento facial",
      "dor"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo Capilar Inoar Argan Oil 7ml",
    "aliases": [
      "óleo capilar inoar argan oil 7ml",
      "óleo capilar inoar argan oil",
      "inoar"
    ],
    "price": 14.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "7ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Inoar",
    "isGeneric": false,
    "tags": [
      "dermocosmeticos",
      "frizz"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Gel de Limpeza Facial Nutrel Sensitive com 150ml",
    "aliases": [
      "gel de limpeza facial nutrel sensitive com 150ml",
      "gel de limpeza facial nutrel sensitive com",
      "profuse"
    ],
    "price": 76.22,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Profuse",
    "isGeneric": false,
    "tags": [
      "dermocosmeticos",
      "tratamento facial",
      "micose",
      "pomada"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo Micelar Demaquilante Sensibio Micellar Cleasing Oil 150ml",
    "aliases": [
      "óleo micelar demaquilante sensibio micellar cleasing oil 150ml",
      "óleo micelar demaquilante sensibio micellar cleasing oil",
      "bioderma"
    ],
    "price": 105.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "150ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Bioderma",
    "isGeneric": false,
    "tags": [
      "dermocosmeticos",
      "tratamento facial"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Sabonete Facial em Espuma Dermotivin Soft Pele Seca ou Sensível com 130ml",
    "aliases": [
      "sabonete facial em espuma dermotivin soft pele seca ou sensível com 130ml",
      "sabonete facial em espuma dermotivin soft pele seca ou sensível com",
      "dermotivin"
    ],
    "price": 71.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "130ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Dermotivin",
    "isGeneric": false,
    "tags": [
      "dermocosmeticos",
      "tratamento facial",
      "assadura",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Óleo de Banho Protetor Isdin Ureadin Calm 400ml",
    "aliases": [
      "óleo de banho protetor isdin ureadin calm 400ml",
      "óleo de banho protetor isdin ureadin calm",
      "ureadin"
    ],
    "price": 149.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "400ml",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Ureadin",
    "isGeneric": false,
    "tags": [
      "dermocosmeticos",
      "tratamento facial"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fórmula Infantil Ninho Fases 1+ Nestlé 1 a 3 anos 800g",
    "aliases": [
      "fórmula infantil ninho fases 1+ nestlé 1 a 3 anos 800g",
      "fórmula infantil ninho fases",
      "ninho fases"
    ],
    "price": 56.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "800g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Ninho Fases",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fórmulas infantis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fórmula Infantil Nanlac Comfor Nestlé 1 a 3 anos 800g",
    "aliases": [
      "fórmula infantil nanlac comfor nestlé 1 a 3 anos 800g",
      "fórmula infantil nanlac comfor nestlé",
      "nanlac comfor"
    ],
    "price": 76.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "800g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nanlac Comfor",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fase 3"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fórmula Infantil Aptanutri Premium 3 Danone 1 a 3 anos 800g",
    "aliases": [
      "fórmula infantil aptanutri premium 3 danone 1 a 3 anos 800g",
      "fórmula infantil aptanutri premium",
      "aptanutri"
    ],
    "price": 78.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "800g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Aptanutri",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fórmulas infantis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fralda Calça Huggies Proteção Acolchoada XG 80 unidades",
    "aliases": [
      "fralda calça huggies proteção acolchoada xg 80 unidades",
      "fralda calça huggies proteção acolchoada xg",
      "huggies"
    ],
    "price": 121.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "80un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Huggies",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fraldas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Lenço Umedecido Huggies Rosto e Corpo Hipoalergênico 48 unidades 4 pacotes",
    "aliases": [
      "kit lenço umedecido huggies rosto e corpo hipoalergênico 48 unidades 4 pacotes",
      "kit lenço umedecido huggies rosto e corpo hipoalergênico",
      "huggies"
    ],
    "price": 35.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "192un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Huggies",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "lenços umedecidos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fórmula Infantil NANLAC Supreme Nestlé 1 a 3 anos 800g",
    "aliases": [
      "fórmula infantil nanlac supreme nestlé 1 a 3 anos 800g",
      "fórmula infantil nanlac supreme nestlé",
      "nanlac supreme"
    ],
    "price": 105.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "800g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nanlac Supreme",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fórmulas infantis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fralda Huggies Máxima Proteção XG 82 unidades",
    "aliases": [
      "fralda huggies máxima proteção xg 82 unidades",
      "fralda huggies máxima proteção xg",
      "huggies"
    ],
    "price": 129.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "82un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Huggies",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fraldas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fórmula Infantil Aptanutri Profutura 3 Danone 1 a 3 anos 800g",
    "aliases": [
      "fórmula infantil aptanutri profutura 3 danone 1 a 3 anos 800g",
      "fórmula infantil aptanutri profutura",
      "aptanutri"
    ],
    "price": 106.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "800g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Aptanutri",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fórmulas infantis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fralda Calça Needs Baby Ultrasafe Pants G 72 unidades",
    "aliases": [
      "fralda calça needs baby ultrasafe pants g 72 unidades",
      "fralda calça needs baby ultrasafe pants g",
      "needs"
    ],
    "price": 89.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "72un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fraldas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fralda Calça Huggies Proteção Acolchoada XXG 72 unidades",
    "aliases": [
      "fralda calça huggies proteção acolchoada xxg 72 unidades",
      "fralda calça huggies proteção acolchoada xxg",
      "huggies"
    ],
    "price": 121.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "72un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Huggies",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fraldas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fralda Huggies Máxima Proteção G 92 unidades",
    "aliases": [
      "fralda huggies máxima proteção g 92 unidades",
      "fralda huggies máxima proteção g",
      "huggies"
    ],
    "price": 129.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "92un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Huggies",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fraldas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fórmula Infantil Nestonutri Nestlé 1 a 3 anos 800g",
    "aliases": [
      "fórmula infantil nestonutri nestlé 1 a 3 anos 800g",
      "fórmula infantil nestonutri nestlé",
      "nestonutri"
    ],
    "price": 59.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "800g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Nestonutri",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fórmulas infantis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Lenço Umedecido Needs Baby Sem Fragrância 192 Unidades",
    "aliases": [
      "lenço umedecido needs baby sem fragrância 192 unidades",
      "lenço umedecido needs baby sem fragrância",
      "needs"
    ],
    "price": 35.7,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "1un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "lenços umedecidos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fralda Huggies Natural Care Premium RN 34 unidades",
    "aliases": [
      "fralda huggies natural care premium rn 34 unidades",
      "fralda huggies natural care premium rn",
      "huggies natural care"
    ],
    "price": 39.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "34un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Huggies natural care",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fraldas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fralda Calça Needs Baby Ultrasafe Pants XXG 60 unidades",
    "aliases": [
      "fralda calça needs baby ultrasafe pants xxg 60 unidades",
      "fralda calça needs baby ultrasafe pants xxg",
      "needs"
    ],
    "price": 89.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fraldas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Kit Lenço Umedecido Huggies Higiene Superior Hipoalergênico Sem Álcool 48 unidades 4 pacotes",
    "aliases": [
      "kit lenço umedecido huggies higiene superior hipoalergênico sem álcool 48 unidades 4 pacotes",
      "kit lenço umedecido huggies higiene superior hipoalergênico sem álcool",
      "huggies"
    ],
    "price": 45.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "192un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Huggies",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "lenços umedecidos",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fralda Huggies Máxima Proteção XXG 80 unidades",
    "aliases": [
      "fralda huggies máxima proteção xxg 80 unidades",
      "fralda huggies máxima proteção xxg",
      "huggies"
    ],
    "price": 129.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "80un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Huggies",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fraldas"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fralda Pampers Pants Premium Care XXG 60 unidades",
    "aliases": [
      "fralda pampers pants premium care xxg 60 unidades",
      "fralda pampers pants premium care xxg",
      "pampers premium care"
    ],
    "price": 149.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "60un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Pampers Premium Care",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fraldas",
      "micose"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fórmula Infantil Aptamil Premium 1 Danone 0 a 6 meses 800g",
    "aliases": [
      "fórmula infantil aptamil premium 1 danone 0 a 6 meses 800g",
      "fórmula infantil aptamil premium",
      "aptamil"
    ],
    "price": 75.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "800g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Aptamil",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fórmulas infantis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Lenço Umedecido Needs Baby Aloe Vera 176 Unidades",
    "aliases": [
      "lenço umedecido needs baby aloe vera 176 unidades",
      "lenço umedecido needs baby aloe vera",
      "needs"
    ],
    "price": 39.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "176un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "lenços umedecidos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Fórmula Infantil Aptamil Premium 2 Danone 6 a 12 meses 800g",
    "aliases": [
      "fórmula infantil aptamil premium 2 danone 6 a 12 meses 800g",
      "fórmula infantil aptamil premium",
      "aptamil"
    ],
    "price": 78.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "800g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Aptamil",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "fórmulas infantis"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Lenço Umedecido Needs Baby Comfort 40 Unidades",
    "aliases": [
      "lenço umedecido needs baby comfort 40 unidades",
      "lenço umedecido needs baby comfort",
      "needs"
    ],
    "price": 7.9,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "40un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "lenços umedecidos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Composto Lácteo Ninho Fases 3+ Nestlé 3 a 5 anos 800g",
    "aliases": [
      "composto lácteo ninho fases 3+ nestlé 3 a 5 anos 800g",
      "composto lácteo ninho fases",
      "ninho fases"
    ],
    "price": 53.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "800g",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Ninho Fases",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "compostos lácteos"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  },
  {
    "name": "Algodão Quadrado Needs Baby Comfort 200 Unidades",
    "aliases": [
      "algodão quadrado needs baby comfort 200 unidades",
      "algodão quadrado needs baby comfort",
      "needs"
    ],
    "price": 59.99,
    "category": "MIP",
    "needsRecipe": false,
    "recipeType": null,
    "allowsDelivery": true,
    "presentation": "200un",
    "unitName": "caixa",
    "activeIngredient": null,
    "manufacturer": "Needs",
    "isGeneric": false,
    "tags": [
      "mamaebebe",
      "algodão"
    ],
    "safetyNote": "Siga a orientação do seu médico ou farmacêutico. Consulte a bula."
  }
];

// Export if Node, otherwise expose to window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MEDICINES_DB;
} else {
  window.MEDICINES_DB = MEDICINES_DB;
}
