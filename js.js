const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileSize = 40;

let totalPlayTime = 0;     // Totalt antall millisekunder spilt
let playSessionStart = null; // Når denne spilløkta startet

let menuOpen = false;

let isDead = false;

let lastFrameTime = performance.now();

let gameStarted = false;


// === Kart: Lokasjoner og visning ===
const mapData = [
  { name: "Spenningsbyen", x: 20, y: 20, type: "city", color: "green" },
  { name: "Path-1", x: 35, y: 20, type: "road", color: "#8B4513" },
  { name: "Path-1", x: 50, y: 20, type: "road", color: "#8B4513" },
  { name: "Path-1", x: 65, y: 20, type: "road", color: "#8B4513" },
  { name: "Yurborg", x: 80, y: 20, type: "city", color: "green" },
  { name: "Path-2", x: 80, y: 35, type: "road", color: "#8B4513" },
  { name: "Path-2", x: 80, y: 50, type: "road", color: "#8B4513" },
  { name: "Vulcano-Hill", x: 80, y: 65, type: "city", color: "orange" },
  
];

// === Tiles ===
const tileImages = {
  black: new Image(),
  grass: new Image(),
  coblestone: new Image(),
  tree: new Image(),
  moltenTree: new Image(),
  brick: new Image(),
  roof: new Image(),
  plank: new Image(),
  fence: new Image(),
  table: new Image(),
  door: new Image(),
  water: new Image(),
  lava: new Image(),
  sand: new Image(),
  stoneSingle: new Image(),
  campfire: new Image(),
  stonepath: new Image(),
  lavacoble: new Image(),
  voidgate: new Image()
};

tileImages.black.src = 'images/tiles/black.png';
tileImages.grass.src = 'images/tiles/grassTile.png';
tileImages.tree.src = 'images/tiles/treeTile.png';
tileImages.moltenTree.src = 'images/tiles/moltenTree.png';
tileImages.brick.src = 'images/tiles/brickTile.png';
tileImages.roof.src = 'images/tiles/roofTile.png';
tileImages.plank.src = 'images/tiles/plankTile.png';
tileImages.door.src = 'images/tiles/doorTile.png';
tileImages.fence.src = 'images/tiles/fenceTile.png';
tileImages.table.src = 'images/tiles/tableTile.png';
tileImages.coblestone.src = 'images/tiles/coblestoneTile.png';
tileImages.water.src = 'images/tiles/waterTile.png';
tileImages.lava.src = 'images/tiles/lavaTile.gif';
tileImages.sand.src = 'images/tiles/sandPathTile.png';
tileImages.stoneSingle.src = 'images/tiles/stoneSingleTile.png';
tileImages.campfire.src = 'images/tiles/campfireStill.png';
tileImages.stonepath.src = 'images/tiles/stonePathTile.png';
tileImages.lavacoble.src = 'images/tiles/lavaCobleTile.png';
tileImages.voidgate.src = 'images/tiles/voidgateTile.png';

const nonWalkableTiles = ['tree', 'brick', 'fence', 'table', 'water', 'lava', 'stoneSingle','campfire',];
const tilesAbovePlayer = ['roof', 'moltenTree'];

const tileMapping = {
  'BB': 'black',
  'G1': 'grass',
  'C1': 'coblestone',
  'LC': 'lavacoble',
  'T1': 'tree',
  'MT': 'moltenTree',
  'B1': 'brick',
  'R1': 'roof',
  'P1': 'plank',
  'F1': 'fence',
  'T2': 'table', 
  'D1': 'door',
  'W1': 'water',
  'L1': 'lava',
  'S1': 'sand',
  'P2': 'stonepath',
  'S2': 'stoneSingle',
  'C2': 'campfire',
  'V1': 'voidgate',
};

const levels = [
  {
    //Spenningsbyen "0"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11----12----13----14----15----16----17----18----19----20----21----22----23
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'S2', 'C1', 'C1', 'C1', 'C1', 'C1'],//0
      ['T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'S2', 'C1', 'R1', 'R1', 'R1'],//1
      ['T1', 'G1', 'G1', 'G1', 'T1', 'T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'S2', 'C1', 'P1', 'P1', 'P1'],//2
      ['T1', 'G1', 'G1', 'T1', 'T1', 'T1', 'T1', 'T1', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'S2', 'P1', 'D1', 'P1'],//3
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'G1', 'G1', 'G1', 'G1', 'P2', 'C2', 'P2', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'S2', 'G1', 'S2'],//4
      ['T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'P2', 'G1', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2'],//5
      ['T1', 'R1', 'R1', 'R1', 'R1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'T1'],//6
      ['T1', 'R1', 'R1', 'R1', 'R1', 'T1', 'T1', 'T1', 'T1', 'G1', 'G1', 'G1', 'G1', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'T1'],//7
      ['T1', 'B1', 'B1', 'B1', 'B1', 'T1', 'T1', 'T1', 'T1', 'T1', 'G1', 'G1', 'G1', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'S1', 'S1', 'S1', 'S1'],//8
      ['T1', 'B1', 'D1', 'B1', 'B1', 'F1', 'F1', 'F1', 'F1', 'F1', 'F1', 'F1', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'S1', 'W1', 'W1', 'W1', 'W1'],//9
      ['T1', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'S1', 'W1', 'W1', 'W1', 'W1', 'W1'],//10
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'S1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],//11

    ],
    startX: 4,
    startY: 10,
    background: 'grass'
  },
  {
    //GATHERERS HUB "1"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11
      ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],//0
      ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'D1', 'B1', 'B1', 'D1', 'B1'],//1
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//2
      ['B1', 'T2', 'T2', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//3
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//4
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//5
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//6
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//7
    ],
    startX: 5,
    startY: 5,
    background: 'plank'
  },
  {
    // DEEP VOID CAVE SPENNINGSBYEN "2"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11
      ['S2', 'S2', 'S2', 'P2', 'C1', 'V1', 'C1', 'C1', 'C1', 'S2', 'S2', 'S2'],//0
      ['S2', 'S2', 'P2', 'C1', 'C1', 'P2', 'C1', 'S2', 'C1', 'C1', 'C1', 'C1'],//1
      ['S2', 'P2', 'C1', 'C1', 'C1', 'P2', 'C1', 'C1', 'C1', 'S2', 'C1', 'C1'],//2
      ['P2', 'C1', 'C1', 'C1', 'P2', 'P2', 'P2', 'C1', 'C1', 'C1', 'C1', 'C1'],//3
      ['P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2'],//4
      ['W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],//5
      ['W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],//6
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],//7
    ],
    startX: 5,
    startY: 5,
    background: 'coblestone'
  },
  {
    // HUS HUB TROFE ROM "3"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11
      ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],//0
      ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],//1
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//2
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//3
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//4
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//5
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//6
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'V1', 'P1', 'P1', 'P1', 'B1'],//7
    ],
    startX: 5,
    startY: 5,
    background: 'plank'
  },
  {
    // STI-1 "4"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11----12----13----14----15----16----17----18----19----20----21----22----23
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'W1', 'W1', 'W1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1'],//0
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'G1', 'S2', 'W1', 'W1', 'W1', 'S2', 'T1', 'T1', 'G1', 'T1', 'G1', 'G1', 'T1'],//1
      ['T1', 'G1', 'P2', 'P2', 'P2', 'P2', 'G1', 'T1', 'T1', 'T1', 'G1', 'G1', 'G1', 'W1', 'W1', 'W1', 'G1', 'G1', 'G1', 'G1', 'T1', 'G1', 'G1', 'T1'],//2
      ['V1', 'P2', 'P2', 'T1', 'G1', 'P2', 'P2', 'G1', 'P2', 'P2', 'P2', 'P2', 'G1', 'W1', 'W1', 'W1', 'F1', 'F1', 'F1', 'G1', 'G1', 'P2', 'P2', 'P2'],//3
      ['T1', 'G1', 'T1', 'T1', 'T1', 'G1', 'P2', 'P2', 'P2', 'G1', 'G1', 'P2', 'P2', 'P1', 'P1', 'P1', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'T1', 'T1'],//4
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'G1', 'S2', 'G1', 'G1', 'G1', 'G1', 'G1', 'P1', 'P1', 'P1', 'G1', 'G1', 'G1', 'G1', 'G1', 'T1', 'T1', 'T1'],//5
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'W1', 'W1', 'W1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1'],//6
    ],
    startX: 5,
    startY: 5,
    background: 'grass'
  },
  {
    //YURBORG "5"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11----12----13----14----15----16----17----18----19----20----21----22----23----24----25----26----27----28
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1'],//0
      ['T1', 'T1', 'T1', 'T1', 'G1', 'G1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1', 'R1'],//1
      ['T1', 'T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],//2
      ['T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'R1', 'R1', 'R1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],//3
      ['T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'B1', 'B1', 'B1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'T1'],//4
      ['P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'T1'],//5
      ['T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'T1'],//6
      ['T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'T1'],//7
      ['T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'R1', 'R1', 'R1', 'R1', 'R1'],//8
      ['T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'R1', 'R1', 'R1', 'R1', 'R1'],//9
      ['T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'G1', 'G1', 'G1', 'B1', 'B1', 'B1', 'B1', 'B1'],//10
      ['T1', 'T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'P2', 'G1', 'B1', 'B1', 'D1', 'B1', 'B1'],//11
      ['T1', 'T1', 'T1', 'T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'T1'],//12
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'P2', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'G1', 'T1'],//13
      ['T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'F1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1', 'T1'],//14
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],//15
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],//16
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],//17
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],//18
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1'],//19

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
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11
      ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],//0
      ['B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1', 'B1'],//1
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//2
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//3
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//4
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//5
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'B1'],//6
      ['B1', 'P1', 'P1', 'P1', 'P1', 'P1', 'P1', 'V1', 'P1', 'P1', 'P1', 'B1'],//7
    ],
    startX: 3,
    startY: 3,
    background: 'plank'
  },
  {
    // VEILED ABYSS "8"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11----12----13----14----15----16----17----18----19----20----21----22----23----24----25----26----27----28----29----30----31----32----33----34----35
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//0
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//1
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//2
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//3
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//4
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//5
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//6
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//7
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//8
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//9
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//10
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//11
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//12
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//14
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//15
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//16

    ],
    startX: 5,
    startY: 5,
    background: 'coblestone'
  },
  {
    // Vulcano Hill "9"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11----12----13----14----15----16----17----18----19----20----21----22----23----24----25----26----27----28----29----30----31----32----33----34----35
      ['S2', 'S2', 'C1', 'S2', 'S2', 'LC', 'L1', 'L1', 'LC', 'S2', 'S2', 'P2', 'P2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2'],//0
      ['S2', 'C1', 'C1', 'C1', 'C1', 'LC', 'L1', 'L1', 'LC', 'C1', 'C1', 'P2', 'P2', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'S2'],//1
      ['S2', 'C1', 'C1', 'C1', 'C1', 'LC', 'L1', 'L1', 'LC', 'C1', 'C1', 'C1', 'P2', 'P2', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'S2'],//2
      ['S2', 'C1', 'C1', 'C1', 'LC', 'L1', 'L1', 'L1', 'LC', 'C1', 'C1', 'C1', 'P2', 'P2', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'MT', 'S2'],//3
      ['S2', 'C1', 'C1', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'LC', 'C1', 'C1', 'P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'MT', 'MT', 'C1', 'C1', 'C1', 'C1', 'C1', 'S2'],//4
      ['S2', 'C1', 'C1', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'LC', 'C1', 'P2', 'P2', 'P2', 'P2', 'P2', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'S2'],//5
      ['S2', 'C1', 'C1', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'LC', 'LC', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'S2'],//6
      ['S2', 'C1', 'C1', 'C1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'LC', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//7
      ['S2', 'C1', 'C1', 'C1', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'LC', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'S2'],//8
      ['S2', 'C1', 'C1', 'C1', 'C1', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'S2', 'S2'],//9
      ['S2', 'C1', 'C1', 'C1', 'C1', 'C1', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'S2', 'LC', 'LC'],//10
      ['S2', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'S2', 'S2', 'LC', 'LC', 'LC'],//11
      ['S2', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'LC', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'S2', 'LC', 'LC', 'LC', 'LC', 'LC'],//12
      ['S2', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'LC', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'D1', 'LC', 'LC', 'LC', 'LC'],//14
      ['S2', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'S2', 'S2', 'LC', 'LC', 'LC', 'LC'],//15
      ['S2', 'S2', 'C1', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'LC', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'L1', 'LC', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'S2', 'LC', 'LC', 'LC', 'LC'],//16

    ],
    startX: 5,
    startY: 5,
    background: 'coblestone'
  },
  {
    // Path-2 "10"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11----12----13----14----15----16----17----18----19----20----21----22----23
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//0
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//1
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//2
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//3
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//4
      ['W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//5
      ['W1', 'W1', 'W1', 'W1', 'P2', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'P1', 'P1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//6
      ['W1', 'W1', 'W1', 'P2', 'LC', 'P2', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//7
      ['W1', 'W1', 'W1', 'P2', 'L1', 'P2', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//8
      ['W1', 'W1', 'P2', 'L1', 'LC', 'P2', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//9
      ['W1', 'W1', 'P2', 'L1', 'L1', 'P2', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//10
      ['W1', 'W1', 'P2', 'LC', 'L1', 'P2', 'W1', 'W1', 'W1', 'W1', 'W1', 'P2', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//11
      ['W1', 'W1', 'W1', 'P2', 'L1', 'L1', 'P2', 'P2', 'W1', 'W1', 'W1', 'P2', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//12
      ['W1', 'W1', 'W1', 'P2', 'LC', 'L1', 'L1', 'LC', 'P2', 'W1', 'W1', 'P2', 'P2', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//14
      ['P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'L1', 'L1', 'LC', 'P2', 'W1', 'C1', 'P2', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//15
      ['P2', 'P2', 'P2', 'P2', 'P2', 'P2', 'L1', 'L1', 'LC', 'P2', 'W1', 'C1', 'P2', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1',],//16

    ],
    startX: 5,
    startY: 5,
    background: 'coblestone'
  },
  {
    // MOLTEN DUNGEON "11"
    layout: [
      //0-----1-----2-----3-----4-----5-----6-----7-----8-----9-----10----11----12----13----14----15----16----17----18----19----20----21----22----23----24----25----26----27----28----29----30----31----32----33----34----35
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//0
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//1
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//2
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//3
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//4
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//5
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//6
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//7
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//8
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//9
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//10
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//11
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//12
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//14
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//15
      ['C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'W1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1', 'C1'],//16

    ],
    startX: 5,
    startY: 5,
    background: 'coblestone'
  },
  
];

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
    { name: "Grodr", rarity: "common", image: "images/creatures/vann/grodr.png", chance: 900, price: 5},
    { name: "Grauder", rarity: "common", image: "images/creatures/vann/grauder.png", chance: 800, price: 10},
    { name: "Albino Grodr", rarity: "rare", image: "images/creatures/vann/albinoGrodr.png", chance: 49, price: 74 },

    // { name: "Mørkål", rarity: "rare", image: "images/morkaal.png", chance: 2, price: 55 }
  ],
  2: [ // Cave
    { name: "Grodr", rarity: "common", image: "images/creatures/vann/grodr.png", chance: 900, price: 5},
    { name: "Grauder", rarity: "common", image: "images/creatures/vann/grauder.png", chance: 800, price: 10},
    { name: "Deep Void Lure", rarity: "legendary", image: "images/creatures/vann/deepVoidLure.png", chance: 10, price: 418},
    { name: "Skuggosk", rarity: "rare", image: "images/creatures/vann/skuggosk.png", chance: 80, price: 42 },
  ],
  4: [ // Path-1
    { name: "Grodr", rarity: "common", image: "images/creatures/vann/grodr.png", chance: 95, price: 5},
    { name: "Grauder", rarity: "common", image: "images/creatures/vann/grauder.png", chance: 80, price: 10},
    { name: "Albino Grodr", rarity: "rare", image: "images/creatures/vann/albinoGrodr.png", chance: 1, price: 74},
  ],
  5: [ // Yurborg
    { name: "Krap", rarity: "common", image: "images/creatures/vann/krap.png", chance: 900, price: 19},
    { name: "Blue Krap", rarity: "rare", image: "images/creatures/vann/blueKrap.png", chance: 45, price: 92},
    { name: "Albino Krap", rarity: "legendary", image: "images/creatures/vann/albinoKrap.png", chance: 7, price: 743},
  ],
  8: [ // The-Veiled-Abyss
    { name: "Grodr", rarity: "common", image: "images/creatures/vann/grodr.png", chance: 900, price: 5},
    { name: "Grauder", rarity: "common", image: "images/creatures/vann/grauder.png", chance: 800, price: 10},
    { name: "Skuggosk", rarity: "rare", image: "images/creatures/vann/skuggosk.png", chance: 80, price: 42},

  ],
  9: [ // Vulcano-Hill
    { name: "Molten Muck", rarity: "common", image: "images/creatures/vann/moltenMuck.png", chance: 900, price: 25},


  ],
  10: [ // Path-2
    { name: "Krap", rarity: "common", image: "images/creatures/vann/krap.png", chance: 900, price: 19},
    { name: "Blue Krap", rarity: "rare", image: "images/creatures/vann/blueKrap.png", chance: 45, price: 92},
    { name: "Albino Krap", rarity: "legendary", image: "images/creatures/vann/albinoKrap.png", chance: 7, price: 743},
    { name: "Great White", rarity: "legendary", image: "images/creatures/vann/greatWhite.png", chance: 15, price: 217},
    { name: "Elder Great White", rarity: "mythical", image: "images/creatures/vann/elderGreatWhite.png", chance: 4, price: 1953},

  ],
};

const treeCreaturePools = {
  0: [ // Level 0 – Spenningsbyen
    { name: "Grey Mouse", rarity: "common", image: "images/creatures/land/mouseGrey.png", chance: 800, price: 16},
    { name: "Poisetle", rarity: "rare", image: "images/creatures/land/poisetle.png", chance: 100, price: 46},
    { name: "Albino Mouse", rarity: "rare", image: "images/creatures/land/albinoMouse.png", chance: 60, price: 74},

  ],
  4: [ // Sti-1
    { name: "Grey Mouse", rarity: "common", image: "images/creatures/land/mouseGrey.png", chance: 800, price: 16},
    { name: "Poisetle", rarity: "rare", image: "images/creatures/land/poisetle.png", chance: 100, price: 46},
    { name: "Albino Mouse", rarity: "rare", image: "images/creatures/land/albinoMouse.png", chance: 60, price: 74},
    { name: "Golden Beetle", rarity: "legendary", image: "images/creatures/land/goldenBeetle.png", chance: 14, price: 370},
    { name: "Beetle", rarity: "common", image: "images/creatures/land/beetle.png", chance: 400, price: 25},


  ],
  5: [ // Yurborg
    { name: "Grey Mouse", rarity: "common", image: "images/creatures/land/mouseGrey.png", chance: 800, price: 16},
    { name: "Poisetle", rarity: "rare", image: "images/creatures/land/poisetle.png", chance: 100, price: 46},
    { name: "Albino Mouse", rarity: "rare", image: "images/creatures/land/albinoMouse.png", chance: 60, price: 74},

  ],
  9: [ // Vulcano-hill
    { name: "Molten Golem", rarity: "common", image: "images/creatures/land/moltenGolem.png", chance: 800, price: 20},
    
  ],
};

defineAllCreatureXP();

const bosses = {
  "abyssBeast": {
    name: "The Abyss Beast",
    maxHP: 300,
    level: "the-veiled-abyss",
    rarity: "rare",
    image: "images/creatures/boss/theAbyssBeast/theAbyssBeastDown.png",
    drops: [
      {
        name: "Abyss Eye",
        image: "images/creatures/boss/theAbyssBeast/abyssEye.png",
        rarity: "rare",
        price: 875,
        chance: 10  // 20% sjanse
      },
    ],
    barSpeed: 1500,       // Tid for bar i ms
    damageToBoss: 34,      // Hvor mye skade bossen får ved suksess
    damageToPlayer: 67     // Hvor mye skade spilleren får ved bom
  },
};

const visibleBosses = [
  {
    name: "The Abyss Beast",
    image: "images/creatures/boss/theAbyssBeast/theAbyssBeastDown.png",
    level: 8,
    x: 25, // startposisjon på tilekartet
    y: 4,
    width: 6,   // hvor mange tiles bred
    height: 6   // hvor mange tiles høy
  },
  // du kan legge til flere bosser her!
];



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
      "To fish you just have to go up to any lake or ocean and interact. But first you need a fishing rod, you can buy one from the Voidlore merchant in Yurborg, to the east. To get gold you can start by searching some bushes for creatures and sell them to Oleander the Hunter, he is also in Yurborg in the shack.",
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
      "My tip was to fish in my old pearl here, you will get many trophies to show off.",
      "Now.. take care mye friend."

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
    name: "Voidlore Merchant Yurborg",
    image: "images/npc/voidloreMerchantRight.png",
    x: 6,
    y: 4,
    level: 5,
    type: "special_shop",
    dialog: ["No one sells goods like mine!",
      "Take a look."
    ]
  },

  {
    name: "Grobbe the gambler",
    image: "images/player/man/pixelmannUp.png",
    x: 12,
    y: 4,
    level: 9,
    type: "special_shop",
    dialog: ["I am not addicted to these boxes, i have opened boxes every day for 10 years, and i can stop at my will!"
    ]
  },
  {
    name: "Voidlore Merchant Vulcano-Hill",
    image: "images/npc/voidLoreMerchantVulcanoRight.png",
    x: 15,
    y: 4,
    level: 9,
    type: "special_shop",
    dialog: ["No one sells goods like mine!",
      "Take a look."
    ]
  },
  
  //----------SKAPNINGER----------
  
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
    name: "Skuggosk",
    image: "images/creatures/vann/skuggosk.png",
    x: 2,
    y: 4,
    level: 2,
    type: "creature",
    dialog: ["krk-kvak-kvek",
      "kvekek-krk-kvekek",
    ]
  },
  // Legg til flere her!
];

const npcShopItems = {
  "Voidlore Merchant Yurborg": [
    {
      name: "Dock Key",
      image: "images/items/dockKey.png",
      price: 600,
      description: "Unlocks fence to dock in Yurborg.",
      once: true, // Bare én gang per spiller
    },
    {
      name: "Abyss Seekers",
      image: "images/items/book.png",
      price: 1500,
      description: "Unlocks location knowledge.",
      once: true // Bare én gang per spiller
    },
    {
      name: "Fishing rod",
      image: "images/items/fishingRod.png",
      price: 50,
      description: "Rod used to fish in lakes and oceans",
      once: true // Bare én gang per spiller
    },
    // Flere varer kan enkelt legges til her senere
  ],
  "Voidlore Merchant Vulcano-Hill": [
    {
      name: "Dock Key",
      image: "images/items/dockKey.png",
      price: 600,
      description: "Unlocks fence to dock in Yurborg.",
      once: true, // Bare én gang per spiller
    },
    {
      name: "Molten Fishing rod",
      image: "images/items/moltenFishingRod.png",
      price: 2000,
      description: "Rod that can withstand high temperatures!",
      once: true // Bare én gang per spiller
    },
    // Flere varer kan enkelt legges til her senere
  ],
  "Grobbe the gambler": [
    {
      name: "Void Box",
      image: "images/items/boxes/voidBox.png",
      price: 20,
      description: "common box for the common man.",
      once: false // Bare én gang per spiller
    },
    {
      name: "Rare Box",
      image: "images/items/boxes/rareBox.png",
      price: 80,
      description: "Rare Box, im surely not addicted.",
      once: false // Bare én gang per spiller
    },
    {
      name: "Legendary Box",
      image: "images/items/boxes/legendaryBox.png",
      price: 500,
      description: "Legendary Box! This is not a hobby anymore!",
      once: false // Bare én gang per spiller
    },

  ],
};

//KLIKKBARE ITEMS I INVENTORY
const interactableItems = {
  "Abyss Seekers": {
    message: "To enter The Veiled Abyss, /tp the-veiled-abyss"
  },
  "Void Box": {
    action: () => tryOpenMysteryBox("Void Box")
  },
  "Rare Box": {
    action: () => tryOpenMysteryBox("Rare Box")
  },
  "Legendary Box": {
    action: () => tryOpenMysteryBox("Legendary Box")
  },
  // Du kan lett legge til flere spesialgjenstander her etterpå
};

// === Mystery Boxes ===
const mysteryBoxes = {
  "Void Box": {
    price: 20, 
    rarity: "common",
    image: "images/items/boxes/voidBox.png",
    items: [
      { name: "Grodr", image: "images/creatures/vann/grodr.png", chance: 200,},
      { name: "Grauder", image: "images/creatures/vann/grauder.png", chance: 100},
      { name: "Krap", image: "images/creatures/vann/krap.png", chance: 70},
      { name: "Molten Muck", image: "images/creatures/vann/moltenMuck.png", chance: 60},
      { name: "Grey Mouse", image: "images/creatures/land/mouseGrey.png", chance: 90},
      { name: "Beetle", image: "images/creatures/land/beetle.png", chance: 60},
      { name: "Skuggosk", image: "images/creatures/vann/skuggosk.png", chance: 20},
    ]
  },
  "Rare Box": {
    price: 80, 
    rarity: "rare",
    image: "images/items/boxes/rareBox.png",
    items: [
      { name: "Poisetle", image: "images/creatures/land/poisetle.png", chance: 200 },
      { name: "Albino Grodr", image: "images/creatures/vann/albinoGrodr.png", chance: 100 },
      { name: "Skuggosk", image: "images/creatures/vann/skuggosk.png", chance: 200 },
      { name: "Blue Krap", image: "images/creatures/vann/blueKrap.png", chance: 70 },
      { name: "Albino Mouse", image: "images/creatures/land/albinoMouse.png", chance: 100 },
      { name: "Golden Beetle", image: "images/creatures/land/goldenBeetle.png", chance: 14},

    ]
  },
  "Legendary Box": {
    price: 500, 
    rarity: "legendary",
    image: "images/items/boxes/legendaryBox.png",
    items: [
      { name: "Deep Void Lure", image: "images/creatures/vann/deepVoidLure.png", chance: 100},
      { name: "Albino Krap", image: "images/creatures/vann/albinoKrap.png", chance: 50},
      { name: "Great White", image: "images/creatures/vann/greatWhite.png", chance: 200},
      { name: "Elder Great White", image: "images/creatures/vann/elderGreatWhite.png", chance: 10},

    ]
  },
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
    '26,11': { targetLevel: 7, targetX: 7, targetY: 6 }, // TIL GATHERERS HUB 
    '11,19': { targetLevel: 10, targetX: 11, targetY: 1 },  // TIL PATH-2
    '12,19': { targetLevel: 10, targetX: 12, targetY: 1 },  // TIL PATH-2
    //'5,5': { targetLevel: 0, targetX: 22, targetY: 5 }  // TIL CASINO-1
  },
  6: { //CASINO-1
    '5,5': { targetLevel: 5, targetX: 5, targetY: 2 }  // TIL YURBORG
  },
  7: { //GATHERERS HUB YURBORG
    '7,7': { targetLevel: 5, targetX: 26, targetY: 12 }  // TIL YURBORG
  },
  9: { //VULCANO HILL
    '11,0': { targetLevel: 10, targetX: 11, targetY: 14 },  // TIL PATH-2
    '12,0': { targetLevel: 10, targetX: 12, targetY: 14 },  // TIL PATH-2
    '31,13': { targetLevel: 11, targetX: 5, targetY: 5 },  // TIL Molten Dungeon
  },
  10: { //PATH-2
    '11,0': { targetLevel: 5, targetX: 11, targetY: 18 },  // TIL YURBORG
    '12,0': { targetLevel: 5, targetX: 12, targetY: 18 },  // TIL YURBORG
    '11,15': { targetLevel: 9, targetX: 11, targetY: 1 },  // TIL Vulcano Hill
    '12,15': { targetLevel: 9, targetX: 12, targetY: 1 }  // TIL Vulcano Hill
  },
  11: { //MOLTEN DUNGEON
    '1,1': { targetLevel: 9, targetX: 30, targetY: 13 },  // TIL VULCANO HILL
  }
};



const levelNamesToIndex = {
  "spenningsbyen": 0,
  "gatherers-hub": 1,
  "deep-void-cave": 2,
  "bedroom": 3,
  "path-1": 4,
  "yurborg": 5,
  "casino": 6,
  "gatherers-hub-yurborg": 7,
  
  // Hemmelig nivå:
  "the-veiled-abyss": 8,
  "vulcano-hill": 9,
  "path-2": 10,
  "molten-dungeon": 11,
};

const levelDefinitions = {
  "spenningsbyen":      { index: 0,  x: 4,  y: 10 },
  "gatherers-hub":      { index: 1,  x: 5,  y: 5 },
  "deep-void-cave":     { index: 2,  x: 5,  y: 5 },
  "bedroom":            { index: 3,  x: 5,  y: 5 },
  "path-1":             { index: 4,  x: 2,  y: 3 },
  "yurborg":            { index: 5,  x: 4,  y: 4 },
  "casino":             { index: 6,  x: 5,  y: 5 },
  "gatherers-hub-yurborg": { index: 7, x: 3, y: 3},
  "the-veiled-abyss":   { index: 8,  x: 2,  y: 2 }, // Hemmelig nivå
  "vulcano-hill":       { index: 9,  x: 11,  y: 1 },
  "path-2":             { index: 10,  x: 11,  y: 0},
  "molten-dungeon":     { index: 11,  x: 11,  y: 0},
};

let confirmCallback = null;

function showConfirmBox(message, callback) {
  const box = document.getElementById("confirmBox");
  const msg = document.getElementById("confirmMessage");
  msg.textContent = message;
  confirmCallback = callback;
  box.style.display = "block";
}

function confirmBoxResponse(choice) {
  document.getElementById("confirmBox").style.display = "none";
  if (confirmCallback) confirmCallback(choice);
  confirmCallback = null;
}

// === Når spiller klikker på en box i inventory ===
function tryOpenMysteryBox(boxName) {
  const box = mysteryBoxes[boxName];
  if (!box) return;

  showConfirmBox(`Are you sure you want to open a ${boxName}?`, (confirmed) => {
    if (!confirmed) return;
    openMysteryBoxAnimation(boxName);
  });
}

function findCreatureByName(name) {
  for (const pool of Object.values(fishPools)) {
    const match = pool.find(c => c.name === name);
    if (match) return match;
  }

  for (const pool of Object.values(treeCreaturePools)) {
    const match = pool.find(c => c.name === name);
    if (match) return match;
  }

  return null;
}

function getFullCreatureData(name) {
  const pools = [...Object.values(fishPools).flat(), ...Object.values(treeCreaturePools).flat()];
  return pools.find(creature => creature.name === name);
}


function openMysteryBoxAnimation(boxName) {
  const box = mysteryBoxes[boxName];
  if (!box || !box.items) return;

  const overlay = document.createElement("div");
  overlay.id = "mysteryBoxOverlay";
  overlay.style.position = "absolute";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0,0,0,0.85)";
  overlay.style.zIndex = 999;
  overlay.innerHTML = `<canvas id="boxWheelCanvas" width="600" height="600" style="margin:auto; display:block;"></canvas>`;
  document.body.appendChild(overlay);

  const canvas = document.getElementById("boxWheelCanvas");
  const ctx = canvas.getContext("2d");

  const items = box.items;
  const segmentAngle = (2 * Math.PI) / items.length;
  const radius = 200;
  let currentAngle = 0;
  let selectedIndex = null;

  // Bestem vinner basert på sjanser
  const pool = [];
  items.forEach((item, index) => {
    for (let i = 0; i < item.chance; i++) {
      pool.push(index);
    }
  });
  selectedIndex = pool[Math.floor(Math.random() * pool.length)];

  // 💡 Beregn hvilken vinkel som trengs for at vinneren havner øverst
  const targetAngle = (3 * Math.PI / 2) - (selectedIndex * segmentAngle);
  const spins = 5; // antall runder før stopp
  const finalAngle = (2 * Math.PI * spins) + targetAngle;

  let rotation = 0;
  let startTime = null;
  const duration = 4000;

  function drawWheel(angle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Sirkel rundt hjulet
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius + 50, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 8;
    ctx.stroke();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const theta = i * segmentAngle + angle;
      const x = canvas.width / 2 + Math.cos(theta) * radius;
      const y = canvas.height / 2 + Math.sin(theta) * radius;

      const img = new Image();
      img.src = item.image;
      ctx.drawImage(img, x - 24, y - 24, 48, 48);
    }

    // Pil
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2 - radius - 60);
    ctx.lineTo(canvas.width / 2 - 15, canvas.height / 2 - radius - 30);
    ctx.lineTo(canvas.width / 2 + 15, canvas.height / 2 - radius - 30);
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();
  }

  function animateWheel(timestamp) {
    if (sounds.sfx.boxWheelSpinStart) sounds.sfx.boxWheelSpinStart.play();
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    if (elapsed < duration) {
      const progress = elapsed / duration;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      rotation = finalAngle * easeOut;
      drawWheel(rotation);

      requestAnimationFrame(animateWheel);
    } else {
      rotation = finalAngle;
      drawWheel(rotation);

      const wonItem = items[selectedIndex];
      const fullCreature = getFullCreatureData(wonItem.name);
      selectedIndex = pool[Math.floor(Math.random() * pool.length)];

      if (!fullCreature) {
        appendChatMessage("Error: Something went wrong, could not find full creature data.");
        return;
      }
      setTimeout(() => {
        removeItem(boxName); // Fjern brukt box
        if (sounds.sfx.catchSuccess) sounds.sfx.catchSuccess.play();
        appendChatMessage("System: You unboxed: " + `${wonItem.name}!`);
        addToInventory({
          name: fullCreature.name,
          type: "creature",
          rarity: fullCreature.rarity,
          image: fullCreature.image,
          price: fullCreature.price
        });

        if (!trophies[wonItem.name]) {
          trophies[wonItem.name] = new Date().toLocaleDateString();
        }

        document.body.removeChild(overlay);
        renderInventory();
      }, 1000);
    }
  }

  requestAnimationFrame(animateWheel);
}




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
    catchFail: new Audio("lyder/mistetFisk.wav"),
    boxWheelSpinStart: new Audio("lyder/boxWheelSpinStart.wav"),
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

function downloadSave() {
  const saveData = JSON.stringify({
    character: playerData,
    inventory,
    gold,
    trophies,
    playerLevel,
    playerXP,
    xpToNextLevel
  }, null, 2);

  const blob = new Blob([saveData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "voidquest_save.json";
  a.click();
  URL.revokeObjectURL(url);
}

function loadFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.character || !data.inventory) {
        appendChatMessage("System: Invalid save file.");
        return;
      }

      playerData = data.character;
      inventory = data.inventory;
      gold = data.gold;
      trophies = data.trophies;
      playerLevel = data.playerLevel;
      playerXP = data.playerXP;
      xpToNextLevel = data.xpToNextLevel;
      applyCharacterAppearance();
      renderInventory();
      updateXPBar();
      appendChatMessage("System: Save loaded!");
    } catch (err) {
      appendChatMessage("System: Failed to load save file.");
      console.error(err);
    }
  };
  reader.readAsText(file);
  saveGame();
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
  appendChatMessage("Your save has been deleted. The game will now restart.");
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
    3: "Bedroom",
    4: "Path-1",
    5: "Yurborg",
    6: "Casino",
    7: "Gatherers-hub-Yurborg",
    8: "The-Veiled-Abyss",
    9: "Vulcano-Hill",
    10: "Path-2",
    11: "Molten-Dungeon",
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

  map = level.layout.map(row => row.map(tile => tileMapping[tile]));

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
  const level = levels[currentLevel];
  const layout = level.layout;
  const background = tileImages[level.background];

  // Sjekk at player er definert før vi prøver å tegne rundt den
  if (!character) return;

  for (let y = 0; y < layout.length; y++) {
    for (let x = 0; x < layout[y].length; x++) {
      const tileCode = layout[y][x];
      const tileName = tileMapping[tileCode];
      const tileImg = tileImages[tileName];

      const dx = Math.abs(x - character.x);
      const dy = Math.abs(y - character.y);

      // Bare i Molten Dungeon (level 11): begrens synsfelt
      if (currentLevel === 11 && (dx > 2 || dy > 2)) {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        continue;
      }

      // Tegn bakgrunn først
      if (background) {
        ctx.drawImage(background, x * tileSize, y * tileSize, tileSize, tileSize);
      }

      // Deretter selve tile
      if (tileCode !== 'G1' && tileImg) {
        ctx.drawImage(tileImg, x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }

  // NPCs
  npcs.forEach(npc => {
    if (npc.level === currentLevel) {
      const img = new Image();
      img.src = npc.image;
      ctx.drawImage(img, npc.x * tileSize, npc.y * tileSize, tileSize, tileSize);
    }
  });

  // Bosses
  visibleBosses.forEach(boss => {
    if (boss.level === currentLevel) {
      const img = new Image();
      img.src = boss.image;
      ctx.drawImage(img, boss.x * tileSize, boss.y * tileSize, boss.width * tileSize, boss.height * tileSize);
    }
  });

  // Mørkt lag for spesifikke nivåer (ikke molten dungeon)
  if ((currentLevel === 2 || currentLevel === 8 || currentLevel === 11)) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}


function changeTile(levelIndex, x, y, newTileChar) {
  // Endre layout-dataen direkte
  const row = levels[levelIndex].layout[y];
  if (Array.isArray(row)) {
    row[x] = newTileChar; // riktig for array-form
  } else {
    const newRow = row.substring(0, x) + newTileChar + row.substring(x + 1);
    levels[levelIndex].layout[y] = newRow;
  }

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
    appendChatMessage("You must choose a name!");
    return;
  }

  playerData.gender = gender;
  playerData.name = name;
  applyCharacterAppearance();

  document.getElementById("charCreation").remove();
  

  // Start spillet fra level 1
  loadLevel(1);

  // Lagre umiddelbart
  saveGame();
  renderInventory();
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
  const pixelsPerSecond = 200; // Justerbar hastighet (gå)
  let previousTime = performance.now();
  

  function animate(currentTime) {
    const deltaTime = (currentTime - previousTime) / 1000; // sekunder
    previousTime = currentTime;
    const speed = pixelsPerSecond * deltaTime;

    let doneX = false, doneY = false;

    if (character.pixelX < targetX) {
      character.pixelX += speed;
      if (character.pixelX >= targetX) {
        character.pixelX = targetX;
        doneX = true;
      }
    } else if (character.pixelX > targetX) {
      character.pixelX -= speed;
      if (character.pixelX <= targetX) {
        character.pixelX = targetX;
        doneX = true;
      }
    } else {
      doneX = true;
    }

    if (character.pixelY < targetY) {
      character.pixelY += speed;
      if (character.pixelY >= targetY) {
        character.pixelY = targetY;
        doneY = true;
      }
    } else if (character.pixelY > targetY) {
      character.pixelY -= speed;
      if (character.pixelY <= targetY) {
        character.pixelY = targetY;
        doneY = true;
      }
    } else {
      doneY = true;
    }

    gameLoop();

    if (!doneX || !doneY) {
      requestAnimationFrame(animate);
    } else {
      character.moving = false;
      const tile = map[character.y][character.x];

      const key = `${character.x},${character.y}`;
      const door = doorMap[currentLevel]?.[key];
      if (door) {
        // Krever nøkkel for visse dører
        if (door.requires && !hasItem(door.requires)) {
          appendChatMessage("System: You need the " + door.requires + " to enter this area.");
          return;
        }
        loadLevel(door.targetLevel, door.targetX, door.targetY);
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
  if (currentLevel === 5 && tx === 12 && ty === 14 && tile === 'fence') {
    if (hasItem("Dock Key")) {
      changeTile(currentLevel, 12, 14, 'G1'); // Bytt til 'G1' = grass
    } else {
      appendChatMessage("System: The fence is locked, you need a (Dock Key).");
    }
    return; // Stopp videre interaksjon
  }

  const npc = npcs.find(n => n.level === currentLevel && n.x === tx && n.y === ty);
  if (npc) return startNPCInteraction(npc);

  if (tile === "water") {
    const hasWaterRod = inventory.some(
      item => item && item.name.toLowerCase().includes("fishing rod") && !item.name.toLowerCase().includes("molten")
    );
  
    if (hasWaterRod) {
      return startFishing();
    } else {
      return appendChatMessage("System: You can't fish without a fishing rod!");
    }
  }
  
  if (tile === "lava") {
    const hasLavaRod = inventory.some(
      item => item && item.name.toLowerCase().includes("molten fishing rod")
    );
  
    if (hasLavaRod) {
      return startFishing();
    } else {
      return appendChatMessage("System: You can't fish in lava without a Molten Fishing Rod!");
    }
  }

  if (tile === 'tree') return startTreeHunt(); 
  if (tile === 'moltenTree') return startTreeHunt(); 

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

function showBossFightPrompt(bossKey) {
  const boss = bosses[bossKey];
  if (!boss) return;

  const box = document.createElement("div");
  box.id = "bossPromptBox";
  box.style.position = "absolute";
  box.style.top = "50%";
  box.style.left = "50%";
  box.style.transform = "translate(-50%, -50%)";
  box.style.background = "#111";
  box.style.color = "white";
  box.style.padding = "20px";
  box.style.border = `2px solid ${raritySettings[boss.drops[0].rarity]?.border || "white"}`;
  box.style.fontFamily = "monospace";
  box.style.zIndex = 9999;
  box.style.textAlign = "center";

  box.innerHTML = `
    <h2>${boss.name}</h2>
    <img src="${boss.image}" width="80" /><br><br>
    <p>Prepare to battle ${boss.name}.</p>
    <p>It can hit you for <span style="color:red">${boss.damageToPlayer}</span> damage if you miss!</p>
    <p>You deal <span style="color:lime">${boss.damageToBoss}</span> damage per hit.</p>
    <p>Drops: Abyss Eye.</p>boss.drops

    <br>
    <button onclick="startBossFight('${bossKey}'); document.body.removeChild(document.getElementById('bossPromptBox'));">Battle</button>
    <button onclick="document.body.removeChild(document.getElementById('bossPromptBox'));">Cancel</button>
  `;

  document.body.appendChild(box);
}

function startBossFight(bossKey) {
  if (document.activeElement === chatInput) return;

  const boss = bosses[bossKey];
  if (!boss) return;

  let bossHP = boss.maxHP;
  let playerHP = 200;

  const fightNextRound = () => {
    if (bossHP <= 0) {
      endBossFight(true, boss);
      return;
    }
    if (playerHP <= 0) {
      endBossFight(false, boss);
      return;
    }

    const baseBarTime = boss.barSpeed || 1000;
    const barTime = baseBarTime + Math.random() * 500;
    let hit = false;
    let elapsed = 0;

    showFishingBox(`
      <div>
        <div style="margin-bottom: 8px;"><img src="${boss.image}" width="64"><br>${boss.name}</div>
        <div>HP: You ${playerHP} | ${boss.name} ${bossHP}</div>
        <div>Press [Space] when the bar is on the line!</div>
        <div id="biteTimerBar" style="width: 100%; height: 20px; background: #222; position: relative;">
          <div id="catchZone" style="position: absolute; top: 0; left: 45%; width: 10%; height: 100%; background: #fff2; border-left: 2px solid red; border-right: 2px solid red;"></div>
          <div id="biteTimerFill" style="position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: red;"></div>
        </div>
      </div>
    `);

    const fill = document.getElementById("biteTimerFill");

    const onKeyDown = (e) => {
      if (e.code === "Space") {
        const progress = elapsed / barTime;
        if (progress >= 0.45 && progress <= 0.55) {
          bossHP -= boss.damageToBoss || 1;
        } else {
          playerHP -= boss.damageToPlayer || 1;
        }
        document.removeEventListener("keydown", onKeyDown);
        clearInterval(timer);
        fightNextRound();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const timer = setInterval(() => {
      elapsed += 20;
      fill.style.width = `${(elapsed / barTime) * 100}%`;
      if (elapsed >= barTime) {
        document.removeEventListener("keydown", onKeyDown);
        clearInterval(timer);
        playerHP -= boss.damageToPlayer || 1;
        fightNextRound();
      }
    }, 20);
  };

  fightNextRound();
}

function endBossFight(playerWon, boss) {
  if (playerWon) {

      // Legg til bossen som et trofé
    if (!trophies[boss.name]) {
      trophies[boss.name] = new Date().toISOString();
    }

    let dropsWon = [];

    for (const item of boss.drops) {
      const roll = Math.random() * 100;
      if (roll < item.chance) {
        addToInventory({ ...item, count: 1 });
        dropsWon.push(item.name);
      }
    }

    if (dropsWon.length > 0) {
      showFishingBox(`Boss defeated! You received: ${dropsWon.join(", ")}`);
    } else {
      showFishingBox("Boss defeated! But it dropped nothing...");
    }
  } else {
    isDead = true;
    showDeathScreen();
    setTimeout(() => {
      document.getElementById("deathScreen").remove();
      const loc = levelDefinitions["gatherers-hub"];
      loadLevel(loc.index, loc.x, loc.y);
      isDead = false;
      showFishingBox("You died... You return to Gatherers Hub.");
    }, 3000); // vent 3 sekunder før respawn
  }

  setTimeout(cancelFishing, 3000);
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
  if (document.activeElement === chatInput) return;

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
        gainXP(creature.xp);
        
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
  document.addEventListener("keydown", (e) => {
    // Ikke trigge hvis du allerede skriver
    if (document.activeElement === chatInput) return;
  
    if (e.key === "t" || e.key === "T") {
      e.preventDefault();
      chatInput.focus();
    }
  });

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

//removeItem("Void Key"); hvis du skal bruke den til noe annet
function removeItem(name) {
  const index = inventory.findIndex(i => i && i.name === name);
  if (index !== -1) {
    if (inventory[index].count !== undefined) {
      inventory[index].count--;
      if (inventory[index].count <= 0) {
        inventory.splice(index, 1);
      }
    } else {
      // Hvis item ikke har count, fjern det direkte
      inventory.splice(index, 1);
    }
    if (inventoryOpen) renderInventory();
  } else {
    console.warn(`removeItem: Fant ikke item med navn '${name}' i inventory.`);
  }
}

function hasItem(name) {
  return inventory.some(i => i.name === name);
}

function openSpecialShop(npcName) {
  const shopBox = document.getElementById('shopBox');
  const items = npcShopItems[npcName] || [];
  const ownedItems = inventory.filter(item => item && item.name).map(item => item.name);

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

  // Vis items du kan selge også:
  html += `<hr><h4>Sell Items</h4>`;

  let hasItemsToSell = false;
  inventory.forEach(item => {
    if (!item || typeof item !== "object") return;
    const isFishOrCreature = item.rarity !== undefined; 
    
    if (!isFishOrCreature) {
      hasItemsToSell = true;
      const sellPrice = item.price || 5; // fallback pris hvis item ikke har pris
      html += `
        <div style="margin-bottom:10px;">
          <img src="${item.image}" width="32" height="32"> ${item.name}
          <br><button onclick="sellToMerchant('${npcName}', '${item.name}', ${sellPrice})">Sell for ${sellPrice} gold</button>
        </div>
      `;
    }
  });

  if (!hasItemsToSell) {
    html += `<p>You have no sellable items.</p>`;
  }

  html += `<br><button onclick="closeShop()">Leave</button>`;
  shopBox.innerHTML = html;
  shopBox.style.display = 'block';
}

function sellToMerchant(npcName, itemName, price) {
  const index = inventory.findIndex(item => item && item.name === itemName);
  if (index !== -1) {
    gold += price;
    inventory.splice(index, 1); // Fjern item
    appendChatMessage(`You sold ${itemName} for ${price} gold.`);
    renderInventory();
    openSpecialShop(npcName); // 🔄 Oppdater butikken etterpå!
  }
}

function buySpecialItem(npcName, itemName, price) {
  const item = npcShopItems[npcName].find(i => i.name === itemName);
  if (!item) return;

  if (gold < price) {
    appendChatMessage("System: You can't afford that.");
    return;
  }

  appendChatMessage(`System: You bought ${itemName} for ${price} gold.`);

  gold -= price;

  inventory.push({ ...item, count: 1 });
  
  renderInventory();
  openSpecialShop(npcName); // Refresh shop
}

let currentShopType = "water";

function openShop(type = "water") {
  currentShopType = type;
  const shopBox = document.getElementById('shopBox');
  let shopHTML = `<h3 style="font-family: Cursive;"></h3><p>This is my prices:</p>`;
  let hasFish = false;

  inventory.forEach(item => {
    if (!item) return; // 🔒 Hopp over tomme ruter

    const creaturePools = type === "water" ? fishPools : treeCreaturePools;
    const allCreatures = Object.values(creaturePools).flat();
    const creatureInfo = allCreatures.find(c => c.name === item.name);
    
    if (creatureInfo) {
      hasFish = true;
      shopHTML += `<button onclick="sellFish('${item.name}', ${creatureInfo.price})">Sell ${item.name} (${creatureInfo.price} gold)</button><br>`;
    }
  });

  if (!hasFish) {
    shopHTML += `<p>System You dont have any creatures, off you go!.</p>`;
  }

  shopHTML += `<br><button onclick="closeShop()">Cancel</button>`;
  shopBox.innerHTML = shopHTML;

  shopBox.style.display = 'block';
}

function closeShop() {
  document.getElementById('shopBox').style.display = 'none';
}

function sellFish(fishName, price) {
  const itemIndex = inventory.findIndex(i => i && i.name === fishName);
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
  if (document.activeElement === chatInput) return;

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
  inv.innerHTML = `<h3 style="color:white;font-family: Cursive;">Inventory (${playerData.name})</h3>
                   <p style="color:gold;font-family: Cursive;">Gold: ${gold}</p>`;

  const hoverInfoBox = document.getElementById("hoverInfoBox") || (() => {
    const box = document.createElement("div");
    box.id = "hoverInfoBox";
    Object.assign(box.style, {
      position: "fixed", pointerEvents: "none", background: "#222", border: "1px solid #999",
      color: "white", padding: "8px", fontFamily: "monospace", zIndex: 1000, display: "none"
    });
    document.body.appendChild(box);
    return box;
  })();

  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(4, 64px)';
  grid.style.gridTemplateRows = 'repeat(6, 64px)';
  grid.style.gap = '8px';

  for (let i = 0; i < 24; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    cell.style.width = '64px';
    cell.style.height = '64px';
    cell.style.background = '#111';
    cell.style.border = '2px solid #444';
    cell.style.display = 'flex';
    cell.style.flexDirection = 'column';
    cell.style.alignItems = 'center';
    cell.style.justifyContent = 'center';

    const item = inventory[i];
    if (item) {
      const rarity = raritySettings[item.rarity];
      const borderColor = rarity ? rarity.border : "#666";
      cell.style.border = `2px solid ${borderColor}`;
      cell.innerHTML = `<img src="${item.image}" width="32" height="32"><div style="color:white;">x${item.count}</div>`;

      if (interactableItems[item.name]) {
        cell.style.cursor = "pointer";
        cell.onclick = () => showItemDialog(item.name);
      }

      // === Drag & Drop ===
      cell.draggable = true;
      cell.ondragstart = (e) => {
        e.dataTransfer.setData("text/plain", i);
      };

      cell.onmousemove = (e) => {
        const rarityData = raritySettings[item.rarity];
        const rarityColor = rarityData ? rarityData.color : "#fff";
        const caughtDate = trophies[item.name] || "Unknown";
        hoverInfoBox.innerHTML = `
          <strong style="color:${rarityColor}">${item.name}</strong><br>
          <span>Price: ${item.price} gold</span><br>
          
        `;
        hoverInfoBox.style.display = "block";
        hoverInfoBox.style.left = (e.clientX + 15) + "px";
        hoverInfoBox.style.top = (e.clientY + 15) + "px";
      };

      cell.onmouseleave = () => {
        hoverInfoBox.style.display = "none";
      };
    }

    // === Drop Target ===
    cell.ondragover = (e) => e.preventDefault();
    cell.ondrop = (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);
      const toIndex = parseInt(cell.dataset.index, 10);
      if (fromIndex !== toIndex) {
        [inventory[fromIndex], inventory[toIndex]] = [inventory[toIndex], inventory[fromIndex]];
        renderInventory(); // Oppdater visningen
      }
    };

    grid.appendChild(cell);
  }

  inv.appendChild(grid);
}


function toggleInventory() {
  inventoryOpen = !inventoryOpen;
  document.getElementById("inventory").style.display = inventoryOpen ? "block" : "none";  
}

function showItemDialog(itemName) {
  const data = interactableItems[itemName];
  if (!data) return;

  if (mysteryBoxes[itemName]) {
    tryOpenMysteryBox(itemName);
    return;
  }

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
  appendChatMessage("System: Game Saved!");
}

function loadGame() {
  try {
    const saved = localStorage.getItem('voidquest_save');
    if (saved) {
      const data = JSON.parse(saved);
      totalPlayTime = data.playTime || 0;
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
      createXPUI();
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

function showDeathScreen() {
  const overlay = document.createElement("div");
  overlay.id = "deathScreen";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.8)";
  overlay.style.backdropFilter = "blur(4px) grayscale(100%)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "10000";

  const text = document.createElement("h1");
  text.textContent = "You died";
  text.style.color = "white";
  text.style.fontSize = "64px";
  text.style.fontFamily = "monospace";
  text.style.textShadow = "0 0 10px red";

  overlay.appendChild(text);
  document.body.appendChild(overlay);
}

// === Troféjournal ===
let trophyJournalOpen = false;
let currentTrophyType = "water"; // kan være "water", "land" eller "boss"

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
  const allBosses = Object.values(bosses).map(b => ({
    name: b.name,
    image: b.image,
    rarity: b.drops[0]?.rarity || "legendary"
  }));
  
  let fullList;
  if (currentTrophyType === "water") {
    fullList = allFish;
  } else if (currentTrophyType === "land") {
    fullList = allLand;
  } else if (currentTrophyType === "boss") {
    fullList = allBosses;
  }
  

  //filtrerer ut alle skapninger hvis de ikke er fanget
  const list = fullList
  .filter(creature => trophies[creature.name])
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

  const caught = fullList.filter(c => trophies[c.name]).length;

  const buttons = `
  <button onclick="currentTrophyType='water'; toggleTrophyJournal(); toggleTrophyJournal()">Water</button>
  <button onclick="currentTrophyType='land'; toggleTrophyJournal(); toggleTrophyJournal()">Land</button>
  <button onclick="currentTrophyType='boss'; toggleTrophyJournal(); toggleTrophyJournal()">Boss</button>
  `;

  const title = `<h3>${
    currentTrophyType === 'water' ? 'Water creatures' :
    currentTrophyType === 'land' ? 'Land creatures' :
    'Bosses'
  } (${caught}/${fullList.length})</h3>`;

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
  if (document.activeElement === chatInput) return;

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
function defineAllCreatureXP() {
  const allFish = Object.values(fishPools).flat();
  const allLand = Object.values(treeCreaturePools).flat();
  const allCreatures = [...allFish, ...allLand];

  allCreatures.forEach(c => {
    if (!c.xp) {
      if (c.rarity === "common") c.xp = 10;
      else if (c.rarity === "rare") c.xp = 25;
      else if (c.rarity === "legendary") c.xp = 75;
      else if (c.rarity === "mythical") c.xp = 250;
      else if (c.rarity === "secret") c.xp = 0;
      else c.xp = 5; // fallback
    }
  });
}

function gainXP(amount) {
  playerXP += amount;
  if (playerXP >= xpToNextLevel) {
    playerXP -= xpToNextLevel;
    playerLevel++;
    xpToNextLevel = Math.floor(xpToNextLevel * 1.25);
    appendChatMessage("You just levelled up to level" + `${playerLevel}!`);
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
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  
  chatInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const input = chatInput.value.trim();
      if (input.length > 300) {
        appendChatMessage("System: Message too long (max 300 characters).");
        chatInput.value = "";
        return;
      }
      if (!input) return;
      
      if (input.startsWith("/")) {
        // Dette er en kommando – IKKE vis i chat
        handleCommand(input);
      } else {
        // Vanlig melding – vis i chat
        appendChatMessage(playerData.name + ": " + input);
      }
  
      chatInput.value = "";
      chatInput.blur();
    }
  });
  
  


  
}

function appendChatMessage(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleCommand(cmd) {
  const args = cmd.toLowerCase().split(" ");
  const base = args[0];

  switch (base) {
    case "/gold":
      gold += parseInt(args[1] || "10");
      appendChatMessage(`You gained ${args[1] || 10} gold.`);
      renderInventory();
      break;

      case "/played":
        if (!playSessionStart) {
          appendChatMessage("Time tracking is not active.");
          break;
        }
      
        const now = Date.now();
        const total = totalPlayTime + (now - playSessionStart);
        const minutes = Math.floor(total / 60000);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
      
        appendChatMessage("You have played this character for " + `${hours}h ${mins}m.`);
        break;

    case "/tp":
      if (args.length >= 2) {
        const levelName = args[1].toLowerCase();
        const def = levelDefinitions[levelName];
    
        if (!def) {
          appendChatMessage("System: Unknown level:" + `${cmd}`); 
          break;
        }
    
        const x = parseInt(args[2]) || def.x;
        const y = parseInt(args[3]) || def.y;
    
        loadLevel(def.index, x, y);
      } else {
        appendChatMessage("System: Usage: /tp <levelName> ");
      }
      break;

    case "/fight":
      const levelName = Object.entries(levelDefinitions).find(([name, def]) => def.index === currentLevel)?.[0];
      const bossInArea = Object.entries(bosses).find(([key, boss]) => boss.level === levelName);
    
      if (bossInArea) {
        const [bossKey] = bossInArea;
        showBossFightPrompt(bossKey); // <-- NY FUNKSJON
      } else {
        appendChatMessage("System: No boss found in this area at this time.");
      }
      break;

    default:
      appendChatMessage("System: Unknown command:" + `${cmd}`); 
  }
}

// === Spill av lyd for level up ===
sounds.sfx.levelUp = new Audio("lyder/levelUp.wav");

// === Legg til XP når du fanger fisk ===
function addToInventory(newItem) {
  // Finn om det finnes en match fra før
  let existingItem = inventory.find(i => i && i.name === newItem.name);

  if (existingItem) {
    existingItem.count += 1;
  } else {
    // Finn første tomme plass (undefined)
    const emptyIndex = inventory.findIndex(i => !i);
    if (emptyIndex !== -1) {
      inventory[emptyIndex] = { ...newItem, count: 1 };
    } else {
      // Ingen tomme plasser, legg til på slutten
      inventory.push({ ...newItem, count: 1 });
    }
  }
  if (!trophies[newItem.name]) {
    trophies[newItem.name] = new Date().toISOString();
  }

  if (inventoryOpen) renderInventory();
  if (!inventoryOpen) renderInventory();
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

  const genderImage = playerData.gender === "male"
  ? "images/player/man/pixelmannDown.png"
  : "images/player/woman/pixelwomanDown.png";

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

  totalPlayTime = data.playTime || 0;
  playSessionStart = Date.now();

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
    <img src="images/voidQuestLogo.png" style="width:128px;height:auto;" />
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
  alert("Farewell Path seeker!"); // Fallback for vanlige faner
  window.close(); // Fungerer kun hvis siden ble åpnet av et skript
}

toggleMenu();

