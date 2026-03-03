
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
        id: "blacksmith_01",
        name: "Blacksmith Yorn",
        x: 263, //horisontalt 
        y: 245, //vertikalt 
        sprites: [
          "assets/npcs/blacksmith/blacksmith_idle1.png",
          "assets/npcs/blacksmith/blacksmith_idle2.png"
        ],
        trader: true,
        shop: [
          { itemId: "tinBar", cost: { itemId: "tinOre", qty: 5 } },
          { itemId: "copperBar", cost: { itemId: "copperOre", qty: 5 } },
          { itemId: "bronzeBar", cost: { itemId: "coins", qty: 100 } },
          { itemId: "bronzeArmor", cost: { itemId: "bronzeBar", qty: 5 } },
          { itemId: "pickaxe", cost: { itemId: "coins", qty: 5 } },
          { itemId: "axe", cost: { itemId: "coins", qty: 5 } },
          { itemId: "fishingRod", cost: { itemId: "coins", qty: 5 } },


        ],
        idleMs: 540,        // hvor ofte den bytter frame
        dialogId: "blacksmith_01",
        drawWTiles:1, 
        drawHTiles:1
      },

      {
        id: "church_warden_normal",
        name: "Church Warden",
        x: 224, //horisontalt +1
        y: 234, //vertikalt +1
        sprites: [
          "assets/npcs/church_warden/church_warden_normal.png",
          "assets/npcs/church_warden/church_warden_normal_idle.png"
        ],
        churchwarden: true,
        respawnPoint: { levelId: "spenningsbyen", x: 233, y: 236 },
        idleMs: 600,
        dialogId: "graveyard_warden",
        drawWTiles:1, 
        drawHTiles:1
      },

        // --- ANIMALS  ---
      {
        id: "cow_01",
        name: "Cow",
        x: 238, //horisontalt +1
        y: 248, //vertikalt +1

        sprites: [
          "assets/npcs/animals/cow/cow_left.png",
          "assets/npcs/animals/cow/cow_idle.png"
        ],
        idleMs: 500,
        hostile: true,
        maxHp: 6,
        hitChance: 0.1,
        attackSpeedMs: 7000,
        maxHit: 1,
        respawnMs: 20000,
        roaming: false,
        roamRadius: 4,             // tiles
        roamMinWaitMs: 900,
        roamMaxWaitMs: 5000,
        drawWTiles:1, 
        drawHTiles:1
      },
      {
        id: "cow_01",
        name: "Cow",
        x: 243, //horisontalt +1
        y: 247, //vertikalt +1
        sprites: [
          "assets/npcs/animals/cow/cow_left.png",
          "assets/npcs/animals/cow/cow_idle.png"
        ],
        idleMs: 500,
        hostile: true,
        maxHp: 6,
        hitChance: 0.1,
        attackSpeedMs: 7000,
        maxHit: 1,
        respawnMs: 20000,
        drawWTiles:1, 
        drawHTiles:1
      },
      {
        id: "cow_01",
        name: "Cow",
        x: 241, //horisontalt +1
        y: 245, //vertikalt +1
        sprites: [
          "assets/npcs/animals/cow/cow_left.png",
          "assets/npcs/animals/cow/cow_idle.png"
        ],
        idleMs: 500,
        hostile: true,
        maxHp: 6,
        hitChance: 0.1,
        attackSpeedMs: 7000,
        maxHit: 1,
        respawnMs: 20000,
        drawWTiles:1, 
        drawHTiles:1
      },
      {
        id: "cow_01",
        name: "Cow",
        x: 238, //horisontalt +1
        y: 246, //vertikalt +1
        sprites: [
          "assets/npcs/animals/cow/cow_left.png",
          "assets/npcs/animals/cow/cow_idle.png"
        ],
        idleMs: 500,
        hostile: true,
        maxHp: 6,
        hitChance: 0.1,
        attackSpeedMs: 7000,
        maxHit: 1,
        respawnMs: 20000,
        drawWTiles:1, 
        drawHTiles:1
      },

        // --- ENEMY  ---
      {
        id: "goblin_01",
        name: "Goblin",
        x: 226,
        y: 231,

        // du legger inn assets senere:
        sprites: [
          "assets/npcs/goblin/goblin.png",
          "assets/npcs/goblin/goblin_idle1.png"
        ],
        weaponFxSprite: "assets/items/club.png",
        idleMs: 450,

        hostile: true,     // enemy :)
        maxHp: 6,
        hitChance: 0.50,
        attackSpeedMs: 3000,
        maxHit: 1,
        respawnMs: 20000,
        drawWTiles:1, 
        drawHTiles:1
      }

    ],
      // --------- PORTALS  ---------
    portals: [
      {
        x: 238, y: 237,                 // hvor døra står i denne levelen
        toLevel: "gatherers_inn",           // nivået du går inn i
        toSpawn: { x: 7, y: 1 },       // hvor du spawner inne
        label: "Enter"                // tekst i meny
      },
      {
        x: 229, y: 238,
        toLevel: "bank_spenningsbyen",
        toSpawn: { x: 7, y: 1 }, 
        label: "Enter" 
      }
    ],

    // disse settes automatisk når TMJ loader:
    grid_base: null,
    grid_mid: null,
    grid_top: null,

  },

  bank_spenningsbyen: {
    id: "bank_spenningsbyen",
    name: "Bank",
    width: 10,
    height: 5,
    spawn: { x: 5, y: 5 },
    edges: { north: null, south: null, west: null, east: null },

    npcs: [
      {
        id: "banker_01",
        name: "banker",
        x: 5, //horisontalt 
        y: 2, //vertikalt 
        sprites: [
          "assets/npcs/banker/banker_down.png",
          "assets/npcs/banker/banker_down_idle.png"
        ],
        banker: true,
        idleMs: 500,
        dialogId: "banker_intro",
        //roaming
        roaming: false,
        roamRadius: 4,             // tiles
        roamMinWaitMs: 900,
        roamMaxWaitMs: 5000,
        drawWTiles:1, 
        drawHTiles:1,
      },

    ],

    // Dør inne som går ut til spenningsbyen
    portals: [
      {
        x: 7, y: 1,                 // dørtile inne i huset
        toLevel: "spenningsbyen",
        toSpawn: { x: 229, y: 239 },     // spawner utenfor døra
        label: "Exit"
      }
    ],

    grid_base: [
      ["plank","plank","plank","plank","plank","plank","plank","plank","plank","plank"],
      ["plank","plank","plank","plank","plank","plank","plank","door","plank","plank"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
    ],
    grid_mid: [
      [".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".","."],
      [".","chai2","tabl1","tabl2","chai1","."],

    ],
    grid_top: [
      [".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".","."],
    ],
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
        id: "inn_keeper_spenningsbyen",
        name: "Oleander",
        x: 12, //horisontalt 
        y: 2, //vertikalt 
        sprites: [
          "assets/npcs/oleander/oleander_down.png",
          "assets/npcs/oleander/oleander_down_idle1.png"
        ],
        idleMs: 550,
        drawWTiles:1, 
        drawHTiles:1,
        dialogId: "guide_intro",
      },

    ],

    // Dør inne som går ut til spenningsbyen
    portals: [
      {
        x: 7, y: 1,                 // dørtile inne i huset
        toLevel: "spenningsbyen",
        toSpawn: { x: 238, y: 237 },     // spawner utenfor døra
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
        toSpawn: { x: 236, y: 234 },     // spawner utenfor døra
        label: "Exit"
      }
    ],

    grid_base: [
      ["gras8","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras5","gras9"],
      ["gras2","grass","grass","grass","grass","grass","grass","door","grass","grass","grass","grass","grass","grass","gras3"],
      ["gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","gras3"],
      ["gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","gras3"],
      ["gras2","doc2","dock","dock","dock","dock","dock","dock","dock","dock","dock","dock","dock","doc1","gras3"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0"],

    ],
    grid_mid: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".","pole0",".",".",".",".",".",".",".",".",".",".",".","pole0","."],
      [".","doc7","doc4","doc5","doc5","doc4","doc3","doc5","doc4","doc5","doc5","doc4","doc5","doc6","."],
      [".",".",".",".",".",".","doc3",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".","doc3",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".","doc8",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
    ],
    grid_top: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
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

  // -------------------- FISHING SPOTS --------------------
  // NB: Dette er kun tile-definisjon (grafikk + krav + respawn).
  // nodeKey (= tile key) brukes som nøkkel

  fish1: {
    //img: "assets/tiles/terrain/fishing/fishingSpot1.png",

    animated: true,
    frameDuration: 720, // ms per frame
    frames: [
      "assets/tiles/terrain/water/fish_spot_1/1.png",
      "assets/tiles/terrain/water/fish_spot_1/2.png",
      "assets/tiles/terrain/water/fish_spot_1/3.png",
      "assets/tiles/terrain/water/fish_spot_1/4.png",
    ],
    walkable: false,
    description: "There is plenty of fish here!",
    fishing: {
      toolAction: "fishing",
      minLevel: 1,
      xp: 10,
      catchesRequired: 4,   // hvor mange fisk/junk før spot går i cooldown
      respawnMs: 12000      // spot kommer tilbake etter 12s
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

  //DOCK
  dock:{ img: "assets/tiles/dock/dock_mid.png", walkable: true, description: "planks built to withstand the power of waves." },
  doc1:{ img: "assets/tiles/dock/dock_end_right.png", walkable: true, description: "planks built to withstand the power of waves." },
  doc2:{ img: "assets/tiles/dock/dock_end_left.png", walkable: true, description: "planks built to withstand the power of waves." },
  doc3:{ img: "assets/tiles/dock/dock_end_left_right.png", walkable: true, description: "planks built to withstand the power of waves." },

  doc4:{ img: "assets/tiles/dock/dock_end_down_mid_beam.png", walkable: false, description: "planks built to withstand the power of waves." },
  doc5:{ img: "assets/tiles/dock/dock_end_down_mid.png", walkable: false, description: "planks built to withstand the power of waves." },
  doc6:{ img: "assets/tiles/dock/dock_end_down_right_beam.png", walkable: false, description: "planks built to withstand the power of waves." },
  doc7:{ img: "assets/tiles/dock/dock_end_down_left_beam.png", walkable: false, description: "planks built to withstand the power of waves." },
  doc8:{ img: "assets/tiles/dock/dock_end_down_left_right_beam.png", walkable: false, description: "planks built to withstand the power of waves." },



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

  //Bricks/house
  brcs: { img: "assets/tiles/house/bricks/bricks.png", walkable: false, description: "Hot clay that has dried up..." },
  brc1: { img: "assets/tiles/house/bricks/bricks_down_end_left.png", walkable: false, description: "Hot clay that has dried up..." },
  brc2: { img: "assets/tiles/house/bricks/bricks_down_end_right.png", walkable: false, description: "Hot clay that has dried up..." },
  brc3: { img: "assets/tiles/house/bricks/bricks_down_mid.png", walkable: false, description: "Hot clay that has dried up..." },
  brc4: { img: "assets/tiles/house/bricks/bricks_mid_left.png", walkable: false, description: "Hot clay that has dried up..." },
  brc5: { img: "assets/tiles/house/bricks/bricks_mid_right.png", walkable: false, description: "Hot clay that has dried up..." },
  brc6: { img: "assets/tiles/house/bricks/bricks_top_end_left.png", walkable: false, description: "Hot clay that has dried up..." },
  brc7: { img: "assets/tiles/house/bricks/bricks_top_end_right.png", walkable: false, description: "Hot clay that has dried up..." },
  brc8: { img: "assets/tiles/house/bricks/bricks_top_end_mid.png", walkable: false, description: "Hot clay that has dried up..." },

  brrf: { img: "assets/tiles/house/bricks/bricks_roof_top.png", walkable: false, description: "Hot clay that has dried up..." },

  brwn: { img: "assets/tiles/house/bricks/brck_win.png", walkable: false, description: "windproof windows." },

  //Signs
  sig1: { img: "assets/tiles/house/Signs/signInnRoofLeft.png", walkable: true, description: "A place to rest and feast." },

  //MISC
  //camfr: { img: "assets/tiles/terrain/misc/campfire.png", walkable: false, description: "Eternal campfire for cooking and resting." },

  camfr: {
    name: "Campfire",
    description: "Eternal campfire for cooking and resting.",
    img: "assets/tiles/terrain/misc/campfire.png",
    walkable: false,
    useShopId: "campfire_01",
    useLabel: "Use",
  },

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



  tree: {
    img: "assets/tiles/terrain/tree/treeStomp.png",
    walkable: false,
    description: "A sturdy tree.",

    woodcutting: {
      toolAction: "woodcutting",
      minLevel: 1,
      xp: 10,
      hitsRequired: 3,
      respawnMs: 20000,
      drop: { itemId: "woodLog", qtyMin: 1, qtyMax: 1 }
    }
  },
  tre2: { img: "assets/tiles/terrain/tree/treeTop.png", walkable: true, description: "Tree Top!" },
  tre1: { img: "assets/tiles/terrain/tree/treeMid.png", walkable: true, description: "Middle of the tree." },
  tre3: { img: "assets/tiles/terrain/tree/treeSingle.png", walkable: false, description: "Too small of a tree to get any logs." },


  door: {
    img: "assets/tiles/house/door01.png",  
    walkable: false,
    description: "A sturdy door.",
    actions: ["enter"]
  },

  //brick door
  brdr: {
    img: "assets/tiles/house/bricks/brick_door.png",   
    walkable: false,
    description: "A sturdy door.",
    actions: ["enter"]
  },

};


// Items / top-layer (ting du kan plukke opp, eller som ligger på bord)
window.ITEM_DEFS = {};



