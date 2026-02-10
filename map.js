
window.TILE_SIZE = 32;
window.EMPTY = ".";

window.LEVELS = {
  spenningsbyen: {
    id: "spenningsbyen",
    overworld: true,
    name: "spenningsbyen",
    width: 60,
    height: 40,
    spawn: { x: 23, y: 13 },
    edges: { north: null, south: null, west: null, east: null },

    //MAP
    mapFile: "spenningsbyen.tmj",

    npcs: [
      {
        id: "trader_01",
        name: "Trader",
        x: 22, //horisontalt +1
        y: 12, //vertikalt +1
        sprites: [
          "assets/npcs/oleander/oleanderDown.png",
          "assets/npcs/oleander/oleanderDownIdle1.png"
        ],
        trader: true,
        shop: [
          { itemId: "bronzeArmor", cost: { itemId: "club", qty: 2 } },
          { itemId: "apple", cost: { itemId: "coins", qty: 1 } },
        ],
        idleMs: 540,        // hvor ofte den bytter frame (valgfritt)
        dialogId: "trader_01",
      },

      {
        id: "banker_01",
        name: "banker",
        x: 21, //horisontalt +1
        y: 12, //vertikalt +1
        sprites: [
          "assets/npcs/oleander/oleanderDown.png",
          "assets/npcs/oleander/oleanderDownIdle1.png"
        ],
        banker: true,
        idleMs: 540,        // hvor ofte den bytter frame (valgfritt)
        dialogId: "trader_01",
      },

      // --- ENEMY  ---
      {
        id: "goblin_01",
        name: "Goblin",
        x: 26,
        y: 13,

        // du legger inn assets senere:
        sprites: [
          "assets/npcs/goblin/goblin.png",
          "assets/npcs/goblin/goblinIdle1.png"
        ],
        weaponFxSprite: "assets/items/club.png",
        idleMs: 450,

        drops: [
          { itemId: "club", chance: 0.70 },
          { itemId: "coins", chance: 1, qtyMin: 1, qtyMax: 10 }, // 100% sjanse for 1-10 coins

        ],

        hostile: true,     // enemy :)
        maxHp: 6,
        hitChance: 0.50,
        attackSpeedMs: 3000,
        maxHit: 1,
        respawnMs: 20000,

      }

    ],

    portals: [
      {
        x: 25, y: 12,                 // hvor døra står i denne levelen
        toLevel: "gatherers_inn",           // nivået du går inn i
        toSpawn: { x: 7, y: 2 },       // hvor du spawner inne
        label: "Enter"                // tekst i meny
      }
    ],

    // disse settes automatisk når TMJ loader:
    grid_base: null,
    grid_mid: null,
    grid_top: null,

  },

  gatherers_inn: {
    id: "gatherers_inn",
    name: "Gatherers Inn",
    width: 15,
    height: 10,
    spawn: { x: 5, y: 9 },
    edges: { north: null, south: null, west: null, east: null },

    npcs: [
      {
        id: "guide_spenningsbyen",
        name: "Oleander",
        x: 12, //horisontalt +1
        y: 2, //vertikalt +1
        sprites: [
          "assets/npcs/oleander/oleanderDown.png",
          "assets/npcs/oleander/oleanderDownIdle1.png"
        ],
        idleMs: 550,        // hvor ofte den bytter frame (valgfritt)

        dialogId: "guide_intro",
      },

      {
        id: "blacksmith_01",
        name: "Blacksmith Yorn",
        x: 4, //horisontalt +1
        y: 8, //vertikalt +1
        sprites: [
          "assets/npcs/blacksmith/blacksmithIdle1.png",
          "assets/npcs/blacksmith/blacksmithIdle2.png"
        ],
        trader: true,
        shop: [
          { itemId: "tinBar", cost: { itemId: "tinOre", qty: 5 } },
          { itemId: "copperBar", cost: { itemId: "copperOre", qty: 5 } },
          { itemId: "pickaxe", cost: { itemId: "coins", qty: 5 } },
        ],
        idleMs: 540,        // hvor ofte den bytter frame (valgfritt)
        dialogId: "blacksmith_01",
      },

    ],

    // Dør inne som går ut til spenningsbyen
    portals: [
      {
        x: 7, y: 1,                 // dørtile inne i huset
        toLevel: "spenningsbyen",
        toSpawn: { x: 25, y: 13 },     // spawner utenfor døra
        label: "Exit"
      }
    ],

    grid_base: [
      ["plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank"],
      ["plank","plank","plank","plank","plank","plank","plank","door","plank","plank","plank","plank","plank","plank","plank"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],

    ],
    grid_mid: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".","patn2",".",".",".",".",".","patn1",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".","chai2","tabl1","tabl2","chai1",".",".",".",".",".",".",".",".",".","."],
      [".",".","tabl3","tabl4",".",".",".",".",".",".",".",".",".",".","."],
      [".","chai2","tabl6","tabl7","chai1",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    ],
    grid_top: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".","chai3",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],

    ],
  },

  testMap: {
    id: "testMap",
    name: "testMap",
    width: 15,
    height: 10,
    spawn: { x: 5, y: 9 },
    edges: { north: null, south: null, west: null, east: null },


    // Dør inne som går ut til spenningsbyen
    portals: [
      {
        x: 7, y: 1,                 // dørtile inne i huset
        toLevel: "spenningsbyen",
        toSpawn: { x: 25, y: 13 },     // spawner utenfor døra
        label: "Exit"
      }
    ],

    grid_base: [
      ["gras8","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras9"],
      ["gras2","grass","grass","grass","grass","grass","grass","door","grass","grass","grass","grass","grass","grass","gras3"],
      ["gras2","grass","mud1","mud1","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","gras3"],
      ["gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","gras3"],
      ["gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","gras3"],
      ["gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","gras3"],
      ["gras2","grass","grass","grass","grass","grass","grass","grass","grass","plan2","win01","plank","winfl","plan1","gras3"],
      ["gras2","grass","grass","grass","grass","grass","grass","grass","grass","plan3","plan5","door","plan7","plan4","gras3"],
      ["gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","gras3"],
      ["gras6","gras4","gras4","gras4","gras4","gras4","gras4","gras4","gras4","gras4","gras4","gras4","gras4","gras4","gras7"],

    ],
    grid_mid: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".","mud9","mud7","mud7","mud8",".",".",".",".",".",".",".",".",".","."],
      [".","mud5","copst","tinst","mud6",".",".",".",".",".",".",".",".",".","."],
      [".","mud3","mud2","mud2","mud4",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".","stfl6","stfl4","stfl4","stfl5",".",".",".",".",".",".",".",".",".","."],
      [".","stfl2","stfl1","stfl1","stfl3",".",".",".",".",".",".",".",".",".","."],
      [".","stfl2","stfl1","stfl1","stfl3",".",".",".",".",".",".",".",".",".","."],
      [".","stfl9","stfl7","stfl7","stfl8",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    ],
    grid_top: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".","sig1","roo2","roof","roof","roof","roo1","brrg"],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],

    ],
  },


};

window.TILE_DEFS = {
  //GROUND
  grass: { img: "assets/tiles/terrain/grass/grass01.png", walkable: true, description: "Soft grass." },
  gras1: { img: "assets/tiles/terrain/grass/grass02.png", walkable: true, description: "Soft grass." },
  gras2: { img: "assets/tiles/terrain/grass/grassEndLeft.png", walkable: true, description: "Soft grass." },
  gras3: { img: "assets/tiles/terrain/grass/grassEndRight.png", walkable: true, description: "Soft grass." },
  gras4: { img: "assets/tiles/terrain/grass/grassEndDown.png", walkable: true, description: "Soft grass." },
  gras5: { img: "assets/tiles/terrain/grass/grassEndTop.png", walkable: true, description: "Soft grass." },
  gras6: { img: "assets/tiles/terrain/grass/grassEndDownLeft.png", walkable: true, description: "Soft grass." },
  gras7: { img: "assets/tiles/terrain/grass/grassEndDownRight.png", walkable: true, description: "Soft grass." },
  gras8: { img: "assets/tiles/terrain/grass/grassEndTopLeft.png", walkable: true, description: "Soft grass." },
  gras9: { img: "assets/tiles/terrain/grass/grassEndTopRight.png", walkable: true, description: "Soft grass." },


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
  ston: { img: "assets/tiles/terrain/stoneSingleTile.png", walkable: true, description: "A solid stone." },
  
  sto1: { img: "assets/tiles/terrain/stonePath/stonePath1.png", walkable: true, description: "A path made of stone." },
  sto2: { img: "assets/tiles/terrain/stonePath/stonePath2.png", walkable: true, description: "A path made of stone." },
  sto3: { img: "assets/tiles/terrain/stonePath/stonePathUpDown.png", walkable: true, description: "A path made of stone." },
  sto4: { img: "assets/tiles/terrain/stonePath/stonePathLeftRight.png", walkable: true, description: "A path made of stone." },
  sto5: { img: "assets/tiles/terrain/stonePath/stonePathUpDownLeft.png", walkable: true, description: "A path made of stone." },
  sto6: { img: "assets/tiles/terrain/stonePath/stonePathUpDownRight.png", walkable: true, description: "A path made of stone." },
  sto7: { img: "assets/tiles/terrain/stonePath/stonePathUpRight.png", walkable: true, description: "A path made of stone." },
  sto8: { img: "assets/tiles/terrain/stonePath/stonePathUpLeft.png", walkable: true, description: "A path made of stone." },
  sto9: { img: "assets/tiles/terrain/stonePath/stonePathUp.png", walkable: true, description: "A path made of stone." },

  //MUD
  mud1: { img: "assets/tiles/terrain/mud/mud.png", walkable: true, description: "dried up mud." },
  mud2: { img: "assets/tiles/terrain/mud/mudEndDown.png", walkable: true, description: "dried up mud." },
  mud3: { img: "assets/tiles/terrain/mud/mudEndDownLeft.png", walkable: true, description: "dried up mud." },
  mud4: { img: "assets/tiles/terrain/mud/mudEndDownRight.png", walkable: true, description: "dried up mud." },
  mud5: { img: "assets/tiles/terrain/mud/mudEndLeft.png", walkable: true, description: "dried up mud." },
  mud6: { img: "assets/tiles/terrain/mud/mudEndRight.png", walkable: true, description: "dried up mud." },
  mud7: { img: "assets/tiles/terrain/mud/mudEndTop.png", walkable: true, description: "dried up mud." },
  mud8: { img: "assets/tiles/terrain/mud/mudEndTopRight.png", walkable: true, description: "dried up mud." },
  mud9: { img: "assets/tiles/terrain/mud/mudEndTopLeft.png", walkable: true, description: "dried up mud." },



  //Minables
  copst: {
    img: "assets/tiles/terrain/minable/copperStone.png", // <- sjekk at dette er riktig sti
    walkable: false,
    description: "Stone filled with copper.",

    // mining-data
    mining: {
      toolAction: "mining",      // hva slags tool som kreves
      minLevel: 1,
      xp: 12,
      hitsRequired: 3,           // hvor mange "slag" for å mine den
      respawnMs: 20000,          // 20 sek respawn
      drop: { itemId: "copperOre", qtyMin: 1, qtyMax: 1 }
    }
  },

  tinst: {
    img: "assets/tiles/terrain/minable/tinStone.png", // <- sjekk at dette er riktig sti
    walkable: false,
    description: "Stone filled with tin.",

    // mining-data
    mining: {
      toolAction: "mining",      // hva slags tool som kreves
      minLevel: 1,
      xp: 12,
      hitsRequired: 3,           // hvor mange "slag" for å mine den
      respawnMs: 20000,          // 20 sek respawn
      drop: { itemId: "tinOre", qtyMin: 1, qtyMax: 1 }
    }
  },

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
  roo1:  { img: "assets/tiles/house/roofTopEndRight.png", walkable: false, description: "Waterproof roof." },
  roo2:  { img: "assets/tiles/house/roofTopEndLeft.png", walkable: false, description: "Waterproof roof." },
  brlf:  { img: "assets/tiles/house/roofTopBarLeft.png", walkable: false, description: "Waterproof roof." },
  brrg:  { img: "assets/tiles/house/roofTopBarRight.png", walkable: false, description: "Waterproof roof." },
  plank: { img: "assets/tiles/house/plankTile.png", walkable: false, description: "Handcrafted quality planks." },
  plan1: { img: "assets/tiles/house/plankRight.png", walkable: false, description: "Handcrafted quality planks." },
  plan2: { img: "assets/tiles/house/plankLeft.png", walkable: false, description: "Handcrafted quality planks." },
  plan3: { img: "assets/tiles/house/plankLeftGrass.png", walkable: false, description: "Handcrafted quality planks." },
  plan4: { img: "assets/tiles/house/plankRightGrass.png", walkable: false, description: "Handcrafted quality planks." },
  plan5: { img: "assets/tiles/house/plankGrass.png", walkable: false, description: "Handcrafted quality planks." },
  plan6: { img: "assets/tiles/house/plankGrassEndRight.png", walkable: false, description: "Handcrafted quality planks." },
  plan7: { img: "assets/tiles/house/plankGrassEndLeft.png", walkable: false, description: "Handcrafted quality planks." },

  //Stone/house
  stfl1: { img: "assets/tiles/house/stone/stoneFloor.png", walkable: true, description: "Ground as hards as stone." },
  stfl2: { img: "assets/tiles/house/stone/stoneFloorEndLeft.png", walkable: true, description: "Ground as hards as stone." },
  stfl3: { img: "assets/tiles/house/stone/stoneFloorEndRight.png", walkable: true, description: "Ground as hards as stone." },
  stfl4: { img: "assets/tiles/house/stone/stoneFloorEndTop.png", walkable: true, description: "Ground as hards as stone." },
  stfl5: { img: "assets/tiles/house/stone/stoneFloorEndTopRight.png", walkable: true, description: "Ground as hards as stone." },
  stfl6: { img: "assets/tiles/house/stone/stoneFloorEndTopLeft.png", walkable: true, description: "Ground as hards as stone." },
  stfl7: { img: "assets/tiles/house/stone/stoneFloorEndDown.png", walkable: true, description: "Ground as hards as stone." },
  stfl8: { img: "assets/tiles/house/stone/stoneFloorEndDownRight.png", walkable: true, description: "Ground as hards as stone." },
  stfl9: { img: "assets/tiles/house/stone/stoneFloorEndDownLeft.png", walkable: true, description: "Ground as hards as stone." },


  //Signs
  sig1: { img: "assets/tiles/house/Signs/signInnRoofLeft.png", walkable: true, description: "A place to rest and feast." },


  flor2: { img: "assets/tiles/house/floorTile.png", walkable: true, description: "Ground, just inside...." },
  win01: { img: "assets/tiles/house/window01.png", walkable: false, description: "windproof windows." },
  winfl: { img: "assets/tiles/house/window01SunFlower.png", walkable: false, description: "windproof windows with a flower." },
  winlg: { img: "assets/tiles/house/window01Light.png", walkable: false, description: "The light is on it seems" },

  //Mobler
  chai1: { img: "assets/tiles/house/mobler/chair1/chairRight.png", walkable: true, description: "Simple chair to relax on." },
  chai2: { img: "assets/tiles/house/mobler/chair1/chairLeft.png", walkable: true, description: "Simple chair to relax on." },
  chai3: { img: "assets/tiles/house/mobler/chair1/chairBack.png", walkable: true, description: "Simple chair to relax on." },


  tabl1: { img: "assets/tiles/house/mobler/table/tableTopLeft.png", walkable: false, description: "Table." },
  tabl2: { img: "assets/tiles/house/mobler/table/tableTopRight.png", walkable: false, description: "Table." },
  tabl3: { img: "assets/tiles/house/mobler/table/tableMidLeft.png", walkable: false, description: "Table." },
  tabl4: { img: "assets/tiles/house/mobler/table/tableMidRight.png", walkable: false, description: "Table." },
  tabl5: { img: "assets/tiles/house/mobler/table/tableMid.png", walkable: false, description: "Table." },
  tabl6: { img: "assets/tiles/house/mobler/table/tableEndLeft.png", walkable: false, description: "Table." },
  tabl7: { img: "assets/tiles/house/mobler/table/tableEndRight.png", walkable: false, description: "Table." },

  patn1: { img: "assets/tiles/house/mobler/misc/paintingHW25.png", walkable: false, description: "Painting from the halloween event 2025 on voidmarket." },
  patn2: { img: "assets/tiles/house/mobler/misc/paintingXmas25.png", walkable: false, description: "Painting from the christmas event 2025 on voidmarket." },





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



