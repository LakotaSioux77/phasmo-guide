/* =========================================================================
   maps.js — 17 playable maps (13 base + 4 Restricted), v0.19.1.0
   cursed: one fixed spot per possession type per map.
     floor = level name used to group markers on the schematic board
     room  = room / area
     dir   = directions from the entrance, in our own words
   Fuse boxes and hiding spots: not yet verified for 2026 layouts → shown as
   "Unverified" in the app instead of guessed.
   ========================================================================= */
window.PD = window.PD || {};

PD.mapRules = {
  sizes: "Small maps allow 9 lights on at once, medium 8, large 7 — exceed it and the breaker trips.",
  restricted: "Restricted variants block off part of a large map. Prison Restricted and Brownstone Restricted have several layouts picked at random each contract.",
  ghostRoom: "The ghost spawns in a room that is usually its favourite room. Any room inside the investigation area can be the ghost room (some large maps exclude a few rooms).",
  src: ["wiki_map","vpe_restricted","kg_v01900"]
};

PD.maps = [
{ id: "tanglewood", name: "6 Tanglewood Drive", size: "Small", levels: ["Ground floor","Basement","Garage"], rooms: "12", rework: "Visual overhaul with basement and kitchen layout changes (v0.16.0.0, Mar 3, 2026)",
  cursed: {
    tarot:    { floor: "Ground floor", room: "Living room", dir: "Small table in the far-right corner of the living room, beside the house phone." },
    ouija:    { floor: "Basement", room: "Basement (train set)", dir: "Go down to the basement; at the far end of the model train set, bottom shelf of the small control table." },
    musicbox: { floor: "Ground floor", room: "Third bedroom on the left", dir: "Down the main hallway, third bedroom on the left (next to the living room), inside the little safe in the closet." },
    paw:      { floor: "Garage", room: "Garage", dir: "In the garage, resting on a fertilizer bag next to tan gloves." },
    mirror:   { floor: "Ground floor", room: "Bedroom by the living room", dir: "Doorway on the left near the living room leads to a bedroom — mirror on the wall beside the door." },
    circle:   { floor: "Basement", room: "Basement (workbench)", dir: "Basement, back section, on the floor by the workbench." },
    voodoo:   { floor: "Ground floor", room: "Children's bedroom", dir: "Children's bedroom on the left of the main hallway — on the floor beside the giant teddy bear, right side of the bed." }
  },
  tips: ["Compact: a single long hallway connects most bedrooms — easy to get cornered at its end.", "Check the basement early; two possessions spawn there."],
  src: ["tg_cursed"] },

{ id: "edgefield", name: "42 Edgefield Road", size: "Small", levels: ["Ground floor","Upstairs","Basement"], rooms: "16",
  cursed: {
    tarot:    { floor: "Ground floor", room: "Entrance", dir: "Just inside the front door on the right: white dresser with a green dish — cards beside the bowl." },
    ouija:    { floor: "Ground floor", room: "Utility room", dir: "Back-left corner utility room on the ground floor, on the floor in front of the shelving." },
    musicbox: { floor: "Ground floor", room: "Living room", dir: "Turn left from the entrance into the living room; white dresser with a green bowl and lamp." },
    paw:      { floor: "Upstairs", room: "Orange bedroom", dir: "Upstairs, the orange bedroom on your right — on the blue/pink changing table." },
    mirror:   { floor: "Ground floor", room: "Entrance / stairs", dir: "Hanging on the wall next to the stairs as you walk in." },
    circle:   { floor: "Basement", room: "Basement", dir: "Basement floor, between the shelving stacks." },
    voodoo:   { floor: "Upstairs", room: "Blue bedroom", dir: "Upstairs, turn left and follow the hall to the blue bedroom — on the bed." }
  },
  tips: ["Three levels: track which floor activity comes from.", "The basement has few escape routes."],
  src: ["tg_cursed"] },

{ id: "ridgeview", name: "10 Ridgeview Court", size: "Small", levels: ["Ground floor","Upstairs","Basement"], rooms: "16",
  cursed: {
    tarot:    { floor: "Ground floor", room: "Entrance", dir: "Small table right behind the front door when it opens." },
    ouija:    { floor: "Ground floor", room: "Utility closet", dir: "Through the dining room to a hallway with two facing doors; the utility closet on the left, on the shelves." },
    musicbox: { floor: "Upstairs", room: "Bedroom (blue rug)", dir: "Upstairs, left hallway, room on the right with a big bed and blue rug — dresser on your left." },
    paw:      { floor: "Upstairs", room: "Bedroom with desk", dir: "Upstairs, right hallway, room on the right — white desk with a laptop and green book." },
    mirror:   { floor: "Ground floor", room: "Opposite basement stairs", dir: "On the wall above the dresser facing the basement stairs." },
    circle:   { floor: "Basement", room: "Basement", dir: "Down in the basement, straight across from the door." },
    voodoo:   { floor: "Ground floor", room: "Computer nook", dir: "Left from the entrance into the small computer area — on the blue bench seat." }
  },
  tips: ["Loop around the ground-floor rooms when the ghost is downstairs.", "Basement circle is a long way from the exit."],
  src: ["tg_cursed"] },

{ id: "willow", name: "13 Willow Street", size: "Small", levels: ["Ground floor","Basement"], rooms: "10 (pre-rework count)", rework: "Reworked v0.18.0.0 (Jul 21, 2026): visual overhaul, layout kept with some rooms repurposed",
  cursed: {
    tarot:    { floor: "Basement", room: "Game room", dir: "Basement, turn left into the game room with the pool table — small table with playing cards." },
    ouija:    { floor: "Basement", room: "Laundry area", dir: "Basement, turn right — on the table beside the towel and laundry basket." },
    musicbox: { floor: "Ground floor", room: "Living room", dir: "Brown shelving unit with books and plants near the couch — first column, third shelf." },
    paw:      { floor: "Ground floor", room: "Painting room", dir: "Painting room, empty shelf on the right, next to the 'Painting Wildlife' book square." },
    mirror:   { floor: "Ground floor", room: "Gym", dir: "Gym area, on the wall above the small white table at the end of the treadmill." },
    circle:   { floor: "Ground floor", room: "Kitchen", dir: "Middle of the kitchen floor." },
    voodoo:   { floor: "Ground floor", room: "Master bedroom", dir: "Master bedroom with the bay window — far corner behind the white chair, on a pet bed." }
  },
  tips: ["All locations changed in the July 2026 rework — ignore older guides.", "Room count after the rework is not yet verified."],
  src: ["tg_cursed","kg_v01900"] },

{ id: "grafton", name: "Grafton Farmhouse", size: "Small", levels: ["Ground floor","Upstairs","Attic"], rooms: "14", rework: "Full rework (v0.14.0.0, Aug 12, 2025)",
  cursed: {
    tarot:    { floor: "Ground floor", room: "Library", dir: "Through the dining room, turn right to three doors; left door is the library — desk with a typewriter, left of it." },
    ouija:    { floor: "Attic", room: "Attic", dir: "In the attic, at the foot of a tall lamp." },
    musicbox: { floor: "Upstairs", room: "Room with a hole in the floor", dir: "Upstairs, the room with a big hole — on the nightstand by the bed." },
    paw:      { floor: "Ground floor", room: "Dining room", dir: "Walk straight to the dining room; dresser on the left of the table." },
    mirror:   { floor: "Upstairs", room: "Master bedroom", dir: "Upstairs master bedroom — on the dresser opposite the door." },
    circle:   { floor: "Upstairs", room: "Children's room", dir: "Upstairs children's room, back corner." },
    voodoo:   { floor: "Ground floor", room: "Seamstress room", dir: "Through the dining room, right to the three doors; right door — centre table." }
  },
  tips: ["Watch the hole upstairs when looping.", "Most possessions are on the ground floor near the dining room."],
  src: ["tg_cursed"] },

{ id: "bleasdale", name: "Bleasdale Farmhouse", size: "Medium", levels: ["Ground floor","Upstairs","Attic"], rooms: "21", rework: "Full rework (v0.12.0.1, Mar 10, 2025)",
  cursed: {
    tarot:    { floor: "Attic", room: "Fortune teller room", dir: "Deepest part of the attic, small fortune teller room — table next to the crystal ball." },
    ouija:    { floor: "Ground floor", room: "Living room", dir: "Straight through the double doors from the entrance; leaning on a couch near the incense." },
    musicbox: { floor: "Ground floor", room: "Tea room", dir: "Tea room immediately left of the front door — main shelf of the dish display, on a doily." },
    paw:      { floor: "Upstairs", room: "Study", dir: "Top of the stairs, door straight ahead into the study — corner bookshelf, main shelf." },
    mirror:   { floor: "Upstairs", room: "Trophy room", dir: "Upstairs, first room on the left — on the floor in the back-left corner." },
    circle:   { floor: "Ground floor", room: "Utility room", dir: "Left into the tea room, then through the door straight across into the utility room — on the floor." },
    voodoo:   { floor: "Upstairs", room: "Master bedroom", dir: "Upstairs, first door on the right — on the cushioned seat at the foot of the bed." }
  },
  tips: ["Three floors: use sound sensors per floor to find the room.", "Attic is a dead end."],
  src: ["tg_cursed"] },

{ id: "woodwind", name: "Camp Woodwind", size: "Small", levels: ["Campsite (outdoor)"], rooms: "11",
  cursed: {
    tarot:    { floor: "Campsite (outdoor)", room: "Picnic benches", dir: "Forward and left from the entrance to two picnic benches — left-most bench beside two blue books." },
    ouija:    { floor: "Campsite (outdoor)", room: "Games tent", dir: "White tents directly right of the entrance — the one with outdoor games, on the table." },
    musicbox: { floor: "Campsite (outdoor)", room: "Yellow tent", dir: "Yellow tent on the left side of the site — small white table inside." },
    paw:      { floor: "Campsite (outdoor)", room: "Platform by purple tent", dir: "Wooden platform beside the purple tent on the north side, next to marshmallows on sticks." },
    mirror:   { floor: "Campsite (outdoor)", room: "Centre tree", dir: "Centre of the camp, on the ground by the fairy-light tree near the cornhole board." },
    circle:   { floor: "Campsite (outdoor)", room: "Food tent", dir: "Right from the entrance past the campfire — white tent with food tables, centre of the floor." },
    voodoo:   { floor: "Campsite (outdoor)", room: "By the red tent", dir: "Straight across the camp to the big red tent; on the ground by the smaller blue tent to its left." }
  },
  tips: ["Outdoor: few doors to break line of sight — tents are your hiding spots.", "Weather affects visibility."],
  src: ["tg_cursed"] },

{ id: "nells", name: "Nell's Diner", size: "Small", levels: ["Diner (single floor)"], rooms: "14",
  cursed: {
    tarot:    { floor: "Diner (single floor)", room: "Front counter", dir: "Front entrance, big counter on the right — left of the register." },
    ouija:    { floor: "Diner (single floor)", room: "Janitor's closet", dir: "Side entrance, down the main hall — janitor's closet on the left, on an open cardboard box on the left side." },
    musicbox: { floor: "Diner (single floor)", room: "Manager's office", dir: "Side entrance, first room on the right — turn around, table with cacti behind the door." },
    paw:      { floor: "Diner (single floor)", room: "Kitchen", dir: "Kitchen (via the counter from the front, or first left from the side entrance) — on a cutting board at the near end of the counter." },
    mirror:   { floor: "Diner (single floor)", room: "Break room", dir: "Side entrance, down the hall to the break room — on a chair left of the vending machine." },
    circle:   { floor: "Diner (single floor)", room: "Men's bathroom", dir: "Long hallway with the bathrooms — men's room on the left, on the floor before the sinks." },
    voodoo:   { floor: "Diner (single floor)", room: "Booths", dir: "Front entrance, immediately left into the booths — far-left booth before the curved one, right-hand seat." }
  },
  tips: ["Two entrances — remember both for escapes.", "Kitchen is very dark and cluttered; bring light."],
  src: ["tg_cursed"] },

{ id: "maple", name: "Maple Lodge Campsite", size: "Medium", levels: ["Campsite (outdoor)","Cabins"], rooms: "28",
  cursed: {
    tarot:    { floor: "Campsite (outdoor)", room: "North picnic area", dir: "North path at the top of the site — picnic table with playing cards, centre of the table." },
    ouija:    { floor: "Cabins", room: "Bathroom block closet", dir: "Bathroom block to the right of the site — cleaning closet in the middle, on the shelf." },
    musicbox: { floor: "Campsite (outdoor)", room: "Back campfire", dir: "Campfire at the back of the map — on a log seat beside a red thermos." },
    paw:      { floor: "Campsite (outdoor)", room: "Staff storage", dir: "Right from the start to the staff storage area, then left — barrel along the fence by a light switch." },
    mirror:   { floor: "Cabins", room: "Reception", dir: "Straight into reception, turn left — on the wall above the couch by the window." },
    circle:   { floor: "Cabins", room: "Log cabin living room", dir: "Log cabin on the right side of the map — living room floor." },
    voodoo:   { floor: "Campsite (outdoor)", room: "Left campfire", dir: "Campfire on the left side — by a log, right of a guitar." }
  },
  tips: ["Huge outdoor area: use sound sensors to locate the ghost area first."],
  src: ["tg_cursed"] },

{ id: "pointhope", name: "Point Hope", size: "Medium", levels: ["Floor 1","Floor 3","Floor 4","Floor 5","Floor 6","Floor 7","Floor 8"], rooms: "16",
  cursed: {
    tarot:    { floor: "Floor 1", room: "Living room", dir: "Floor 1 living room — small table between the two green couches." },
    ouija:    { floor: "Floor 4", room: "Games room", dir: "Floor 4 games room — centre, on a low shelf." },
    musicbox: { floor: "Floor 6", room: "Bedroom", dir: "Floor 6 bedroom — on the small vanity with makeup and a mirror." },
    paw:      { floor: "Floor 8", room: "Workshop", dir: "Floor 8 — woodworking bench right of the stairs, lower right corner." },
    mirror:   { floor: "Floor 3", room: "Dining room", dir: "Floor 3 dining room — on the floor left of a blue cabinet." },
    circle:   { floor: "Floor 5", room: "Bathroom", dir: "Floor 5 bathroom — between the door and the tub." },
    voodoo:   { floor: "Floor 7", room: "Child's bedroom", dir: "Floor 7 child's bedroom — dresser by the window beside a pirate hat." }
  },
  tips: ["A vertical lighthouse: the spiral stairs are the only route — never get trapped above the ghost.", "Hunt sounds travel between floors."],
  src: ["tg_cursed"] },

{ id: "pointhope_r", name: "Point Hope (Restricted)", parent: "pointhope", size: "Small", levels: ["Floor 1","Floor 2","Floor 3"], rooms: "—", rework: "Added v0.19.0.0 (Aug 25, 2026); playable area ends at the dining room",
  cursed: {
    tarot:    { floor: "Floor 1", room: "Living room", dir: "Living room — table between the two green couches." },
    paw:      { floor: "Floor 1", room: "Living room", dir: "Same table as the Tarot Cards." },
    voodoo:   { floor: "Floor 1", room: "Living room", dir: "Beside the stairs at the end of the living room (basket/chest under the stairs)." },
    circle:   { floor: "Floor 2", room: "Kitchen", dir: "Kitchen floor near the sink." },
    ouija:    { floor: "Floor 3", room: "Dining room", dir: "Under a blue chair/ottoman on the back wall." },
    mirror:   { floor: "Floor 3", room: "Dining room", dir: "Leaning against a blue cupboard." },
    musicbox: { floor: "Floor 3", room: "Dining room", dir: "Sideboard/table beside the top of the stairs." }
  },
  tips: ["Many of the full map's hiding spots are blocked off.", "Small map classification."],
  src: ["tg_restricted","gg_ph_restricted"] },

{ id: "prison", name: "Prison", size: "Medium", levels: ["Entrance & lobby","Cell blocks","Upper floor"], rooms: "31 (29 possible ghost rooms)",
  cursed: {
    tarot:    { floor: "Entrance & lobby", room: "Security checkpoint", dir: "Security checkpoint right inside — in a grey plastic box on the desk." },
    ouija:    { floor: "Entrance & lobby", room: "Security checkpoint", dir: "Security checkpoint — on the floor behind the desks." },
    musicbox: { floor: "Entrance & lobby", room: "Security checkpoint", dir: "Security desk with two grey boxes — inside the left box." },
    paw:      { floor: "Entrance & lobby", room: "Security checkpoint", dir: "Desk by the big scanner — right of the grey box." },
    mirror:   { floor: "Entrance & lobby", room: "Entrance corridor", dir: "Straight ahead from the entrance, under the row of white chairs." },
    circle:   { floor: "Entrance & lobby", room: "Entrance corridor", dir: "End of the entrance corridor before the hallway, on the floor next to the white chairs." },
    voodoo:   { floor: "Entrance & lobby", room: "Security checkpoint", dir: "Desk next to the big red scanner — left of a grey box." }
  },
  tips: ["v0.19.0.0 moved the truck closer to the main entrance.", "All possessions are at the entrance — grab one before searching."],
  src: ["tg_cursed","kg_v01900"] },

{ id: "prison_r", name: "Prison (Restricted)", parent: "prison", size: "Small", levels: ["Entrance hallway"], rooms: "Several random layouts", rework: "Added v0.19.0.0 (Aug 25, 2026)",
  cursed: {
    mirror:   { floor: "Entrance hallway", room: "Entrance hallway", dir: "Under the row of chairs." },
    circle:   { floor: "Entrance hallway", room: "Entrance hallway", dir: "At the end of the hallway." },
    tarot:    { floor: "Entrance hallway", room: "Entrance hallway", dir: "Inside the blue crate." },
    musicbox: { floor: "Entrance hallway", room: "Entrance hallway", dir: "Inside the black crate." },
    voodoo:   { floor: "Entrance hallway", room: "Entrance hallway", dir: "On the table between the crates." },
    ouija:    { floor: "Entrance hallway", room: "Entrance hallway", dir: "On the floor behind that table." },
    paw:      { floor: "Entrance hallway", room: "Entrance hallway", dir: "On the table beside the blue crate." }
  },
  tips: ["Layout is randomised each contract.", "v0.19.0.1 added more props and fingerprint spots to the entrance to help identification."],
  src: ["tg_restricted","kg_v01901"] },

{ id: "brownstone", name: "Brownstone High School", size: "Large", levels: ["Lobby","Ground floor wings","Upper floor"], rooms: "64 (58 possible ghost rooms)",
  cursed: {
    tarot:    { floor: "Lobby", room: "Lobby", dir: "Long wooden bench on your left as you enter, next to a green book." },
    ouija:    { floor: "Lobby", room: "Lobby", dir: "Where the lobby meets the corridor — on the floor beside a pillar on the left." },
    musicbox: { floor: "Lobby", room: "Lobby", dir: "Long bench on the right side among green books, cardboard box below." },
    paw:      { floor: "Lobby", room: "Lobby", dir: "On a cardboard box on the right side by a brick pillar." },
    mirror:   { floor: "Lobby", room: "Lobby", dir: "Right side just before the corridor — leaning on a brick pillar." },
    circle:   { floor: "Lobby", room: "Corridor", dir: "Walk forward to where the lobby joins the corridor — centre of the corridor floor." },
    voodoo:   { floor: "Lobby", room: "Lobby", dir: "Walk to the wall opposite the entrance — on the wooden bench." }
  },
  tips: ["v0.19.0.0 moved the truck closer to the main entrance.", "Huge: split up with sound sensors to find the room."],
  src: ["tg_cursed","kg_v01900"] },

{ id: "brownstone_r", name: "Brownstone High School (Restricted)", parent: "brownstone", size: "Medium", levels: ["First floor","Second floor"], rooms: "Four random layouts", rework: "Added v0.19.0.0 (Aug 25, 2026)",
  cursed: {
    tarot:    { floor: "First floor", room: "Main corridor bench", dir: "Bench in front of the staircase, first floor main corridor." },
    ouija:    { floor: "First floor", room: "Main corridor bench", dir: "Same bench in front of the staircase." },
    musicbox: { floor: "First floor", room: "Main corridor bench", dir: "Same bench in front of the staircase." },
    paw:      { floor: "First floor", room: "Main corridor bench", dir: "Same bench in front of the staircase." },
    mirror:   { floor: "First floor", room: "Main corridor bench", dir: "Same bench in front of the staircase." },
    voodoo:   { floor: "First floor", room: "Main corridor bench", dir: "Same bench in front of the staircase." },
    circle:   { floor: "Second floor", room: "Outside Classroom 21 or 24", dir: "Depends on the layout: in front of Classroom 21 (left variant) or Classroom 24 (right variant), second floor main corridor." }
  },
  tips: ["Known v0.19.0.0 issue: the bone can spawn inside inaccessible hiding spots."],
  src: ["tg_restricted"] },

{ id: "sunny", name: "Sunny Meadows Mental Institution", size: "Large", levels: ["Chapel","Wings","Courtyard"], rooms: "69",
  cursed: {
    tarot:    { floor: "Chapel", room: "Chapel stage", dir: "Chapel at the end of the entrance corridor, right and up the steps — red circle by the railings." },
    ouija:    { floor: "Chapel", room: "Chapel stage", dir: "Raised area, on the floor by the railings furthest from the door." },
    musicbox: { floor: "Chapel", room: "Chapel", dir: "Right side, in front of a wooden candle stand in the back-left corner." },
    paw:      { floor: "Chapel", room: "Chapel stage", dir: "Base of the red metal post (large crucifix) in the centre of the upper deck." },
    mirror:   { floor: "Chapel", room: "Chapel stage", dir: "Red circle in front of two candle stands — ground, bottom-right corner stand." },
    circle:   { floor: "Chapel", room: "Chapel stage", dir: "Large red circle in the centre of the upper deck." },
    voodoo:   { floor: "Chapel", room: "Chapel stage", dir: "In front of the red metal post, on the ground in blood." }
  },
  tips: ["Candles already lit in the chapel can let an Onryo hunt early — don't mistake it for a Demon."],
  src: ["tg_cursed","kukiz"] },

{ id: "sunny_r", name: "Sunny Meadows (Restricted)", parent: "sunny", size: "Medium", levels: ["Chapel","Entrance + one random wing"], rooms: "17",
  cursed: {
    tarot:    { floor: "Chapel", room: "Chapel", dir: "Same chapel spots as the full map." },
    ouija:    { floor: "Chapel", room: "Chapel", dir: "Same chapel spots as the full map." },
    musicbox: { floor: "Chapel", room: "Chapel", dir: "Same chapel spots as the full map." },
    paw:      { floor: "Chapel", room: "Chapel", dir: "Base of the large crucifix." },
    mirror:   { floor: "Chapel", room: "Chapel", dir: "Same chapel spots as the full map." },
    circle:   { floor: "Chapel", room: "Chapel", dir: "Centre of the room." },
    voodoo:   { floor: "Chapel", room: "Chapel", dir: "Same chapel spots as the full map." }
  },
  tips: ["Only the entrance area and one random wing are open each contract."],
  src: ["tg_restricted","tg_cursed"] }
];

/* Display names for possession ids used in cursed{} above. */
PD.cursedNames = { ouija: "Ouija Board", mirror: "Haunted Mirror", musicbox: "Music Box", circle: "Summoning Circle", voodoo: "Voodoo Doll", tarot: "Tarot Cards", paw: "Monkey Paw" };
