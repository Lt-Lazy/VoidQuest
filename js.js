const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 40;

let totalPlayTime = 0;     // Totalt antall millisekunder spilt
let playSessionStart = null; // Når denne spilløkta startet

let menuOpen = false;


// === Kart: Lokasjoner og visning ===
const mapData = [
  { name: "Spenningsbyen", x: 20, y: 20, type: "city", color: "dodgerblue" },
  { name: "Path-1", x: 35, y: 20, type: "road", color: "#8B4513" },
  { name: "Path-1", x: 50, y: 20, type: "road", color: "#8B4513" },
  { name: "Path-1", x: 65, y: 20, type: "road", color: "#8B4513" },
  { name: "Path-1", x: 80, y: 20, type: "road", color: "#8B4513" },
  { name: "Yurborg", x: 95, y: 20, type: "city", color: "dodgerblue" },
  
];

// === Tiles ===
const tileImages = {
  grass: new Image(),
  coblestone: new Image(),
  tree: new Image(),
  brick: new Image(),
  roof: new Image(),
  plank: new Image(),
  fence: new Image(),
  table: new Image(),
  door: new Image(),
  water: new Image(),
  sand: new Image(),
  stoneSingle: new Image(),
  campfire: new Image(),
  stonepath: new Image(),
  voidgate: new Image()
};

tileImages.grass.src = 'images/tiles/grassTile.png';
tileImages.tree.src = 'images/tiles/treeTile.png';
tileImages.brick.src = 'images/tiles/brickTile.png';
tileImages.roof.src = 'images/tiles/roofTile.png';
tileImages.plank.src = 'images/tiles/plankTile.png';
tileImages.door.src = 'images/tiles/doorTile.png';
tileImages.fence.src = 'images/tiles/fenceTile.png';
tileImages.table.src = 'images/tiles/tableTile.png';
tileImages.coblestone.src = 'images/tiles/coblestoneTile.png';
tileImages.water.src = 'images/tiles/waterTile.png';
tileImages.sand.src = 'images/tiles/sandPathTile.png';
tileImages.stoneSingle.src = 'images/tiles/stoneSingleTile.png';
tileImages.campfire.src = 'images/tiles/campfireStill.png';
tileImages.stonepath.src = 'images/tiles/stonePathTile.png';
tileImages.voidgate.src = 'images/tiles/voidgateTile.png';

const nonWalkableTiles = ['tree', 'brick', 'fence', 'table', 'water', 'stoneSingle','campfire'];
const tilesAbovePlayer = ['roof', 'tree'];

const tileMapping = {
  'G': 'grass',
  'C': 'coblestone',
  'T': 'tree',
  'B': 'brick',
  'R': 'roof',
  'P': 'plank',
  'F': 'fence',
  'F': 'fence',
  '1': 'table', 
  'D': 'door',
  'W': 'water',
  'S': 'sand',
  'p': 'stonepath',
  's': 'stoneSingle',
  'c': 'campfire',
  'V': 'voidgate',
};

const characterImages = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image(),
};

characterImages.up.src = 'images/player/man/pixelmannUp.png';
characterImages.down.src = 'images/player/man/pixelmannDown.png';
characterImages.left.src = 'images/player/man/pixelmannLeft.png';
characterImages.right.src = 'images/player/man/pixelmannRight.png';

const fishPools = {
  0: [ // Utenfor
    { name: "Grodr", rarity: "common", image: "images/creatures/vann/grodr.png", chance: 900, price: 5 },
    { name: "Grauder", rarity: "common", image: "images/creatures/vann/grauder.png", chance: 800, price: 10 },
    { name: "Albino Grodr", rarity: "rare", image: "images/creatures/vann/albinoGrodr.png", chance: 49, price: 74 },

    // { name: "Mørkål", rarity: "rare", image: "images/morkaal.png", chance: 2, price: 55 }
  ],
  2: [ // Cave
    { name: "Grodr", rarity: "common", image: "images/creatures/vann/grodr.png", chance: 900, price: 5 },
    { name: "Grauder", rarity: "common", image: "images/creatures/vann/grauder.png", chance: 800, price: 10 },
    { name: "Deep Void Lure", rarity: "legendary", image: "images/creatures/vann/deepVoidLure.png", chance: 10, price: 418 },
    { name: "Skuggosk", rarity: "rare", image: "images/creatures/vann/skuggosk.png", chance: 80, price: 42 },
  ],
  4: [ // Path-1
    { name: "Grodr", rarity: "common", image: "images/creatures/vann/grodr.png", chance: 95, price: 5 },
    { name: "Grauder", rarity: "common", image: "images/creatures/vann/grauder.png", chance: 80, price: 10 },
    { name: "Albino Grodr", rarity: "rare", image: "images/creatures/vann/albinoGrodr.png", chance: 1, price: 74 },
  ],
  5: [ // Yurborg
    { name: "Krap", rarity: "common", image: "images/creatures/vann/krap.png", chance: 900, price: 19 },
    { name: "Blue Krap", rarity: "rare", image: "images/creatures/vann/blueKrap.png", chance: 45, price: 87 },
    { name: "Albino Krap", rarity: "legendary", image: "images/creatures/vann/albinoKrap.png", chance: 7, price: 743 },
    { name: "Great White", rarity: "legendary", image: "images/creatures/vann/greatWhite.png", chance: 15, price: 217 },
    { name: "Elder Great White", rarity: "mythical", image: "images/creatures/vann/elderGreatWhite.png", chance: 4, price: 1953 },

  ],
};

const treeCreaturePools = {
  0: [ // Level 0 – Spenningsbyen
    { name: "Grey Mouse", rarity: "common", image: "images/creatures/land/mouseGrey.png", chance: 800, price: 16},
    { name: "Poisetle", rarity: "rare", image: "images/creatures/land/poisetle.png", chance: 100, price: 46 },
    { name: "Albino Mouse", rarity: "rare", image: "images/creatures/land/albinoMouse.png", chance: 60, price: 74},

  ],
  4: [ // Sti-1
    { name: "Grey Mouse", rarity: "common", image: "images/creatures/land/mouseGrey.png", chance: 800, price: 16},
    { name: "Poisetle", rarity: "rare", image: "images/creatures/land/poisetle.png", chance: 100, price: 46 },
    { name: "Albino Mouse", rarity: "rare", image: "images/creatures/land/albinoMouse.png", chance: 60, price: 74},
  ],
  5: [ // Yurborg
    { name: "Grey Mouse", rarity: "common", image: "images/creatures/land/mouseGrey.png", chance: 800, price: 16},
    { name: "Poisetle", rarity: "rare", image: "images/creatures/land/poisetle.png", chance: 100, price: 46 },
    { name: "Albino Mouse", rarity: "rare", image: "images/creatures/land/albinoMouse.png", chance: 60, price: 74},

  ],
};

const raritySettings = {
  common: { time: 6000, color: "gray", border: "gray" },
  uncommon: { time: 5000, color: "green", border: "green" },
  rare: { time: 2000, color: "blue", border: "blue" },
  legendary: { time: 1200, color: "gold", border: "gold" },
  mythical: { time: 1200, color: "purple", border: "purple" },
  secret: { time: 2500, color: "pink", border: "pink" },
};

const npcs = [
  {
    name: "Morgan the sailor",
    image: "images/npc/morganSailorDown.png",
    x: 2,
    y: 2,
    level: 1,
    type: "shop",
    dialog: ["I give a good coin in exchange of good fish!"]
  },
  {
    name: "Path Seeker Nodin",
    image: "images/player/man/pixelmannDown.png",
    x: 10,
    y: 6,
    level: 1,
    type: "lore",
    dialog: ["hail be thou! My name is Nodin!", 
      "Welcome to Spenningsbyen!",
      "This is a town located far to the north-west in the continent of Voidlore.",
      "I am a fellow Path Seeker myself, and for now i have dedicated myself to help fellow Path Seekers!",
      "I will give you a quick rundown and then off with you.",
      "You can interact with others by pressing E, like you just found out...",
      "Be sure to use your map by pressing M, to navigate through Voidlore.",
      "The fellow over there is Morgan, i dont know much about the man. But i got some gold by giving him some grodr fish!",
      "To fish you just have to go up to any lake or ocean and interact.",
      "I myself only hunt rare land creatures.",
      "Be sure to keep track of your inventory by pressing i. I like to have it open almost always, the inventory shows important info.",
      "And ofcourse press TAB to se the menu.",
      "Dont forget to save often!",
      "Last tip, you can zoom in and out after your liking for better experience.",
      "I hope our path crosses, fellow Path Seeker...",
    ]
  },
  {
    name: "Nocturne",
    image: "images/npc/nocturneDown.png",
    x: 19,
    y: 3,
    level: 0,
    type: "lore",
    dialog: ["Greeting to ya!", 
      "I have retired from searching the land after creatures. Those years are behind me.",
      "An average old man are maybe not that much to use, but i have more knowledge of these Great cave water creatures, than anyone in Voidlore!",
      "I originate from a town to the east called Yurborg, not to far away.",
      "But this cave was my old pearl.",
      "After the old moss clan invaded Yurborg city i had to leave.",
      "I took refugee here at Morgan's gatherers hub.",
      "He is a good man.",
      "You look like a happy and hopeful person yourself! Let me give you a piece of advice my friend.",
      "If you havent yet seen it. There is a trophy hanging over the door in to the cave, that is the legendary Deep Void Lure! I caught it myself.",
      "My tip was to fish in my old pear here, you will get many trophies to show off.",
      "Now.. take care mye friend."

    ]
  },
  {
    name: "Deep Void Lure",
    image: "images/creatures/vann/deepVoidLure.png",
    x: 22,
    y: 2,
    level: 0,
    type: "creature",
    dialog: ["You are not supposed to be here...",
      "And you are not supposed to know that i ca-",
      "Eh? i feel the.. you.. are.."
    ]
  },
  {
    name: "Oleander the Hunter",
    image: "images/npc/oleanderDown.png",
    x: 1,
    y: 2,
    level: 7,
    type: "shop_land",
    dialog: ["Dont touch my creatures!",
      "Have you hunted any?"
    ]
  },
  {
    name: "Voidlore Merchant",
    image: "images/npc/voidloreMerchantRight.png",
    x: 0,
    y: 0,
    level: 5,
    type: "special_shop",
    dialog: ["No one sells goods like mine!",
      "Take a look."
    ]
  },
  {
    name: "Poisetle",
    image: "images/creatures/land/poisetle.png",
    x: 5,
    y: 2,
    level: 7,
    type: "creature",
    dialog: ["SSSsSsssSssSSS",
      "SSssssSSSsss"
    ]
  },
  // Legg til flere her!
];

const npcShopItems = {
  "Voidlore Merchant": [
    {
      name: "Dock Key",
      image: "images/items/dockKey.png",
      price: 2000,
      description: "Unlocks fence to dock in Yurborg.",
      once: true // Bare én gang per spiller
    },
    {
      name: "Abyss Seekers",
      image: "images/items/book.png",
      price: 1500,
      description: "Unlocks location knowledge.",
      once: true // Bare én gang per spiller
    },
    // Flere varer kan enkelt legges til her senere
  ]
};

//KLIKKBARE ITEMS I INVENTORY
const interactableItems = {
  "The Veiled Abyss Location": {
    message: "To enter The Veiled Abyss, tp to the-veiled-abyss"
  },
  // Du kan lett legge til flere spesialgjenstander her etterpå
};

let trophies = {}; // Navn på fiskene du har fanget før

const character = {
  x: 0, y: 0,
  pixelX: 0, pixelY: 0,
  direction: 'down',
  moving: false
};

const keys = { w: false, a: false, s: false, d: false };

// === Bruk: Legg til en locked door i doorMap slik: ===
// '5,5': { targetLevel: 6, targetX: 1, targetY: 1, requires: "Void Key" }

const doorMap = {
  0: { //SPENNINGSBYEN
    '2,9': { targetLevel: 1, targetX: 10, targetY: 2 }, // TIL HUS
    '22,3': { targetLevel: 2, targetX: 5, targetY: 1 },  // TIL CAVE
    '23,5': { targetLevel: 4, targetX: 1, targetY: 3 }  // TIL STI-1
  },
  1: { //HUS HUB SPENNINGSBYEN
    '10,1': { targetLevel: 0, targetX: 2, targetY: 10 }, // TIL UTE 
    '7,1': { targetLevel: 3, targetX: 7, targetY: 6 } // TIL TROFEROM
  },
  2: { //CAVE1 SPENNINGSBYEN
    '5,0': { targetLevel: 0, targetX: 22, targetY: 4 }  // TIL UTE 
  },
  3: { //TROFEROM HUS HUB SPENNINGSBYEN
    '7,7': { targetLevel: 1, targetX: 7, targetY: 2 }  // TIL HUS HUB
  },
  4: { //STI-1
    '0,3': { targetLevel: 0, targetX: 22, targetY: 5 },  // TIL SPENNINGSBYEN
    '23,3': { targetLevel: 5, targetX: 1, targetY: 5 }  // TIL YURBORG
  },
  5: { //YURBORG
    '0,5': { targetLevel: 4, targetX: 22, targetY: 3 },  // TIL STI-1
    '25,10': { targetLevel: 7, targetX: 7, targetY: 5 }, // TIL GATHERERS HUB 
    //'5,5': { targetLevel: 0, targetX: 22, targetY: 5 }  // TIL CASINO-1
  },
  6: { //CASINO-1
    '5,5': { targetLevel: 5, targetX: 5, targetY: 2 }  // TIL YURBORG
  },
  7: { //GATHERERS HUB YURBORG
    '7,6': { targetLevel: 5, targetX: 25, targetY: 11 }  // TIL YURBORG
  }
};

const levels = [
  {
    //Spenningsbyen "0"
    layout: [
      'TTTTTTTTTTTTTTTTTTsCCCCC',
      'TGGGGGGGGGGGGGGGGGGsCRRR',
      'TGGGGGTTTTpppGGGGGGsCPPP',
      'TGGGTTTTTGpcpGGGGGGGsPDP',
      'TGGGGTTTTGpppppGGGGGGsGs',
      'TGGGGGGTTTGGpppppppppppV',
      'TRRRRGGGGGGGGpppGGGGGGGT',
      'TRRRRGTTGGGGGGpGGGGGGGGT',
      'TBBBBTTTTTTGGGpGGGGGSSSS',
      'TBDBBFFFFFGppppGGGGSWWWW',
      'TpppppppppppGGGGGGSWWWWW',
      'TTTTTTTTTTTTTTTTTSWWWWWW'
    ],
    startX: 4,
    startY: 10,
    background: 'grass'
  },
  {
    //GATHERERS HUB "1"
    layout: [
      'BBBBBBBBBBBB',
      'BBBBBBBDBBDB',
      'BPPPPPPPPPPB',
      'B111PPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB'
    ],
    startX: 5,
    startY: 5,
    background: 'plank'
  },
  {
    // DEEP VOID CAVE SPENNINGSBYEN "2"
    layout: [
      'CCsssVssCsWW',
      'CsCssCCsCCsW',
      'CsCCCCCCCCCC',
      'CCCsCCCCCCsC',
      'CsCsssCCCCsC',
      'CCCCsCCssCsC',
      'CCCCsCCCCCsC',
      'CCCCsCCCCCCC'
    ],
    startX: 5,
    startY: 5,
    background: 'coblestone'
  },
  {
    // HUS HUB TROFE ROM "3"
    layout: [
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BPPPPPPPPPPB',
      'BBBBBBBDBBBB'
    ],
    startX: 5,
    startY: 5,
    background: 'plank'
  },
  {
    // STI-1 "4"
    layout: [
      'TTTTTTTTTTTTTWWWTTTTTTTT',
      'TTTGGppppGGTTWWWGGTTTGGT',
      'TGGGppGGppGGTWWWGGGGGGGT',
      'VppppGTTGpppGWWWFFFFFppV',
      'TGGGGTTTTGGppPPPppGGppGT',
      'TGGGTTTTTTGGpPPPpppppGGT',
      'TTTTTTTTTTTTTWWWTTTTTTTT'
    ],
    startX: 5,
    startY: 5,
    background: 'grass'
  },
  {
    //YURBORG "5"
    layout: [
      'G1GGGTTTTTTTTTTTTRRRRRRRRRRR',
      'G1GGGGGGTTTTTTTTGRRRRRRRRRRR',
      'GGGGGGGGGGGTTTGGGBBBBBBBBBBB',
      'GGGGGGGGGGGGGGGGGBBBBBBBBBBB',
      'GGGGGGGGGGGGpppGGGGGGGGGGGGG',
      'VppppppppGGppGppGGGppppppGGG',
      'GGGGGGGGppppGGGpppppGGGGGGGG',
      'GGGGGGGGGGGppGppGGGGGGGRRRRR',
      'GGGGGGGGGGGGpppppppGGGGRRRRR',
      'GTTGGGGGGGGGGpGGGGppGGGBBBBB',
      'TTTTGGGGGGGGppGGGGGpppGBBDBB',
      'TTTTTTGGGGGGpGGGGGGGGppppppp',
      'TTTTTTTTGGGGpGGGGGGGGGGGGGGG',
      'TTTTTTTTTTTTFTTTTTTTTTTTTTTT',
      'WWWWWWWWWWWPPPWWWWWWWWWWWWWW',
      'WWWWWWWWWWWPPPWWWWWWWWWWWWWW',
      'WWWWWWWWWPPPPPPPWWWWWWWWWWWW',
      'WWWWWWWWWPPPPPPPWWWWWWWWWWWW',
      'WWWWWWWWWWWPPPWWWWWWWWWWWWWW'
    ],
    startX: 4,
    startY: 4,
    background: 'grass'
  },
  {
    // CASINO YURBORG "6"
    layout: [
      'BBBBBBBBBBBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBBBBBBBBBBB',
      'BPPPPPPPPPPPPPPPPPPPPPPB',
      'BPPPPPPPPPPPPPPPPPPPPPPB',
      'BPPPPPPPPPPPPPPPPPPPPPPB',
      'BPPPPPPPPPPPPPPPPPPPPPPB',
      'BPPPPVPPPPPPPPPPPPPPPPPB'
    ],
    startX: 5,
    startY: 5,
    background: 'plank'
  },
  {
    // GATHERERS HUB YURBORG "7"
    layout: [
      'BBBBBBBBBBBBBBB',
      'BBBBBBBBBBBBBBB',
      'BPPPPPPPPPPPPPB',
      'B11PPPPPPPPPPPB',
      'BPPPPPPPPPPPPPB',
      'BPPPPPPPPPPPPPB',
      'BPPPPPPVPPPPPPB'
    ],
    startX: 3,
    startY: 3,
    background: 'plank'
  },
  {
    // VEILED ABYSS "8"
    layout: [
      'CCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCC',
      'CCCCCCCCCCCCCCCCWWWWWWWCCCCCCCCCCCCC'
    ],
    startX: 5,
    startY: 5,
    background: 'coblestone'
  },
  
];

const levelNamesToIndex = {
  "spenningsbyen": 0,
  "gatherers-hub": 1,
  "deep-void-cave": 2,
  "trophyroom": 3,
  "path-1": 4,
  "yurborg": 5,
  "casino": 6,
  "gatherers-hub-yurborg": 7,
  
  // Hemmelig nivå:
  "the-veiled-abyss": 8 // <- hemmelig!
};

const levelDefinitions = {
  "spenningsbyen":      { index: 0,  x: 4,  y: 10 },
  "gatherers-hub":      { index: 1,  x: 5,  y: 5 },
  "deep-void-cave":     { index: 2,  x: 5,  y: 5 },
  "trophyroom":         { index: 3,  x: 5,  y: 5 },
  "path-1":             { index: 4,  x: 2,  y: 3 },
  "yurborg":            { index: 5,  x: 4,  y: 4 },
  "casino":             { index: 6,  x: 5,  y: 5 },
  "gatherers-hub-yurborg": { index: 7, x: 3, y: 3 },

  // Hemmelig nivå
  "the-veiled-abyss":   { index: 8,  x: 2,  y: 2 },
};

// ================== QUESTER ==================



// ========= LYD =========
const sounds = {
  music: {
    0: new Audio("musikk/introVoidQuestMusic.wav"),
    //1: new Audio("musikk/music_house.mp3"),
    //2: new Audio("musikk/music.wav"),
    //3: new Audio("musikk/music.wav"),
    //4: new Audio("musikk/sti1Musikk.wav"),
    5: new Audio("musikk/yurborgMusic.wav"),

  },
  sfx: {
    startFishing: new Audio("lyder/kasteFiskeStang.wav"),
    gotBite: new Audio("lyder/fiskNapper.wav"),
    catchSuccess: new Audio("lyder/fangetFisk.wav"),
    catchFail: new Audio("lyder/mistetFisk.wav")
  }
};

let masterVolume = 0.5;

const savedVolume = localStorage.getItem('voidquest_volume');
if (savedVolume !== null) {
  masterVolume = parseFloat(savedVolume);
}

function toggleSettings() {
  const settings = document.getElementById('settingsMenu');
  settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
}

function confirmDeleteSave() {
  const confirmDelete = confirm("Are you sure you want to delete your character save?");
  if (confirmDelete) {
    deleteSave();
  }
}

function deleteSave() {
  localStorage.removeItem('voidquest_save');
  localStorage.removeItem('voidquest_volume');
  alert("Your save has been deleted. The game will now restart.");
  location.reload(); // Starter spillet på nytt
}

function updateVolume(value) {
  masterVolume = parseFloat(value);

  // Juster volum på alle lyder og musikk
  Object.values(sounds.music).forEach(audio => {
    audio.volume = masterVolume;
  });

  Object.values(sounds.sfx).forEach(audio => {
    audio.volume = masterVolume;
  });

  // Lagre volumvalg i localStorage
  localStorage.setItem('voidquest_volume', masterVolume);
}

// ========= LYD FERDIG =========
let currentMusic = null;

let currentLevel = 0, map = [], mapWidth = 0, mapHeight = 0;
let currentBackground = 'grass';

let isFishing = false;
let fishingBox = null;
let fishTimeout = null;
let biteTimeout = null;
let currentFish = null;
let fishCaught = false;

let inventory = [];
let inventoryOpen = false;
let gold = 0;

function loadLevel(levelIndex, startX = null, startY = null) {
  const levelNames = {
    0: "Spenningsbyen",
    1: "Gatherers hub",
    2: "Deep-Void-Cave",
    3: "Trophyroom",
    4: "Path-1",
    5: "Yurborg",
    6: "Casino",
    7: "Gatherers-hub-Yurborg",
    8: "The-Veiled-Abyss",
  };
  
  const level = levels[levelIndex];
  currentLevel = levelIndex;

  const locationLabel = document.getElementById("locationLabel");
  locationLabel.innerText = levelNames[levelIndex] || `Område ${levelIndex}`;

  if (currentMusic) {
    currentMusic.pause();
    currentMusic.currentTime = 0;
  }

  currentMusic = sounds.music[levelIndex];
  if (currentMusic) {
    currentMusic.loop = true;
    currentMusic.volume = masterVolume;
    currentMusic.play();
  }

  map = level.layout.map(row => row.split('').map(char => tileMapping[char]));
  mapHeight = map.length;
  mapWidth = map[0].length;

  canvas.width = mapWidth * tileSize;
  canvas.height = mapHeight * tileSize;

  currentBackground = level.background || 'grass';

  character.x = startX !== null ? startX : level.startX;
  character.y = startY !== null ? startY : level.startY;

  character.pixelX = character.x * tileSize;
  character.pixelY = character.y * tileSize;

  gameLoop();
  // Fjern tidligere trofévisning hvis den finnes
  const existingTrophy = document.getElementById("trophyRoom");
  if (existingTrophy) existingTrophy.remove();

}

function drawMap() {
  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      const tileType = map[y][x];
      ctx.drawImage(tileImages[currentBackground], x * tileSize, y * tileSize, tileSize, tileSize);
      if (tileType !== 'grass') {
        ctx.drawImage(tileImages[tileType], x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
    npcs.forEach(npc => {
      if (npc.level === currentLevel) {
        const img = new Image();
        img.src = npc.image;
        ctx.drawImage(img, npc.x * tileSize, npc.y * tileSize, tileSize, tileSize);
      }
  });
}

function changeTile(levelIndex, x, y, newTileChar) {
  // Endre layout-dataen
  const row = levels[levelIndex].layout[y];
  const newRow = row.substring(0, x) + newTileChar + row.substring(x + 1);
  levels[levelIndex].layout[y] = newRow;

  // Hvis vi er på riktig nivå nå, oppdater også "map"-arrayen som brukes i spillet
  if (currentLevel === levelIndex) {
    map[y][x] = tileMapping[newTileChar];
    gameLoop(); // Tegn på nytt
  }
}

// === KARAKTERVALG ===
// Vi lagrer karaktervalg her etter character creation
let playerData = {
  gender: null,
  name: null,
  
};

// === Karaktervalgskjerm ===
function showCharacterCreation() {
  const container = document.createElement("div");
  container.id = "charCreation";
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100%";
  container.style.height = "100%";
  container.style.background = "rgba(0,0,0,0.9)";
  container.style.zIndex = "50";
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.color = "white";
  container.style.fontFamily = "monospace";

  container.innerHTML = `
    <h2>Create your character</h2>
    <label>Username: <input id="charName" /></label><br>
    <label>Gender:
      <select id="charGender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select> <br> <br>
      <button onclick="finishCharacterCreation()">Start</button> 
      <button onclick="showMainMenu();">Menu</button> 

    </label><br><br>
  `;

  document.body.appendChild(container);
}

function finishCharacterCreation() {
  const gender = document.getElementById("charGender").value;
  const name = document.getElementById("charName").value.trim();

  if (!name) {
    alert("Du må velge et navn!");
    return;
  }

  playerData.gender = gender;
  playerData.name = name;
  applyCharacterAppearance();

  document.getElementById("charCreation").remove();

  // Start spillet fra level 0
  loadLevel(1);

  // Lagre umiddelbart
  saveGame();
}

function applyCharacterAppearance() {
  if (!playerData || !playerData.gender) return;

  if (playerData.gender === 'male') {
    characterImages.up.src = 'images/player/man/pixelmannUp.png';
    characterImages.down.src = 'images/player/man/pixelmannDown.png';
    characterImages.left.src = 'images/player/man/pixelmannLeft.png';
    characterImages.right.src = 'images/player/man/pixelmannRight.png';
  } else {
    characterImages.up.src = 'images/player/woman/pixelwomanUp.png';
    characterImages.down.src = 'images/player/woman/pixelwomanDown.png';
    characterImages.left.src = 'images/player/woman/pixelwomanLeft.png';
    characterImages.right.src = 'images/player/woman/pixelwomanRight.png';
  }
}

// === Karakter tegning ===
function drawCharacter() {
  const tileUnderPlayer = map[character.y][character.x];
  const img = characterImages[character.direction];

  if (tilesAbovePlayer.includes(tileUnderPlayer)) {
    ctx.globalAlpha = 0.5; // Gjør spilleren halvveis gjennomsiktig
  }

  ctx.drawImage(img, character.pixelX, character.pixelY, tileSize, tileSize);
  ctx.globalAlpha = 1.0; // Tilbakestill for resten av canvas
}

function canMoveTo(x, y) {
  if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) return false;
  return !nonWalkableTiles.includes(map[y][x]);
}

function moveCharacter(dx, dy) {
  if (character.moving) return;

  const newX = character.x + dx;
  const newY = character.y + dy;
  if (!canMoveTo(newX, newY)) return;

  character.direction = dx === -1 ? 'left' : dx === 1 ? 'right' : dy === -1 ? 'up' : 'down';
  character.moving = true;
  character.x = newX;
  character.y = newY;

  const targetX = character.x * tileSize;
  const targetY = character.y * tileSize;
  const speed = 2;

  function animate() {
    let doneX = false, doneY = false;
    if (character.pixelX < targetX) {
      character.pixelX += speed;
      if (character.pixelX >= targetX) { character.pixelX = targetX; doneX = true; }
    } else if (character.pixelX > targetX) {
      character.pixelX -= speed;
      if (character.pixelX <= targetX) { character.pixelX = targetX; doneX = true; }
    } else { doneX = true; }

    if (character.pixelY < targetY) {
      character.pixelY += speed;
      if (character.pixelY >= targetY) { character.pixelY = targetY; doneY = true; }
    } else if (character.pixelY > targetY) {
      character.pixelY -= speed;
      if (character.pixelY <= targetY) { character.pixelY = targetY; doneY = true; }
    } else { doneY = true; }

    gameLoop();

    if (!doneX || !doneY) {
      requestAnimationFrame(animate);
    } else {
      character.moving = false;
      const tile = map[character.y][character.x];
      if (tile === 'door' || tile === 'voidgate') {
        const key = `${character.x},${character.y}`;
        const door = doorMap[currentLevel]?.[key];
        if (door) {
          // Krever nøkkel for visse dører
          if (door.requires && !hasItem(door.requires)) {
            alert("You need the " + door.requires + " to enter this area.");
            return;
          }
          loadLevel(door.targetLevel, door.targetX, door.targetY);
        }
      }
    }
  }

  requestAnimationFrame(animate);
}

function getAllUniqueCreatures() {
  const fish = Object.values(fishPools).flat();
  const land = Object.values(treeCreaturePools).flat();
  const all = [...fish, ...land];

  const seen = {};
  return all.filter(c => {
    if (seen[c.name]) return false;
    seen[c.name] = true;
    return true;
  });
}
function tryInteract() {
  if (character.moving || isFishing) return;

  let tx = character.x, ty = character.y;
  if (character.direction === 'up') ty -= 1;
  if (character.direction === 'down') ty += 1;
  if (character.direction === 'left') tx -= 1;
  if (character.direction === 'right') tx += 1;

  const tile = map[ty]?.[tx];

  // === Åpne låst gjerde hvis spiller har "Dock Key" ===
  if (currentLevel === 5 && tx === 12 && ty === 13 && tile === 'fence') {
    if (hasItem("Dock Key")) {
      changeTile(currentLevel, 12, 13, 'G'); // Bytt til 'G' = grass
    } else {
      alert("Gjerdet er låst. Du trenger en Dock Key.");
    }
    return; // Stopp videre interaksjon
  }

  const npc = npcs.find(n => n.level === currentLevel && n.x === tx && n.y === ty);
  if (npc) return startNPCInteraction(npc);

  if (tile === 'water') return startFishing();
  if (tile === 'tree') return startTreeHunt(); 

  if (tile === 'npcShop') return openShop();
}

function startNPCInteraction(npc) {
  const dialogBox = document.createElement("div");
  dialogBox.id = "npcDialog";
  dialogBox.style.position = "absolute";
  dialogBox.style.bottom = "50px";
  dialogBox.style.left = "50%";
  dialogBox.style.transform = "translateX(-50%)";
  dialogBox.style.background = "#222";
  dialogBox.style.color = "white";
  dialogBox.style.border = "2px solid #888";
  dialogBox.style.padding = "20px";
  dialogBox.style.fontFamily = "monospace";
  dialogBox.style.zIndex = 20;
  dialogBox.style.width = "400px";

  let dialogIndex = 0;

  function renderDialog() {
    dialogBox.innerHTML = `
      <div style="display: flex; gap: 10px; align-items: center;">
        <img src="${npc.image}" width="48" height="48">
        <strong>${npc.name}</strong>
      </div>
      <p style="margin-top: 10px;">${npc.dialog[dialogIndex]}</p>
      <button id="nextDialogBtn">Next</button>
    `;

    dialogBox.querySelector("#nextDialogBtn").onclick = () => {
      dialogIndex++;
      if (dialogIndex >= npc.dialog.length) {
        document.body.removeChild(dialogBox);
        if (npc.type === "shop") {
          openShop("water");
        } else if (npc.type === "shop_land") {
          openShop("land");
        } else if (npc.type === "special_shop") {
          openSpecialShop(npc.name); 
        }
      } else {
        renderDialog();
      }
    };
  }

  renderDialog();
  document.body.appendChild(dialogBox);
}

function startTreeHunt() {
  isFishing = true; // bruk samme flagg for nå
  fishCaught = false;

  showFishingBox("Searching the tree...");
  const wait = Math.floor(Math.random() * 8000) + 2000;
  fishTimeout = setTimeout(treeCreatureAppears, wait);
}

function treeCreatureAppears() {
  currentFish = getRandomTreeCreature();
  startCatchMinigame(currentFish, false); // false = er landdyr
}

function getRandomTreeCreature() {
  const pool = treeCreaturePools[currentLevel] || [];

  const totalChance = pool.reduce((sum, c) => sum + c.chance, 0);
  const roll = Math.random() * totalChance;
  let sum = 0;

  for (const creature of pool) {
    sum += creature.chance;
    if (roll < sum) return creature;
  }

  return { name: "???", rarity: "secret", image: "images/defaultTree.png", price: 0 };
}

function startFishing() {
  isFishing = true;

  if (sounds.sfx.startFishing) sounds.sfx.startFishing.play();

  fishCaught = false;
  showFishingBox("Fishing...");
  const wait = Math.floor(Math.random() * 8000) + 2000;
  fishTimeout = setTimeout(fishGotBite, wait);
}

function showFishingBox(text) {
  if (!fishingBox) {
    fishingBox = document.createElement('div');
    fishingBox.id = 'fishingBox';
    fishingBox.style.position = 'absolute';
    fishingBox.style.bottom = '50px';
    fishingBox.style.left = '50%';
    fishingBox.style.transform = 'translateX(-50%)';
    fishingBox.style.background = '#333';
    fishingBox.style.color = '#fff';
    fishingBox.style.padding = '10px';
    fishingBox.style.border = '2px solid #aaa';
    fishingBox.style.fontFamily = 'monospace';
    fishingBox.style.zIndex = '10';
    document.body.appendChild(fishingBox);
  }
  fishingBox.innerHTML = `${text}<br><button onclick="cancelFishing()">Avbryt</button>`;
}

function hideFishingBox() {
  if (fishingBox) {
    document.body.removeChild(fishingBox);
    fishingBox = null;
  }
}

function cancelFishing() {
  clearTimeout(fishTimeout);
  clearTimeout(biteTimeout);
  hideFishingBox();
  isFishing = false;
}

function fishGotBite() {
  currentFish = getRandomFish();
  if (sounds.sfx.gotBite) sounds.sfx.gotBite.play();

  startCatchMinigame(currentFish, true); // true = er vann/fiske
}

function startCatchMinigame(creature, isWater) {
  const settings = raritySettings[creature.rarity] || { time: 4000, color: "white" };
  const totalTime = settings.time;
  const color = settings.color;

  fishCaught = false;
  let successZoneStart = 0.45;
  let successZoneEnd = 0.55;

  fishingBox.innerHTML = `
    <div style="margin-bottom: 10px;">
      <div style="border: 2px solid ${color}; padding: 4px; display:inline-block;">
        <img src="${creature.image}" width="64" height="64" alt="${creature.name}">
      </div>
      <div>${creature.name}</div>
    </div>
    <div style="margin-bottom: 10px;">Press [Space] when the bar is on the line!</div>
    <div id="biteTimerBar" style="width: 100%; height: 20px; background: #222; margin-top: 10px; position: relative;">
      <div id="catchZone" style="position: absolute; top: 0; left: 45%; width: 10%; height: 100%; background: #fff2; border-left: 2px solid ${color}; border-right: 2px solid ${color}; z-index: 1;"></div>
      <div id="biteTimerFill" style="position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: ${color}; z-index: 2;"></div>
    </div>
  `;

  const fill = document.getElementById("biteTimerFill");
  let elapsed = 0;
  const interval = 20;

  function onKeyDown(event) {
    if (event.code === "Space" && !fishCaught) {
      const progress = elapsed / totalTime;
      if (progress >= successZoneStart && progress <= successZoneEnd) {
        fishCaught = true;
        showFishingBox(`You caught a ${creature.name}!`);
        addToInventory(creature);
        if (sounds.sfx.catchSuccess) sounds.sfx.catchSuccess.play();
      } else {
        fishCaught = true;
        showFishingBox("Oh you failed! The creature fleed.");
        if (sounds.sfx.catchFail) sounds.sfx.catchFail.play();
      }
      document.removeEventListener("keydown", onKeyDown);
      clearInterval(countdown);
      setTimeout(cancelFishing, 1500);
    }
  }

  document.addEventListener("keydown", onKeyDown);

  const countdown = setInterval(() => {
    if (fishCaught) {
      clearInterval(countdown);
      document.removeEventListener("keydown", onKeyDown);
      return;
    }

    elapsed += interval;
    const progress = elapsed / totalTime;
    fill.style.width = (progress * 100) + "%";

    if (elapsed >= totalTime) {
      clearInterval(countdown);
      document.removeEventListener("keydown", onKeyDown);
      showFishingBox("You didnt react in time!");
      if (sounds.sfx.catchFail) sounds.sfx.catchFail.play();
      setTimeout(cancelFishing, 1200);
    }
  }, interval);
}


function tryCatchFish(choice) {
  if (currentFish && currentFish.rarity === choice) {
    showFishingBox(`Du fanget en ${currentFish.name}!`);
    if (sounds.sfx.catchSuccess) sounds.sfx.catchSuccess.play();
    addToInventory(currentFish);
  } else {
    showFishingBox("Bom! Du mistet fisken.");
    if (sounds.sfx.catchFail) sounds.sfx.catchFail.play();
  }
  fishCaught = true;
  setTimeout(cancelFishing, 2000);
}

function getRandomFish() {
  const pool = fishPools[currentLevel] || [];

  const totalChance = pool.reduce((sum, fish) => sum + fish.chance, 0);
  const roll = Math.random() * totalChance;
  let sum = 0;

  for (const fish of pool) {
    sum += fish.chance;
    if (roll < sum) {
      return {
        name: fish.name,
        rarity: fish.rarity,
        image: fish.image,
        price: fish.price
      };
    }
  }

  return { name: "???", rarity: "secret", image: "images/creatures/vann/defaultFish.png", price: 0 };
}

function addToInventory(fish) {
  let item = inventory.find(i => i.name === fish.name);
  if (item) {
    item.count += 1;
  } else {
    inventory.push({ ...fish, count: 1 });
  }

  // Legg til i trophies hvis det er første gang du fanger denne
  if (!trophies[fish.name]) {
    const now = new Date();
    const formatted = now.getFullYear() + "-" +
                      String(now.getMonth() + 1).padStart(2, '0') + "-" +
                      String(now.getDate()).padStart(2, '0') + " " +
                      String(now.getHours()).padStart(2, '0') + ":" +
                      String(now.getMinutes()).padStart(2, '0');
  
    trophies[fish.name] = formatted;
  }

  if (inventoryOpen) renderInventory();
}

//removeItem("Void Key"); hvis du skal bruke den til noe annet
function removeItem(name) {
  const index = inventory.findIndex(i => i.name === name);
  if (index !== -1) {
    inventory[index].count--;
    if (inventory[index].count <= 0) {
      inventory.splice(index, 1);
    }
    if (inventoryOpen) renderInventory();
  }
}

function hasItem(name) {
  return inventory.some(i => i.name === name);
}

function openSpecialShop(npcName) {
  const shopBox = document.getElementById('shopBox');
  const items = npcShopItems[npcName] || [];
  const ownedItems = inventory.map(i => i.name);

  let html = `<h3>${npcName}</h3><p>Choose wisely...</p>`;

  const filtered = items.filter(item => !(item.once && ownedItems.includes(item.name)));

  if (filtered.length === 0) {
    html += `<p>You already own everything I have...</p>`;
  } else {
    filtered.forEach(item => {
      html += `<div style="margin-bottom:10px;">
        <img src="${item.image}" width="32" height="32"> <strong>${item.name}</strong><br>
        <small>${item.description}</small><br>
        <button onclick="buySpecialItem('${npcName}', '${item.name}', ${item.price})">
          Buy for ${item.price} gold
        </button>
      </div>`;
    });
  }

  html += `<br><button onclick="closeShop()">Leave</button>`;
  shopBox.innerHTML = html;
  shopBox.style.display = 'block';
}

function buySpecialItem(npcName, itemName, price) {
  const item = npcShopItems[npcName].find(i => i.name === itemName);
  if (!item) return;

  if (gold < price) {
    alert("You can't afford that.");
    return;
  }

  gold -= price;
  inventory.push({ ...item, count: 1 });
  if (inventoryOpen) renderInventory();
  saveGame();
  openSpecialShop(npcName); // Refresh shop
}

let currentShopType = "water";

function openShop(type = "water") {
  currentShopType = type;
  const shopBox = document.getElementById('shopBox');
  let shopHTML = `<h3 style="font-family: Cursive;"></h3><p>This is my prices:</p>`;
  let hasFish = false;

  inventory.forEach(item => {
    const creaturePools = type === "water" ? fishPools : treeCreaturePools;
    const allCreatures = Object.values(creaturePools).flat();
    const creatureInfo = allCreatures.find(c => c.name === item.name);
    
    if (creatureInfo) {
      hasFish = true;
      shopHTML += `<button onclick="sellFish('${item.name}', ${creatureInfo.price})">Sell ${item.name} (${creatureInfo.price} gold)</button><br>`;
    }
  });

  if (!hasFish) {
    shopHTML += `<p>You dont have any creatures, off you go!.</p>`;
  }

  shopHTML += `<br><button onclick="closeShop()">Cancel</button>`;
  shopBox.innerHTML = shopHTML;
  shopBox.style.display = 'block';
}

function closeShop() {
  document.getElementById('shopBox').style.display = 'none';
}

function sellFish(fishName, price) {
  const itemIndex = inventory.findIndex(i => i.name === fishName);
  if (itemIndex !== -1) {
    inventory[itemIndex].count--;
    gold += price;
    if (inventory[itemIndex].count <= 0) {
      inventory.splice(itemIndex, 1);
    }
    renderInventory();
    openShop(currentShopType); // Refresh shop UI
  }
}

let showMap = false;
const mouse = { x: 0, y: 0 };
let hoveredLocation = null;

canvas.addEventListener("mousemove", (e) => {
  if (!showMap) return;
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;

  gameLoop(); 
});

function renderWorldMap() {
  const mapX = canvas.width - 200 - 20;
  const mapY = 10;
  const mapWidth = 200;
  const mapHeight = 200;

  ctx.fillStyle = "#111";
  ctx.fillRect(mapX, mapY, mapWidth, mapHeight);
  ctx.strokeStyle = "#888";
  ctx.strokeRect(mapX, mapY, mapWidth, mapHeight);

  hoveredLocation = null;

  mapData.forEach(loc => {
    const lx = mapX + loc.x;
    const ly = mapY + loc.y;
    const size = loc.type === "city" ? 10 : 6;
    const shape = loc.type === "city" ? "rect" : "circle";

    const isHovered = (
      mouse.x >= lx - size && mouse.x <= lx + size &&
      mouse.y >= ly - size && mouse.y <= ly + size
    );

    if (isHovered) hoveredLocation = loc.name;

    ctx.fillStyle = loc.color;
    if (shape === "rect") {
      ctx.fillRect(lx - size / 2, ly - size / 2, size, size);
    } else {
      ctx.beginPath();
      ctx.arc(lx, ly, size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  if (hoveredLocation) {
    ctx.fillStyle = "#fff";
    ctx.font = "12px monospace";
    ctx.fillText(hoveredLocation, mapX + 5, mapY + mapHeight - 5);
  }
}

document.addEventListener("keydown", (e) => {
  if (document.activeElement.tagName === "INPUT") return;
  if (e.key === "m") {
    showMap = !showMap;
    gameLoop();
  }
});

// === Overstyr gameLoop med kart ===
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawCharacter();
  if (showMap) renderWorldMap();
}


function renderInventory() {
  const inv = document.getElementById('inventory');
  inv.innerHTML = `<h3 style="color:white;font-family: Cursive;">Inventory (${playerData.name})</h3><p style="color:gold;font-family: Cursive;">Gold: ${gold}</p>`;  
  
  let hoverInfoBox = document.getElementById("hoverInfoBox");
  if (!hoverInfoBox) {
    hoverInfoBox = document.createElement("div");
    hoverInfoBox.id = "hoverInfoBox";
    hoverInfoBox.style.position = "fixed";
    hoverInfoBox.style.pointerEvents = "none";
    hoverInfoBox.style.background = "#222";
    hoverInfoBox.style.border = "1px solid #999";
    hoverInfoBox.style.color = "white";
    hoverInfoBox.style.padding = "8px";
    hoverInfoBox.style.fontFamily = "monospace";
    hoverInfoBox.style.zIndex = "1000";
    hoverInfoBox.style.display = "none";
    document.body.appendChild(hoverInfoBox);
  }

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(5, 64px)';
  grid.style.gap = '8px';

  inventory.forEach(item => {
    const cell = document.createElement('div'); 
    const rarity = raritySettings[item.rarity];
    const borderColor = rarity ? rarity.border : "#666";

    cell.style.width = '64px';
    cell.style.height = '64px';
    cell.style.background = '#111';
    cell.style.border = `2px solid ${borderColor}`;
    cell.style.display = 'flex';
    cell.style.flexDirection = 'column';
    cell.style.alignItems = 'center';
    cell.style.justifyContent = 'center';

    cell.onmousemove = (e) => {
      const rarityData = raritySettings[item.rarity];
      const rarityColor = rarityData ? rarityData.color : "#fff";
      const caughtDate = trophies[item.name] || "Unknown";
      hoverInfoBox.innerHTML = `
        <strong style="color:${rarityColor}">${item.name}</strong><br>
        <span>Rarity: <span style="color:${rarityColor}">${item.rarity}</span></span><br>
        <span>Price: ${item.price} gold</span><br>
        <span style="color:gray;">First caught: ${caughtDate}</span>
      `;
      hoverInfoBox.style.display = "block";
      hoverInfoBox.style.left = (e.clientX + 15) + "px";
      hoverInfoBox.style.top = (e.clientY + 15) + "px";
    };

    cell.onmouseleave = () => {
      hoverInfoBox.style.display = "none";
    };

    cell.innerHTML = `<img src="${item.image}" width="32" height="32"><div style="color:white;">x${item.count}</div>`;
    if (interactableItems[item.name]) {
      cell.style.cursor = "pointer";
      cell.onclick = () => {
        showItemDialog(item.name);
      };
    }
    grid.appendChild(cell);
  });

  inv.appendChild(grid);
}

function toggleInventory() {
  inventoryOpen = !inventoryOpen;
  document.getElementById('inventory').style.display = inventoryOpen ? 'block' : 'none';
  if (inventoryOpen) renderInventory();
}

function showItemDialog(itemName) {
  const data = interactableItems[itemName];
  if (!data) return;

  const existing = document.getElementById("itemDialog");
  if (existing) existing.remove();

  const box = document.createElement("div");
  box.id = "itemDialog";
  box.style.position = "absolute";
  box.style.top = "50%";
  box.style.left = "50%";
  box.style.transform = "translate(-50%, -50%)";
  box.style.background = "#111";
  box.style.border = "2px solid #888";
  box.style.padding = "20px";
  box.style.color = "white";
  box.style.fontFamily = "monospace";
  box.style.zIndex = 9999;
  box.style.maxWidth = "400px";
  box.style.textAlign = "center";

  box.innerHTML = `
    <h3>${itemName}</h3>
    <p>${data.message}</p>
    <br>
    <button onclick="document.getElementById('itemDialog').remove()">Close</button>
  `;

  document.body.appendChild(box);
}

document.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === "INPUT") return;
  if (character.moving) return;
  switch (e.key) {
    case 'w': moveCharacter(0, -1); break;
    case 's': moveCharacter(0, 1); break;
    case 'a': moveCharacter(-1, 0); break;
    case 'd': moveCharacter(1, 0); break;
    case 'e': tryInteract(); break;
    case 'i': toggleInventory(); break;
    case 'c': showCharacterInfo(); break;

  }
});

document.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === "INPUT") return;
  if (e.key === 'Tab') {
    e.preventDefault();
    toggleMenu();
  }
});

function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('gameMenu').style.display = menuOpen ? 'flex' : 'none';
}

function closeMenu() {
  menuOpen = false;
  document.getElementById('gameMenu').style.display = 'none';
}

function saveGame() {
  const saveData = {
    character: playerData,
    inventory,
    trophies,
    gold,
    level: currentLevel,
    position: {
      x: character.x,
      y: character.y,
      direction: character.direction
    },
    playerLevel,
    playerXP,
    xpToNextLevel,
    playTime: totalPlayTime
  };

  if (playSessionStart) {
    totalPlayTime += Date.now() - playSessionStart;
    playSessionStart = Date.now(); // restart måling for neste økt
  }

  localStorage.setItem('voidquest_save', JSON.stringify(saveData));
  alert("Spillet er lagret!");
}

function loadGame() {
  try {
    const saved = localStorage.getItem('voidquest_save');
    if (saved) {
      const data = JSON.parse(saved);
      totalPlayTime = data.playTime || 0;
      playSessionStart = Date.now();
      inventory = data.inventory || [];
      trophies = data.trophies || [];
      gold = data.gold || 0;

      playSessionStart = Date.now();

      // Last nivå og XP
      playerLevel = data.playerLevel || 1;
      playerXP = data.playerXP || 0;

      xpToNextLevel = Math.floor(100 * Math.pow(1.25, playerLevel - 1)); // beregn riktig threshold

      const level = data.level ?? 0;
      const x = data.position?.x ?? levels[level].startX;
      const y = data.position?.y ?? levels[level].startY;
      const dir = data.position?.direction ?? 'down';

      character.direction = dir;
      loadLevel(level, x, y);
      renderInventory();
      updateXPUI(); // oppdater UI etter load
      updateXPBar();
    } else {
      loadLevel(0);
    }
  } catch (e) {
    console.error("Feil ved lasting av lagring:", e);
    loadLevel(0);
  }
}

// === Troféjournal ===
let trophyJournalOpen = false;
let currentTrophyType = "water";

function toggleTrophyJournal() {
  trophyJournalOpen = !trophyJournalOpen;
  const existing = document.getElementById("trophyJournal");
  if (existing) {
    existing.remove();
    return;
  }
  renderTrophyJournal();
}

function getUniqueCreaturesFromList(list, showSecrets = false) {
  const seen = new Set();
  return list.filter(creature => {
    if (seen.has(creature.name)) return false;
    if (creature.rarity === "secret" && !showSecrets && !trophies[creature.name]) return false;
    seen.add(creature.name);
    return true;
  });
}

function renderTrophyJournal() {
  const rawFish = Object.values(fishPools).flat();
  const rawLand = Object.values(treeCreaturePools).flat();
  const allFish = getUniqueCreaturesFromList(rawFish, true);
  const allLand = getUniqueCreaturesFromList(rawLand, true);

  //Sorterer journal skapninger etter rarity
  //Og fultrerer ut secret rarity
  const fullList = currentTrophyType === "water" ? allFish : allLand;

  const list = fullList
    .filter(creature => creature.rarity !== "secret" || trophies[creature.name])
    .slice()
    .sort((a, b) => {
      const order = { common: 1, rare: 2, legendary: 3, mythical: 4, secret: 5 };
      return (order[a.rarity] || 99) - (order[b.rarity] || 99);
    });

  // === INFOBOKS hover ===
  let hoverInfoBox = document.getElementById("hoverInfoBox");
  if (!hoverInfoBox) {
    hoverInfoBox = document.createElement("div");
    hoverInfoBox.id = "hoverInfoBox";
    hoverInfoBox.style.position = "fixed";
    hoverInfoBox.style.pointerEvents = "none";
    hoverInfoBox.style.background = "#222";
    hoverInfoBox.style.border = "1px solid #999";
    hoverInfoBox.style.color = "white";
    hoverInfoBox.style.padding = "8px";
    hoverInfoBox.style.fontFamily = "monospace";
    hoverInfoBox.style.zIndex = "1000";
    hoverInfoBox.style.display = "none";
    document.body.appendChild(hoverInfoBox);
  }

  const journal = document.createElement("div");
  journal.id = "trophyJournal";
  journal.style.position = "absolute";
  journal.style.top = "50px";
  journal.style.left = "50%";
  journal.style.transform = "translateX(-50%)";
  journal.style.background = "#111";
  journal.style.border = "2px solid #888";
  journal.style.padding = "20px";
  journal.style.zIndex = "30";
  journal.style.color = "white";
  journal.style.fontFamily = "monospace";
  journal.style.textAlign = "center";

  const caught = list.filter(c => trophies[c.name]).length;

  const buttons = `
    <button onclick="currentTrophyType='water'; toggleTrophyJournal(); toggleTrophyJournal()">Water</button>
    <button onclick="currentTrophyType='land'; toggleTrophyJournal(); toggleTrophyJournal()">Land</button>
  `;

  const title = `<h3>${currentTrophyType === 'water' ? 'Fisker' : 'Land skapninger'} (${caught}/${list.length})</h3>`;

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(6, 64px)";
  grid.style.gap = "12px";
  grid.style.marginTop = "12px";

  list.forEach(creature => {
    const hasCaught = trophies[creature.name];

    const cell = document.createElement("div");
    cell.style.width = "64px";
    cell.style.height = "64px";
    cell.style.background = "#222";
    const rarity = raritySettings[creature.rarity];
    const borderColor = hasCaught && rarity ? rarity.border : "#444";
    cell.style.border = `2px solid ${borderColor}`;
    cell.style.display = "flex";
    cell.style.alignItems = "center";
    cell.style.justifyContent = "center";

    const img = document.createElement("img");

    cell.onmousemove = (e) => {
      const rarityData = raritySettings[creature.rarity];
      const rarityColor = rarityData ? rarityData.color : "#fff";
    
      let html = `<strong style="color:${rarityColor}">${hasCaught ? creature.name : "???"}</strong><br>`;
      html += `<span>Rarity: <span style="color:${rarityColor}">${creature.rarity}</span></span><br>`;
      if (hasCaught) {
        const caughtDate = trophies[creature.name];
        html += `Price: ${creature.price} gold<br>`;
        html += `<span style="color:gray;">First caught: ${caughtDate}</span>`;
      }
      hoverInfoBox.innerHTML = html;
      hoverInfoBox.style.display = "block";
      hoverInfoBox.style.left = (e.clientX + 15) + "px";
      hoverInfoBox.style.top = (e.clientY + 15) + "px";
    };
    
    cell.onmouseleave = () => {
      hoverInfoBox.style.display = "none";
    };

    img.src = creature.image;
    img.width = 48;
    img.height = 48;
    img.title = hasCaught ? creature.name : "???";
    if (!hasCaught) img.style.filter = "grayscale(100%) brightness(50%)";

    cell.appendChild(img);
    grid.appendChild(cell);
  });

  journal.innerHTML = buttons + title;
  journal.appendChild(grid);

  const close = document.createElement("button");
  close.textContent = "Lukk";
  close.style.marginTop = "10px";
  close.onclick = () => journal.remove();
  journal.appendChild(close);

  document.body.appendChild(journal);
}

// === Tast for å åpne journal ===
document.addEventListener("keydown", (e) => {
  if (document.activeElement.tagName === "INPUT") return;
  if (e.key === "j") {
    toggleTrophyJournal();
  }
});


// === XP & LEVEL SYSTEM ===
let playerLevel = 1;
let playerXP = 0;
let xpToNextLevel = 100;

// Hvor mye XP hver type fisk gir
defineFishXP();
function defineFishXP() {
  const pool = Object.values(fishPools).flat();
  pool.forEach(fish => {
    if (!fish.xp) {
      if (fish.rarity === "common") fish.xp = 10;
      else if (fish.rarity === "rare") fish.xp = 25;
      else if (fish.rarity === "legendary") fish.xp = 75;
      else if (fish.rarity === "mythical") fish.xp = 250;
      else if (fish.rarity === "secret") fish.xp = 0;
    }
  });
}

function gainXP(amount) {
  playerXP += amount;
  if (playerXP >= xpToNextLevel) {
    playerXP -= xpToNextLevel;
    playerLevel++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.25);
    alert(`You just levelled up to level ${playerLevel}!`);
    if (sounds.sfx.levelUp) sounds.sfx.levelUp.play();
  }
  updateXPBar();
}

function updateXPBar() {
  const bar = document.getElementById("xpBar");
  const percent = Math.floor((playerXP / xpToNextLevel) * 100);
  if (bar) {
    bar.style.width = percent + "%";
    bar.innerHTML = `<span style="white-space: nowrap;">XP: ${playerXP} / ${xpToNextLevel}</span>`;
  }
}

// === Legg til HTML XP-Bar et sted i DOM ===
function createXPUI() {
  const xpBarWrapper = document.createElement("div");
  xpBarWrapper.style.position = "absolute";
  xpBarWrapper.style.bottom = "50px";
  xpBarWrapper.style.left = "50%";
  xpBarWrapper.style.transform = "translateX(-50%)";
  xpBarWrapper.style.width = "300px";
  xpBarWrapper.style.background = "#222";
  xpBarWrapper.style.border = "2px solid #888";
  xpBarWrapper.style.color = "white";
  xpBarWrapper.style.fontFamily = "monospace";
  

  const xpBar = document.createElement("div");
  xpBar.id = "xpBar";
  xpBar.style.height = "20px";
  xpBar.style.width = "0%";
  xpBar.style.background = "lime";
  xpBar.style.textAlign = "center";
  xpBar.style.fontSize = "14px";
  xpBar.style.lineHeight = "20px";

  xpBarWrapper.appendChild(xpBar);
  document.body.appendChild(xpBarWrapper);
  updateXPBar();

  // === Chatbox ===
  const chatWrapper = document.createElement("div");
  chatWrapper.style.display = "flex";
  chatWrapper.style.marginTop = "10px";
  chatWrapper.style.gap = "10px";
  chatWrapper.style.alignItems = "center";
  chatWrapper.style.justifyContent = "center";

  const chatLabel = document.createElement("span");
  chatLabel.textContent = "Chat:";
  chatLabel.style.color = "white";

  const chatInput = document.createElement("input");
  chatInput.id = "commandInput";
  chatInput.type = "text";
  chatInput.placeholder = "Type command...";
  chatInput.style.background = "#222";
  chatInput.style.color = "white";
  chatInput.style.border = "1px solid #888";
  chatInput.style.padding = "5px";
  chatInput.style.fontFamily = "monospace";
  chatInput.style.width = "150px";

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleCommand(chatInput.value.trim());
      chatInput.value = "";
    }
  });

  chatWrapper.appendChild(chatLabel);
  chatWrapper.appendChild(chatInput);
  xpBarWrapper.appendChild(chatWrapper);
  
}

function handleCommand(cmd) {
  const args = cmd.toLowerCase().split(" ");
  const base = args[0];

  switch (base) {
    case "/gold":
      gold += parseInt(args[1] || "10");
      alert(`You gained ${args[1] || 10} gold.`);
      renderInventory();
      break;

    case "/played":
      const now = Date.now();
      const total = totalPlayTime + (playSessionStart ? now - playSessionStart : 0);
      const minutes = Math.floor(total / 60000);
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      alert(`You have played this character for ${hours}h ${mins}m.`);
      break;

    case "/tp":
      if (args.length >= 2) {
        const levelName = args[1].toLowerCase();
        const def = levelDefinitions[levelName];
    
        if (!def) {
          alert(`Unknown level: "${levelName}"`);
          break;
        }
    
        const x = parseInt(args[2]) || def.x;
        const y = parseInt(args[3]) || def.y;
    
        loadLevel(def.index, x, y);
      } else {
        alert("Usage: /tp <levelName> ");
      }
      break;
      

    case "/levelup":
      playerXP = xpToNextLevel;
      gainXP(0); // trigge level up
      break;

    default:
      alert(`Unknown command: ${cmd}`);
  }
}

// === Spill av lyd for level up ===
sounds.sfx.levelUp = new Audio("lyder/levelUp.wav");

// === Legg til XP når du fanger fisk ===
function addToInventory(fish) {
  let item = inventory.find(i => i.name === fish.name);
  if (item) {
    item.count += 1;
  } else {
    inventory.push({ ...fish, count: 1 });
  }if (!trophies[fish.name]) {
    const now = new Date();
    const formatted = now.getFullYear() + "-" +
                      String(now.getMonth() + 1).padStart(2, '0') + "-" +
                      String(now.getDate()).padStart(2, '0') + " " +
                      String(now.getHours()).padStart(2, '0') + ":" +
                      String(now.getMinutes()).padStart(2, '0');
  
    trophies[fish.name] = formatted;
  }
  gainXP(fish.xp || 10); // Få XP basert på fisken
  if (inventoryOpen) renderInventory();
}

// === Start XP UI ved spillets start ===
createXPUI();



function showCharacterCreationWithSlot(slotKey) {
  showCharacterCreation();
  
  // Vent til neste "tick" så DOM-innholdet er på plass
  setTimeout(() => {
    const button = document.querySelector("#charCreation button");
    if (button) {
      button.onclick = () => finishCharacterCreationToSlot(slotKey);
    } else {
      console.error("Fant ikke startknappen for karakteropprettelse!");
    }
  }, 0);
}

function finishCharacterCreationToSlot(slotKey) {
  const gender = document.getElementById("charGender").value;
  const name = document.getElementById("charName").value.trim();

  if (!name) {
    alert("Du må velge et navn!");
    return;
  }

  playerData.gender = gender;
  playerData.name = name;
  applyCharacterAppearance();

  localStorage.setItem(slotKey + '_character', JSON.stringify(playerData));
  document.getElementById("charCreation").remove();

  loadLevel(0);
}


// Prevent movement/inventory while menu is open or fishing
document.addEventListener('keydown', (e) => {
  if (document.activeElement.tagName === "INPUT") return;
  if (menuOpen || isFishing) return;
  // Your existing movement + inventory toggle logic here
});

function showCharacterInfo() {
  // Fjern tidligere visning hvis den finnes
  const existing = document.getElementById("characterInfoBox");
  if (existing) existing.remove();

  const box = document.createElement("div");
  box.id = "characterInfoBox";
  box.style.position = "absolute";
  box.style.top = "50%";
  box.style.left = "10%";
  box.style.transform = "translate(-50%, -50%)";
  box.style.background = "#222";
  box.style.border = "2px solid #aaa";
  box.style.padding = "20px";
  box.style.color = "white";
  box.style.fontFamily = "monospace";
  box.style.zIndex = "30";
  box.style.textAlign = "center";

  const total = getAllUniqueCreatures().length;
  const caught = Object.keys(trophies).length;

  const genderImage = playerData.gender === "male" ? "images/player/man/pixelmannDown.png" : "images/pixelwomanDown.png";

  box.innerHTML = `
    <h2>${playerData.name}</h2>
    <img src="${genderImage}" width="64" height="64"><br><br>
    <strong>Level:</strong> ${playerLevel}<br>
    <strong>XP:</strong> ${playerXP} / ${xpToNextLevel}<br>
    <strong>Trophies:</strong> ${caught} / ${total}<br><br>
    <button onclick="document.getElementById('characterInfoBox').remove()">Exit</button>
  `;

  document.body.appendChild(box);
}

const saved = localStorage.getItem("voidquest_save");

if (saved) {
  const data = JSON.parse(saved);

  playerData = data.character;
  applyCharacterAppearance();

  inventory = data.inventory || [];
  trophies = data.trophies || [];
  gold = data.gold || 0;
  playerLevel = data.playerLevel || 1;
  playerXP = data.playerXP || 0;
  xpToNextLevel = data.xpToNextLevel || 100;

  const level = data.level ?? 0;
  const pos = data.position || { x: 0, y: 0, direction: 'down' };

  character.direction = pos.direction;
  loadLevel(level, pos.x, pos.y);
  renderInventory();
  //updateXPUI();
  updateXPBar();
} else {
  showMainMenu();
}

//---------------MAIN MENY FØRST-----------------

function showMainMenu() {
  const menu = document.createElement("div");
  menu.id = "mainMenu";
  menu.style.position = "absolute";
  menu.style.top = "0";
  menu.style.left = "0";
  menu.style.width = "100%";
  menu.style.height = "100%";
  menu.style.background = "#000";
  menu.style.display = "flex";
  menu.style.flexDirection = "column";
  menu.style.alignItems = "center";
  menu.style.justifyContent = "center";
  menu.style.gap = "30px";
  menu.style.zIndex = 1000;

  menu.innerHTML = `
    <img src="images/npc/voidQuestLogo.png" style="width:128px;height:auto;" />
    <button style="padding: 20px 40px; font-size: 24px;" onclick="startCharacterCreationFromMenu()">Make Character</button>
    <button style="padding: 20px 40px; font-size: 24px;" onclick="showCredits()">Credits</button>
    <button style="padding: 20px 40px; font-size: 24px;" onclick="quitGame()">Quit</button>
  `;

  document.body.appendChild(menu);
}

function startCharacterCreationFromMenu() {
  document.getElementById("mainMenu").remove();
  showCharacterCreation();
}

function showCredits() {
  const credits = document.createElement("div");
  credits.id = "creditsScreen";
  credits.style.position = "absolute";
  credits.style.top = "0";
  credits.style.left = "0";
  credits.style.width = "100%";
  credits.style.height = "100%";
  credits.style.background = "#111";
  credits.style.color = "white";
  credits.style.fontFamily = "monospace";
  credits.style.display = "flex";
  credits.style.flexDirection = "column";
  credits.style.alignItems = "center";
  credits.style.justifyContent = "center";
  credits.style.zIndex = 1001;
  credits.style.textAlign = "center";
  credits.innerHTML = `
    <h1>VoidQuest</h1>
    <p>Created by: Erik Spenningsby</p>
    <p>Every pixelart used in this game</p>
    <p>are designed and created by our team, and for this game.</p>
    <p>Pixel art help: Jocelyn, Isabella, Daniel</p>
    <p>Music: Erik Spenningsby</p>
    <p>Help/report bugs/inquiries</p>
    <p>Discord: https://discord.gg/UP67kGYmQE</p>
    <p>voidcrypt@hotmail.com</p>
    
    <br><br>
    <button onclick="document.getElementById('creditsScreen').remove()">Tilbake</button>
  `;
  document.body.appendChild(credits);
}

function quitGame() {
  window.close(); // Fungerer kun hvis siden ble åpnet av et skript
  alert("Du må lukke fanen manuelt."); // Fallback for vanlige faner
}

toggleMenu();

