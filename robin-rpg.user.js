// ==UserScript==
// @name         Robin rpg bot
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  rpg bot ;3 based on /u/npinsker trivia bot
// @author       /u/anokrs
// @include      https://www.reddit.com/robin*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @updateURL    https://github.com/anok/robin-rpg/raw/master/robin-rpg.user.js
// ==/UserScript==
(function() {

MAX_MESSAGE_LENGTH = 140;
TIME_PER_QUEST = 35000;
TIME_PER_BREAK = 20000;
RETRY_CONNECT = 2000;
NUM_COMMANDS = 5;
COMMANDS_TIMEOUT = 5000;

QUESTS_PER_SCORE_DISPLAY = 20;
NUM_SCORES_TO_DISPLAY = 15;

NUM_TO_FLEE = 6;

FILTER_CHANNEL = true;
FILTER = "#rpg";
USER_NAME = "robin-rpg";

SAVE_STRING = "robin-rpg-scores";


q = "Arctic Tern,2,Bat,2,Hedgehog,2,Lemming,2,Ptarmigan,2,Puffin,2,Thrush,2,Toad,2,Arctic Hare,3,Cat,3,Conshee,3,Flying Squirrel,3,Gremlin,3,Lizard,3,Mite,3,Mite,3,Platypus,3,Rabbit,3,Raven,3,Shadow Rat,3,Skunk,3,Sprite,3,Squirrel,3,Turtle,3,Viper,3,Albino Cave Spider,4,Archaeopteryx,4,Armadillo,4,Beheaded,4,Blue-Ringed Octopus,4,Brownie,4,Elder Witchlights,4,Ermine,4,Fire Beetle,4,Fox,4,Giant Botfly,4,Giant Mosquito,4,Greensting Scorpion,4,Greensting Scorpion,4,Grig,4,Grimple,4,Haniver,4,Hawk,4,House Centipede,4,Human Skeleton,4,Killmoulis,4,Lesser Fire Crab,4,Mimi,4,Monkey,4,Nymph Water Strider,4,Ochre Eurypterid,4,Otter,4,Owl,4,Poison Frog,4,Poisonous Frog,4,Quipper,4,Raccoon,4,Raccoon,4,Rat,4,Rat-Ghouls,4,Redcap,4,Rhamphorhynchus,4,Scarlet Spider,4,Scarlet Spider,4,Seal,4,Severed Head,4,Skull Spider,4,Skull Spider,4,Skunk,4,Small Barracuda,4,Small Stingray,4,Snowy Owl,4,Spire Monkey,4,Sprite,4,Tiny Monstrous Sea Wasp,4,Vegepygmy Commoner,4,Weasel,4,Alpluachra,5,Arctic Fox,5,Baboon,5,Barrow Rat,5,Biloko,5,Black Spot,5,Cave Cricket,5,Changeling,5,Clockwork Drone,5,Clockwork Scout,5,Clockwork Spy,5,Dire Rat,5,Donkey Rat,5,Drow,5,Eagle,5,Flaming Skull,5,Floating Eye,5,Fox,5,Giant Centipede,5,Giant Flea,5,Giant Flea,5,Goat,5,Great Horned Owl,5,Grindylow,5,Jaculi,5,King Crab,5,Kitsune,5,Kobold,5,Land Lamprey,5,Larval Slime Crawler,5,Leaf Leshy,5,Mandragora,5,Mantari,5,Medium Monstrous Sea Wasp,5,Muckdweller,5,Nilbog,5,Nupperibo Devil,5,Porcupine,5,Sloth,5,Small Acid Quasi-elemental,5,Small Monstrous Sea Wasp,5,Small Obsidian Quasi-elemental,5,Small Salt Elemental,5,Snapping Turtle,5,Soul Nibbler,5,Stirge,5,Strix,5,Syrinx,5,Tooth Fairy,5,Trumpeter Swan,5,Tuatara,5,Vegepygmy,5,Vilstrak,5,Vulchling,5,Wizard's Shackle,5,Al-mi'raj,6,Al-Mi'raj,6,Amber Ooze,6,Antelope,6,Blood Hawk,6,Compsognathus,6,Dodo,6,Dog,6,Dwarf Caiman,6,Formian Worker,6,Giant Isopod,6,Gillman,6,Goblin,6,Gribbon,6,Jinkin,6,Kangaroo,6,Killer Frog,6,Lesser Shadow,6,Llama,6,Orc,6,Pig,6,Podokesaurus,6,Pugwampi,6,Skvader,6,Vapor Dire Rat,6,Vulture,6,Dire Shadow Rat,7,Ectoplasmic Human,7,Fuath,7,Gathlain,7,Ghost-faced Orc,7,Giant Maggot,7,Greenskin Orc,7,Grippli,7,Kuah-lij,7,Leprechaun,7,Merfolk,7,Pestie,7,Sagari,7,Sanguine Ooze Swarm,7,Talorani,7,Thylacine,7,Xothotak,7,Abyssal Larva,8,Black Orc,8,Blood Orc,8,Burrowing Lamprey,8,Carbuncle,8,Changeling,8,Duergar,8,Giant Cockroach,8,Human,8,Ifrit,8,Phlegmatic Ooze Swarm,8,Ratfolk,8,Silid,8,Undine,8,Vexgit,8,Wayang,8,Amoeba Swarm,9,Asrai,9,Atomie,9,Badger,9,Brownie,9,Chon Chon,9,Crawling Hand,9,Dragonfish,9,Festrog,9,Flumph,9,Flumph,9,Fyr,9,Giant Tick,9,Giant Weasel,9,Goblin Dog,9,Gourd Leshy,9,Hollow Helm,9,Huggermugger,9,Isitoq,9,Jackal,9,Jynx,9,Locathah,9,Nixie,9,Sailors,9,Skull Swarm,9,Spider Swarm,9,Stench Beetle,9,Sylph,9,Tengu,9,Vanara,9,Water Strider Swarm,9,Atomie,10,Fetchling,10,Forgotten One,10,Half-Orc,10,Kasatha,10,Nagaji,10,Tiefling,10,Wyvaran,10,Aasimar,11,Android,11,Barbegazi,11,Buckawn,11,Bull Shark,11,Carrionstorm,11,Clawbat,11,Common Eurypterid,11,Deer,11,Dimorphodon,11,Dolphin,11,Ethereal Rat,11,Executioner's Hood,11,Executioner's Hood,11,Giant Archerfish,11,Giant Blister Beetle,11,Giant Crab Spider,11,Giant Gecko,11,Gnoll,11,Golden Cat,11,Gorbel,11,Half-Elf,11,Homunculus,11,Jack-O'-Lantern,11,Jigsaw Shark,11,Lashunta,11,Lizardfolk,11,Mandrill,11,Pedipalp,11,Pickled Punk,11,Ram,11,Rune Guardian,11,Samsaran,11,Sea Snake,11,Sheep,11,Skulk,11,Small Fire Elemental,11,Small Lightning Elemental,11,Small Magma Elemental,11,Small Smoke Elemental,11,Suli,11,Tabaxi,11,Vishkanya,11,Wood Idol,11,Zoog,11,Catfolk,12,Fast Zombie,12,Ghoran,12,Grippli,12,Human Zombie,12,Oread,12,Plague Zombie,12,Pyre Zombie,12,Sciurian,12,Almiraj,13,Bat Swarm,13,Bone Delver,13,Camel,13,Carbuncle,13,Cassisian,13,City Guards,13,Coral Capuchin,13,Dark Dancer,13,Dhampir,13,Dire Corby,13,Dossenus,13,Euparkeria,13,Faun,13,Fire Fish,13,Fire Nymph,13,Fire Snake,13,Fleshdreg,13,Forlarren,13,Frost Dwarf,13,Gar,13,Ghost Scorpion,13,Ghoul,13,Ghoul Monkey,13,Giant Caribe,13,Giant Solifugid,13,Giant Tick,13,Goblin Snake,13,Grioth,13,Guardian Phantom Armor,13,Half-ogre,13,Hunter Urchin,13,Hyena,13,Krenshar,13,Lacedon,13,Lantern Archon,13,Lemure,13,Lynx,13,Margay,13,Mockingfey,13,Mongrelman,13,Monkey Goblin,13,Monstrous Jellyfish,13,Ningyo,13,Octopus,13,Ogren,13,Ogrillon,13,Ostrich,13,Paracletus,13,Pipefox,13,Pony,13,Reefclaw,13,Riding Dog,13,Scarlet Spider Swarm,13,Shifty Nobles,13,Silvanshee,13,Small Air Elemental,13,Small Earth Elemental,13,Small Gravity Elemental,13,Small Ice Elemental,13,Small Mud Elemental,13,Small Negative Energy Elemental,13,Small Positive Energy Elemental,13,Small Water Elemental,13,Spore Rat,13,Squid,13,Stingray,13,Thought Eater,13,Triaxian,13,Tri-flower Frond,13,Troglodyte,13,Tsathar,13,Venomous Snake,13,Witchcrow,13,Witherstench,13,Wolf,13,Baric,14,Monaciello,14,Quickling,14,Akata,15,Giant Amoeba, 15,Arbiter,15,Azer,15,Baboonwere,15,Bog Strider,15,Boilborn,15,Dakon,15,Darkmantle,15,Death's Head Jellyfish,15,Dire Corby,15,Edon,15,Elk,15,Flind,15,Frost Fir,15,Fungus Leshy,15,Giant Fly,15,Giant Frog,15,Giant Frog,15,Grimlock,15,Gryph,15,Gryph,15,Hippocampus,15,Horse,15,Human Juju Zombie,15,Iron Cobra,15,Iron Cobra,15,Leaf Ray,15,Malenti,15,Mongrelman,15,Mudman,15,Pseudodragon,15,Sahuagin,15,Stag,15,Svirfneblin,15,Undead Ningyo,15,Wolpertinger,15,Barizou Demon,16,Bogwiggle,16,Bone Idol,16,Bugbear,16,Cadaver,16,Cave Scorpion,16,Choker,16,Clockwork Familiar,16,Coffer Corpse,16,Cythnigot,16,Deadly Mandrake,16,Doru,16,Drow Noble,16,Dweomercat Cub,16,Fungus Man,16,Giant Bee,16,Giant Falcon,16,Giant Fly,16,Giant Marmoset,16,Giant Spider,16,Harbinger Archon,16,Hedon,16,Rhianna Horse,16,Huecuva,16,Huecuva,16,Imp,16,Kuru,16,Lesser Boneneedle,16,Lightning Mephit,16,Medium Barracuda,16,Oakman,16,Petitioner,16,Piranha Swarm,16,Plagued Steed,16,Poltergeist,16,Quasit,16,Rat Swarm,16,Screaming Devilkin,16,Sin Seeker,16,Skulk,16,Slinker,16,Smoke Mephit,16,Snake Swarm,16,Stormwarden,16,Tiger Fish,16,Vegepygmy Worker,16,Voidworm,16,Volt,16,Weedwhip,16,Worker Thermite,16,Dire Racoon,17,Electric Eel,17,Foo Dog,17,Ghast,17,Hagfish,17,Hobgoblin,17,Melancholic Ooze Swarm,17,Mythic Human Skeleton,17,Skeletal Champion,17,Slurk,17,Timber Wolf,17,Trox,17,Ulfen Raider,17,Blindheim,18,Boar,18,Contemplative,18,Contemplative Of Ashok,18,Death Dog,18,Dretch,18,Forlarren,18,Four-armed,18,Ghoul Wolf,18,Giant Ant,18,Giant Flying Piranha,18,Ice Troll,18,Incutilis,18,Kapre,18,Leprechaun,18,Locust Swarm,18,Pech,18,Pixie,18,Poisonous Frog Swarm,18,Pooka,18,Quickling,18,Raven Swarm,18,Ravenous Urchin Swarm,18,Sczarni Thugs,18,Skin Stealer,18,Swamp Barracuda,18,Wererat,18,Wyrwood,18,Asp,19,Augur,19,Banderlog,19,Cacodaemon,19,Cave Moray,19,Chaneque,19,Charau-Ka,19,Cheetah,19,Chupacabra,19,Clubnek,19,Constrictor Snake,19,Crabman,19,Dark Creeper,19,Dark Creeper,19,Draugr,19,Medium Fire Crab,19,Fleshdreg Swarm,19,Garden Ooze,19,Giant Beheaded,19,Giant Crab,19,Giant Leech,19,Giant Leech,19,Giant Water Strider,19,Gorilla,19,Gutlslug,19,Kampfult,19,Kappa,19,Kijimuna,19,Leopard,19,Lyrakien,19,Manta Ray,19,Mature Slime Crawler,19,Medium Salt Elemental,19,Mephit,19,Monstrous Crab,19,Nosoi,19,Nuglub,19,Panda,19,Panotti,19,Poltergeist,19,Ram,19,Ratling,19,Shadow,19,Shadowgarm,19,Shikigami,19,Ship In A Bottle,19,Shocker Lizard,19,Sinspawn,19,Soulbound Doll,19,Soulsliver,19,Spirit Oni,19,Stone Idol,19,Thawn,19,Tripurasura,19,Triton,19,Ubue,19,Vargouille,19,Water Wraith,19,Werewolf,19,Wichtlein,19,Adamantine Cobra,20,Jinx Eater,20,Mystery Cultists,20,Skum,20,Smugglers,20,Wererat,20,Archer Bush,21,Clockwork Overseer,21,Werewolf,21,Aurochs,22,Axe Beak,22,Axe Beak,22,Azizou Demon,22,Dire Badger,22,Blindheim,22,Blink Dog,22,Boggard,22,Brine Zombie,22,Cambion,22,Cave Fisher,22,Cave Fisher,22,Ceru,22,Clockwork Parasite,22,Cooshee,22,Crocodile,22,Dark Slayer,22,Death Dog,22,Dire Bat,22,Electric Eel,22,Faerie Dragon,22,Faerie Dragon,22,Fetch,22,Fey Giant Toad,22,Fey Wolverine,22,Flame Drakeling,22,Fogwarden,22,Frost Man,22,Ghoul-stirge,22,Giant Locust,22,Giant Porcupine,22,Giant Silverfish,22,Giant Tiger Barb,22,Giant Toad,22,Giant Tortoise,22,Glacial Haunt,22,Guardian Doll,22,Hanged Man,22,Hippogriff,22,Ice Drake,22,Jackalwere,22,Jade Idol,22,Juvenile Seps,22,Large Monstrous Sea Wasp,22,Lava Child,22,Lupin,22,Mammoth Flea,22,Medium Acid Quasi-elemental,22,Medium Obsidian Quasi-elemental,22,Medium Stingray,22,Monitor Lizard,22,Monkey Swarm,22,Morlock,22,Niserie,22,Normal Spriggan,22,Nycar,22,Oozeanderthal,22,Ovinnik,22,Phooka,22,Plantoid Servitor,22,Pyrolisk,22,Raktavarna,22,Retch Hound,22,Ronus,22,Ryven,22,Sasquatch,22,Shadow Drake,22,Shadow Hunter Hatchling,22,Shark,22,Shredskin,22,Shulsaga,22,Smoke Dragon,22,Spriggan,22,Stalk Beetle,22,Swordfish,22,Tangtal,22,Tatzlwyrm,22,Tentamort,22,Thoqqua,22,Troblin,22,T'shann,22,Valeany,22,Velociraptor,22,Water Leaper,22,Whip Jelly,22,Wolverine,22,Wyrmling Gray Dragon,22,Wyrmling White Dragon,22,Xacon,22,Yellow Musk Creeper,22,Yellow Musk Creeper,22,Orog,23,Werebat,23,Hoar Fox,24,Medium Gravity Elemental,24,Brush Thylacine,25,Choleric Ooze Swarm,25,Derro,25,Frost Drakeling,25,Lesser Ooze Demon,25,Lightning Lamprey,25,Marble Snake,25,Ogrekin,25,Phycomid,25,Pirate Officers,25,River Cleric,25,River Elk,25,Sheet Fungus,25,Slitherrat,25,Stench Kow,25,Taer,25,Urdefhan,25,Adherer,26,Aspis Agents,26,Burning Ghat,26,Cockroach Swarm,26,Crysmal,26,Decapus,26,Defender Globe,26,Dire Hyena,26,Domovoi,26,Doppelganger,26,D'ziriak,26,Eblis,26,Frost Wight,26,Fungal Crawler,26,Gambado,26,Giant Clam,26,Giant Eagle,26,Giant Horsefly,26,Giant Seahorse,26,Hoar Spirit,26,Jaguar,26,Kech,26,Knight Gaunt,26,Medium Lightning Elemental,26,Monstrous Crayfish,26,Mountain Lion,26,Necrocraft,26,Necro-Phantom,26,Pard,26,Phlogiston,26,Piranha Swarm,26,Ravager Beetle,26,Sandling,26,Shadow Wolf,26,Skin Feaster,26,Skull Child,26,Skulleton,26,Spring-Heeled Jack,26,Spyglass Archon,26,Stymphalian Bird,26,Sudoth,26,Tether,26,Thorny,26,Tikoloshe,26,Vampire Spawn,26,Vegepygmy Guard,26,Wang Liang,26,Werebat,26,Wight,26,Worg,26,Baccae,27,Bone Swarm,27,Chon Chon Swarm,27,Cockatrice,27,Comozant Wyrd,27,Domovoi,27,Dryad,27,Dust Digger,27,Giant Skunk,27,Grick,27,Korred,27,Lamhigyn,27,Pech,27,Rust Monster,27,Sloth Viper,27,Solifugid,27,Twigjack,27,Undead Ooze,27,Velvet Ant Swarm,27,Warden Jack Swarm,27,Werecrocodile,27,Ankheg,28,Kelpie,28,Korog,28,Piranha Swarm,28,Slime Mold,28,Yhakkor,28,Weretiger,29,Accuser,30,Adaro,30,Adherer,30,Ahlinni,30,Allip,30,Argos,30,Assassin Vine,30,Babbler,30,Belabra,30,Belostomatid,30,Bonesnapper,30,Borsin,30,Centaur,30,Ceratioidi,30,Cerebric Fungus,30,Chickcharney,30,Chike,30,Chupacabra,30,Clamor,30,Common Inphidian,30,Dancer Inphidian,30,Dire Ape,30,Disenchanter,30,Drekavac,30,Elusa Hound,30,Ettercap,30,Fire Drake,30,Flail Snail,30,Flail Snail,30,Formian Warrior,30,Fukujin,30,Fye,30,Giant Boring Beetle,30,Giant Chameleon,30,Giant Hamster,30,Giant Mantis,30,Giant Rock-horned Lizard,30,Giant Seahorse,30,Giant Water Beetle,30,Giraffe,30,Greater Fire Crab,30,Hammerhead Shark,30,Hell Hound,30,Jupiter Bloodsucker,30,Kamadan,30,Khaei,30,Lacridaemon,30,Lava Child,30,Lesser Gelid Beetle,30,Lesser Host Devil,30,Magmin,30,Marine Crocodile,30,Medium Air Elemental,30,Medium Fire Elemental,30,Medium Ice Elemental,30,Medium Magma Elemental,30,Medium Mud Elemental,30,Medium Negative Energy Elemental,30,Medium Positive Energy Elemental,30,Medium Smoke Elemental,30,Medium Water Elemental,30,Medusa Head,30,Merrow Freshwater, 30,Mindslaver Mold,30,Moose,30,Moss Troll,30,Narwhal,30,Nightmare Ettercap,30,Ogre,30,Phantom Fungus,30,Sandman,30,Sandman,30,Seaweed Leshy,30,Snallygaster,30,Snow Leopard,30,Strangle Weed,30,Tidepool Dragon,30,Trollhound,30,Vampire Rose,30,Vampiric Mist,30,Vermlek,30,Violet Fungus,30,Walrus,30,Wereboar,30,Werecrocodile,30,Wolliped,30,Wolliped,30,Wyrmling Black Dragon,30,Wyrmling Brass Dragon,30,Yeth Hound,30,Yeti,30,Zombie Lord,30,Centipede Swarm,31,Clockwork Servant,31,Diger,31,Man-Eating Aurochs,31,Mosquito Swarm,31,Mudbog,31,Wasp Swarm,31,Wereboar,31,Abrikandilu,32,Bone Cobbler,32,Bronze Sentinel,32,Bunyip,32,Dire Weasel,32,Giant Bumblebee Worker,32,Giant Dragonfly Nymph,32,Giant Saw-toothed Beetle,32,Gloomwing,32,Gnoll Mutant,32,Greater Witchcrow,32,Haunt,32,Kech,32,Lion,32,Marsh Jelly,32,Pteranodon,32,Sirine Flower,32,Ukobach,32,Besmaran Priest,33,Dobie,33,Gallows Tree Zombie,33,Grave Mount,33,Jack-o-lantern,33,Korred,33,Mehrim Demon,33,Screaming Skull,33,Small Lightning Quasi-elemental,33,Transposer,33,Tsathar Scourge,33,War Flower,33,Wereshark,33,Cairn Wight,34,Deinonychus,34,Dimetrodon,34,Dire Fox,34,Giant Chameleon,34,Giant Rot Grub,34,Giant Sea Anemone,34,Giant Wasp,34,Gronk,34,Hag Ooze,34,Hippocampus,34,Kathlin,34,Large Spriggan,34,Medium Earth Elemental,34,Megaloceros,34,Megaloceros Elk,34,Mobat,34,Mobat Bat,34,Moose,34,Night Scale Assassins,34,Pegasus,34,River Drake,34,Screamer,34,Shoanti Gladiators,34,Skitterdark Demon,34,Unicorn,34,Werebear,34,Penanggalen,35,Shackled Sorcerers,35,Animated Object,36,Caryatid Column,36,Mythic Worg,36,Necrophidius,36,Wereshark,36,Algoid,37,Aranea,37,Barrow Wight,37,Basidirond,37,Caterwaul,37,Church Grim,37,Cobra-back Inphidian,37,Dire Wolf,37,Disenchanter,37,Fungoid,37,Giant Black Widow Spider,37,Giant Phantom Armor,37,Giant Scorpion,37,Giant Slicer Beetle,37,Gloomwing,37,Grimshrike,37,Hala,37,Hellstoker Devil,37,Howler,37,Juvenile Rukh,37,Mandragora,37,Myceloid,37,Nightgaunt,37,Pachycephalosaurus,37,Schir,37,Soldier Thermite,37,Vegepygmy Bodyguard,37,Venomous Snake Swarm,37,Voltar,37,Voonith,37,Weretiger,37,Witherweed,37,Wyrmling Copper Dragon,37,Wyrmling Green Dragon,37,Young Dungeon Dragon,37,Zombyre,37,Zuvembie,37,Agathion,38,Blood Golem,38,Crab Swarm,38,Draug,38,Dvorovoi,38,Fire Phantom,38,Giant Whiptail Centipede,38,Green Guardian Gargoyle,38,Harpy,38,Huldra,38,Kelpie,38,Peg Powler,38,Sea Hag,38,Sewer Sludge,38,Shae,38,Shriezyx,38,Slime Mold,38,Swamp Troll,38,Thin Man,38,Udaeus,38,Boggart,39,Calathgar,39,Dark Stalker,39,Dark Stalker,39,Fen Witch,39,Fungus Weird,39,Geruzou Demon,39,Giant Pike,39,Giant Yellowjacket,39,Hound Archon,39,Janni,39,Lar,39,Leech Swarm,39,Mawler,39,Otyugh,39,Phycomid,39,Shadow Rat Swarm,39,Slicer Beetle,39,Stone Roper,39,Swordtooth Shark,39,Tentamort,39,Tuyewera,39,Umbral Shepherd,39,Vulnudaemon,39,Wikkawak,39,Botfly Swarm,40,Mummy Of The Deep,40,Will-o'-Wisp,40,Fossegrim,41,Pirate Captains,41,Aghash,42,Algoid,42,Amphisbaena,42,Bison,42,Bloody Bones,42,Bunyip,42,Carrion Golem,42,Caryatid Column,42,Cavern Lizard,42,Chrystone,42,City Watch Captains,42,Clockwork Brain Gear,42,Clockwork Swarm,42,Clockwork Warrior,42,Cobalt Viper,42,Devilfish,42,Dire Boar,42,Dire Mastiff,42,Dire Stag,42,Dire Wolverine,42,Doombat Bat,42,Dust Digger,42,Faceless Stalker,42,Forest Drake,42,Gargoyle,42,Giant Tuatara,42,Giant Vulture,42,Gorilla Bear,42,Grave Risen,42,Great White Shark,42,Greater Boneneedle,42,Griffon,42,Grizzly Bear,42,Grothlut,42,Half-Celestial Unicorn,42,Junk Golem,42,Kamadan,42,Khargra,42,Kuwa,42,Living Topiary,42,Longboat Captain,42,Mask Golem,42,Narwhal,42,Nirento,42,Peryton,42,Plantoid,42,Rhinoceros,42,Serpentfolk,42,Slithering Tracker,42,Spear Urchin,42,Stunjelly,42,Thriae Soldier,42,Tombotu,42,Umasi,42,Very Young Gray Dragon,42,Very Young White Dragon,42,Wax Golem,42,Marble Sentinel,43,Mythic Cockatrice,43,Trench Zombie,43,Werewolverine,43,Crystalline Golem,44,Lurker In Light,44,Satyr,44,Sparksting Swarm,44,Albino Cave Solifugid,45,Alu-Demon,45,Amphisbaena,45,Attic Whisperer,45,Barghest,45,Black Skeleton,45,Bloodworm,45,Carrion Moth,45,Cecaelia,45,Cobra Flower,45,Corpse Rook,45,Crag Man,45,Dawn Piper,45,Decapus,45,Devil Dog,45,Eye Killer,45,Fachen,45,Fungus Man King,45,Giant Dragonfly,45,Giant Dragonfly,45,Giant Hornet,45,Giant Stag Beetle,45,Grig Swarm,45,Ice Troll,45,Large Salt Elemental,45,Lythic,45,Magnesium Spirit,45,Minotaur,45,Night Adder Inphidian,45,Parasaurolophus,45,Phantom Stalker,45,Rock Reptile,45,Sand Stalker,45,Sea Cat,45,Selkie,45,Skin Stitcher,45,Sprite Swarm,45,Temporal Crawler,45,Tiger,45,Wolf-spider,45,Wyrmling Blue Dragon,45,Wyrmling Bronze Dragon,45,Yamah,45,Yeti,45,Gibbering Mouther,46,Living Wall,46,Necrophidius,46,Werebear,46,Werewolverine,46,Boalisk,47,Bogwid,47,Chemosit,47,Cimota,47,Demonic Mist,47,Divine Guardian Hydra,47,Ectoplasm,47,Freezing Flow,47,Gargoyle Stone Idol,47,Hanu-Naga,47,Hungry Flesh,47,Hyaenodon,47,Hydra,47,Mythic Hell Hound,47,Owlbear,47,Scarecrow,47,Scarecrow,47,Sentient Wax Golem,47,Shobhad,47,Slithering Tracker,47,Stone Guardian Golem,47,Tanuki,47,Vapor Wasp,47,Vescavor Swarm,47,Viduus,47,Wraith,47,Army Ant Swarm,49,Risen Guard,49,Drelb,50,Filcher Gremlin,50,Gelatinous Cube,50,Giant Dire Frog,50,Gray Ooze,50,Lightning Bladder,50,Mythic Ogre,50,Buggane,51,Carrion Claw,51,Catrina,51,Cavern Crawler,51,Cayhound,51,Cloaker,51,Dandasuka,51,Emberleaf,51,Emperor Cobra,51,Fear Guard,51,Fire Eel,51,Genthodaemon,51,Ghul,51,Grey Spirit,51,Hippopotamus,51,Homotherium,51,Jiang-shi,51,Kodama,51,Large Acid Quasi-elemental,51,Large Obsidian Quasi-elemental,51,Leonine,51,Mercane,51,Murder-born,51,Nightmare,51,Phase Spider,51,Raiju,51,Rast,51,Rattler Inphidian,51,Serpent Creeper,51,Shadow Mastiff,51,Smilodon,51,Thoxel,51,Tojanida,51,Vegepygmy Subchief,51,Venedaemon,51,Very Young Black Dragon,51,Very Young Brass Dragon,51,Vireseed Swarm,51,Vodyanoi,51,Achaierai,52,Apostasy Wraith,52,Apparition,52,Ascomoid,52,Ascomoid,52,Basidirond,52,Basilisk,52,Blightspawn of Ghlaunder,52,Blood Orchid,52,Blood Pudding,52,Bluetip Eurypterid,52,Bog Beast,52,Cave Troll,52,Corpse Candle,52,Crypt Thing,52,Dark Caller,52,Darnoc,52,Dire Rat Megaswarm,52,Djinni,52,Festering Lung,52,Forester's Bane,52,Gearghost,52,Giant Blowfish,52,Giant Bumblebee Queen,52,Giant Crawling Hand,52,Giant Hellgrammite,52,Giant Moray Eel,52,Giant Moray Eel,52,Gilded Sea Serpent,52,Grimstalker,52,Huge Monstrous Sea Wasp,52,Lampad,52,Lamprey Swarm,52,Midnight Peddler,52,Mimic,52,Neomimic,52,Noble Steed,52,Ogre Spider,52,Ostiarius,52,Polar Bear,52,Sabosan,52,Scythe Horn,52,Siren,52,Skinstitch,52,Spectre,52,Spider Eater,52,Spitting Gargoyle,52,Stymphalides Swarm,52,Styracosaurus,52,Uraeus,52,Vampiric Ooze,52,Wood Giant,52,Angelic Guardian,53,Graven Guardian,53,Ice Golem,53,Mirror Man,53,Rope Golem,53,Jellyfish Swarm,54,Berserker Cannibal,55,Blackraven Scout,55,Larva Helix Moth,55,Mercury Ooze,55,Niln,55,Protector,55,Swan Maiden,55,Crypt Thing,56,Andrazku,57,Bearded Devil,57,Blood Bush,57,Brimorak,57,Caterprism,57,Churr,57,Flame Drake,57,Four-armed Gargoyle,57,Giant Owl,57,Globster,57,Gloom Haunt,57,Great Diadem Urchin,57,Half-Fiend Minotaur,57,Ja Noi,57,Leucrotta,57,Manticore,57,Mist Drake,57,Nothosaur,57,Rat King,57,Saltwater Crocodile,57,Stroke Lad,57,Ved,57,Winter Wolf,57,Yamabushi Tengu,57,Burning Dervish,58,Cerebral Stalker,58,Elven Wasp,58,Festering Spirit,58,Giant Abyssal Dire Frog,58,Greater Shadow,58,Green Hag,58,Skaveling,58,Stegocentipede,58,Archelon,59,Crystalline Horror,59,Derhii,59,Elder Thing,59,Fungus Gargoyle,59,Giant Barracuda,59,Giant Frilled Lizard,59,Giant Queen Bee,59,Greater Host Devil,59,Hippopotamus,59,Host Devil,59,Hungry Fog,59,Hypnalis,59,Ice Salamander,59,Megatherium,59,Ommoth,59,Onyx Deer,59,Oronci,59,Possession Lesser,59,Saguaroi,59,Scorpionfolk,59,Shadow Demon,59,Shadow Demon,59,Tazelwurm,59,Tupilaq,59,Undead Mimic,59,Very Young Copper Dragon,59,Very Young Green Dragon,59,Vulpinal,59,Wind Walker,59,Wyrmling Red Dragon,59,Aberrant,60,Aswang,60,Bog Mummy,60,Bogeyman,60,Bonesucker,60,Cave Lion,60,Crawling Offspring,60,Dire Lion,60,Giant Ant Lion,60,Giant Mosquito,60,Greater Medusa,60,Gulper Eel,60,Hieracosphinx,60,Hodag,60,Kyton,60,Large Fire Elemental,60,Large Lightning Elemental,60,Large Magma Elemental,60,Large Smoke Elemental,60,Mihstu,60,Mummy,60,Nithu,60,Nymph,60,Polevik,60,Redcap,60,Sword Wight,60,Vetala,61,Mythic Gargoyle,62,Mythic Griffon,62,Tear of Nuruu'gal,62,Ice Golem,63,Jolly Jelly,63,Killer Seahorse,63,Margoyle Gargoyle,63,Ochre Jelly,63,Riptide Horror,63,River Troll,63,Sabrewing,63,Scrag,63,Troll,63,Turtle-shark,63,Blood Golem,64,Bottled Armada,64,Clockwork Soldier,64,Golden Guardian,64,Magnesium Golem,64,Mummy Golem,64,Pestilential Cadaver,64,Terra-Cotta Soldier,64,Wood Golem,64,Wood Golem,64,Crystal Ooze,65,Cyclops,65,Encephalon Gorger,65,Ettin,65,Graeae,65,Kamarupa,65,Moon Dog,65,Algidarch,66,Annis Hag,66,Bladecoin Swarm,66,Blodeuwedd,66,Bralani Azata,66,Brethedan,66,Death Worm,66,Gallu-Demon,66,Grodair,66,Hydrodaemon,66,Mi-Go,66,Xorn,66,Young Crystal Dragon,66,Young Gray Dragon,66,Young White Dragon,66,Ant Lion,67,Baobhan Sith,67,Bhuta,67,Boobrie,67,Brykolakas,67,Cave Giant,67,Dream Spectre,67,Giant Assassin Bug,67,Giant Death Watch Beetle,67,Gylptodon,67,Heat Swarm,67,Lamia,67,Melfesh Monster,67,Mudlord,67,Murder Crow,67,Mythic Owlbear,67,Orca,67,Petrified Maiden,67,Queen Thermite,67,Red Jester,67,Scarab Beetle,67,Scythe Tree,67,Seugathi,67,Shambling Mound,67,Uggoth,67,Wood Giant,67,Xill,67,Ahuizotl,68,Astral Shark,68,Belker,68,Berbalang,68,Bloodsuckle,68,Bucentaur,68,Cambion Demon,68,Ceustodaemon,68,Choral Angel,68,Cinder Ghoul,68,Clockwork Titan,68,Crimson Basilisk,68,Death Worm,68,Death's Head Inphidian,68,Demiurge,68,Dire Worg,68,Feral Vampire Spawn,68,Giant Forest Lizard,68,Giant Funnel-Web Spider,68,Grimslake,68,Guardian Daemon,68,Helicoprion,68,Herne,68,Huge Salt Elemental,68,Lantern Goat,68,Large Air Elemental,68,Large Earth Elemental,68,Large Ice Elemental,68,Large Mud Elemental,68,Large Negative Energy Elemental,68,Large Positive Energy Elemental,68,Large Stingray,68,Large Water Elemental,68,Lunar Naga,68,Maftet,68,Memory Child,68,Renzer,68,River Giant,68,Ship Sentinel,68,Skrik Nettle,68,Soul Knight,68,Undead Troll,68,Very Young Blue Dragon,68,Very Young Bronze Dragon,68,Winter Fey,68,Witchwyrd,68,Wyrmling Gold Dragon,68,Young Brine Dragon,68,Amber Skeleton,69,Glacial Ooze,69,Thunder Beast,69,Tribal Totem,69,Bloodhaze Mosquito Swarm,71,Deathweb,71,Lesser Hollow Serpent,71,Nosferatu,71,Osirionologist,71,Sangoi,71,Mythic Minotaur,72,Arcanoplasm,73,Babau,73,Boreal Creature,73,Dracolisk,73,Fachan,73,Ghost,73,Giant Gar,73,Girallon,73,Glacier Toad,73,Lilin Devil,73,Lillend Azata,73,Nabasu Demonling,73,Sea Drake,73,Wyvern,73,Clockwork Steed,74,Flagstone Golem,74,Gaki,74,Aballonian,75,Ankylosaurus,75,Apocalypse Locust,75,Blood Weird,75,Brain Ooze,75,Dunkleosteus,75,Eye Of The Deep,75,Giant Electric Catfish,75,Hag Nymph,75,Halsora,75,Hooded Horror,75,Lead Skeleton,75,Lightning Weird,75,Magmoid,75,Medium Lightning Quasi-elemental,75,Sepulchral Guardian,75,Soul Eater,75,Tallow Golem,75,Adhukait,76,Arach,76,Blighted Fey,76,Cactant,76,Capramace,76,Caulborn,76,Cave Leech,76,Cerberi,76,Daochyn,76,Dragon Horse,76,Dragonne,76,Dragonnel,76,Dreadweed,76,Drider,76,Drocha Swarm,76,Duppy,76,Elder Nirento,76,Fanged Sea Serpent,76,Gray-Scale Inphidian,76,Hangman Tree,76,Hell Moth,76,Huge Acid Quasi-elemental,76,Huge Obsidian Quasi-elemental,76,Iguanodon,76,Incubus,76,Karkinoi,76,Kelp Devil,76,Large Gravity Elemental,76,Legion Archon,76,Livestone,76,Lunarma,76,Malkeen,76,Medusa,76,Megapiranha Swarm,76,Mothman,76,Movanic Deva,76,Nazalor,76,Nothosaurus,76,Oceanid,76,Owb,76,Pairaka,76,Phantom Lancer,76,Qallupilluk,76,Revenant,76,Rorkoun,76,Salamander,76,Salikotal,76,Sea Scourge,76,Shadow Hunter,76,Shedu,76,Spartolos,76,Stygira,76,Tendriculos,76,Tendrul,76,Theletos,76,Tormentor Devil,76,Vanth,76,Vegepygmy Chief,76,Water Naga,76,Woolly Rhinoceros,76,Yaenit,76,Young Black Dragon,76,Young Brass Dragon,76,Young Cloud Dragon,76,Young Underworld Dragon,76,Mythic Manticore,77,Mythic Winter Wolf,77,Stirge Swarm,78,Ebon Acolytus,79,Flesh Golem,79,Frog Stone Idol,79,Mythic Troll,79,Abyssal Wolf,80,Desert Hermit,80,Invisible Stalker,80,Merrow Saltwater,80,Nogitsune,80,Rock Troll,80,Shoggti,80,Spawn Of Juiblex,80,Adamantine Wasp Swarm,82,Oliphant,82,Quetzalcoatlus,82,Soul Eater,82,Tombstone Fairy,82,Blackwood Satyr,83,Aboleth,84,Bedlam,84,Black Troll,84,Bulette,84,Cytillipede,84,Ebony Horse,84,Ekimmu,84,Frost Drake,84,Fungal Nymph,84,Gray Nisp,84,Hangman Tree,84,Intellect Devourer,84,Shark-Eating Crab,84,Spire Drake,84,Storm Drake,84,Succubus,84,Svartalfar,84,Warmonger Devil,84,Yaoguai,84,Abasheen Genie,85,Arsinoitherium,85,Asp Mummy,85,Axiomite,85,Blaze Boa,85,Bodak,85,Brass Man,85,Chaos Beast,85,Charda,85,Chimera,85,Chuul,85,Criosphinx,85,Dark Naga,85,Death Naga,85,Dosojin,85,Dullahan,85,Dweomercat,85,Firebird,85,Formian Taskmaster,85,Galley Beggar,85,Giant Adult Ant Lion,85,Giant Rhinoceros Beetle,85,Giant Sea Snake,85,Greater Barghest,85,Greater Basilisk,85,Guardian Cimota,85,Hellcat,85,Hill Giant,85,Hound of Tindalos,85,Huge Fire Elemental,85,Huge Lightning Elemental,85,Huge Magma Elemental,85,Huge Smoke Elemental,85,Kirin,85,Lurker Above,85,Magma Ooze,85,Manananggal,85,Marrowstone Golem,85,Megalania,85,Ngoga,85,Oil Shark,85,Ooze Golem,85,Pukwudgie,85,Rot Grub Swarm,85,Sceaduinar,85,Shaitan,85,Slag Giant,85,Soulbound Mannequin,85,Spellscar Fext,85,Storm Hag,85,Suspiridaemon,85,Totenmaske,85,Unfettered Eidolon,85,Verdurous Ooze,85,Very Young Red Dragon,85,Vilkacis,85,Warmonger Wasp,85,Winter Hag,85,Young Copper Dragon,85,Young Green Dragon,85,Young Magma Dragon,85,Young Sea Dragon,85,Dun Pudding,87,Metallic Ooze,87,Mythic Ettin,89,Animate Dream,90,Blood Hag,90,Blood Wight,90,Bone Golem,90,Destrachan,90,Gargoyle Guardian,90,Ghoul Dire Wolf,90,Giant Octopus,90,Hellwasp Swarm,90,Necromantic Golem,90,Pod-Spawned Guard Captain,90,Shadow Dire Bear,90,Stegosaurus,90,Dark Custodian,91,Frostfallen Mammoth,91,Lesser Gibbering Orb,91,Mohrg,91,Oracular Cyclops,91,Rawbones,91,Geon,92,Mihstu,92,Mythic Mummy,92,Night Hag,92,Ogre Mage,92,Rock Troll,92,Stirge Demon,92,Allosaurus,93,Bogeyman,93,Dromosphinx,93,Elephant,93,Fallen,93,Wolf-in-sheep's-clothing,93,Xenopterid,93,Amaimon Devil,94,Avoral,94,Blood Reaver Devil,94,Demonic Knight,94,Dimensional Shambler,94,Erinyes Devil,94,Giant Jellyfish,94,Giant Stymphalides,94,Juvenile Gray Dragon,94,Juvenile White Dragon,94,Lammasu,94,Lava Lizard,94,Maenad,94,Mantidrake,94,Marai,94,Mordnaissant,94,Naunet,94,Remorhaz,94,Stymphalidies,94,Vile Drake,94,White Pudding,94,Yuki-onna,94,Algant,95,Azgenzak,95,Baku,95,Balisse Angel,95,Bog Creeper,95,Chrestomath,95,Deadfall Scorpion,95,Denizen of Leng,95,Dire Bear,95,Efreeti,95,Ghirru,95,Gloom Crawler,95,Gorgimera,95,Greater Acid Quasi-elemental,95,Greater Obsidian Quasi-elemental,95,Greater Salt Elemental,95,Hellwidow,95,Huge Air Elemental,95,Huge Earth Elemental,95,Huge Ice Elemental,95,Huge Mud Elemental,95,Huge Negative Energy Elemental,95,Huge Positive Energy Elemental,95,Huge Water Elemental,95,Hydrodaemon,95,Lava Weird,95,Lurker Above,95,Monadic Deva,95,Quickwood,95,Runeslave Hill Giant,95,Sentinel Hut,95,Seraph Genie,95,Shadow Wing,95,Slaughterford,95,Spirit Naga,95,Stone Maiden,95,Two-headed Troll,95,Uniila,95,Very Young Gold Dragon,95,Weaverworm,95,Young Blue Dragon,95,Young Bronze Dragon,95,Young Cloud Dragon,95,Young Mist Dragon,95,Young Sky Dragon,95,Young Void Dragon,95,Alchemical Golem,96,Cephalophore,96,Coral Golem,96,Glass Golem,96,Iron Maiden Golem,96,Obsidian Minotaur,96,Ossuary Golem,96,Baykok,97,Cold Rider,97,Forsaken Lich,97,Hawanar Genie,97,Mythic Lamia,97,Wolf-in-sheep's-clothing,97,Ebon Ooze,100,Gorgon,100,Gray Render,100,Leanan Sidhe,100,Sand Kraken,100,Urannag,100,Broken Soul Lillend,101,Clay Golem,101,Clockwork Snail,101,Clockwork Mage,102,Common Time Elemental,102,Dust Ghoul,102,Giant Slug,102,Giant Slug,102,Giant Squid,102,Gynosphinx,102,Iku-turso,102,Lamia Matriarch,102,Large Lightning Quasi-elemental,102,Marsh Giant,102,Soucouyant,102,Spider Lich,102,Spitting Sea Serpent,102,Stone Giant,102,Undead Fire Elemental,102,Vampire,102,Whirlmaw,102,Balban Demon,103,Desert Drake,103,Drowning Devil,103,Mythic Wyvern,103,Nabasu,103,Adult Dungeon Dragon,104,Astral Spider,104,Deinosuchus,104,Gargantuan Monstrous Sea Wasp,104,Giant Cobalt Viper,104,Goliath Stag Beetle,104,Guecubu,104,Jyoti,104,Kuchrima,104,Lich Shade,104,Moonflower,104,Nephilim,104,Nuckalavee,104,Nuckelavee,104,Quickwood,104,Salt Drake,104,Shantak,104,Sleeping Willow,104,Terry Demodand,104,Young Silver Dragon,104,Young Umbral Dragon,104,Young Vortex Dragon,104,Angustiden,105,Behir,105,Black Pudding,105,Bone Devil,105,Boruta,105,Brine Drake,105,Charonodaemon,105,Crimson Whale,105,Dire Tiger,105,Dracohydra,105,Dragon Horse,105,Elasmosaurus,105,Fire Lizard,105,Girtablilu,105,Gnasher Lizard,105,Gorgosaurus,105,Huge Gravity Elemental,105,Ijiraq,105,Irnakurse,105,Juvenile Black Dragon,105,Juvenile Brass Dragon,105,Mustard Jelly,105,Mythic Greater Barghest,105,Neh-thalggu,105,Northlands Aurochs,105,Silverfish Swarm,105,Tenebrous Worm,105,Tylosaurus,105,Undead Raven Swarm,105,Warped One,105,Yithian,105,Young Lunar Dragon,105,Aluum,107,Bronze Minotaur,107,Stone Golem,107,Taotieh,107,Tophet,107,Witch-doll Golem,107,Black Rot,108,Brume,110,Greater Lightning Elemental,110,Time Flayer,110,Zombie Horde,110,Lich,111,Tiberolith,111,Dire Shark (Megalodon),112,Dire Smilodon,112,Kytha,112,Lurker Wraith,112,Philosopher Golem,112,Shield Archon,112,Skull Ripper,112,Sword Spider,112,Trench Mist,112,Tunnel Worm,112,Vrock,112,Worm That Walks,113,Angazhani (High Girallon),114,Aurumvorax,114,Aurumvorax,114,Baba Yaga,114,Baluchitherium,114,Banyant,114,Bone Crawler,114,Camulatz,114,Elder Acid Quasi-elemental,114,Elder Obsidian Quasi-elemental,114,Elder Salt Elemental,114,Fountain Fungus,114,Fungus Queen,114,Geist,114,Gelatinous Golem,114,Greater Gelid Beetle,114,Guardian Naga,114,Kere,114,Living Mirage,114,Marid,114,Marid Genie,114,Mummified Gynosphinx,114,Nependis,114,Phantasm,114,Sandpoint Devil,114,Sangudaemon,114,Sepia Snake,114,Shard Spider,114,Spiny Eurypterid,114,Squealer,114,Star Monarch,114,Tikbalang,114,Treant,114,Upasunda,114,Vescavor Queen,114,Well Lurker,114,Yrthak,114,Bloodsoaker Vine,115,Brontotherium,115,Brown Pudding,115,Coven Ooze,115,Daughter of Urgathoa,115,Demonic Deadfall Scorpion,115,Dracolisk,115,Dragonkin,115,Garuda,115,Giant Snapping Turtle,115,Giant Tarantula,115,Greruor Demon,115,Juvenile Copper Dragon,115,Juvenile Green Dragon,115,Kithangian,115,Lava Drake,115,Leukodaemon,115,Mythic Medusa,115,Raggoth,115,Rakewood,115,Rakshasa,115,Shedu,115,Shoki,115,Spawning Canker,115,Vrykolakas,115,Wight Lord,115,Witch Tree,115,Witchfire,115,Yangethe,115,Young Adult Gray Dragon,115,Young Adult White Dragon,115,Young Red Dragon,115,Young Solar Dragon,115,Zelekhut,115,Zeuglodon,115,Mythic Hydra,117,Mythic Vampire,117,Sphinx Stone Idol,117,Trapper,117,Clockwork Golem,118,Mythic Aboleth,118,Reliquary Guardian,118,Gohl,119,Mokele-Mbembe,119,Mythic Hill Giant,119,Poludnica,119,Triceratops,119,Magma Ooze,120,Mature Helix Moth,120,Roc,120,Tick Swarm,120,Devilbound Sorcerer,121,Fossil Golem,122,Skiff Golem,122,Androsphinx,123,Coral Giant,123,Desert Giant,123,Dorvae,123,Einherji,123,Greater Air Elemental,123,Greater Fire Elemental,123,Greater Ice Elemental,123,Greater Magma Elemental,123,Greater Mud Elemental,123,Greater Negative Energy Elemental,123,Greater Positive Energy Elemental,123,Greater Smoke Elemental,123,Greater Water Elemental,123,Imentesh,123,Phasma,123,Sargassum Fiend,123,Trapper,123,Zuishin,123,Mythic Juvenile White Dragon,124,Chortov,125,Derghodaemon,125,Kalavakus,125,Nerizo Demon,125,Netherspark,125,Nyogoth,125,Proto-Creature,125,Boarfolk,126,Cave Giant,126,Chaaor Demon,126,Chalkydri,126,Colour Out Of Space,126,Couatl,126,Deathtrap Ooze,126,Derakni,126,Dimensional Slug,126,Dragon Turtle,126,Emperor Walrus,126,Formian Myrmarch,126,Giant Anaconda,126,Glass Urchin,126,Immense Tortoise,126,Impaled Spirit,126,Juvenile Blue Dragon,126,Juvenile Bronze Dragon,126,Movanic Deva,126,Nereid,126,Nereid,126,Nessian Warhound,126,Nue,126,Peluda,126,Rift Drake,126,Sacristan,126,Shard Slag,126,Stone Pudding,126,Young Adult Black Dragon,126,Young Adult Brass Dragon,126,Young Forest Dragon,126,Young Gold Dragon,126,Young Sovereign Dragon,126,Adlet,127,Corpsespinner,127,Crimson Death,127,Fext,127,Galvo,127,Gholdako,127,Gug,127,Gug Savant,127,Jungle Giant,127,Kapre,127,Minor Grim Reaper,127,Pale Stranger,127,Shenzuzhou,127,Woodwose,127,Clockwork Leviathan,128,Shedu Stone Idol,128,Iron Golem,129,Tyrant Jelly,129,Soulbound Shell,132,Ankou,133,Behemoth Hippopotamus,133,Cliff Giant,133,Crag Giant,133,Demi-lich,133,Devourer,133,Devouring Mist,133,Frost Giant,133,Garipan,133,Impundulu,133,Irlgaunt,133,Mastodon Elephant,133,Moon-beast,133,Noble Marid,133,Royal Naga,133,Spawn Of Yog-Sothoth,133,Thriae Seer,133,Greater Ooze Demon,135,Myrmecoleon,135,Nihiloi,135,Titan Centipede,135,Carnivorous Crystal,136,Contract Devil,136,Dretch Megaswarm,136,Elder Lightning Elemental,136,Empyreal,136,Fire Whale,136,Ghaele Azata,136,Greater Earth Elemental,136,Greater Gravity Elemental,136,Korir-kokembe,136,Mobogo,136,Saumen Kar,136,Siyokoy,136,Slime Demodand,136,Thundershrike,136,Water Orm,136,White Rider,136,Young Adult Copper Dragon,136,Young Adult Green Dragon,136,Entropic Ooze,137,Forgefiend,137,Gibrileth,137,Gongorinan,137,Piscodaemon,137,Piscodaemon,137,Retriever,137,Aerial Servant,138,Barbed Devil,138,Cacodaemon,138,Chuul-Ttaen,138,Delver,138,Dire Crocodile,138,Gargiya,138,Great Sea Anemone,138,Kronosaurus,138,Lightning Treant,138,Mezzalorn Demon,138,Raelis,138,Sapphire Jellyfish,138,Scylla,138,Ursikka,138,Woolly Rhinoceros,138,Cat Lord,139,Graveknight,139,Cannon Golem,140,Petrified Horror,140,High Cimota,141,Cinder Knight,142,Crucifixion Spirit,142,Demilich,142,Draconid,142,Fire Giant,142,Giant Emperor Scorpion,142,Jubilex-touched Marsh Jelly,142,Juggernaut,142,Lesser Banshee,142,Mouse Lord,142,Mythic Sphinx,142,Pharaonic Guardian,142,Sea Giant,142,Sea Spider,142,Tentacled Horror,142,Animated Tank,144,Furnace Golem,144,Larabay,144,Hezrou,145,Mythic Bone Devil,145,Mythic Flesh Golem,145,Mythic Treant,146,Abaia,147,Adult Brine Dragon,147,Ash Giant,147,Atamahuta,147,Bhuta,147,Cauchemar,147,Char Shambler,147,Crystallis,147,Erodaemon,147,Gnarlwood,147,Gnoph-Keh,147,Goliath Spider,147,Greater Shedu,147,Harionago,147,Interlocutor,147,Leonal,147,Lukwata,147,Meladaemon,147,Monadic Deva,147,Rukh,147,Seps,147,Sleipnir,147,Svathurim,147,Tetrolimulus,147,Thunderbird,147,Young Adult Blue Dragon,147,Young Adult Bronze Dragon,147,Akhana,148,Shachath,148,Adult Crystal Dragon,149,Adult Gray Dragon,149,Adult White Dragon,149,Giant Flytrap,149,Gigas Clam,149,Jinmenju,149,Juvenile Red Dragon,149,Mammoth,149,Young Time Dragon,149,Bebilith,150,Brass Golem,150,Canopy Creeper,150,Chernobue,150,Giant Snapping Turtle,150,Rusalka,150,Shira,150,Sojourner Of The Sea,150,Aerial Servant,152,Aoandon,152,Bronze Giant,152,Deadly Mantis,152,Elder Air Elemental,152,Elder Fire Elemental,152,Elder Ice Elemental,152,Elder Magma Elemental,152,Elder Mud Elemental,152,Elder Negative Energy Elemental,152,Elder Positive Energy Elemental,152,Elder Smoke Elemental,152,Elder Water Elemental,152,Inverted Giant,152,Jotun,152,Mythic Vrock,152,Red Rider,152,Shining Child,152,Vouivre,152,Living Rune,153,Tyrannosaurus,153,Calikang,157,Death Worm Leviathan,157,Grand Defender,157,Nightskitter,157,Proscriber,157,Putrid Ooze,157,Shaggy Demodand,157,Taiga Giant,157,Voidstick Zombie,157,Whale,157,Wickerman,157,Kolyarut,158,Adult Black Dragon,161,Adult Brass Dragon,161,Adult Cloud Dragon,161,Adult Underworld Dragon,161,Aghasura,161,Athach,161,Banshee,161,Basilosaurus,161,Catoblepas,161,Chain Worm,161,Dark Young of Shub-Niggurath,161,Deathstroke Serpent,161,Derghodaemon,161,Ghawwas,161,Ice Devil,161,Jorogumo,161,Juvenile Gold Dragon,161,Juvenile Sovereign Dragon,161,Malbolgian Cerberi,161,Sayona,161,Daraka Demon,162,Ghonhatine,162,Gibbering Abomination,162,Lorelei,162,Omox,162,Roper,162,Shadow Roper,162,Shrroth Demon,162,Stygian Spawn,162,Giant Sea Slug,164,Grimm,165,Mythic Rakshasa,165,Mythic Young Red Dragon,165,The First Owlbear,165,Mythic Nessian Warhound,166,Azruverda,168,Baregara,168,Cloud Giant,168,Coloxus,168,Dune Horror,168,Elder Earth Elemental,168,Elder Gravity Elemental,168,Frost Worm,168,Glass Wyrm,168,Scarlet Walker,168,Valkyrie,168,Dragonship,170,Spinosaurus,170,Black Rider,171,Brachiosaurus,171,Morrigna,171,Pit Hag,171,Razor Treant,171,Tarry Demodand,171,Adult Copper Dragon,172,Adult Green Dragon,172,Adult Magma Dragon,172,Adult Sea Dragon,172,Astral Deva,172,Crysolax,172,Hetkoshu,172,Kokogiak,172,Mature Adult White Dragon,172,Mature Gray Dragon,172,Mithral Golem,172,Thanadaemon,172,Woolly Rhinoceros Elasmotherium,172,Young Adult Red Dragon,172,Flayer Devil,174,Dwiergeth,175,Greater Verduous Ooze,175,Heresy Devil,175,Mute hag,175,Nabasu Demon,175,Obambo,175,Oolioddroo,175,Stygian Turtle-shark,175,Tobongo,175,Trumpet Archon,175,Battlehulk,177,Clockwork Dragon,177,Biclops,178,Corpse Lotus,178,Inkanyamba,178,Lilith,178,Siabrae,178,Splinter Drake,178,The Old Man,178,Umdhlebi,178,Vorin,178,Widow Creeper,178,Gashadokuro,180,Peri,180,Adult Blue Dragon,184,Adult Bronze Dragon,184,Adult Cloud Dragon,184,Adult Mist Dragon,184,Adult Sky Dragon,184,Adult Void Dragon,184,Argus,184,Beluiri,184,Blue Whale,184,Carnivorous Blob,184,Charybdis,184,Dread Wraith,184,Froghemoth,184,Froghemoth,184,Giant Bog Turtle,184,Mature Adult Black Dragon,184,Mature Adult Brass Dragon,184,Oni Earth Yai,184,Seaweed Siren,184,Spitting Eurypterid,184,Young Adult Gold Dragon,184,Glabrezu,186,Ciratto,187,Possession Greater Devil,187,Ghorazagh,187,Handmaiden Devil,187,Sea Serpent,187,Dancing Hut Of Baba Yaga,188,Aeshma Demon,189,Akhlut,189,Shipwrecker Crab,189,Somalcygot,189,Spirit of Adoration,189,Diplodocus,190,Hamadryad,190,Noble Time Elemental,190,Viper Vine,190,Adult Silver Dragon,195,Adult Umbral Dragon,195,Adult Vortex Dragon,195,Courage Heart,195,Great Cyclops,195,Mature Adult Copper Dragon,195,Mature Adult Green Dragon,195,Mezlan,195,Nightwing,195,Rokurokubi,195,Temerdaemon,195,Vemerak,195,Vespergaunt,195,Mythic Fire Giant,197,Alraune,199,Cat Lord,199,Corpse Orgy,199,Kakuen-taka,199,Sphinx Colossus,199,Steward of the Skein,199,Storm Giant,199,Vydrarch,199,Adult Lunar Dragon,200,Basileus,200,Ghaddar Devil,200,Ice Yai,200,Mastodon,200,Purple Worm,200,Veiled Master,200,Volcano Giant,201,Crag Linnorm,202,Fisherman,202,Leng Spider,202,Mythic Elder Air Elemental,202,Mythic Elder Fire Elemental,202,Mythic Elder Water Elemental,202,Noqual Golem,202,Nysrock Demon,202,Sepid,202,Augnagar,203,Giant Proto-Creature,203,Nalfeshnee,203,Adamantine Golem,205,Air Elemental Construct,205,Earth Elemental Construct,205,Fire Elemental Construct,205,Water Elemental Construct,205,Behemoth Golem,206,Arcanotheign,207,Bythos,207,Caizel,207,Dybbuk,207,Flying Polyp,207,Hand of the Inheritor,207,Mature Adult Blue Dragon,207,Mature Adult Bronze Dragon,207,Mountain Troll,207,Suijin,207,Warsworn,207,Crone Queen,209,Ecorche,209,Mythic Lich,209,Demoriel,210,Phoenix,210,Stringy Demodand,210,Toshigami,210,Willow Dusk,210,Addu,212,Adult Red Dragon,212,Adult Solar Dragon,212,Astradaemon,212,Belier Devil,212,Cetaceal,212,Crucidaemon,212,Gorynych,212,Old Gray Dragon,212,Old White Dragon,212,Stormghost,212,Clockwork Goliath,214,Marut,214,Jotund Troll,216,Memitim,216,Horned Devil,217,Mallor Demon,217,Riftcreeper,217,Seraptis,217,Ancient Dungeon Dragon,218,Gallows Tree,218,Hyakume,218,Mythic Elder Earth Elemental,218,Ocean Giant,218,Personification of Fury,218,Sand Giant,218,Shadow Giant,218,Addath,220,Hungerer,220,Mythic Ice Devil,221,Flesh Colossus,224,Adult Gold Dragon,225,Adult Sovereign Dragon,225,Amalgamation,225,Emperor of Scales,225,End's Voice,225,Great White Whale,225,Living Monolith,225,Nemhain,225,Old Black Dragon,225,Old Brass Dragon,225,Popobala,225,Stabbing Beast,225,Stabbing Beast,225,Sthenno,225,Tataka,225,Vilsteth,225,Woundwyrm,225,Black Scorpion,228,Gallowdead,228,Royal Time Elemental,228,Adult Forest Dragon,229,Fire Yai,229,Gare Linnorm,229,Kurshu The Undying,229,Planetar,229,Ugash-iram,229,Ulkreth,229,Bodythief,230,Gunpowder Ooze,230,Hollow Serpent,230,Jubjub Bird,230,Mother's Maw,230,Neothelid,230,Pelagos Sea Spider,230,Wind Yai,230,Herald Of Tsathogga,231,Sea Bonze,231,Soul Reaper,231,Black Magga,232,Labyrinth Minotaur,232,Gigas Hell,237,Manitou,237,Mature Adult Red Dragon,237,Old Copper Dragon,237,Old Green Dragon,237,Very Old Gray Dragon,237,Very Old White Dragon,237,Nightwalker,241,Plasma Ooze,241,Slimy Demodand,241,Ephialtes Kyton,243,Mythic Great Cyclops,243,Shemhazian,246,Zomok,246,Faceless Whale,248,Fjord Linnorm,248,Gharros Demon,248,Spine Dragon,248,Ha-Naga,250,Mature Adult Gold Dragon,250,Old Blue Dragon,250,Old Bronze Dragon,250,Scylla,250,Slorath,250,Very Old Black Dragon,250,Very Old Brass Dragon,250,Elemental Air Dragon,252,Elemental Earth Dragon,252,Elemental Fire Dragon,252,Elemental Water Dragon,252,Flayed Angel,252,Kulgreer,252,Wood Elemental,252,Barometz,253,Ypotryll,253,Adult Time Dragon,256,Brijidine,256,Gelatinous Emperor,256,Jade Colossus,256,Mature Adult Forest Dragon,256,Mythic Mature Adult Black Dragon,260,Apostate Devil,261,First Blade,261,Khala,261,Kongamato,261,Bakekujira,262,Old Umbral Dragon,262,Shaggy Demodand,262,Tunche,262,Very Old Copper Dragon,262,Very Old Green Dragon,262,Lilitu,263,Mortuary Cyclone,263,Termagant,263,Kaminari,264,Marilith,264,Phasmadaemon,264,Stone Colossus,265,Baaphel,270,Erlking,270,Euryale,270,Immortal Ichor,270,Lusca,270,Norn,270,Rune Giant,270,Taniniver,270,Winterwight,270,Ancient Brine Dragon,275,Shinigami,275,Titivilus,275,Very Old Blue Dragon,275,Very Old Bronze Dragon,275,Formian Queen,276,Ice Linnorm,279,Thrasfyr,279,Wendigo,279,Mythic Phoenix,280,Abyss Gigas,283,Abyssal Harvester,283,Ancient Crystal Dragon,283,Ancient Gray Dragon,283,Ancient White Dragon,283,Cervinal,283,Grootslang,283,Mire Brute,283,Old Red Dragon,283,Ferrous Giant,287,Keketar,287,Mythic Nalfeshnee,287,Bhole,290,Cairn Linnorm,290,Choronzon Demon,290,Kraken,290,Oma,290,Thulgant,290,Purrodaemon,294,Star Archon,294,Mythic Mature Adult Blue Dragon,295,Advodaza Devil,297,Ancient Black Dragon,297,Ancient Brass Dragon,297,Ancient Cloud Dragon,297,Ancient Underworld Dragon,297,Aspidochelone,297,Hutijin,297,Kelpie's Wrath,297,Nemesis Devil,297,Old Gold Dragon,297,Vavakia,297,Water Yai,297,Irminsul,301,Ghaggurath,304,Katpaskir,304,Iron Colossus,309,Ancient Copper Dragon,310,Ancient Green Dragon,310,Ancient Magma Dragon,310,Ancient Sea Dragon,310,Astral Leviathan,310,Bandersnatch,310,Eremite,310,Leviathan,310,Maharaja,310,Very Old Red Dragon,310,Wyrm Gray Dragon,310,Wyrm White Dragon,310,Nightcrawler,312,Thriae Queen,312,Immolation Devil,315,Obcisidaemon,319,Tzitzimitl,319,Jack-in-irons Giant,321,Ancient Blue Dragon,324,Ancient Bronze Dragon,324,Ancient Cloud Dragon,324,Ancient Mist Dragon,324,Ancient Void Dragon,324,Deep Hunter Sea Serpent,324,Draconal,324,Pleroma,324,Simurgh,324,Veranallia,324,Wyrm Black Dragon,324,Wyrm Brass Dragon,324,Maphistal,330,Gallu,332,Vrolikai,332,Afanc,333,Ancient Sky Dragon,333,Baal,333,Deep Sea Serpent,333,Sard,333,Shoggoth,333,Ancient Silver Dragon,337,Ancient Umbral Dragon,337,Ancient Vortex Dragon,337,Ravener Behemoth,337,Gibbering Orb,337,Lhaksharut,337,Red Wyrm Ravener,337,Thunder Behemoth,337,Wyrm Copper Dragon,337,Wyrm Green Dragon,337,Yamaraj,337,Grendel,340,Humbaba,341,Mythic Very Old Green Dragon,342,Mythic Marilith,344,Charnel Colossus,345,Requiem Beetle,345,Stone Treant,346,Taiga Linnorm,346,Ancient Lunar Dragon,348,Jinushigami,348,Slag Worm,348,Pit Fiend,350,Wyrm Blue Dragon,351,Wyrm Bronze Dragon,351,Dantalion,356,Quantum,357,Ancient Red Dragon,362,Ancient Solar Dragon,362,Great Wyrm Gray Dragon,362,Great Wyrm White Dragon,362,Star-Spawn Of Cthulhu,362,Solar,363,Vepar,363,Devastator,365,Savage Great Cyclops,368,Balor,370,Olethrodaemon,370,Akvan,372,Gorson,372,Iathavos,372,Quantium Golem,375,Ancient Gold Dragon,377,Ancient Sovereign Dragon,377,Great Wyrm Black Dragon,377,Great Wyrm Brass Dragon,377,Grim Reaper,378,Moxix,379,Void Yai,379,Asurendra,385,Sonechard,385,Tarn Linnorm,385,Ancient Forest Dragon,387,Caasimolar,391,Dark Matter Entropic Ooze,391,Great Wyrm Copper Dragon,391,Great Wyrm Green Dragon,391,Nightwave,391,Thalassic Behemoth,391,Wyrm Red Dragon,391,Julunggali,399,Ravager Spawn,405,Ravager Spawn,405,Great Wyrm Blue Dragon,406,Great Wyrm Bronze Dragon,406,Elysian Titan,409,Fomorian Titan,413,Ancient Time Dragon,418,Mu Spore,418,Great Wyrm Umbral Dragon,420,Tor Linnorm,420,Elohim,423,Amon,434,Volnagur,437,Tempest Behemoth,445,Great Wyrm Red Dragon,449,Cherum,450,Jabberwock,455,Charon,464,Cerberus,465,Great Wyrm Gold Dragon,465,Wrath Dragon,465,Blood Queen,471,Ifestus,471,Thanatotic Titan,471,Chemnosit,472,Ravager Spawn,495,Inder,500,Susir,500,Hekatonkheires,516,Balor Lord,518,Mythic Wyrm Red Dragon,518,Stygian Leviathan,522,Living Lake,525,Tarrasque,525,Fafnheir,526,Nightripper,526,Yamasoth,526,Korada,528,Guardian Dragon,529,Kostchtchie,536,Lypso,540,Jubilex,553,Shamira,553,Baphomet,555,Lorthact,560,Moloch,561,Dagon,594,Kostchtchie,604,Pazuzu,604,Vildeis,610,Geryon,612,The Ravager,612,The Ravager,612,Drakainia,642,Baphomet,643,Xoveron,643,Bokrug,645,Agyra,656,Alastor,660,Onyst,660,Cernunnos,663,Shipbreaker Sea Serpent,665,Sifkesh,666,Dagon,676,Shax Demon Lord,676,Xaphan,717,Hastur,731,Deskari,742,Orcus,742,Pazuzu,752,Cthulhu,774,Nocticula,774,Slaad Lord Of The Insane,820,The Oinodaemon,857,The Ravager,857,Tsathogga,861,Slaad Lord Of Entropy,888,Fraz-urb'luu,900,Lucifer,943";
l = "Dagger of Venom,Lens of Detection,Unguent of Timelessness,Universal Solvent,Amulet of Inescapable Location,Armor of Arrow Attraction,Armor of Rage,Bag of Devouring,Boots of Dancing,Bracers of Defenselessness,Broom of Animated Attack,Crystal Hypnosis Ball,Dust of Sneezing and Choking,Flask of Curses,Gauntlets of Fumbling,Helm of Opposite Alignment,Incense of Obsession,Mace of Blood,Medallion of Thought Projection,Necklace of Strangulation,Net of Snaring,Periapt of Foul Rotting,Poisonous Cloak,Potion of Poison,Robe of Powerlessness,Robe of Vermin,Ring of Clumsiness,Scarab of Death,Stone of Weight (Loadstone),Vacuous Grimoire,Adamantine Breastplate,Dwarven Plate,Dragonhide Plate,Elven Chain,Mithral Shirt,Darkwood Buckler,Darkwood Shield,Mithral Heavy Shield,Grave Candle,Truecolor Dye,Bones of Founder,Clasp of the Mind Scream,Entwined Syrinx,Felhart,Golden Dragon Kite,War Mask,Spirit Jars,Skin of the Troll King,Talisman of the Orc Mother's Fury,Melancholic Talisman,Sanguine Talisman,Bilious Talisman,The Morrowfall,clear spindle ioun stone,dusty rose prism ioun stone,deep red sphere ioun stone,incandescent blue sphere ioun stone,pale blue rhomboid ioun stone,pink rhomboid ioun stone,pink and green sphere ioun stone,scarlet and blue sphere ioun stone,dark blue rhomboid ioun stone,iridescent spindle ioun stone,pale lavender ellipsoid ioun stone,pearly white spindle ioun stone,pale green prism ioun stone,orange prism ioun stone,vibrant purple prism ioun stone,lavender and green ellipsoid ioun stone,Golem Manual clay,Golem Manual flesh,Golem Manual iron,Golem Manual stone,Golem Manual stone guardian,Manual of Bodily Health +1,Manual of Bodily Health +2,Manual of Bodily Health +3,Manual of Bodily Health +4,Manual of Bodily Health +5,Manual of Gainful Exercise +1,Manual of Gainful Exercise +2,Manual of Gainful Exercise +3,Manual of Gainful Exercise +4,Manual of Gainful Exercise +5,Manual of Quickness of Action +1,Manual of Quickness of Action +2,Manual of Quickness of Action +3,Manual of Quickness of Action +4,Manual of Quickness of Action +5,Tome of Clear Thought +1,Tome of Clear Thought +2,Tome of Clear Thought +3,Tome of Clear Thought +4,Tome of Clear Thought +5,Tome of Leadership and Influence +1,Tome of Leadership and Influence +3,Tome of Leadership and Influence +4,Tome of Leadership and Influence +5,Tome of Understanding +1,Tome of Understanding +2,Tome of Understanding +3,Tome of Understanding +4,Tome of Understanding +5,Ring of Energy Resistance major,Ring of Energy Resistance minor,Ring of Energy Resistance greater,Sparton Seeds,Ioun Stone amber spindle,Ioun Stone crimson sphere,Ioun Stone dull gray stone,Ioun Stone emerald ellipsoid,Ioun Stone gamboge nodule,Ioun Stone mossy disk,Ioun Stone mulberry pentacle,Ioun Stone nacreous gray sphere,Ioun Stone onyx rhomboid,Ioun Stone opalescent white pyramid,Ioun Stone pale ruby trillian,Ioun Stone scarlet and green cabochon,Ioun Stone turquoise sphere,Ioun Stone vermilion rhomboid,Wayfinder (Standard),Wayfinder of Passage,Wayfinder of the Sleeping Eye,Autonomous Cartographer,Dead Man's Shroud,Eldritch Egress,Horseshoes of Great Burden,Pathfinder Pouch,Versatile Vest,Blade of the Willing Martyr,Mindborer Ioun Stone,Ioun Stone sepia ellipsoid,Crystal Ball standard,Figurine of Wondrous Power (bronze griffon),Figurine of Wondrous Power (ebony fly),Figurine of Wondrous Power (golden lions),Figurine of Wondrous Power (ivory goats),Figurine of Wondrous Power (marble elephant),Figurine of Wondrous Power (obsidian steed),Figurine of Wondrous Power (onyx dog),Figurine of Wondrous Power (serpentine owl),Figurine of Wondrous Power (silver raven),Slaying Arrow greater,Talon Sword,Talonstrike Sword,Golden Eagle Epaulets,Figurine of Wondrous Power (serpentine eagle),Tome of Leadership and Influence +2,Fang of Erebus,Nightskin,Stag's Helm,Crook of Cildhureen,Bag of Concealment type I,Bag of Concealment type II,Bag of Concealment type III,Bag of Concealment type IV,Corpse-Ferrying Bag,Cube of varies Force Walls,Discriminationg Cube,Independent Cube of Force,Rechargeable Cube of Force,Remote Activation Cube,Twinned Cubes of Force,The Elder Decks,House of Cards,Helm of Reclamation,Aligned Horn of Valhalla,Linnorm's Lament,Sphere of Bleeding Snowflakes,Twin Spheres,Rift-Born Sphere,Magi Staff of the Mammoth,Magi Staff of the Deep Black,Magi Staff of the Necromancer,Magi Staff of the Scholar,Staff of Elemental Castigation,Staff of the Magi,Executioner's Hand,Frostkiss Whip,Jorngarl's Harm,Liar's Well,Shadow Well,Well of Stars,Well of the Welcome Respite,Nesa's Coin,Soul Jar,Beguiling Bangles,Chest of Preparedness,Crowcaller,Daring Dancers,Disk of Ghol-Gan,Eye of the Mantis,Guiding Vellum 1st,Guiding Vellum 2nd,Guiding Vellum 3rd,Guiding Vellum 4th,Guiding Vellum 5th,Guiding Vellum 6th,Guiding Vellum 7th,Guiding Vellum 8th,Guiding Vellum 9th,Home Stone,Ki Crystal,Midsummer Sickle,Utilitarian Rod,Armillary Amulet,Elixir of True Form,Cloak of the Jungle,Expedition Pavilion,Jungle Boots,Machete of Clearing,Spirit Shield,Staff of Spirit-Talking,Blackwick Cauldron,Crown of Ash,Staff of Stoneweaving,Figurine of Wondrous Power (emerald frog),Goreclaw,Plumed Mantle,Greater Hat of Disguise,Idol of the Eye,Halflight Charm,Death's Head Talisman 10HD,Death's Head Talisman 14HD,Death's Head Talisman 18HD,Death's Head Talisman 24HD,Necklace of Lovelies,Assisting Glove,Moon Circlet,Robes of Arcane Heritage,Silver Smite Bracelet,Buffoon's Sword,Cannibal Ring,Cloak of Immolation,Crown of Blindness,Gravesoul Armor,Hat of Hatreds,Girdle of Opposite Gender,Planar Invasion Shield,One-Way Window,Ring of Truth,Riot Pipes,Rod of Arson,Beacon of True Faith,Hammer of Thunderbolts,Knucklebone of Fickle Fortune,Perfect Golden Lute,Spindle of Perfect Knowledge,Talisman of Reluctant Wishes,Bottle of the Bound,Cloud Castle of The Storm King,Fork of the Forgotten One,The Moaning Diamond,The Shield of the Sun,Spirit Fetish,War Mask of Terror,Eloko Bell,Torc of Kostchtchie,Charm of Fate,Elixir of Spirit Sight,Hammertail,Hyena Spirit Skin,Litheria Blossom,Mantis Blade,Monkey's Paw,Ring of Seven Virtues,Rod of Well-Deserved Rest,Savage Sting,Stunstone,Wavecutter,Black Blessing,Ganji Doll,Laubo Powder,Spirit Tear,Argental Font,Amulet of the Abyss,Book of the Damned : Demonic,Celestial Lens,Flame of Guidance,The Aqualinth,Nightmare Tears,Throne of the Ascendant,Belt of the Snake King,Snakescale Armor,Totem of Angazhan,Padma Blossom,Haunt Siphon,Charm of Aluum Control,Goz Mask,Mask of the Mantis,Unguent of Revivification,Wayfinder,Zoic Fetish,Blackaxe,Final Blade,God Shield,Sun Orchid Elixir,Wardstone,Infensus Mucro,Deathgag Elixir,Canopic Stone,Pendant of the Blood Scarab,Chomper (Intelligent Bag of Devouring),Cockatrice Grit,Desiccating Dust,Firefoot Powder,Marionette Crux,Raven's Head,Face of Dagon,Brain Cylinder,Moribund Key,Bloodbrew Elixir,Witching Gown,Horns of Naraga,Gem of Dreams,Raven Bracers,Deadflesh Waraxe,Deck of Harrowed Tales,Coldfire Wrappings,Bone Beads,Bloodfeast Shield,Amatatsu Seal,Dancing Wasp,Warding Box,Whispering Shrike,Decemvirate Helm,Dweomer's Essence,Field Scrivener's Desk,Fortifying Stone,Fortunate Charm,Pathfinder's Coin,Pipes of Shifting Tempo,Tyrant's Friend,Shining Wayfinder,Tireless Wayfinder,Vanishing Wayfinder,Wayfinder of Revelation,Wayfinder of Spellbreaking,Devastating Dog Whistle,Explosion Pocket,Jumping Cinder,Scavenger 's Stone,Deadly Kiss,Earthfire Shuriken,Fugitive's Grenade,Oathtaker,Shozoku of the Night Wind,Banner of the Ancient Kings,Harp of Storms,Rixbrand,Ghost Mirror Armor,Map of the High Ice,Nine-Fold Spirit Sword,Sashimono of Comfort,Do-Maru of Broken Flesh,Flask of Endless Sake,Kikuya's Sensu,The Thundering Blade,Book of The Damned: Daemonic,Candle of Abaddon,Hydrodaemon Runestone,Ring of The Cacodaemon,Talisman of Soul-Eating,Book of Infinite Spells,Deck of Many Things,Philosopher's Stone,Sphere of Annihilation,Talisman of Pure Good,Talisman of the Sphere,Talisman of Ultimate Evil,Axe of the Dwarvish Lords,Codex of the Infinite Planes,The Orbs of Dragonkind,The Shadowstaff,Shinobi Fuhonsen,Armor of the Tireless Warrior,Daikyu of Commanding Presence,Dragonmaw Nunchaku,Karyukai Tea Set,Samisen of Oracular Vision,Chon Chon Elixir,The Raging Cyclone,The Cutting Light,O-Yoroi of Imperial Rule,Spirit Elixir,The Silent Crane,Pressure Suit,Pirate's Tricorne,Boarding Pike of Repelling,Hospitality's Hammock,Steadfast Grapple,Tidewater Cutlass,Vindictive Harpoon,Book of Night without Moon,Pirate Bones,Brine's Sting,Captain's Locker,Farglass,Svingli's Eye,Zul,All-Seeing Eye,Bloodstone Impaler,Snailplate,Abrogalian Corset,Cloak of Flash and Shadow,Grudge Blade,Hellcaller's Edge,Pact Parchment,Ring of Terrible Cost,Verdict of the Nether Court,Elixir of Luck,Hero's Blade,Reaver's Scythe,Ring of Heroes,Staff of Fortune,Clockwork Key,Calming Oils,Manual of Calm Reflection,Mask of Destruction and Creation,Razored Ropes,Spiral Tiles,Triple-Stinging Blade,Sharpshooter's Blade,Charts of the Fair Winds,Ring of the Iron Skull,Shackles Ensign,Voidstick,Farwatcher,Behemoth Golem Manual,Ivory Baton,Rotcarver,Visage of the Broodlord,Elixir of Darksight,Gloves of Elvenkind,Amazing Tools of Manufacture,Phantasmal Gem,Brooch of Blending,Purifying Pearl,Book of Marvelous Recipes,Escape Dust,Quickfingers Gloves,Solidsmoke Pipeweed,Symbol of Luck,Daredevil Softpaws,Rending Claw Blade,Amulet of Channeled Life,Lenses of Darkness,Symbol of Unholy Command,Living Garments,Amulet of Hidden Light,Lambent Window,Lantern of Dancing Shadows,Wound Paste,Rubble Gloves,Trapmaker's Sack,Pipes of The Warren Guardian,Elixir of Forceful Exhalation,Black Feather Fan,Figurine of Wondrous Power (black jade raven),Red Feather Fan,Tengu Drinking Jug,Darksire Amulet,Shark Tooth Amulet,Bubble Vault,Nagaji Scale Polish,Incense of Many Fates,Bag of Shadow Clouds,Eel Skin Armor,Impossible Bottle,Scoundrel's Sword Cane,Skeleton Anchor,Kapre Cigar,Aiger's Kiss,Howling Skull Armor,Mariner's Eye Patch,Mutineer's Bane Earring,Skyrocket Crossbow,Wizard Hook,Sword of Greed,Crossbow of Retribution,Doubleshot Pepperbox,Enervating Pistol,Hurricane Crown,Sirocco Cannon,Cat Burglar's Boots,Extraction Scarificator,Paradox Box,Pendant of The Souk,Shard of Envy,Shard of Gluttony,Shard of Greed,Shard of Pride,Shard of Sloth,Shard of Wrath,Shard of Lust,Iron Lash,Anathema Archive,Anima Focus,Elixir of The Peaks,Fanged Falchion,Fog-cutting Lenses,Impaler of Thorns,Burning Glaive,Revelation Quill,Robe of Runes,Runechill Hatchet,Runeslave Cauldron,Runewell Amulet,Runewell of Greed,Sadist's Lash,Runestar Medallion,Runestar Ring,Runestar Tome,Skinsaw Mask,Soul Lens,Armor of Insults,Banded Mail of Luck,Boneless Leather,Breastplate of Command,Breastplate of Vanishing,Buccaneer's Breastplate,Catskin Leather,Celestial Armor,Daystar Half-plate,Demon Armor,Enchanted Eelskin,Equestrian Plate,Folding Plate,Forsaken Banded Mail,Hamatula Hide,Invincible Armor,Mail of Malevolence,Mistmail,Mithral Full Plate of Speed,Morlock Hide,Murderer's Blackcloth,Otyugh Hide,Plate Armor of The Deep,Prismatic Plate,Rhino Hide,Scarab Breastplate,Soothsayer's Raiment,Warden of The Woods,Absorbing Shield,Avalanche Shield,Battlement Shield,Belligerent Shield,Burglar's Buckler,Caster's Shield,Celestial Shield,Collapsible Tower,Dragonslayer's Shield,Elysian Shield,Force Tower,Fortress Shield,Lion's Shield,Maelstrom Shield,Quick Block Buckler,Spell Ward Tower Shield,Spined Shield,Tempest Shield,Volcanic Shield,Winged Shield,Wyrmslayer's Shield,Zombie Skin Shield,Alchemist's Bullet,Assassin's Dagger,Bastard's Sting,Beaststrike Club,Blade of Binding,Blade of The Rising Sun,Bladeofthe Sword-Saint,Bloodletting Kukri,Bloodthirst Dagger,Boulderhead Mace,Cutthroat's Apprentice,Dagger of Doubling,Dragoncatch Guisarme,Dragon's Doom,Dust Bolt,Dustburst Bullet,Dwarfbond Hammer,Dwarven Thrower,Earthenflail,Everflowing Aspergillum,Fighter's Fork,Firedrake Pistol,Flame Tongue,Frost Brand,Frostbite Sling,Ghoul's Lament,Gloom Blade,Guarding Blade,Heartswood Spear,Hellscourge,Holy Avenger,Hurricane Quarterstaff,Hushing Arrow,Javelin of Lightning,Lance of Jousting,Lash of The Howler,Life-drinker,Luck Blade 0 Wishes,Luck Blade 1 wish,Luck Blade 2 Wishes,Luck Blade 3 Wishes,Mace of Smiting,Mace of Terror,Nine Lives Stealer,Oathbow,Pistol of The Infinite Sky,Polarity Hammer,Quarterstaff of Vaulting,Rapier of Puncturing,Ricochet Hammer,Scimitar of The Spellthief,Screaming Bolt,Searing Arrow,Shatterspike,Shieldsplitter Lance,Shifter's Sorrow,Sizzling Arrow,Slaying Arrow,Sleep Arrow,Sparkwake Starknife,Spider's Fang,Spirit Blade,Spirit Caller,Summoner's Sorrow,Sun Blade,Swift Obsidian Greataxe,Sword of Life Stealing,Sword of Subtlety,Sword of The Planes,Sylvan Scimitar,Tangle Bolt,Ten-ring Sword,Tracer Bullet,Trident of Fish Command,Trident of Stability,Trident of Warning,Triton's Trident,Undercutting Axe,Valor's Minion,Void Scythe,Warbringer,Decoy Ring,Ring of Animal Friendship,Ring of Arcane Mastery,Ring of Arcane Signets,Ring of Blinking,Ring of Chameleon Power,Ring of Climbing,Ring of Continuation,Ring of Counterspells,Ring of Craft Magic,Ring of Curing,Ring of Delayed Doom,Ring of Djinni Calling,Ring of Ectoplasmic Invigoration,Ring of Elemental Command,Ring of Energy Shroud,Ring of Evasion,Ring of Feather Falling,Ring of Ferocious Action,Ring of Foe Focus,Ring of Force Shield,Ring of Forcefangs,Ring of Freedom of Movement,Ring of Friend Shield,Ring of Grit Mastery,Ring of Invisibility,Ring of Jumping,Ring of Ki Mastery,Ring of Maniacal Devices,Ring of Mind Shielding,Ring of Protection +1,Ring of Protection +2,Ring of Protection +3,Ring of Protection +4,Ring of Protection +5,Ring of Rat Fangs,Ring of Regeneration,Ring of Retribution,Ring of Return,Ring of Sacred Mistletoe,Ring of Shooting Stars,Ring of Spell Knowledge Type I,Ring of Spell Knowledge Type II,Ring of Spell Knowledge Type III,Ring of Spell Knowledge Type IV,Ring of Spell Storing,Ring of Spell Turning,Ring of Strength Sapping,Ring of Sustenance,Ring of Swarming Stabs,Ring of Swimming,Ring of Tactical Precision,Ring of Telekinesis,Ring of The Ecclesiarch,Ring of The Grasping Grave,Ring of The Ram,Ring of The Sea Strider,Ring of The Sophisticate,Ring of The Troglodyte,Ring of Three Wishes,Ring of Transposition,Ring of Water Walking,Ring of Wizardry I,Ring of Wizardry II,Ring of Wizardry III,Ring of Wizardry IV,Ring of X-ray Vision,Scholar's Ring,Spiritualist Rings,Steelhand Circle,Conduit Rod,Earthbind Rod,Fiery Nimbus Rod,Grounding Rod,Immovable Rod,Liberator's Rod,Rod of Absorption,Rod of Alertness,Rod of Balance,Rod of Beguiling,Rod of Cancellation,Rod of Dwarven Might,Rod of Enemy Detection,Rod of Escape,Rod of Flailing,Rod of Flame Extinguishing,Rod of Ice,Rod of Lordly Might,Rod of Metal And Mineral Detection,Rod of Mind Mastery,Rod of Negation,Rod of Nettles,Rod of Ruin,Rod of Rulership,Rod of Security,Rod of Shadows,Rod of Splendor,Rod of Steadfast Resolve,Rod of The Aboleth,Rod of The Python,Rod of The Viper,Rod of The Wayang,Rod of Thunder And Lightning,Rod of Thunderous Force,Rod of Withering,Rod of Wonder,Sapling Rod,Scepter of Heaven,Suzerain Scepter,Trap-stealer's Rod,Bouncing Metamagic Rod,Burning Metamagic Rod,Concussive Metamagic Rod,Dazing Metamagic Rod,Disruptive Metamagic Rod,Echoing Metamagic Rod,Ectoplasmic Metamagic Rod,Elemental Metamagic Rod,Empower Metamagic Rod,Enlarge Metamagic Rod,Extend Metamagic Rod,Flaring Metamagic Rod,Focused Metamagic Rod,Intensified Metamagic Rod,Lingering Metamagic Rod,Maximize Metamagic Rod,Merciful Metamagic Rod,Persistent Metamagic Rod,Piercing Metamagic Rod,Quicken Metamagic Rod,Reach Metamagic Rod,Rime Metamagic Rod,Selective Metamagic Rod,Sickening Metamagic Rod,Silent Metamagic Rod,Thanatopic Metamagic Rod,Threnodic Metamagic Rod,Thundering Metamagic Rod,Toppling Metamagic Rod,Animate Staff,Chaotic Staff,Dragon Staff,Heretic's Bane,Holy Staff,Lawful Staff,Musical Staff,Staff of Abjuration,Staff of Accompaniment,Staff of Acid,Staff of Aspects,Staff of Authority,Staff of Belittling,Staff of Blessed Relief,Staff of Bolstering,Staff of Cackling Wrath,Staff of Charming,Staff of Conjuration,Staff of Courage,Staff of Curses,Staff of Dark Flame,Staff of Defense,Staff of Divination,Staff of Earth And Stone,Staff of Eidolons,Staff of Electricity,Staff of Enchantment,Staff of Evocation,Staff of Feast And Famine,Staff of Fire,Staff of Frost,Staff of Healing,Staff of Heaven And Earth,Staff of Hoarding,Staff of Hungry Shadows,Staff of Illumination,Staff of Illusion,Staff of Journeys,Staff of Life,Staff of Many Rays,Staff of Minor Arcana,Staff of Mithral Might,Staff of Necromancy,Staff of Obstacles,Staff of One Hundred Hands,Staff of Passage,Staff of Performance,Staff of Power,Staff of Radiance,Staff of Revelations,Staff of Rigor,Staff of Shrieking,Staff of Size Alteration,Staff of Slumber,Staff of Souls,Staff of Speaking,Staff of Spiders,Staff of Stealth,Staff of Swarming Insects,Staff of The Avenger,Staff of The Hierophant,Staff of The Master,Staff of The Planes,Staff of The Scout,Staff of The Woodlands,Staff of Toxins,Staff of Transmutation,Staff of Traps,Staff of Travel,Staff of Tricks,Staff of Understanding,Staff of Vision,Staff of Weather,Unholy Staff,Anaconda's Coils,Aquatic Cummerbund,Belt of Dwarvenkind,Belt of Equilibrium,Belt of Fallen Heroes,Belt of Foraging,Belt of Giant Strength +2,Belt of Giant Strength +4,Belt of Giant Strength +6,Belt of Physical Might +2,Belt of Physical Might +4,Belt of Physical Might +6,Belt of Incredible Dexterity +2,Belt of Incredible Dexterity +4,Belt of Incredible Dexterity +6,Belt of Mighty Constitution +2,Belt of Mighty Constitution +4,Belt of Mighty Constitution +6,Belt of Physical Perfection +2,Belt of Physical Perfection +4,Belt of Physical Perfection +6,Belt of Stoneskin,Belt of Teeth,Belt of The Weasel,Belt of Thunderous Charging,Belt of Tumbling,Beneficial Bandolier,Bladed Belt,Blinkback Belt,Cord of Stubborn Resolve,Elemental Earth Belt,Equestrian Belt,Gorgon Belt,Heavyload Belt,Merform Belt,Meridian Belt,Minotaur Belt,Monkey Belt,Plague Rat Belt,Sash of Flowing Water,Security Belt,Serpent Belt,Shadowform Belt,Blazing Robe,Bodywrap of Mighty Strikes +1,Bodywrap of Mighty Strikes +2,Bodywrap of Mighty Strikes +3,Bodywrap of Mighty Strikes +4,Bodywrap of Mighty Strikes +5,Bodywrap of Mighty Strikes +6,Bodywrap of Mighty Strikes +7,Cassock of The Clergy,Corset of Dire Witchcraft,Corset of The Vishkanya,Druid's Vestment,Eidolon Anchoring Harness,Gunman's Duster,Mnemonic Vestment,Monk's Robe,Otherworldly Kimono,Resplendent Robe of The Thespian,Robe of Arcane Heritage,Robe of Blending,Robe of Bones,Robe of Components,Robe of Eyes,Robe of Gates,Robe of Infinite Twine,Robe of Needles,Robe of Scintillating Colors,Robe of Stars,Robe of The Archmagi,Robe of Useful Items,Shocking Robe,Smuggler's Collapsible Robe,Sorcerer's Robe,Voidfrost Robe,Xorn Robe,All Tools Vest,Bandages of Rapid Recovery,Bane Baldric,Cackling Hag's Blouse,Deadshot Vest,Endless Bandolier,Mantle of Faith,Mantle of Immortality,Mantle of Spell Resistance,Merciful Baldric,Prophet's Pectoral,Quick Runner's Shirt,Resplendent Uniform Coat,Sash of The War Champion,Shirt of Immolation,Sipping Jacket,Snakeskin Tunic,Spectral Shroud,Tunic of Careful Casting,Tunic of Deadly Might,Unfettered Shirt,Vest of Escape,Vest of Stable Mutation,Vest of Surgery,Vest of The Cockroach,Vest of The Vengeful Tracker,Annihilation Spectacles,Arachnid Goggles,Blind Man's Fold,Darklands Goggles,Deathwatch Eyes,Eyes of Charming,Eyes of Doom,Eyes of Eyebite,Eyes of Keen Sight,Eyes of The Dragon,Eyes of The Eagle,Eyes of The Owl,Goggles of Brilliant Light,Goggles of Elvenkind,Goggles of Minute Seeing,Goggles of Night,Inquisitor's Monocle,Kinsight Goggles,Lenses of Detection,Lenses of Figment Piercing,Mindmaster's Eyes,Monocle of The Investigator,Pirate's Eye Patch,Rainbow Lenses,Sea Tyrant's Patch,Sniper Goggles,Spectacles of Understanding,Swordmaster's Blindfold,Treasure Hunter's Goggles,Truesight Goggles,Acrobat Slippers,Boots of Elvenkind,Boots of Escape,Boots of Friendly Terrain,Boots of Levitation,Boots of Speed,Boots of Striding And Springing,Boots of Teleportation,Boots of The Cat,Boots of The Enduring March,Boots of The Mastodon,Boots of The Mire,Boots of The Winterlands,Caltrop Boots,Daredevil Boots,Dryad Sandals,Earth Root Boots,Feather Step Slippers,Getaway Boots,Haunted Shoes,Horseshoes of A Zephyr,Horseshoes of Crushing Blows +1,Horseshoes of Crushing Blows +2,Horseshoes of Crushing Blows +3,Horseshoes of Crushing Blows +4,Horseshoes of Crushing Blows +5,Horseshoes of Glory,Horseshoes of Mist,Horseshoes of Speed,Jaunt Boots,Nightmare Boots,Nightmare Horseshoes,Sandals of Quick Reaction,Sandals of The Lightest Step,Shoes of Lightning Leaping,Shoes of The Firewalker,Slippers of Cloudwalking,Slippers of Spider Climbing,Slippers of The Triton,Tremor Boots,Verdant Boots,Winged Boots,Apprentice's Cheating Gloves,Assisting Gloves,Challenger's Gloves,Claws of The Ice Bear,Deliquescent Gloves,Engineer's Workgloves,Form-fixing Gauntlets,Gauntlet of Rust,Gauntlets of The Skilled Maneuver,Gauntlets of The Weaponmaster,Ghostvision Gloves,Giant Fist Gauntlets,Glove of Storing,Gloves of Arcane Striking,Gloves of Arrow Snaring,Gloves of Dueling,Gloves of Larceny,Gloves of Reconnaissance,Gloves of Shaping,Gloves of Swimming And Climbing,Gloves of The Commanding Conjurer,Gloves of The Shortened Path,Glowing Glove,Glyphbane Gloves,Healer's Gloves,Iron Cobra Gauntlet,Magnetist's Gloves,Pliant Gloves,Poisoner's Gloves,Shadow Falconer's Glove,Spellstrike Gloves,Talons of Leng,Trapspringer's Gloves,Vampiric Gloves,Batrachian Helm,Buffering Cap,Cap of Human Guise,Cap of Light,Cap of The Free Thinker,Cat's Eye Crown,Circlet of Mindsight,Circlet of Persuasion,Crown of Conquest,Crown of Heaven,Crown of Swords,Grappler's Mask,Halo of Inner Calm,Halo of Menace,Hat of Disguise,Helm of Brilliance,Helm of Comprehend Languages And Read Magic,Helm of Electric Radiance,Helm of Fearsome Mien,Helm of Telepathy,Helm of Teleportation,Helm of The Mammoth Lord,Helm of Underwater Action,Howling Helm,Iron Circlet of Guarded Souls,Jingasa of The Fortunate Soldier,Judge's Wig,Laurel of Command,Magician's Hat,Mask of A Thousand Tomes,Mask of Stony Demeanor,Mask of The Krenshar,Mask of The Skull,Maw of The Wyrm,Medusa Mask,Miser's Mask,Mitre of The Hierophant,Plague Mask,Stalker's Mask,Steel-mind Cap,Stormlord's Helm,Veil of Fleeting Glances,Band of The Stalwart Warrior,Dead Man's Headband,Headband of Aerial Agility +2,Headband of Aerial Agility +4,Headband of Aerial Agility +6,Headband of Alluring Charisma +2,Headband of Alluring Charisma +4,Headband of Alluring Charisma +6,Headband of Arcane Energy,Headband of Counterspelling,Headband of Deathless Devotion,Headband of Fortune's Favor,Headband of Havoc,Headband of Inspired Wisdom +2,Headband of Inspired Wisdom +4,Headband of Inspired Wisdom +6,Headband of Intuition,Headband of Ki Focus,Headband of Knucklebones,Headband of Mental Prowess +2,Headband of Mental Prowess +4,Headband of Mental Prowess +6,Headband of Mental Resilience,Headband of Mental Superiority +2,Headband of Mental Superiority +4,Headband of Mental Superiority +6,Headband of Ninjitsu,Headband of Ponderous Recollection,Headband of Seduction,Headband of Unshakeable Resolve,Headband of Vast Intelligence +2,Headband of Vast Intelligence +4,Headband of Vast Intelligence +6,Hollywreath Band,Hunter's Band,Phylactery of Faithfulness,Phylactery of Negative Channeling,Phylactery of Positive Channeling,Phylactery of The Shepherd,Serpent's Band,Shifter's Headband +2,Shifter's Headband +4,Shifter's Headband +6,Soulbound Eye,Veiled Eye,Winter Wolf Headband,Aegis of Recovery,Ampoule of False Blood,Amulet of Bullet Protection +1,Amulet of Bullet Protection +2,Amulet of Bullet Protection +3,Amulet of Bullet Protection +4,Amulet of Bullet Protection +5,Amulet of Elemental Strife,Amulet of Hidden Strength,Amulet of Magecraft,Amulet of Natural Armor +1,Amulet of Natural Armor +2,Amulet of Natural Armor +3,Amulet of Natural Armor +4,Amulet of Natural Armor +5,Amulet of Proof Against Detection And Location,Amulet of Proof Against Petrification,Amulet of Spell Cunning,Amulet of Spell Mastery,Amulet of The Planes,Brooch of Amber Sparks,Brooch of Shielding,Carcanet of Detention,Collar of The True Companion,Crystal of Healing Hands,Dragonfoe Amulet,Everwake Amulet,Feychild Necklace,Forge Fist Amulet,Frost Fist Amulet,Golembane Scarab,Gravewatch Pendant,Guardian Gorget,Hand of Glory,Hand of Stone,Hand of The Mage,Medallion of Thoughts,Mind Sentinel Medallion,Mummer's Ruff,Necklace of Adaptation,Necklace of Fireballs Type I,Necklace of Fireballs Type II,Necklace of Fireballs Type III,Necklace of Fireballs Type IV,Necklace of Fireballs Type V,Necklace of Fireballs Type VI,Necklace of Fireballs Type VII,Necklace of Ki Serenity,Necklace of Netted Stars,Periapt of Health,Periapt of Proof Against Poison,Periapt of Protection From Curses,Periapt of Wound Closure,Righteous Fist Amulet,Scarab of Protection,Stormlure,Swarmbane Clasp,Symbol of Sanguine Protection,Torc of Lionheart Fury,Cape of Effulgent Escape,Catching Cape,Charlatan's Cape,Cloak of Arachnida,Cloak of Elvenkind,Cloak of Etherealness,Cloak of Fangs,Cloak of Fiery Vanishing,Cloak of Human Guise,Cloak of Resistance +1,Cloak of Resistance +2,Cloak of Resistance +3,Cloak of Resistance +4,Cloak of Resistance +5,Cloak of The Bat,Cloak of The Diplomat,Cloak of The Duskwalker,Cloak of The Hedge Wizard,Cloak of The Manta Ray,Cloak of The Scuttling Rat,Cocoon Cloak,Comfort's Cloak,Cowardly Crouching Cloak,Demonspike Pauldrons,Eagle Cape,Gunfighter's Poncho,Highwayman's Cape,Hunter's Cloak,Jellyfish Cape,Juggernaut's Pauldrons,Lion Cloak,Mantle of Spores,Muleback Cords,Pauldrons of The Bull,Pauldrons of The Serpent,Pauldrons of The Watchful Lion,Prestidigitator's Cloak,Quickchange Cloak,Seafoam Shawl,Shawl of Life-Keeping,Shawl of The Crone,Shield Cloak,Slashing Cloak,Stole of Justice,Stonemist Cloak,Tentacle Cloak,Treeform Cloak,Wings of Flying,Wings of The Gargoyle,Wyvern Cloak,Armbands of The Brawler,Arrowmaster's Bracers,Bonebreaker Gauntlets,Bracelet of Bargaining,Bracelet of Friends,Bracelet of Mercy,Bracelet of Second Chances,Bracers of Armor +1,Bracers of Armor +2,Bracers of Armor +3,Bracers of Armor +4,Bracers of Armor +5,Bracers of Armor +6,Bracers of Armor +7,Bracers of Armor +8,Bracers of Falcon's Aim,Bracers of Steadiness,Bracers of Sworn Vengeance,Bracers of The Avenging Knight,Bracers of The Glib Entertainer,Bracers of The Merciful Knight,Charm Bracelet,Dimensional Shackles,Duelist's Vambraces,Gauntlets of Skill At Arms,Inquisitor's Bastion Vambraces,Longarm Bracers,Manacles of Cooperation,Merciful Vambraces,Seducer's Bane,Shackles of Compliance,Shackles of Durance Vile,Sleeves of Many Garments,Spellguard Bracers,Vambraces of Defense,Vambraces of The Tactician,Verdant Vine,Abjurant Salt,Admixture Vial,Agile Alpenstock,Alluring Golden Apple,Anatomy Doll,Animated Portrait,Apparatus of The Crab,Apple of Eternal Sleep,Archon's Torch,Arrow Magnet,Bag of Holding Type I,Bag of Holding Type II,Bag of Holding Type III,Bag of Holding Type IV,Bag of Tricks Gray,Bag of Tricks Rust,Bag of Tricks Tan,Balm of Impish Grace,Bead of Force,Bead of Newt Prevention,Beast-Bond Brand,Black Soul Shard,Blessed Book,Blood Reservoir of Physical Prowess,Bone Razor,Book of The Loremaster,Bookmark of Deception,Bookplate of Recall,Boro Bead 1st Level,Boro Bead 2nd Level,Boro Bead 3rd Level,Boro Bead 4th Level,Boro Bead 5th Level,Boro Bead 6th Level,Bottle of Air,Bottle of Messages,Bottle of Shadows,Bottled Misfortune,Bottled Yeti Fur,Boundary Chalk,Bowl of Conjuring Water Elementals,Brazier of Conjuring Fire Elementals,Broom of Flying,Campfire Bead,Candle of Clean Air,Candle of Invocation,Candle of Truth,Cape of Bravado,Carpet of Flying 5-ft.-by-5-ft.,Carpet of Flying 5-ft.-by-10-ft.,Carpet of Flying 10-ft.-by-10-ft.,Cauldron of Brewing,Cauldron of Flying,Cauldron of Plenty,Cauldron of Resurrection,Cauldron of Seeing,Cauldron of The Dead,Cautionary Creance,Censer of Conjuring Air Elementals,Chalice of Poison Weeping,Chaos Emerald,Chime of Interruption,Chime of Opening,Chime of Resounding Silence,Clamor Box,Coin of The Untrodden Road,Concealing Pocket,Construct Channel Brick,Crystal Ball,Crystal Ball (see invisibility),Crystal Ball (detect thoughts),Crystal Ball (telepathy),Crystal Ball (true seeing),Cube of Force,Cube of Frost Resistance,Cubic Gate,Darkskull,Decanter of Endless Water,Deck of Illusions,Defoliant Polish,Doomharp,Dowsing Syrup,Dragonbone Divination Sticks,Drinking Horn of Bottomless Valor,Drum of Advance And Retreat,Drums of Haste,Drums of Panic,Dry Load Powder Horn,Dust of Acid Consumption,Dust of Appearance,Dust of Darkness,Dust of Disappearance,Dust of Dryness,Dust of Emulation,Dust of Illusion,Dust of Tracelessness,Dust of Weighty Burdens,Efficient Quiver,Efreeti Bottle,Elemental Gem,Elixir of Dragon Breath,Elixir of Fire Breath,Elixir of Hiding,Elixir of Love,Elixir of Swimming,Elixir of Truth,Elixir of Tumbling,Elixir of Vision,Embalming Thread,Enmity Fetish,Escape Ladder,Eversmoking Bottle,Exorcist's Aspergillum,Eye of The Void,Far-reaching Sight,Figurines of Wondrous Power (slate Spider),Flying Ointment,Folding Boat,Formula Alembic,Gem of Brightness,Gem of Seeing,Goblin Fire Drum,Goblin Skull Bomb,Grave Salt,Grim Lantern,Handy Haversack,Harp of Charming,Harp of Contagion,Harp of Shattering,Hexing Doll,Horn of Antagonism,Horn of Battle Clarity,Horn of Blasting,Horn of Fog,Horn of Goodness/evil,Horn of Judgment,Horn of The Huntmaster,Horn of The Tritons,Horn of Valhalla,Horsemaster's Saddle,Hourglass of Last Chances,Hybridization Funnel,Incense of Meditation,Incense of Transcendence,Insignia of Valor,Insistent Doorknocker,Instant Bridge,Instant Fortress,Ioun Torch,Iron Bands of Binding,Iron Flask,Iron Rope,Iron Spike of Safe Passage,Key of Lock Jamming,Ki Mat,Lantern of Revealing,Last Leaves of The Autumn Dryad,Life Link Badge,Loathsome Mirror,Lyre of Building,Malleable Symbol,Mallet of Building,Manual of War,Martyr's Tear,Marvelous Pigments,Master's Perfect Golden Bell,Mattock of The Titans,Migrus Locker,Mirror of Guarding Reflections,Mirror of Life Trapping,Mirror of Mental Prowess,Mirror of Opposition,Naga-scale Bindi,Necromancer's Athame,Needles of Fleshgraving,Nightdrops,Noble's Vigilant Pillbox,Oil of Silence,Orb of Foul Abaddon,Orb of Golden Heaven,Orb of Pure Law,Orb of Storms,Orb of Utter Chaos,Origami Swarm,Ornament of Healing Light,Page of Spell Knowledge 1st-level,Page of Spell Knowledge 2nd-level,Page of Spell Knowledge 3rd-level,Page of Spell Knowledge 4th-level,Page of Spell Knowledge 5th-level,Page of Spell Knowledge 6th-level,Page of Spell Knowledge 7th-level,Page of Spell Knowledge 8th-level,Page of Spell Knowledge 9th-level,Pearl of The Sirines,Philter of Love,Pipes of Dissolution,Pipes of Haunting,Pipes of Pain,Pipes of Sounding,Pipes of The Sewers,Polymorphic Pouch,Portable Hole,Prayer Wheel of Ethical Strength,Preserving Flask 1st-level,Preserving Flask 2nd-level,Preserving Flask 3rd-level,Preserving Flask 4th-level,Preserving Flask 5th-level,Preserving Flask 6th-level,Pyxes of Redirected Focus,Racing Broom of Flying,Restless Lockpicks,Restorative Ointment,Ring Gates,Rope of Climbing,Rope of Entanglement,Rope of Knots,Salve of Slipperiness,Scabbard of Honing,Scabbard of Keen Edges,Scabbard of Stanching,Scabbard of Vigor,School of Eyes,Seeker's Sight,Seer's Tea,Sheath of Bladestealth,Shroud of Disintegration,Silversheen,Singing Bell of Striking,Snapleaf,Soul Soap,Sovereign Glue,Steadfast Gut-stone,Stone Familiar,Stone of Alarm,Stone of Alliance,Stone of Conjuring Earth Elementals,Stone of Good Luck (luckstone),Stone Salve,Stubborn Nail,Summoning Shackle,Summon-Slave Crystal,Sustaining Spoon,Traveler's Any-Tool,Treasurer's Seal,Void Dust,Void Pennant,Volatile Vaporizer 1st-level,Volatile Vaporizer 2nd-level,Volatile Vaporizer 3rd-level,War Paint of The Terrible Visage,Wasp Nest of Swarming,Waters of Transfiguration,Well of Many Worlds,Werewhistle,Wind Fan,Wind-caller Compass,Word Bottle,Beacon of True Faith,Book of Infinite Spells,Branch of Life,Crown of The Iron King,Deck of Many Things,Hammer of Thunderbolts,Knucklebone of Fickle Fortune,Monkey's Paw,Perfect Golden Lute,Philosopher's Stone,Runescarred Dragonship,Sphere of Annihilation,Spindle of Perfect Knowledge,Staff of The Magi,Talisman of Pure Good,Talisman of Reluctant Wishes,Talisman of The Sphere,Talisman of Ultimate Evil,Weird Queen's Magpie,Axe of The Dwarvish Lords,Bottle of The Bound,Brazen Egg,Celestial Lens,Cloud Castle of The Storm King,Codex of The Infinite Planes,Silverfang,Deathbalm Talisman,Maiden's Helm,Orb of Consumption,Wax of Defiance,Whispering Coin,Glaive-guisarme of The Vanguard,Knight-captain's Lance,War Lance,Armiger's Panoply,Bridle of Tricks (3 Tricks),Bridle of Tricks (4 Tricks),Bridle of Tricks (5 Tricks),Champion's Banner,Commander's Banner,Crusader's Tabard,War Saddle,Apollyon Ring,Blackaxe,Bloodstones of Arazni,Book of The Damned: Complete,Briar,Dancing Hut of Baba Yaga,Harrow Deck of Many Things,Invidian Eye,Lens of Galundari,Orb of Dragon Mastery,Orb of Dragonkin,Orb of Dragonshape,Armor of Skulls,Bound Blade,Crown of Fangs,Howling Horn,Shredskin,Staff of The Slain,Throne of Nalt,Ring of Nine Facets,Saint Cuthbert's Mace,Scepter of Ages,Scroll of Kakishon,Shield of Aroden,Skull of Ydersius,Song of Extinction,Thorncrown of Iomedae,Vesper's Rapier,Bone House,Crown of The Simurgh,Decemvirate Helm,Deck of Harrowed Tales,Hourglass of Shadows,Id Portrait,Maleficus Spike,Mantis Blade,Phylactery of The Failed,Raven's Head,Serithtial,Torc of Kostchtchie,Totem of Angazhan,Vernal Key,Visionary Lens,Warding Box,Demon Prince Armor,Flame of Guidance,Fork of The Forgotten One,Jar of Dragon's Teeth,Horns of Naraga,The Moaning Diamond,The Orbs of Dragonkind,Perfection's Key,The Shadowstaff,The Shield of The Sun,Skullsoul,-2 Cursed Sword,Amulet of Inescapable Location,Armor of Arrow Attraction,Arrowbreak Bow,Bag of Devouring,Berserking Sword,Biting Battleaxe,Boots of Dancing,Bracers of Defenselessness,Broom of Animated Attack,Buffoon's Sword,Cape of Anchoring,Cannibal Ring,Cloak of Immolation,Crown of Blindness,Crystal Hypnosis Ball,Cursed Backbiter Spear,Deadly Returns Throwing Axe,Drums of Lethargy,Dust of Sneezing And Choking,Eyes of Blindness,Flask of Curses,Gauntlets of Fumbling,Girdle of Opposite Gender,Gravesoul Armor,Hat of Hatreds,Headband of Stupidity,Heavy Hammer,Helm of Opposite Alignment,Incense of Obsession,Mace of Blood,Mask of Ugliness,Medallion of Thought Projection,Nearfiring Bow,Necklace of Strangulation,Net of Snaring,One-way Window,Ornery Pistol,Pauldrons of The Jackass,Periapt of Foul Rotting,Petrifying Cloak,Planar Invasion Shield,Poisonous Cloak,Potion of Poison,Ring of Clumsiness,Ring of Lifebleed,Ring of Spell Devouring,Ring of Truth,Riot Pipes,Robe of Powerlessness,Robe of Vermin,Rod of Arson,Rod of Foiled Magic,Scarab of Death,Scattershot Bracers,Staff of Occasional Wonder,Stone of Weight (Loadstone),Unguent of Aging,Unlucky Figurine,Unstable Musket,Unwieldy Glaive,Vacuous Grimoire,Armor of The Shadow Lord,Hammer of Enemies,Chomper,Harbinger Rod,Headband of The Sage,Helmet of The Golden General,Lightning Bow,Lute of Discord,Metamagician's Apprentice,Obsession Ring,Rod That Should Not Be (lesser),Rod That Should Not Be (greater),Shield of The Mage,Singing Sword,Fortifying Leeches,Halflight Charm,Skin Harp,Spine Flail,Spy Eyes,Scarf of The Suggestive Dance,Death Bill,Crystalline Starknife,Doomsday Key,Doomsday Staff,Flaying Halberd,Lashing Aklys,Soul Jar,Censer of Dreams,Crystal Ball of The Dark Void,Nightgaunt Mask,Nightmare Rod,Slave Collar,Chupar Pick,Vitreous Goggles,Mokele-Mbembe Tail Whip,Mothman Memento,Sasquatch Skull,Serpentseeker Bow,Leng Tea,Bloodletting Thimble,Deadly Draught,Dread Heart of Life,Force Net,Necklace of Fangs,Stake of The Righteous,Flamma Horacalcum,Ghost Iron Scimitar,Guardian Key,Runestar Ring,Buoyant Harpoon,Cloak of The Saga Keeper,Helm of The Mammoth Lord,Hex Nail,Mammoth Lance,Pelt of Primal Power,Saga of The Linnorm Kings,Shard of Winter,Attentive Mirror,Cauldron of Overwhelming Allies,Cloak of The Yeti,Ice Floe Elixir,Icicle Wand,Snowshoes of Northern Pursuit,Spear of Manhunting,Spiteful Cookie,Suggestive Tea,Circlet of Speaking,Collar of Obedience,Horseshoes of Sacred Silver,Pull-Ring of Scent,Saddle of The Sky-River,Familiar Metamagic Rod,Figurine of Wondrous Power (glass walrus),Instant Muzzle,Rod of Animal Training,Tamer's Whip,Arcanolembic,Emberchill,Everbloom's Rose,Hyperboreal Robe,Insidious Bear Trap,Rimepelt,Ushanka of The Northlands,Discerning Goggles,Evidentiary Dust,Dark Green Rhomboid Ioun Stone,Deep Brown Sphere Ioun Stone,Lantern of Concealment,Luminous Facet,Smear of Seeing,Teleporting Climbing Rig,Toxin Sponge,Artrosa Ring,Boots of The Winter Jarl,Cookbook of Arcane Augmentation,Frost-Thunder Hammer,Globe of Blizzards,Icelink Chainmail,Bondbreaker's Boots,Devil's Key,Equalizer Shield,Field Medic's Breastplate,Mantle of The Protector,Phoenix Armor,Seraphic Pistol,Staff of The Freed Man,Tessarael's Book of Infinite Spells,Alpine Ice Axe,Amulet of Dragon's Breath,Habit of The Winter Explorer,Hide of The Dragonrider,Figurine of Wondrous Power (obsidian raven),Rimeblade,Truefrost Elixir,Angel's Clarion,Chronicle of The Righteous,Empyreal Armor,Splendorous Ring,Staff of Wings,Starknife of The Void,Sword of Vengeance,Orrery of Distant Worlds,Amulet of Mighty Fists +1,Amulet of Mighty Fists +2,Amulet of Mighty Fists +3,Amulet of Mighty Fists +4,Amulet of Mighty Fists +5,Cape of The Mountebank,Maul of The Titans,Cassock of The Black Monk,Dimensional Grenade,Gas Mask,Gas-Trap Cylinder,Maxim of Suppressive Fire,Sniper's Helmet,Spectral Searchlight,Trumpet of Spirit Speaking,Hezzilreen's Spellbook,Bloatstrike Tail,Displacing Stone,Dragon Herald Vestments,Dwindling Bullet,Imploding Stone,Irradiating Tail,Levitating Land Mine,Paralyzing Snare,Scarecrow Lure,Trapped Beverage,Trapped Puzzle Box,Trapped Sword,Banner of Tactical Command,Diadem of Inspiring Rule,Horn of Plenty,Orb of Arcane Research,Talisman of Beast Training,Gourd of Fire Burping,Ring of The Binding Word,Baba Yaga's Besom,Baba Yaga's Mortar And Pestle,Icecrown,Labrys of The Stone Idol,Winter's Reach,Winter Collector,Boots of The Vengeful Behir,Death's Preservation Banded Mail,Dragonform Armor,Dragon's Tail,Elixir of Elemental Protection,Hexing Runes,Incense of Dulled Senses,Perilous Gloves,Ring of Fear Reflection,Scaled Sash,Staff of Hunting,Staff of Internal Assault,Contingent Wayfinder,Headhunter Wayfinder,Hypnotic Wayfinder,Noisemaker Wayfinder,Smuggler's Wayfinder,Truthseeker Wayfinder,Wayfinder of The Planes,Agate Ellipsoid Ioun Stone,Amethyst Pyramid Ioun Stone,Gold Nodule Ioun Stone,Magenta Prism Ioun Stone,Pale Orange Rhomboid Ioun Stone,Silver Spindle Ioun Stone,Tourmaline Sphere Ioun Stone,Book Thief's Satchel,Coat of Pockets,First Aid Gloves,Honeytongue Elixir,Lenses of Situational Sight,Pathfinder Greatcoat,Polish of Inconspicuous Armor,Tightfit Belt,Robe of The Pure Legion +1,Robe of The Pure Legion +2,Robe of The Pure Legion +3,Robe of The Pure Legion +4,Robe of The Pure Legion +5,Ranseur of The Gargoyle,Bilious Bottle,Brazen Head,Radiance,Wardstone Shard,Gloves of Personal Purity,Hand Wraps of Blinding Ki,Kalistocrat's Coin,Pantheistic Clasp,Prophetic Paraphernalia,Propitious Metumbe,Shield of Countless Causes,Tome of Heretical Revelation,Vest of Shed Servitude,Warden's Cudgel,Azata's Whimsy,Bastion Banner,Dagger of Repossession,Dawnflower's Light,Deadlimb Pins,Thorned Manacles,Warding Lips,Whispering Amulet,Bastion of The Inheritor,Spiritwalk Armor,Stalwart Breastplate,Bow of Erastil,Brutal Axe,Chaos Hammer,Dagger of A Thousand Bites,Dragonbreath Bow,Fire Goddess's Blade,Gun With No Name,Pick of Stonecleaving,Sacred Avenger,Shadow Spike,Shadow's Touch,Skirmishing Spear,Spellbreaker,Stormcaller,Sword of Inner Fire,Ambrosia,Anchoring Belt,Blind Helm,Book of Banishing,Book of Perfect Jokes,Boots of Earth And Wind,Bountiful Bottle,Bracers of Might,Bracers of The Shield Mates,Canopic Jar,Cape of Free Will +1,Cape of Free Will +2,Cape of Free Will +3,Cape of Free Will +4,Cape of Free Will +5,Cayden's Cup,Censer of Sanctuary,Chime of Disillusionment,Cloak of Quick Reflexes +1,Cloak of Quick Reflexes +2,Cloak of Quick Reflexes +3,Cloak of Quick Reflexes +4,Cloak of Quick Reflexes +5,Cloak of The Hunt,Cornucopia of Plenty,Death Warden's Bandolier,Dolorous Rod,Everburning Lantern,Eye Orb,Gallows Rope,Gloves of Distant Action,Gloves of Spell Snaring,Golden Holy Symbol,Headband of Sealed Thoughts,Helm of The Serpent King,Herbs of The Primal Beast,Immolation Cloak,Inescapable Gloves,Laurel Wreath,Lyre of Storms,Mantle of The Faithful Vessel,Mirroring Belt,Mithral Rose,Monocle of Unveiled Auras,Moonstone Cat,Necklace of Spectral Strikes,Nectar of The Gods,Pauldrons of Unflinching Fortitude +1,Pauldrons of Unflinching Fortitude +2,Pauldrons of Unflinching Fortitude +3,Pauldrons of Unflinching Fortitude +4,Pauldrons of Unflinching Fortitude +5,Penitent's Robes,Phoenix Cloak,Ring of Energy Dampening,Ring of Transcendent Spells,Root of The World Tree,Seven-League Boots,Stonefist Gloves,Torc of Truespeech,Aegis,Black Iron Axe,Bullroarers of Outburst,Elemental Chain,Fleshhook of Mythic Sustenance,Fortune's Arrow,Glabrezu Claw,Hermetic Flask,Nexus Crystal,Ring of Equilibrium,Rod of Spell Sundering,Screaming Spear of The Sun,Staff of Eldritch Sovereignty,Sword of The Mists,Torc of The Heavens,Witherfang,Apocalypse Box,Diadem of Nod,Emperor's Mammoth,Frozen Heart of Cocytus,Legendsbane,Netherworld Cauldron,Nimbus of Radiant Truth,Plaguebringer,Scepter of The Shining Lord,Shadowwraith Heart,Silver Maiden,Tarnhelm,Trueforge,Armor of The Pious,Horn of Assured Victory,Righteous Medal of Agility,Righteous Medal of Clarity,Righteous Medal of Command,Righteous Medal of Spirit,Righteous Medal of Valor,Righteous Medal of Vigor,Shadowblood,Soulshear,Sword of Valor,Barding of Pleated Light,Fiendsplitter,Jawbone of the Venerable,The Lymirin Discourses,Pauper's Thighbone,Baleful Eye,Brazen Hooves,Crown of Horns,Demon Heart,Demon Tongue,Demonhide,Splintered Mind,Wicked Wings,Blood of Baphomet,Blackblot,Essence of Wandering Dreams,Shieldmarshal's Ward,Token of The Eldest,Tyrant's Mark,Bracers of The Immortal Hunt,,Demon Blood,Demon Senses,Demon Talon,Bell of Mercy,Retriever Drone,Spherewalker's Staff,Starbow,Swallowtail Bracers,Swarmlord's Jar,Nose Ring of Unearthly Scent,Trident of The Storm Captain,Tiger's Hide,Amulet of The True Form,Corpse Puppet,Globe of Moonlight,Moon Clock,Pelt of The Beast,Spell Totem,Scepter of Shibaxet,Cicatrix,Blancher,Fasciculus Labyrinthum,Imago Lens,Nahyndrian Crystal,Nahyndrian Elixir,Stalker's Crossbow,Talisman of True Faith,Wanderer Compass,Muzzle of Suppression,Amulet of Primal Mastery,Quake Cannon,Stable Metamagic Rod,Animal Totem Tattoo,Hypnotic Tattoo,Runeward Tattoo,Serpentine Tattoo,Trailblazer's Spade,Caster's Tattoo,Reservoir Tattoo,Spell Tattoo,Bracelets of Stone,Infiltrator's Mail,Shield of Covered Retreat,Saline Purge,Scavenger's Ring,Channeler's Aspergillum,Healer's Burning Glass,Sacrificial Sword,Saint's Protection Charm,Explorer's Pith Helmet,Orbicular Sac,Poison Popcushion,Trophy Box,Lizardmarked Blade,Marrowcracker,Crusader's Scabbard,Gossamer Shrouds of The Clairvoyant,Skullduster,Hollis's Lucky Rock,Wary Ring,Arcane Battery,Elemental Storing Stone,Spell-Capturing Gem,Copycat Siphon,Homunculus Clay,Thoqqua Snake,Clockwork Prosthesis,Loudshot Pistol,Murderer's Silence,Poison Vial of Distance,Quick Action Slippers,Scabbard of True Death,Clockwork Bug,Lacerating Rapier,Coldwarp Key,Fleshwarped Scorpion's Tail,Sporecrafter's Kindness,Stalagmite Seed,Discordant Piccolo,Master Vidlian's Squeeze-Box,Music Box Trap,Pipes of Terror,Ring of The Weary Sky,Intelligent Ring of The Weary Sky,Dawnflower's Kiss,Heart of The Herald,Mythic Amulet of The Abyss,Noose of Terminal Embrace,Stole of The Inheritor,Burrower's Bridle,Carpet of Comfort,Inviolate Marker,Ring of The Godless +1,Ring of The Godless +2,Ring of The Godless +3,Ring of The Godless +4,Ring of The Godless +5,Stone of Sending,Vothuemont's Blade,Master's Lash,Mournful Razor,Quasit Key,Riftcarver,Robe of The Rifts,Ring of Culturemeld,Kin's Face Tattoo,Chalice of Undeath,Mummy Armor,Kohl of Uncanny Discernment,Mummified Guardian,Scarab Shield,Spear of The Watchful Guardian,Tablet of Languages Lost,Cloak of Moral Refraction,Eye of Brokerage,Gauntlets of The Unchained,Judicial Hammer,Liar's Robe,Slaver's Cane,Traitorous Blaster,Clarity,Amulet of Grasping Souls,Chalice of Communal Dweomer,Elixir of Last Will,Gorget of Living Whispers,Icon of Aspects,Quicksand Cloak,Rat-Tread Boots,Weirding Watch,Whispering Gloves,Cage of Soul Echoes";
_q = [];
_l = [];
_hpmul = 4.5;
_quest_num = 1;
_num_commands = NUM_COMMANDS;
_additional_pause = 0;
_round = {};
_runaway = 0;

scores = { };

function parseMonsters(monstersDb) {
    function Monster(name, hp) {
        this.name = name;
        this.hp = hp;
    }
	_monsters = monstersDb.split(',');
	for(var i = 0; i < _monsters.length; i += 2) {
		_q.push(new Monster(_monsters[i], _monsters[i+1]));
	}
}

function parseLoot(lootDb) {
	_loot = lootDb.split(',');
	for(var i = 0; i < _monsters.length; i += 2) {
		_l.push(_loot[i]);
	}
}

function generateLoot() {
	a = Math.floor(Math.random() * (_l.length));
	while(_l[a] === undefined) {
		a = Math.floor(Math.random() * (_l.length));
	}
	return a;
}

function addLoot(user) {
	if (scores[user] === undefined) {
      scores[user] = [0,0];
    }
	scores[user][1] += 1;
}
function loadScores() {
  var scoresText = localStorage[SAVE_STRING];
  if (scoresText) {
    scores = JSON.parse(scoresText);
    for (var user in scores) {
	 	var data = scores[user];
	 	if(typeof data === 'number') {
	    	scores[user] = [data, 0];
	    }
 	}
  }
  else {
    scores = { };
  }
  return scores;
}

function saveScores(scores) {
  localStorage[SAVE_STRING] = JSON.stringify(scores);
}

function computeLevel(xp) {
	return Math.floor(((Math.sqrt(625+100*xp)-25)/50)+1);
}

function readXp(user) {
    if (scores[user] === undefined) {
      scores[user] = [0,0];
    }
	return scores[user][0];
}

function readLoot(user) {
	if(scores[user] === undefined) {
		scores[user] = [0,0];
	}
	return scores[user][1];
}
function userInfoLvl(user) {
  //Return xp/lvl.
  xp = readXp(user);
  level = computeLevel(xp);
  nextLevel = level + 1;
  levelTarget = (25*level)*(1+level);
  nextLevelTarget = (25*nextLevel*(1+nextLevel));
  nextLevelPercent = ((xp - levelTarget) * 100) / (nextLevelTarget - levelTarget);
  nextLevelPercent = 100-Math.abs(Math.floor(nextLevelPercent));
  return user + " (" + ((xp !== null ? level : "0") + "/" + nextLevelPercent + "%") + ")";
}

function userInfoXp(user, xp) {
  //Return xp.
  return user + " (" + (xp !== null ? xp : "0") + ")";
}

function computeTopScoresStr(scores, num) {
  var scoresArray = [ ];
  for (var user in scores) {
    scoresArray.push([user, scores[user][0] !== undefined? scores[user][0] : scores[user]]);
  }
  scoresArray.sort(function(a, b) { return -(a[1] - b[1]); });
  var buildScores = "#rpg HEROES : ";
  buildScores += scoresArray.map(i => userInfoLvl(i[0])).slice(0, num).join(", ");
  return buildScores;
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 * Taken verbatim from
 * http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i -= 1) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function getAdditionalPause() {
  if (_additional_pause > 0) {
    var toReturn = _additional_pause;
    _additional_pause = 0;
    return toReturn;
  }
  return 0;
}
function sendMessage(message) {
  var truncated_message = message;
  if (truncated_message.length > MAX_MESSAGE_LENGTH) {
    truncated_message = truncated_message.substr(0, MAX_MESSAGE_LENGTH-3) + "...";
  }
  unsafeWindow.$(".text-counter-input").val(truncated_message).trigger("submit");
}
function printQuest(index) {
  sendMessage("#rpg A wild " + _q[index].name + " appeared! HP: " + Math.round(_q[index].hp * _hpmul) + "[⬛⬛⬛⬛⬛]! Attack it by chatting(no spam)! (or try to !flee)! Join #rpg for 50%+ exp!");
}

function renderHP(hp, hptotal) {
	hp_bar = Math.round(hp) + "[";
	hp_percent = (hp*100/hptotal);
	for(i = 0; i < 5; i++) {
		if(hp_percent > i*20) {
			hp_bar += "⬛";//full
		} else {
			hp_bar += "⬜";//empty
		}
	}
	hp_bar += "]";
	return hp_bar;

}

function pullNewCommands() {
  var re = [];
  $('.robin-message--message:not(.addon--comm)').each(function() {
    var user = $('.robin-message--from', $(this).closest('.robin-message')).text();
    re.push([user, $(this).text()]);
    $(this).addClass('addon--comm');
  });
  
  return re;
}

function filterMessage(_user, _msg) {
	if(_user == USER_NAME) {
		//Plugin to moderation? TO-DO.
		return true;
	}
	if(_user == "[robin]") {
		return true;
	}
	if(_user === "") {
		return true;
	}
	if(_msg.length <= 2) {
		return true;
	}

	//only read #rpg;
	if(FILTER_CHANNEL) {
		if(_msg.substring(0,4) !== "#rpg") {
			return true;
		}
	}

	//only read ascii
	regexp = /[^\x00-\x7F]/g;
	if(regexp.exec(_msg)) {
		return true;
	}

	//dont read text bombs
	regexp_bombs = /([\x00-\x7F])\1{8,}/g;
	if(regexp_bombs.exec(_msg)) {
		return true;
	}
	
	return false;
}

function listCommands(commands) {
  var commmandsList = [];
  var _ratio = 0;
  for (var i=0; i<commands.length; ++i) {
	var _user = commands[i][0];
	var _msg = commands[i][1];
	
	if(filterMessage(_user, _msg) === true) {
		continue;
	}
	if(_msg.includes("!party")) {
		commmandsList.push(["!party", _user]);
		continue;
	}
	
	if(_msg.includes("!loot")) {
		commmandsList.push(["!loot", _user]);
		continue;
	}
	
	if(_msg.includes("!heroes")) {
		commmandsList.push(["!heroes", _user]);
		continue;
	}
	
	if(_msg.includes("!help")) {
		commmandsList.push(["!help", _user]);
		continue;
	}
	
  }
  
  return commmandsList;
}

function replyCommand() {
	setTimeout(function() {
		var commands = pullNewCommands();
		commandMessage = "#rpg ";
		commandsList = listCommands(commands);
		if(commandsList.length > 0) {
			command = commandsList[0][0];
			command_user = commandsList[0][1];
			switch(command) {
				case "!loot":
					commandMessage += command_user + " bag of holding contains " + readLoot(command_user) + " shiny things!";
				break;
                case "!party":
					commandMessage += assembleParty(command_user);
				break;
                case "!heroes":
					commandMessage += computeTopScoresStr(scores, 15);
				break;
                case "!help":
					commandMessage += "Chat your way to glory! Engrave your name in the hall of !heroes, !loot monsters or just hang out with your !party";
				break;
			}
			sendMessage(commandMessage);
		}
		if(_num_commands > 0) {
			_num_commands--;
			replyCommand();
		}
	}, COMMANDS_TIMEOUT);
}

function assembleParty(user) {
	var reply = "THE PARTY: ";
	reply += userInfoLvl(user);
    partyPeople = _round.party;
    if(partyPeople.length <= 1 && partyPeople[0][0] === user) {
        reply += ", the lone wolf.";
    } else { 
        reply += " and... ";
        shuffle(partyPeople);
        reply += partyPeople.map(i => userInfoLvl(i[0])).slice(0, 15).join(", ");
    }
    return reply;
}
function poseSingleQuest(index, timeout) {
  var hptotal = Math.floor(_q[index].hp * _hpmul);
  if(_round.num === 0) {
	printQuest(index);
	_round.hpleft = hptotal;
  } else {
	  _round.dmg = 0;
  }
  _num_commands = NUM_COMMANDS;
  replyCommand();
  setTimeout(function() {
	_round.num++;
    var answers = pullNewAnswers();
    usersScored = judgeAnswers(answers);
	var buildAnswerMessage = "#rpg ";
	var runaway = false;	
	if(_runaway >= NUM_TO_FLEE && (_round.hpleft*100/hptotal) > 70) {
		buildAnswerMessage += "You fleed " +  _q[index].name + " and it's glorious loot of [" + _l[generateLoot()] + "]!";
		_round.hpleft = 0;
		_runaway = 0;
		runaway = true;
	}
    increaseScores(usersScored);
    saveScores(scores);
	var usersArray = [];
	if(_round.hpleft > 0) {
		//ROUND OVER
		var runawayMessage = "";
		if(_runaway > 0) {
			if((_round.hpleft*100/hptotal) > 70) {
				runawayMessage = " [" + _runaway + "/" + NUM_TO_FLEE +" to !flee]";
			} else {
				runawayMessage = " [can't flee!]";
			}
		}
		buildAnswerMessage += "Round #" + _round.num + ", " + Math.round(_round.dmg) + " hits! " + _q[index].name + " HP: " + renderHP(_round.hpleft, hptotal) + runawayMessage + " +XP: ";	
		for (var user in usersScored) {
			usersArray.push([user, usersScored[user]]);
		}
		usersArray.sort(function(a, b) { return -(a[1] - b[1]); });
		if(usersArray.length === 0) {
			buildAnswerMessage += "no one :(";
		}
		_round.party = usersArray.length > 0 ? usersArray : _round.party;
		buildAnswerMessage += usersArray.map(i => userInfoXp(i[0], i[1])).slice(0, 15).join(", ");
	} else if(runaway === false) {
		//BUILD KILL MONSTER
		usersScored.sort(function(a, b) { return -(a[1] - b[1]); });
		var loot = generateLoot();
		buildAnswerMessage += _q[index].name + " is kill! " +  _round.lasthit + " picks up [" + _l[loot] +"]!";
		addLoot(_round.lasthit);
		saveScores(scores);
		buildAnswerMessage += " LVLs: ";	
		for (var user in usersScored) {
			usersArray.push([user, usersScored[user]]);
		}
		usersArray.sort(function(a, b) { return -(a[1] - b[1]); });
		buildAnswerMessage  += usersArray.map(i => userInfoLvl(i[0])).slice(0, 15).join(", ");
		_round = new Round(_round.party);
	} if(runway === true) {
		_round = new Round(_round.party);
	}
    sendMessage(buildAnswerMessage);
  }, timeout);
}

function _poseSeveralQuests(indices, timeout, breaktime, currentIndex) {
  if (currentIndex >= indices.length) {
    return;
  }
  poseSingleQuest(indices[currentIndex], timeout);
  _quest_num++;
 
  var adj_breaktime = timeout + breaktime;

  if (_quest_num % QUESTS_PER_SCORE_DISPLAY === 0) {
    setTimeout(function() {
      sendMessage(computeTopScoresStr(scores, NUM_SCORES_TO_DISPLAY));
    }, timeout + breaktime);
	adj_breaktime = timeout + 2 * breaktime;
  }

  setTimeout(function() {
	if(_round.hpleft <= 0) {
		nextIndex = currentIndex + 1;
	} else {
		nextIndex = currentIndex;
	}
    _poseSeveralQuests(indices, timeout, breaktime, nextIndex);
  }, adj_breaktime);
  
}

function Round(party) {
	  this.num = 0;
	  this.dmg = 0;
	  this.hpleft = 0;
	  this.lasthit = "";
	  this.party = party;
}

function poseSeveralQuests(indices, timeout, breaktime) {
  _poseSeveralQuests(indices, timeout, breaktime, 0);
}

function increaseScores(users) {
  for (var user in users) {
    if (scores[user] === undefined) {
      scores[user] = [0,0];
    }
    scores[user][0] += users[user];
  }
}


function pullNewAnswers() {
  var re = [];
  $('.robin-message--message:not(.addon--judged)').each(function() {
    var user = $('.robin-message--from', $(this).closest('.robin-message')).text();
    re.push([user, $(this).text()]);
    $(this).addClass('addon--judged');
  });
  return re;
}

function judgeAnswers(answers) {
  var roundExp = [];
  var _ratio = 0;
  for (var i=0; i<answers.length; ++i) {
  	var _user = answers[i][0];
  	var _msg = answers[i][1];
	
	if(filterMessage(_user, _msg) === true) {
		continue;
	}
	
	if(_msg.includes("!flee")) {
		_runaway += 1;
	}
	
	var _xp = readXp(_user);
	var _userlevel = computeLevel(_xp === undefined? 1 : _xp );
	var _userloot = scores[_user][1];
	var _lootbonus = 1.125 * (_userloot / (_userloot + 60)) + 1;
	if(roundExp[_user] === undefined) {
		roundExp[_user] = 0;
	}
	
	if(_msg.length > 60) {
	  _ratio = 3;
      roundExp[_user] += 3;
	  _round.hpleft -= _userlevel * _lootbonus * 3;
	  _round.dmg += _userlevel * _lootbonus * 3;
	}
	else {
	  _ratio = 1;
	  roundExp[_user] += 1;
	  _round.hpleft -= _userlevel * _lootbonus * 1;
	  _round.dmg += _userlevel * _lootbonus * 1;
	}
	if(answers[i][1].includes("#rpg")) {
		roundExp[_user] += (_ratio * 0.5);
		_round.hpleft -= _userlevel * _lootbonus * (_ratio * 0.5);
		_round.dmg += _userlevel  * _lootbonus * (_ratio * 0.5);
	}
	
	if(_round.hpleft <= 0) {
		roundExp[_user] += 10;
		_round.lasthit = answers[i][0];
	}
  }

  return roundExp;
}

function pause(ms) {
    _additional_pause += ms;
}

function simpleRpgLoop(q) {
  parseMonsters(q);
  parseLoot(l);
  var r = [ ];
  for (var i=0; i<_q.length; ++i) {
    r.push(i);
  }
  shuffle(_l);
  _round = new Round([]);
  loadScores();
  shuffle(r);
  poseSeveralQuests(r, TIME_PER_QUEST, TIME_PER_BREAK);
}
    
function connectLoop() {
  var connectedMessage = $(".robin-message--message:contains('connected!')");
  if (connectedMessage.length > 0) {
    simpleRpgLoop(q);
    console.log("Rpg bot initialized successfully!");
  }
  else {
    console.log("Could not connect; retrying...");
    setTimeout(connectLoop, RETRY_CONNECT);
  }
}
connectLoop();
})();
