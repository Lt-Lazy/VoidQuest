/**
 * 3-lags map:
 * grid_base: bakken (må alltid ha noe)
 * grid_mid:  objekter (kan være ".")
 * grid_top:  overlay/items (kan være ".")
 */

window.TILE_SIZE = 32;
window.EMPTY = ".";

window.LEVELS = {
  spenningsbyen: {
    id: "spenningsbyen",
    overworld: true,
    name: "spenningsbyen",
    width: 60,
    height: 40,
    spawn: { x: 4, y: 4 },
    edges: { north: null, south: "meadow_02", west: null, east: "forest_01" },

    portals: [
      {
        x: 3, y: 3,                 // hvor døra står i denne levelen
        toLevel: "gatherers_inn",           // nivået du går inn i
        toSpawn: { x: 5, y: 9 },       // hvor du spawner inne
        label: "Enter"                // tekst i meny
      }
    ],

    // BASE: alltid fylt (gress)
    grid_base: [
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","plank","door","plank","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","gras2","gras2","gras2","gras2","gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","gras2","gras2","gras2","gras2","gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0"]
    ],

    // MID: trær/steiner (transparent bakgrunn), ellers "."
    grid_mid: [
      ["tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      ["tre3",".","win01",".","winfl",".",".",".",".",".",".",".","tree","tree",".",".",".",".",".","."],
      ["tre3","ston5","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3","ston3"],
      ["tre3",".",".","pole4",".","pole1","fenc0","pol10","fenc0","pole8",".",".",".",".",".",".",".",".",".","."],
      ["tre3",".",".","pole5",".",".",".","fenc1",".","pole5",".",".",".",".",".",".",".",".",".","."],
      ["tre3",".",".","pol11","fenc0","fenc0","fenc0","pol14","fenc0","pol12",".",".",".",".",".",".",".",".",".","."],
      ["wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1"],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."]
    ],

    grid_top: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".","tre2","tre2",".",".",".",".",".","."],
      [".","brlf","roof","roof","roof","brrg",".",".",".",".",".",".","tre1","tre1",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."]
    ],
  },

  gatherers_inn: {
    id: "gatherers_inn",
    name: "House 01",
    width: 20,
    height: 12,
    spawn: { x: 5, y: 9 },
    edges: { north: null, south: null, west: null, east: null },

    // Dør inne som går ut til spenningsbyen
    portals: [
      {
        x: 16, y: 9,                 // dørtile inne i huset
        toLevel: "spenningsbyen",
        toSpawn: { x: 3, y: 4 },     // spawner utenfor døra
        label: "Exit"
      }
    ],

    grid_base: [
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","door","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"],
      ["flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1","flor1"]
    ],
    grid_mid: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."]
    ],
    grid_top: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."]
    ],
  },

  meadow_02: {
    id: "meadow_02",
    name: "Meadow 02",
    width: 20,
    height: 12,
    spawn: { x: 9, y: 1 },
    edges: { north: "spenningsbyen", south: null, west: null, east: null },

    grid_base: [
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"]
    ],

    grid_mid: [
      ["tre3","tre3","tre3",".",".","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".","stone","stone","stone","stone","stone","stone",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".","stone","stone","stone","stone","stone","stone",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3"]
    ],

    grid_top: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."]
    ],
  },

  forest_01: {
    id: "forest_01",
    name: "Forest 01",
    width: 20,
    height: 12,
    spawn: { x: 1, y: 6 },
    edges: { north: null, south: null, west: "spenningsbyen", east: null },

    grid_base: [
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"]
    ],

    grid_mid: [
      ["tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3"],
      ["tre3",".",".","tre3","tre3",".",".",".",".",".",".",".","tre3","tre3",".",".",".",".",".","tre3"],
      ["tre3",".",".","tre3","tre3",".",".",".",".",".",".",".","tre3","tre3",".",".",".",".",".","tre3"],
      [".",".",".",".",".",".","tre3","tre3",".",".","tre3","tre3",".",".",".",".","tre3","tre3",".","tre3"],
      [".",".",".",".",".",".","tre3","tre3",".",".","tre3","tre3",".",".",".",".","tre3","tre3",".","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","tre3"],
      ["tre3",".",".","tre3","tre3",".",".",".",".",".",".",".","tre3","tre3",".",".",".",".",".","tre3"],
      ["tre3",".",".","tre3","tre3",".",".",".",".",".",".",".","tre3","tre3",".",".",".",".",".","tre3"],
      ["tre3",".",".",".",".",".","tre3","tre3",".",".","tre3","tre3",".",".",".",".","tre3","tre3",".","tre3"],
      ["tre3",".",".",".",".",".","tre3","tre3",".",".","tre3","tre3",".",".",".",".","tre3","tre3",".","tre3"],
      ["tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3"]
    ],

    grid_top: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."]
    ],
  }
};

window.TILE_DEFS = {
  //GROUND
  gras1: { img: "assets/tiles/terrain/grass/grass01.png", walkable: true, description: "Soft grass." },
  gras2: { img: "assets/tiles/terrain/grass/grass02.png", walkable: true, description: "Soft grass." },
  grass: { img: "assets/tiles/terrain/grass/grass03.png", walkable: true, description: "Soft grass." },
  gras4: { img: "assets/tiles/terrain/grass/grassEndLeft.png", walkable: true, description: "Soft grass." },


  wate0: {
    animated: true,
    frameDuration: 720, // ms per frame
    frames: [
      "assets/tiles/terrain/water/water0.png",
      "assets/tiles/terrain/water/water1.png",
      "assets/tiles/terrain/water/water2.png",
      "assets/tiles/terrain/water/water3.png",
    ],
    walkable: false,
    description: "Gently flowing water."
  },
  //wate0: { img: "assets/tiles/terrain/water/water0.png", walkable: false, description: "Soft grass." },
  wate1: { img: "assets/tiles/terrain/water/waterEndGrass.png", walkable: true, description: "Water edge." },
  wate2: { img: "assets/tiles/terrain/water/waterEndGrassRight.png", walkable: true, description: "Water edge." },


  //STONE
  stone: { img: "assets/tiles/terrain/stoneSingleTile.png", walkable: true, description: "A solid stone." },

  ston1: { img: "assets/tiles/terrain/stonePath/stonePath1.png", walkable: true, description: "A path made of stone." },
  ston2: { img: "assets/tiles/terrain/stonePath/stonePath2.png", walkable: true, description: "A path made of stone." },
  ston3: { img: "assets/tiles/terrain/stonePath/stonePathUpDown.png", walkable: true, description: "A path made of stone." },
  ston4: { img: "assets/tiles/terrain/stonePath/stonePathLeftRight.png", walkable: true, description: "A path made of stone." },
  ston5: { img: "assets/tiles/terrain/stonePath/stonePathUpDownLeft.png", walkable: true, description: "A path made of stone." },
  ston6: { img: "assets/tiles/terrain/stonePath/stonePathUpDownRight.png", walkable: true, description: "A path made of stone." },
  ston7: { img: "assets/tiles/terrain/stonePath/stonePathUpRight.png", walkable: true, description: "A path made of stone." },
  ston8: { img: "assets/tiles/terrain/stonePath/stonePathUpLeft.png", walkable: true, description: "A path made of stone." },

  //SAND
  sand1:  { img: "assets/tiles/terrain/sandPathTile.png", walkable: false, description: "A path made of sand." },

  //FENCE
  fenc0:{ img: "assets/tiles/fence/fenceTile2.png", walkable: false, description: "A sturdy fence." },
  fenc1:{ img: "assets/tiles/fence/fenceTileDown.png", walkable: false, description: "A sturdy fence." },
  fenc2:{ img: "assets/tiles/fence/fenceTileDownEnd.png", walkable: false, description: "A sturdy fence." },
  pole0:{ img: "assets/tiles/fence/pole.png", walkable: false, description: "A sturdy fence." },
  pole1:{ img: "assets/tiles/fence/poleRight.png", walkable: false, description: "A sturdy fence." },
  pole2:{ img: "assets/tiles/fence/poleLeft.png", walkable: false, description: "A sturdy fence." },
  pole3:{ img: "assets/tiles/fence/poleUp.png", walkable: false, description: "A sturdy fence." },
  pole4:{ img: "assets/tiles/fence/poleDown.png", walkable: false, description: "A sturdy fence." },
  pole5:{ img: "assets/tiles/fence/poleUpDown.png", walkable: false, description: "A sturdy fence." },
  pole6:{ img: "assets/tiles/fence/poleUpDownLeft.png", walkable: false, description: "A sturdy fence." },
  pole7:{ img: "assets/tiles/fence/poleUpDownRight.png", walkable: false, description: "A sturdy fence." },
  pole8:{ img: "assets/tiles/fence/poleLeftDown.png", walkable: false, description: "A sturdy fence." },
  pole9:{ img: "assets/tiles/fence/poleRightDown.png", walkable: false, description: "A sturdy fence." },
  pol10:{ img: "assets/tiles/fence/poleRightLeftDown.png", walkable: false, description: "A sturdy fence." },
  pol11:{ img: "assets/tiles/fence/poleRightUp.png", walkable: false, description: "A sturdy fence." },
  pol12:{ img: "assets/tiles/fence/poleLeftUp.png", walkable: false, description: "A sturdy fence." },
  pol13:{ img: "assets/tiles/fence/poleLeftRight.png", walkable: false, description: "A sturdy fence." },
  pol14:{ img: "assets/tiles/fence/poleRightLeftUp.png", walkable: false, description: "A sturdy fence." },
  pol15:{ img: "assets/tiles/fence/poleRightLeftUpDown.png", walkable: false, description: "A sturdy fence." },

  //HOUSE
  roof:  { img: "assets/tiles/house/roofTop01.png", walkable: false, description: "Waterproof roof." },
  brlf:  { img: "assets/tiles/house/roofTopBarLeft.png", walkable: false, description: "Waterproof roof." },
  brrg:  { img: "assets/tiles/house/roofTopBarRight.png", walkable: false, description: "Waterproof roof." },
  plank: { img: "assets/tiles/house/plankTile.png", walkable: false, description: "Handcrafted quality planks." },
  flor1: { img: "assets/tiles/house/plankTile.png", walkable: true, description: "Ground, just inside...." },
  win01: { img: "assets/tiles/house/window01.png", walkable: false, description: "windproof windows." },
  winfl: { img: "assets/tiles/house/window01SunFlower.png", walkable: false, description: "windproof windows." },

  tre2: { img: "assets/tiles/terrain/tree/treeTop.png", walkable: true, description: "Tree Top!" },
  tre1: { img: "assets/tiles/terrain/tree/treeMid.png", walkable: true, description: "Middle of the tree." },
  tree:  {
    img: "assets/tiles/terrain/tree/treeStomp.png",
    walkable: false,
    description: "A sturdy tree."
  },
  tre3: { img: "assets/tiles/terrain/tree/treeSingle.png", walkable: false, description: "Too small of a tree to get any logs." },


  door: {
    img: "assets/tiles/house/door01.png",   // <- sørg for at denne finnes
    walkable: false,
    description: "A sturdy door.",
    actions: ["enter"]
  },

};


// Items / top-layer (ting du kan plukke opp, eller som ligger på bord)
window.ITEM_DEFS = {};
