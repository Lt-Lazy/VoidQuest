
window.TILE_SIZE = 32;
window.EMPTY = "tomt";

window.LEVELS = {
  spenningsbyen: {
    id: "spenningsbyen",
    overworld: true,
    name: "spenningsbyen",
    width: 60,
    height: 40,
    spawn: { x: 4, y: 4 },
    edges: { north: null, south: null, west: null, east: null },

    npcs: [
      {
        id: "guide_01",
        name: "Guide",
        x: 6, //horisontalt +1
        y: 2, //vertikalt +1
        sprites: [
          "assets/npcs/oleander/oleanderDown.png",
          "assets/npcs/oleander/oleanderDownIdle1.png"
        ],
        idleMs: 550,        // hvor ofte den bytter frame (valgfritt)

        dialogId: "guide_intro"
      }
    ],

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
      //=001=====002=====003=====004=====005=====006=====007=====008=====009=====010=====011=====012=====013=====014=====015=====016=====017=====018=====019=====020=====021=====022=====023=====024=====025=====026=====027=====028=====029=====030=====031=====032=====033=====034=====035=====036=====037=====038=====039=====040=====041=====042=====043=====044=====045=====046=====047=====048=====049=====050=====051=====052=====053=====054=====055=====056=====057=====058=====059=====060
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"], //001
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","plank","door","plank","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","gras2","gras2","gras2","gras2","gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","gras2","gras2","gras2","gras2","gras2","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],
      ["wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","wate0","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass","grass"],

    ],

    // MID: trær/steiner (transparent bakgrunn), ellers "."
    grid_mid: [
      ["tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3","tre3"],
      ["tre3","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tre3","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tre3","tomt","win01","tomt","winfl","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tree","tree","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tre3","sto5","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3","sto3"],
      ["tre3","tomt","tomt","pole4","tomt","pole1","fenc0","pol10","fenc0","pole8","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tre3","tomt","tomt","pole5","tomt","tomt","tomt","fenc1","tomt","pole5","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tre3","tomt","tomt","pol11","fenc0","fenc0","fenc0","pol14","fenc0","pol12","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1","wate1"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"]
    ],

    grid_top: [
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tre2","tre2","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","brlf","roof","roof","roof","brrg","tomt","tomt","tomt","tomt","tomt","tomt","tre1","tre1","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"],
      ["tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt","tomt"]
    ],
  },

  gatherers_inn: {
    id: "gatherers_inn",
    name: "Gatherers Inn",
    width: 17,
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
      ["plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank","plank"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","door"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"],
      ["flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2","flor2"]
    ],
    grid_mid: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."]
    ],
    grid_top: [
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
      [".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."]
    ],
  },


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
  ston: { img: "assets/tiles/terrain/stoneSingleTile.png", walkable: true, description: "A solid stone." },
  
  sto1: { img: "assets/tiles/terrain/stonePath/stonePath1.png", walkable: true, description: "A path made of stone." },
  sto2: { img: "assets/tiles/terrain/stonePath/stonePath2.png", walkable: true, description: "A path made of stone." },
  sto3: { img: "assets/tiles/terrain/stonePath/stonePathUpDown.png", walkable: true, description: "A path made of stone." },
  sto4: { img: "assets/tiles/terrain/stonePath/stonePathLeftRight.png", walkable: true, description: "A path made of stone." },
  sto5: { img: "assets/tiles/terrain/stonePath/stonePathUpDownLeft.png", walkable: true, description: "A path made of stone." },
  sto6: { img: "assets/tiles/terrain/stonePath/stonePathUpDownRight.png", walkable: true, description: "A path made of stone." },
  sto7: { img: "assets/tiles/terrain/stonePath/stonePathUpRight.png", walkable: true, description: "A path made of stone." },
  sto8: { img: "assets/tiles/terrain/stonePath/stonePathUpLeft.png", walkable: true, description: "A path made of stone." },

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
  flor2: { img: "assets/tiles/house/floorTile.png", walkable: true, description: "Ground, just inside...." },
  win01: { img: "assets/tiles/house/window01.png", walkable: false, description: "windproof windows." },
  winfl: { img: "assets/tiles/house/window01SunFlower.png", walkable: false, description: "windproof windows with a flower." },

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
