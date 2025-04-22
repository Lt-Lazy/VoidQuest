----------------------SOCIALS---------------------------
Web: voidquest.org
Discord: https://discord.gg/UP67kGYmQE
Reddit: r/VoidQuestRPG
Patreon: Voidquest


----------------------ting som må fikses-----------------
Lage skin for Nodin
voidlore merchant shop er litt rar, se feilmeldinger i consol
Fikse molten dungeon nivå (design)



---------------------------PATCH NOTES--------------------

patch notes 1.0

la til fisker knyttet til nivå
bar som viser hvor lang tid du har før fisken rømmer
la til Music ute
la til fange fisk lyd, mistet fisk og napp

patch notes 1.1
NPC system
Byttet til bare 1 save
Lore

patch 1.2
flere skapninger
nytt fange system
npc dialoger 
inspect fisk i journalen med hover

---------------------------NPC-----------------------------

Navn: Morgan the sailer
Plassering: Spenningsbyen, Hus Hub
Type: Shop
Notater:
Morgan: Meaning “child of the sea” in Welsh


Navn: Path Seeker Nodin
Plassering: Spenningsbyen, Hus Hub
Type: Lore
Notater:
Nodin: Meaning “windy day” in Native American.

Navn: Nocturne
Plassering: Spenningsbyen
Type: Lore
Notater:
Nocturne: Meaning “night” in Latin

Navn: Oleander the hunter
Plassering: Yurborg
Type: Shop_land
Notater:
Oleander: Meaning “evergreen tree” in Greek¨.
medlem av moss clan

Name: Deep Void Lure
Plasserig: Spenningsbyena
Type: Creature/lore
Notater:
Dialog som hinter til at fisken kan føle at han er path seeker

---------------------------LOKASJONER-----------------------------
Kontinent:
- Voidlore

Byer:
- Spenningsbyen
	Gatherers hub
	Deep Void Cave
- Yurborg

Stier:
- Sti-1

---------------------------SKAPNINGER-----------------------------
pixel art bilde størrelse:
spiller, npc, skapninger: 32x32
bosser: 200x200


Common: Pris 5-20, Chance 200-1000
Rare: Pris 20-100, Chance 20-200
Legendary: Pris 100-1000, Chance 5-20
Mythical: 1000-5000, Chance 1-5
Secret: 0-0, Chance error

Land:
Common:
- Grey Mouse, overalt, chance: 800
Rare:
- Poisetle, alt gress, chance: 100
- Albino mouse, overalt,  chance: 50

Legendary:

Vann:
Common:
- Grodr, ferskvann, chance: 900
- Grauder, ferskvann, Chance: 800
- Krap, saltvann, chance: 900

Rare:
- Skuggosk, Deep Void Cave, chance: 80
- Blue Krap, saltvann, chance: 45

Legendary:
- Deep Void Lure, Deep Void Cave, chance: 10
- Albino Krap, saltvann, chance: 7
- Great White, saltvann, chance 15

Mythical:
- Elder Great White, saltvann, chance 4

SEASONAL:

BOSSER:
Common:
- The Abyss Beast, the-veiled-abyss
	- item

Rare

Legendary




---------------------------Grupper
Moss clan


---------------------------HUSKLISTE-----------------------------
LEGGER TIL NYE NIVÅER 
oppdater loadlevel(…)

const levelNames = {
  0: "Spenningsbyen",
  1: "Hus Hub",
  2: "Cave",
  3: "Troférom"
};
---------
Legge til nye rarities husk å legge til i denne listen

const order = { common: 1, rare: 2, legendary: 3 };
---------
Om du skal legge til at en type npc slår ut en funksjon.
Legg til den typen og funksjonen her

if (npc.type === "shop") {
  openShop();
} else if (npc.type === "gatekeeper") {
  checkForCaveKey();
}
-------
funksjon som bytter tile
changeTile(levelIndex, x, y, newTileChar)
changeTile(0, 3, 3, C) eksempel
--------
legget til commandoer:
function handleCommand(cmd)
---------
når legger til nye taster som f.eks "h"
legg til denne før (de eksisterende taster)
if (document.activeElement.tagName === "INPUT") return;
--------

Trenger jeg denne? 
const character = {
  x: 0, y: 0,
  pixelX: 0, pixelY: 0,
  direction: 'down',
  moving: false
};




