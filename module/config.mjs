import MapLocationControlIcon from "./canvas/map-location-control-icon.mjs";
import { ConsumptionTargetData } from "./data/activity/fields/consumption-targets-field.mjs";
import TransformationSetting from "./data/settings/transformation-setting.mjs";
import * as activities from "./documents/activity/_module.mjs";
import Actor5e from "./documents/actor/actor.mjs";
import * as advancement from "./documents/advancement/_module.mjs";
import { preLocalize } from "./utils.mjs";
import MappingField from "./data/fields/mapping-field.mjs";

// Namespace Configuration Values
const DEGRINGO5E = {};

// ASCII Artwork
DEGRINGO5E.ASCII = `_______________________________
______      ______ _____ _____
|  _  \\___  |  _  \\  ___|  ___|
| | | ( _ ) | | | |___ \\| |__
| | | / _ \\/\\ | | |   \\ \\  __|
| |/ / (_>  < |/ //\\__/ / |___
|___/ \\___/\\/___/ \\____/\\____/
_______________________________`;

/**
 * Configuration data for abilities.
 *
 * @typedef {object} AbilityConfiguration
 * @property {string} label                               Localized label.
 * @property {string} abbreviation                        Localized abbreviation.
 * @property {string} fullKey                             Fully written key used as alternate for enrichers.
 * @property {string} [reference]                         Reference to a rule page describing this ability.
 * @property {string} [type]                              Whether this is a "physical" or "mental" ability.
 * @property {Object<string, number|string>}  [defaults]  Default values for this ability based on actor type.
 *                                                        If a string is used, the system will attempt to fetch.
 *                                                        the value of the specified ability.
 * @property {string} [icon]                              An SVG icon that represents the ability.
 */

/**
 * The set of Ability Scores used within the system.
 * @enum {AbilityConfiguration}
 */
DEGRINGO5E.abilities = {
  str: {
    label: "DEGRINGO5E.AbilityStr",
    abbreviation: "DEGRINGO5E.AbilityStrAbbr",
    type: "physical",
    fullKey: "strength",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.nUPv6C66Ur64BIUH",
    icon: "systems/degringo5e/icons/svg/abilities/strength.svg"
  },
  dex: {
    label: "DEGRINGO5E.AbilityDex",
    abbreviation: "DEGRINGO5E.AbilityDexAbbr",
    type: "physical",
    fullKey: "dexterity",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ER8CKDUWLsFXuARJ",
    icon: "systems/degringo5e/icons/svg/abilities/dexterity.svg"
  },
  con: {
    label: "DEGRINGO5E.AbilityCon",
    abbreviation: "DEGRINGO5E.AbilityConAbbr",
    type: "physical",
    fullKey: "constitution",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.MpA4jnwD17Q0RPg7",
    icon: "systems/degringo5e/icons/svg/abilities/constitution.svg"
  },
  int: {
    label: "DEGRINGO5E.AbilityInt",
    abbreviation: "DEGRINGO5E.AbilityIntAbbr",
    type: "mental",
    fullKey: "intelligence",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.WzWWcTIppki35YvF",
    icon: "systems/degringo5e/icons/svg/abilities/intelligence.svg",
    defaults: { vehicle: 0 }
  },
  wis: {
    label: "DEGRINGO5E.AbilityWis",
    abbreviation: "DEGRINGO5E.AbilityWisAbbr",
    type: "mental",
    fullKey: "wisdom",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.v3IPyTtqvXqN934s",
    icon: "systems/degringo5e/icons/svg/abilities/wisdom.svg",
    defaults: { vehicle: 0 }
  },
  cha: {
    label: "DEGRINGO5E.AbilityCha",
    abbreviation: "DEGRINGO5E.AbilityChaAbbr",
    type: "mental",
    fullKey: "charisma",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9FyghudYFV5QJOuG",
    icon: "systems/degringo5e/icons/svg/abilities/charisma.svg",
    defaults: { vehicle: 0 }
  },
  hon: {
    label: "DEGRINGO5E.AbilityHon",
    abbreviation: "DEGRINGO5E.AbilityHonAbbr",
    type: "mental",
    fullKey: "honor",
    defaults: { npc: "cha", vehicle: 0 },
    improvement: false
  },
  san: {
    label: "DEGRINGO5E.AbilitySan",
    abbreviation: "DEGRINGO5E.AbilitySanAbbr",
    type: "mental",
    fullKey: "sanity",
    defaults: { npc: "wis", vehicle: 0 },
    improvement: false
  }
};
preLocalize("abilities", { keys: ["label", "abbreviation"] });

/**
 * Configure which ability score is used as the default modifier for initiative rolls,
 * when calculating hit points per level and hit dice, and as the default modifier for
 * saving throws to maintain concentration.
 * @enum {string}
 */
DEGRINGO5E.defaultAbilities = {
  meleeAttack: "str",
  rangedAttack: "dex",
  initiative: "dex",
  hitPoints: "con",
  concentration: "con"
};

/* -------------------------------------------- */

/**
 * Configuration data for skills.
 *
 * @typedef {object} SkillConfiguration
 * @property {string} label        Localized label.
 * @property {string} ability      Key for the default ability used by this skill.
 * @property {string} fullKey      Fully written key used as alternate for enrichers.
 * @property {string} [reference]  Reference to a rule page describing this skill.
 */

/**
 * The set of skill which can be trained with their default ability scores.
 * @enum {SkillConfiguration}
 */
DEGRINGO5E.skills = {
  acr: {
    label: "DEGRINGO5E.SkillAcr",
    ability: "dex",
    fullKey: "acrobatics",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.AvvBLEHNl7kuwPkN",
    icon: "icons/equipment/feet/shoes-simple-leaf-green.webp"
  },
  ani: {
    label: "DEGRINGO5E.SkillAni",
    ability: "wis",
    fullKey: "animalHandling",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.xb3MCjUvopOU4viE",
    icon: "icons/environment/creatures/horse-brown.webp"
  },
  arc: {
    label: "DEGRINGO5E.SkillArc",
    ability: "int",
    fullKey: "arcana",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.h3bYSPge8IOqne1N",
    icon: "icons/sundries/books/book-embossed-jewel-silver-green.webp"
  },
  ath: {
    label: "DEGRINGO5E.SkillAth",
    ability: "str",
    fullKey: "athletics",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.rIR7ttYDUpH3tMzv",
    icon: "icons/magic/control/buff-strength-muscle-damage-orange.webp"
  },
  dec: {
    label: "DEGRINGO5E.SkillDec",
    ability: "cha",
    fullKey: "deception",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.mqVZ2fz0L7a9VeKJ",
    icon: "icons/magic/control/mouth-smile-deception-purple.webp"
  },
  his: {
    label: "DEGRINGO5E.SkillHis",
    ability: "int",
    fullKey: "history",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kRBZbdWMGW9K3wdY",
    icon: "icons/sundries/books/book-embossed-bound-brown.webp"
  },
  ins: {
    label: "DEGRINGO5E.SkillIns",
    ability: "wis",
    fullKey: "insight",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.8R5SMbAGbECNgO8z",
    icon: "icons/magic/perception/orb-crystal-ball-scrying-blue.webp"
  },
  itm: {
    label: "DEGRINGO5E.SkillItm",
    ability: "cha",
    fullKey: "intimidation",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4VHHI2gJ1jEsppfg",
    icon: "icons/skills/social/intimidation-impressing.webp"
  },
  inv: {
    label: "DEGRINGO5E.SkillInv",
    ability: "int",
    fullKey: "investigation",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Y7nmbQAruWOs7WRM",
    icon: "icons/tools/scribal/magnifying-glass.webp"
  },
  med: {
    label: "DEGRINGO5E.SkillMed",
    ability: "wis",
    fullKey: "medicine",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.GeYmM7BVfSCAga4o",
    icon: "icons/tools/cooking/mortar-herbs-yellow.webp"
  },
  nat: {
    label: "DEGRINGO5E.SkillNat",
    ability: "int",
    fullKey: "nature",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ueMx3uF2PQlcye31",
    icon: "icons/magic/nature/plant-sprout-snow-green.webp"
  },
  prc: {
    label: "DEGRINGO5E.SkillPrc",
    ability: "wis",
    fullKey: "perception",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.zjEeHCUqfuprfzhY",
    icon: "icons/magic/perception/eye-ringed-green.webp"
  },
  prf: {
    label: "DEGRINGO5E.SkillPrf",
    ability: "cha",
    fullKey: "performance",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hYT7Z06yDNBcMtGe",
    icon: "icons/tools/instruments/lute-gold-brown.webp"
  },
  per: {
    label: "DEGRINGO5E.SkillPer",
    ability: "cha",
    fullKey: "persuasion",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4R5H8iIsdFQTsj3X",
    icon: "icons/skills/social/diplomacy-handshake.webp"
  },
  rel: {
    label: "DEGRINGO5E.SkillRel",
    ability: "int",
    fullKey: "religion",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.CXVzERHdP4qLhJXM",
    icon: "icons/magic/holy/saint-glass-portrait-halo.webp"
  },
  slt: {
    label: "DEGRINGO5E.SkillSlt",
    ability: "dex",
    fullKey: "sleightOfHand",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.yg6SRpGNVz9nDW0A",
    icon: "icons/sundries/gaming/playing-cards.webp"
  },
  ste: {
    label: "DEGRINGO5E.SkillSte",
    ability: "dex",
    fullKey: "stealth",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4MfrpERNiQXmvgCI",
    icon: "icons/magic/perception/shadow-stealth-eyes-purple.webp"
  },
  sur: {
    label: "DEGRINGO5E.SkillSur",
    ability: "wis",
    fullKey: "survival",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.t3EzDU5b9BVAIEVi",
    icon: "icons/magic/fire/flame-burning-campfire-yellow-blue.webp"
  }
};
preLocalize("skills", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Character alignment options.
 * @enum {string}
 */
DEGRINGO5E.alignments = {
  lg: "DEGRINGO5E.AlignmentLG",
  ng: "DEGRINGO5E.AlignmentNG",
  cg: "DEGRINGO5E.AlignmentCG",
  ln: "DEGRINGO5E.AlignmentLN",
  tn: "DEGRINGO5E.AlignmentTN",
  cn: "DEGRINGO5E.AlignmentCN",
  le: "DEGRINGO5E.AlignmentLE",
  ne: "DEGRINGO5E.AlignmentNE",
  ce: "DEGRINGO5E.AlignmentCE"
};
preLocalize("alignments");

/* -------------------------------------------- */

/**
 * An enumeration of item attunement types.
 * @enum {string}
 */
DEGRINGO5E.attunementTypes = {
  required: "DEGRINGO5E.AttunementRequired",
  optional: "DEGRINGO5E.AttunementOptional"
};
preLocalize("attunementTypes");

/**
 * An enumeration of item attunement states.
 * @type {{"0": string, "1": string, "2": string}}
 * @deprecated since 3.2, available until 3.4
 */
DEGRINGO5E.attunements = {
  0: "DEGRINGO5E.AttunementNone",
  1: "DEGRINGO5E.AttunementRequired",
  2: "DEGRINGO5E.AttunementAttuned"
};
preLocalize("attunements");

/* -------------------------------------------- */
/*  Weapon Details                              */
/* -------------------------------------------- */

/**
 * The set of types which a weapon item can take.
 * @enum {string}
 */
DEGRINGO5E.weaponTypes = {
  simpleM: "DEGRINGO5E.WeaponSimpleM",
  simpleR: "DEGRINGO5E.WeaponSimpleR",
  martialM: "DEGRINGO5E.WeaponMartialM",
  martialR: "DEGRINGO5E.WeaponMartialR",
  natural: "DEGRINGO5E.WeaponNatural",
  improv: "DEGRINGO5E.WeaponImprov",
  siege: "DEGRINGO5E.WeaponSiege"
};
preLocalize("weaponTypes");

/* -------------------------------------------- */

/**
 * General weapon categories.
 * @enum {string}
 */
DEGRINGO5E.weaponProficiencies = {
  sim: "DEGRINGO5E.WeaponSimpleProficiency",
  mar: "DEGRINGO5E.WeaponMartialProficiency"
};
preLocalize("weaponProficiencies");

/* -------------------------------------------- */

/**
 * @typedef {object} WeaponMasterConfiguration
 * @property {string} label        Localized label for the mastery
 * @property {string} [reference]  Reference to a rule page describing this mastery.
 */

/**
 * Weapon masteries.
 * @enum {WeaponMasterConfiguration}
 */
DEGRINGO5E.weaponMasteries = {
  cleave: {
    label: "DEGRINGO5E.WEAPON.Mastery.Cleave",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ULDpodOdTxTTiNEx"
  },
  graze: {
    label: "DEGRINGO5E.WEAPON.Mastery.Graze",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.PPnaXKPsQvAZp0J4"
  },
  nick: {
    label: "DEGRINGO5E.WEAPON.Mastery.Nick",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.l0uao3UVco5ptQso"
  },
  push: {
    label: "DEGRINGO5E.WEAPON.Mastery.Push",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.BPD7ScnLyuPwl145"
  },
  sap: {
    label: "DEGRINGO5E.WEAPON.Mastery.Sap",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.fPkZQ7TkKCCA3nTc"
  },
  slow: {
    label: "DEGRINGO5E.WEAPON.Mastery.Slow",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.OQQ7hAp6OAxX1rXY"
  },
  topple: {
    label: "DEGRINGO5E.WEAPON.Mastery.Topple",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.IMnpuysdrSalmZJg"
  },
  vex: {
    label: "DEGRINGO5E.WEAPON.Mastery.Vex",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hg3adn9O1O5Z2QxL"
  }
};
preLocalize("weaponMasteries", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * A mapping between `DEGRINGO5E.weaponTypes` and `DEGRINGO5E.weaponProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
DEGRINGO5E.weaponProficienciesMap = {
  simpleM: "sim",
  simpleR: "sim",
  martialM: "mar",
  martialR: "mar"
};

/* -------------------------------------------- */

/**
 * A mapping between `DEGRINGO5E.weaponTypes` and `DEGRINGO5E.attackClassifications`. Unlisted types are assumed to be
 * of the "weapon" classification.
 * @enum {string}
 */
DEGRINGO5E.weaponClassificationMap = {};

/* -------------------------------------------- */

/**
 * A mapping between `DEGRINGO5E.weaponTypes` and `DEGRINGO5E.attackTypes`.
 * @enum {string}
 */
DEGRINGO5E.weaponTypeMap = {
  simpleM: "melee",
  simpleR: "ranged",
  martialM: "melee",
  martialR: "ranged",
  siege: "ranged"
};

/* -------------------------------------------- */

/**
 * The basic weapon types in 5e. This enables specific weapon proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
DEGRINGO5E.weaponIds = {
  battleaxe: "Compendium.degringo5e.equipment24.Item.phbwepBattleaxe0",
  blowgun: "Compendium.degringo5e.equipment24.Item.phbwepBlowgun000",
  club: "Compendium.degringo5e.equipment24.Item.phbwepClub000000",
  dagger: "Compendium.degringo5e.equipment24.Item.phbwepDagger0000",
  dart: "Compendium.degringo5e.equipment24.Item.phbwepDart000000",
  flail: "Compendium.degringo5e.equipment24.Item.phbwepFlail00000",
  glaive: "Compendium.degringo5e.equipment24.Item.phbwepGlaive0000",
  greataxe: "Compendium.degringo5e.equipment24.Item.phbwepGreataxe00",
  greatclub: "Compendium.degringo5e.equipment24.Item.phbwepGreatclub0",
  greatsword: "Compendium.degringo5e.equipment24.Item.phbwepGreatsword",
  halberd: "Compendium.degringo5e.equipment24.Item.phbwepHalberd000",
  handaxe: "Compendium.degringo5e.equipment24.Item.phbwepHandaxe000",
  handcrossbow: "Compendium.degringo5e.equipment24.Item.phbwepHandCrossb",
  heavycrossbow: "Compendium.degringo5e.equipment24.Item.phbwepHeavyCross",
  javelin: "Compendium.degringo5e.equipment24.Item.phbwepJavelin000",
  lance: "Compendium.degringo5e.equipment24.Item.phbwepLance00000",
  lightcrossbow: "Compendium.degringo5e.equipment24.Item.phbwepLightCross",
  lighthammer: "Compendium.degringo5e.equipment24.Item.phbwepLightHamme",
  longbow: "Compendium.degringo5e.equipment24.Item.phbwepLongbow000",
  longsword: "Compendium.degringo5e.equipment24.Item.phbwepLongsword0",
  mace: "Compendium.degringo5e.equipment24.Item.phbwepMace000000",
  maul: "Compendium.degringo5e.equipment24.Item.phbwepMaul000000",
  morningstar: "Compendium.degringo5e.equipment24.Item.phbwepMorningsta",
  musket: "Compendium.degringo5e.equipment24.Item.phbwepMusket0000",
  pike: "Compendium.degringo5e.equipment24.Item.phbwepPike000000",
  pistol: "Compendium.degringo5e.equipment24.Item.phbwepPistol0000",
  quarterstaff: "Compendium.degringo5e.equipment24.Item.phbwepQuartersta",
  rapier: "Compendium.degringo5e.equipment24.Item.phbwepRapier0000",
  scimitar: "Compendium.degringo5e.equipment24.Item.phbwepScimitar00",
  shortsword: "Compendium.degringo5e.equipment24.Item.phbwepShortsword",
  sickle: "Compendium.degringo5e.equipment24.Item.phbwepSickle0000",
  spear: "Compendium.degringo5e.equipment24.Item.phbwepSpear00000",
  shortbow: "Compendium.degringo5e.equipment24.Item.phbwepShortbow00",
  sling: "Compendium.degringo5e.equipment24.Item.phbwepSling00000",
  trident: "Compendium.degringo5e.equipment24.Item.phbwepTrident000",
  warpick: "Compendium.degringo5e.equipment24.Item.phbwepWarPick000",
  warhammer: "Compendium.degringo5e.equipment24.Item.phbwepWarhammer0",
  whip: "Compendium.degringo5e.equipment24.Item.phbwepWhip000000"
};

/* -------------------------------------------- */

/**
 * The basic ammunition types.
 * @enum {string}
 */
DEGRINGO5E.ammoIds = {
  arrow: "Compendium.degringo5e.equipment24.Item.phbamoArrows0000",
  blowgunNeedle: "Compendium.degringo5e.equipment24.Item.phbamoNeedles000",
  crossbowBolt: "Compendium.degringo5e.equipment24.Item.phbamoBolts00000",
  firearmBullet: "Compendium.degringo5e.equipment24.Item.phbamoBulletsFir",
  slingBullet: "Compendium.degringo5e.equipment24.Item.phbamoBulletsSli"
};

/* -------------------------------------------- */
/*  Bastion Facilities                          */
/* -------------------------------------------- */

/**
 * @typedef FacilityConfiguration
 * @property {Record<string, Record<number, number>>} advancement  The number of free facilities of a given type awarded
 *                                                                 at certain character levels.
 * @property {Record<string, FacilityOrder>} orders                Orders that can be issued to a facility.
 * @property {Record<string, FacilitySize>} sizes                  Facility size categories.
 * @property {Record<string, SubtypeTypeConfiguration>} types      Facility types and subtypes.
 */

/**
 * @typedef FacilityOrder
 * @property {string} label       The human-readable name of the order.
 * @property {string} icon        The SVG icon for this order.
 * @property {boolean} [basic]    Whether this order can be issued to basic facilities.
 * @property {number} [duration]  The amount of time taken to complete the order if different to a normal bastion turn.
 * @property {boolean} [hidden]   This order is not normally available for execution.
 */

/**
 * @typedef FacilitySize
 * @property {string} label    The human-readable name of the size category.
 * @property {number} days     The number of days to build the facility.
 * @property {number} squares  The maximum area the facility may occupy in the bastion plan.
 * @property {number} value    The cost in gold pieces to build the facility.
 */

/**
 * Configuration data for bastion facilities.
 * @type {FacilityConfiguration}
 */
DEGRINGO5E.facilities = {
  advancement: {
    basic: { 5: 2 },
    special: { 5: 2, 9: 4, 13: 5, 17: 6 }
  },
  orders: {
    build: {
      label: "DEGRINGO5E.FACILITY.Orders.build.inf",
      icon: "systems/degringo5e/icons/svg/facilities/build.svg"
    },
    change: {
      label: "DEGRINGO5E.FACILITY.Orders.change.inf",
      icon: "systems/degringo5e/icons/svg/facilities/change.svg",
      duration: 21
    },
    craft: {
      label: "DEGRINGO5E.FACILITY.Orders.craft.inf",
      icon: "systems/degringo5e/icons/svg/facilities/craft.svg"
    },
    empower: {
      label: "DEGRINGO5E.FACILITY.Orders.empower.inf",
      icon: "systems/degringo5e/icons/svg/facilities/empower.svg"
    },
    enlarge: {
      label: "DEGRINGO5E.FACILITY.Orders.enlarge.inf",
      icon: "systems/degringo5e/icons/svg/facilities/enlarge.svg",
      basic: true
    },
    harvest: {
      label: "DEGRINGO5E.FACILITY.Orders.harvest.inf",
      icon: "systems/degringo5e/icons/svg/facilities/harvest.svg"
    },
    maintain: {
      label: "DEGRINGO5E.FACILITY.Orders.maintain.inf",
      icon: "systems/degringo5e/icons/svg/facilities/maintain.svg"
    },
    recruit: {
      label: "DEGRINGO5E.FACILITY.Orders.recruit.inf",
      icon: "systems/degringo5e/icons/svg/facilities/recruit.svg"
    },
    repair: {
      label: "DEGRINGO5E.FACILITY.Orders.repair.inf",
      icon: "systems/degringo5e/icons/svg/facilities/repair.svg",
      hidden: true
    },
    research: {
      label: "DEGRINGO5E.FACILITY.Orders.research.inf",
      icon: "systems/degringo5e/icons/svg/facilities/research.svg"
    },
    trade: {
      label: "DEGRINGO5E.FACILITY.Orders.trade.inf",
      icon: "systems/degringo5e/icons/svg/facilities/trade.svg"
    }
  },
  sizes: {
    cramped: {
      label: "DEGRINGO5E.FACILITY.Sizes.cramped",
      days: 20,
      squares: 4,
      value: 500
    },
    roomy: {
      label: "DEGRINGO5E.FACILITY.Sizes.roomy",
      days: 45,
      squares: 16,
      value: 1_000
    },
    vast: {
      label: "DEGRINGO5E.FACILITY.Sizes.vast",
      days: 125,
      squares: 36,
      value: 3_000
    }
  },
  types: {
    basic: {
      label: "DEGRINGO5E.FACILITY.Types.Basic.Label.one",
      subtypes: {
        bedroom: "DEGRINGO5E.FACILITY.Types.Basic.Bedroom",
        diningRoom: "DEGRINGO5E.FACILITY.Types.Basic.DiningRoom",
        parlor: "DEGRINGO5E.FACILITY.Types.Basic.Parlor",
        courtyard: "DEGRINGO5E.FACILITY.Types.Basic.Courtyard",
        kitchen: "DEGRINGO5E.FACILITY.Types.Basic.Kitchen",
        storage: "DEGRINGO5E.FACILITY.Types.Basic.Storage"
      }
    },
    special: {
      label: "DEGRINGO5E.FACILITY.Types.Special.Label.one",
      subtypes: {
        arcaneStudy: "DEGRINGO5E.FACILITY.Types.Special.ArcaneStudy",
        armory: "DEGRINGO5E.FACILITY.Types.Special.Armory",
        barrack: "DEGRINGO5E.FACILITY.Types.Special.Barrack",
        garden: "DEGRINGO5E.FACILITY.Types.Special.Garden",
        library: "DEGRINGO5E.FACILITY.Types.Special.Library",
        sanctuary: "DEGRINGO5E.FACILITY.Types.Special.Sanctuary",
        smithy: "DEGRINGO5E.FACILITY.Types.Special.Smithy",
        storehouse: "DEGRINGO5E.FACILITY.Types.Special.Storehouse",
        workshop: "DEGRINGO5E.FACILITY.Types.Special.Workshop",
        gamingHall: "DEGRINGO5E.FACILITY.Types.Special.GamingHall",
        greenhouse: "DEGRINGO5E.FACILITY.Types.Special.Greenhouse",
        laboratory: "DEGRINGO5E.FACILITY.Types.Special.Laboratory",
        sacristy: "DEGRINGO5E.FACILITY.Types.Special.Sacristy",
        scriptorium: "DEGRINGO5E.FACILITY.Types.Special.Scriptorium",
        stable: "DEGRINGO5E.FACILITY.Types.Special.Stable",
        teleportationCircle: "DEGRINGO5E.FACILITY.Types.Special.TeleportationCircle",
        theater: "DEGRINGO5E.FACILITY.Types.Special.Theater",
        trainingArea: "DEGRINGO5E.FACILITY.Types.Special.TrainingArea",
        trophyRoom: "DEGRINGO5E.FACILITY.Types.Special.TrophyRoom",
        archive: "DEGRINGO5E.FACILITY.Types.Special.Archive",
        meditationChamber: "DEGRINGO5E.FACILITY.Types.Special.MeditationChamber",
        menagerie: "DEGRINGO5E.FACILITY.Types.Special.Menagerie",
        observatory: "DEGRINGO5E.FACILITY.Types.Special.Observatory",
        pub: "DEGRINGO5E.FACILITY.Types.Special.Pub",
        reliquary: "DEGRINGO5E.FACILITY.Types.Special.Reliquary",
        demiplane: "DEGRINGO5E.FACILITY.Types.Special.Demiplane",
        guildhall: "DEGRINGO5E.FACILITY.Types.Special.Guildhall",
        sanctum: "DEGRINGO5E.FACILITY.Types.Special.Sanctum",
        warRoom: "DEGRINGO5E.FACILITY.Types.Special.WarRoom"
      }
    }
  }
};
preLocalize("facilities.orders", { key: "label", sort: true });
preLocalize("facilities.sizes", { key: "label", sort: true });
preLocalize("facilities.types", { key: "label", sort: true });
preLocalize("facilities.types.basic.subtypes", { sort: true });
preLocalize("facilities.types.special.subtypes", { sort: true });

/* -------------------------------------------- */
/*  Tool Details                                */
/* -------------------------------------------- */

/**
 * The categories into which Tool items can be grouped.
 *
 * @enum {string}
 */
DEGRINGO5E.toolTypes = {
  art: "DEGRINGO5E.ToolArtisans",
  game: "DEGRINGO5E.ToolGamingSet",
  music: "DEGRINGO5E.ToolMusicalInstrument"
};
preLocalize("toolTypes", { sort: true });

/**
 * The categories of tool proficiencies that a character can gain.
 *
 * @enum {string}
 */
DEGRINGO5E.toolProficiencies = {
  ...DEGRINGO5E.toolTypes,
  vehicle: "DEGRINGO5E.ToolVehicle"
};
preLocalize("toolProficiencies", { sort: true });

/**
 * @typedef ToolConfiguration
 * @property {string} ability  Default ability used for the tool.
 * @property {string} id       UUID of reference tool or ID within pack defined by `DEGRINGO5E.sourcePacks.ITEMS`.
 */

/**
 * Configuration data for tools.
 * @enum {ToolConfiguration}
 */
DEGRINGO5E.tools = {
  alchemist: {
    ability: "int",
    id: "Compendium.degringo5e.equipment24.Item.phbtulAlchemists"
  },
  bagpipes: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusBagpipes00"
  },
  brewer: {
    ability: "int",
    id: "Compendium.degringo5e.equipment24.Item.phbtulBrewersSup"
  },
  calligrapher: {
    ability: "dex",
    id: "Compendium.degringo5e.equipment24.Item.phbtulCalligraph"
  },
  card: {
    ability: "wis",
    id: "Compendium.degringo5e.equipment24.Item.phbgstPlayingcar"
  },
  carpenter: {
    ability: "str",
    id: "Compendium.degringo5e.equipment24.Item.phbtulCarpenters"
  },
  cartographer: {
    ability: "wis",
    id: "Compendium.degringo5e.equipment24.Item.phbtulCartograph"
  },
  chess: {
    ability: "wis",
    id: "Compendium.degringo5e.equipment24.Item.phbgstDragonches"
  },
  cobbler: {
    ability: "dex",
    id: "Compendium.degringo5e.equipment24.Item.phbtulCobblersTo"
  },
  cook: {
    ability: "wis",
    id: "Compendium.degringo5e.equipment24.Item.phbtulCooksUtens"
  },
  dice: {
    ability: "wis",
    id: "Compendium.degringo5e.equipment24.Item.phbgstDice000000"
  },
  disg: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbtulDisguiseKi"
  },
  drum: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusDrum000000"
  },
  dulcimer: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusDulcimer00"
  },
  flute: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusFlute00000"
  },
  forg: {
    ability: "dex",
    id: "Compendium.degringo5e.equipment24.Item.phbtulForgeryKit"
  },
  glassblower: {
    ability: "int",
    id: "Compendium.degringo5e.equipment24.Item.phbtulGlassblowe"
  },
  herb: {
    ability: "int",
    id: "Compendium.degringo5e.equipment24.Item.phbtulHerbalismK"
  },
  horn: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusHorn000000"
  },
  jeweler: {
    ability: "int",
    id: "Compendium.degringo5e.equipment24.Item.phbtulJewelersTo"
  },
  leatherworker: {
    ability: "dex",
    id: "Compendium.degringo5e.equipment24.Item.phbtulLeatherwor"
  },
  lute: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusLute000000"
  },
  lyre: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusLyre000000"
  },
  mason: {
    ability: "str",
    id: "Compendium.degringo5e.equipment24.Item.phbtulMasonsTool"
  },
  navg: {
    ability: "wis",
    id: "Compendium.degringo5e.equipment24.Item.phbtulNavigators"
  },
  painter: {
    ability: "wis",
    id: "Compendium.degringo5e.equipment24.Item.phbtulPaintersSu"
  },
  panflute: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusPanflute00"
  },
  pois: {
    ability: "int",
    id: "Compendium.degringo5e.equipment24.Item.phbtulPoisonersK"
  },
  potter: {
    ability: "int",
    id: "Compendium.degringo5e.equipment24.Item.phbtulPottersToo"
  },
  shawm: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusShawm00000"
  },
  smith: {
    ability: "str",
    id: "Compendium.degringo5e.equipment24.Item.phbtulSmithsTool"
  },
  thief: {
    ability: "dex",
    id: "Compendium.degringo5e.equipment24.Item.phbtulThievesToo"
  },
  tinker: {
    ability: "dex",
    id: "Compendium.degringo5e.equipment24.Item.phbtulTinkersToo"
  },
  viol: {
    ability: "cha",
    id: "Compendium.degringo5e.equipment24.Item.phbmusViol000000"
  },
  weaver: {
    ability: "dex",
    id: "Compendium.degringo5e.equipment24.Item.phbtulWeaversToo"
  },
  woodcarver: {
    ability: "dex",
    id: "Compendium.degringo5e.equipment24.Item.phbtulWoodcarver"
  }
};

/**
 * The basic tool types in 5e. This enables specific tool proficiencies or
 * starting equipment provided by classes and backgrounds.
 * @enum {string}
 */
DEGRINGO5E.toolIds = new Proxy(DEGRINGO5E.tools, {
  get(target, prop) {
    foundry.utils.logCompatibilityWarning(
      "`CONFIG.DEGRINGO5E.toolIds` is deprecated, use `CONFIG.DEGRINGO5E.tools` instead.",
      { since: "DnD5e 4.4", until: "DnD5e 5.2", once: true }
    );
    return target[prop]?.id ?? target[prop];
  }
});

/* -------------------------------------------- */
/*  Time                                        */
/* -------------------------------------------- */

/**
 * @typedef {object} TimeUnitConfiguration
 * @property {string} label            Localized label for this unit.
 * @property {string} [counted]        Localization path for counted plural forms. Only necessary if non-supported unit
 *                                     or using non-standard name for a supported unit. List of supported units can be
 *                                     found here: https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers
 * @property {number} conversion       Conversion multiplier used to converting between units.
 * @property {boolean} [combat=false]  Is this a combat-specific time unit?
 * @property {boolean} [option=true]   Should this be available when users can select from a list of units?
 */

/**
 * Configuration for time units available to the system.
 * @enum {TimeUnitConfiguration}
 */
DEGRINGO5E.timeUnits = {
  turn: {
    label: "DEGRINGO5E.UNITS.TIME.Turn.Label",
    counted: "DEGRINGO5E.UNITS.TIME.Turn.Counted",
    conversion: .1,
    combat: true
  },
  round: {
    label: "DEGRINGO5E.UNITS.TIME.Round.Label",
    counted: "DEGRINGO5E.UNITS.TIME.Round.Counted",
    conversion: .1,
    combat: true
  },
  second: {
    label: "DEGRINGO5E.UNITS.TIME.Second.Label",
    conversion: 1 / 60,
    option: false
  },
  minute: {
    label: "DEGRINGO5E.UNITS.TIME.Minute.Label",
    conversion: 1
  },
  hour: {
    label: "DEGRINGO5E.UNITS.TIME.Hour.Label",
    conversion: 60
  },
  day: {
    label: "DEGRINGO5E.UNITS.TIME.Day.Label",
    conversion: 1_440
  },
  week: {
    label: "DEGRINGO5E.UNITS.TIME.Week.Label",
    conversion: 10_080,
    option: false
  },
  month: {
    label: "DEGRINGO5E.UNITS.TIME.Month.Label",
    conversion: 43_200
  },
  year: {
    label: "DEGRINGO5E.UNITS.TIME.Year.Label",
    conversion: 525_600
  }
};
preLocalize("timeUnits", { key: "label" });

/* -------------------------------------------- */

/**
 * Time periods that accept a numeric value.
 * @enum {string}
 */
DEGRINGO5E.scalarTimePeriods = new Proxy(DEGRINGO5E.timeUnits, {
  get(target, prop) {
    return target[prop]?.label;
  },
  has(target, key) {
    return target[key] && target[key].option !== false;
  },
  ownKeys(target) {
    return Object.keys(target).filter(k => target[k]?.option !== false);
  }
});

/* -------------------------------------------- */

/**
 * Time periods for spells that don't have a defined ending.
 * @enum {string}
 */
DEGRINGO5E.permanentTimePeriods = {
  disp: "DEGRINGO5E.TimeDisp",
  dstr: "DEGRINGO5E.TimeDispTrig",
  perm: "DEGRINGO5E.TimePerm"
};
preLocalize("permanentTimePeriods");

/* -------------------------------------------- */

/**
 * Time periods that don't accept a numeric value.
 * @enum {string}
 */
DEGRINGO5E.specialTimePeriods = {
  inst: "DEGRINGO5E.TimeInst",
  spec: "DEGRINGO5E.Special"
};
preLocalize("specialTimePeriods");

/* -------------------------------------------- */

/**
 * The various lengths of time over which effects can occur.
 * @enum {string}
 */
DEGRINGO5E.timePeriods = {
  ...DEGRINGO5E.specialTimePeriods,
  ...DEGRINGO5E.permanentTimePeriods,
  ...DEGRINGO5E.scalarTimePeriods
};
preLocalize("timePeriods");

/* -------------------------------------------- */

/**
 * Ways in which to activate an item that cannot be labeled with a cost.
 * @enum {string}
 */
DEGRINGO5E.staticAbilityActivationTypes = {
  none: "DEGRINGO5E.NoneActionLabel",
  special: DEGRINGO5E.timePeriods.spec
};

/**
 * Various ways in which an item or ability can be activated.
 * @enum {string}
 */
DEGRINGO5E.abilityActivationTypes = {
  ...DEGRINGO5E.staticAbilityActivationTypes,
  action: "DEGRINGO5E.Action",
  bonus: "DEGRINGO5E.BonusAction",
  reaction: "DEGRINGO5E.Reaction",
  minute: DEGRINGO5E.timePeriods.minute,
  hour: DEGRINGO5E.timePeriods.hour,
  day: DEGRINGO5E.timePeriods.day,
  legendary: "DEGRINGO5E.LegendaryAction.Label",
  mythic: "DEGRINGO5E.MythicActionLabel",
  lair: "DEGRINGO5E.LAIR.Action.Label",
  crew: "DEGRINGO5E.VehicleCrewAction"
};
preLocalize("abilityActivationTypes");

/* -------------------------------------------- */

/**
 * @typedef ActivityActivationTypeConfig
 * @property {string} label             Localized label for the activation type.
 * @property {string} [header]          Localized label for the activation type header.
 * @property {string} [group]           Localized label for the presentational group.
 * @property {boolean} [passive=false]  Classify this item as a passive feature on NPC sheets.
 * @property {boolean} [scalar=false]   Does this activation type have a numeric value attached?
 */

/**
 * Configuration data for activation types on activities.
 * @enum {ActivityActivationTypeConfig}
 */
DEGRINGO5E.activityActivationTypes = {
  action: {
    label: "DEGRINGO5E.ACTIVATION.Type.Action.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.Action.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Standard"
  },
  bonus: {
    label: "DEGRINGO5E.ACTIVATION.Type.BonusAction.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.BonusAction.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Standard"
  },
  reaction: {
    label: "DEGRINGO5E.ACTIVATION.Type.Reaction.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.Reaction.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Standard"
  },
  minute: {
    label: "DEGRINGO5E.ACTIVATION.Type.Minute.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.Minute.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Time",
    scalar: true
  },
  hour: {
    label: "DEGRINGO5E.ACTIVATION.Type.Hour.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.Hour.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Time",
    scalar: true
  },
  day: {
    label: "DEGRINGO5E.ACTIVATION.Type.Day.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.Day.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Time",
    scalar: true
  },
  longRest: {
    label: "DEGRINGO5E.ACTIVATION.Type.LongRest.Label",
    group: "DEGRINGO5E.ACTIVATION.Category.Rest",
    passive: true
  },
  shortRest: {
    label: "DEGRINGO5E.ACTIVATION.Type.ShortRest.Label",
    group: "DEGRINGO5E.ACTIVATION.Category.Rest",
    passive: true
  },
  encounter: {
    label: "DEGRINGO5E.ACTIVATION.Type.Encounter.Label",
    group: "DEGRINGO5E.ACTIVATION.Category.Combat",
    passive: true
  },
  turnStart: {
    label: "DEGRINGO5E.ACTIVATION.Type.TurnStart.Label",
    group: "DEGRINGO5E.ACTIVATION.Category.Combat",
    passive: true
  },
  turnEnd: {
    label: "DEGRINGO5E.ACTIVATION.Type.TurnEnd.Label",
    group: "DEGRINGO5E.ACTIVATION.Category.Combat",
    passive: true
  },
  legendary: {
    label: "DEGRINGO5E.ACTIVATION.Type.Legendary.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.Legendary.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Monster",
    scalar: true
  },
  mythic: {
    label: "DEGRINGO5E.ACTIVATION.Type.Mythic.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.Mythic.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Monster",
    scalar: true
  },
  lair: {
    label: "DEGRINGO5E.ACTIVATION.Type.Lair.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.Lair.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Monster"
  },
  crew: {
    label: "DEGRINGO5E.ACTIVATION.Type.Crew.Label",
    header: "DEGRINGO5E.ACTIVATION.Type.Crew.Header",
    group: "DEGRINGO5E.ACTIVATION.Category.Vehicle",
    scalar: true
  },
  special: {
    label: "DEGRINGO5E.Special"
  }
};
preLocalize("activityActivationTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Different things that an ability can consume upon use.
 * @enum {string}
 */
DEGRINGO5E.abilityConsumptionTypes = {
  ammo: "DEGRINGO5E.ConsumeAmmunition",
  attribute: "DEGRINGO5E.ConsumeAttribute",
  hitDice: "DEGRINGO5E.ConsumeHitDice",
  material: "DEGRINGO5E.ConsumeMaterial",
  charges: "DEGRINGO5E.ConsumeCharges"
};
preLocalize("abilityConsumptionTypes", { sort: true });

/* -------------------------------------------- */

/**
 * @typedef {object} ActivityConsumptionTargetConfig
 * @property {string} label                                     Localized label for the target type.
 * @property {ConsumptionConsumeFunction} consume               Function used to consume according to this type.
 * @property {ConsumptionLabelsFunction} consumptionLabels      Function used to generate a hint of consumption amount.
 * @property {{value: string, label: string}[]} [scalingModes]  Additional scaling modes for this consumption type in
 *                                                              addition to the default "amount" scaling.
 * @property {boolean} [targetRequiresEmbedded]                 Use text input rather than select when not embedded.
 * @property {ConsumptionValidTargetsFunction} [validTargets]   Function for creating an array of consumption targets.
 */

/**
 * @callback ConsumptionConsumeFunction
 * @this {ConsumptionTargetData}
 * @param {ActivityUseConfiguration} config  Configuration data for the activity usage.
 * @param {ActivityUsageUpdates} updates     Updates to be performed.
 * @throws ConsumptionError
 */

/**
 * @callback ConsumptionLabelsFunction
 * @this {ConsumptionTargetData}
 * @param {ActivityUseConfiguration} config  Configuration data for the activity usage.
 * @param {object} [options={}]
 * @param {boolean} [options.consumed]       Is this consumption currently set to be consumed?
 * @returns {ConsumptionLabels}
 */

/**
 * @typedef ConsumptionLabels
 * @property {string} label      Label displayed for the consumption checkbox.
 * @property {string} hint       Hint text describing what should be consumed.
 * @property {{ type: string, message: string }} [notes]  Additional notes relating to the consumption to be performed.
 * @property {boolean} [warn]    Display a warning icon indicating consumption will fail.
 */

/**
 * @callback ConsumptionValidTargetsFunction
 * @this {ConsumptionTargetData}
 * @returns {FormSelectOption[]}
 */

/**
 * Configuration information for different consumption targets.
 * @enum {ActivityConsumptionTargetConfig}
 */
DEGRINGO5E.activityConsumptionTypes = {
  activityUses: {
    label: "DEGRINGO5E.CONSUMPTION.Type.ActivityUses.Label",
    consume: ConsumptionTargetData.consumeActivityUses,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsActivityUses
  },
  itemUses: {
    label: "DEGRINGO5E.CONSUMPTION.Type.ItemUses.Label",
    consume: ConsumptionTargetData.consumeItemUses,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsItemUses,
    targetRequiresEmbedded: true,
    validTargets: ConsumptionTargetData.validItemUsesTargets
  },
  material: {
    label: "DEGRINGO5E.CONSUMPTION.Type.Material.Label",
    consume: ConsumptionTargetData.consumeMaterial,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsMaterial,
    targetRequiresEmbedded: true,
    validTargets: ConsumptionTargetData.validMaterialTargets
  },
  hitDice: {
    label: "DEGRINGO5E.CONSUMPTION.Type.HitDice.Label",
    consume: ConsumptionTargetData.consumeHitDice,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsHitDice,
    validTargets: ConsumptionTargetData.validHitDiceTargets
  },
  spellSlots: {
    label: "DEGRINGO5E.CONSUMPTION.Type.SpellSlots.Label",
    consume: ConsumptionTargetData.consumeSpellSlots,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsSpellSlots,
    scalingModes: [{ value: "level", label: "DEGRINGO5E.CONSUMPTION.Scaling.SlotLevel" }],
    validTargets: ConsumptionTargetData.validSpellSlotsTargets
  },
  attribute: {
    label: "DEGRINGO5E.CONSUMPTION.Type.Attribute.Label",
    consume: ConsumptionTargetData.consumeAttribute,
    consumptionLabels: ConsumptionTargetData.consumptionLabelsAttribute,
    targetRequiresEmbedded: true,
    validTargets: ConsumptionTargetData.validAttributeTargets
  }
};
preLocalize("activityConsumptionTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Configuration data for actor sizes.
 *
 * @typedef {object} ActorSizeConfiguration
 * @property {string} label                   Localized label.
 * @property {string} abbreviation            Localized abbreviation.
 * @property {number} hitDie                  Default hit die denomination for NPCs of this size.
 * @property {number} [token=1]               Default token size.
 * @property {number} [capacityMultiplier=1]  Multiplier used to calculate carrying capacities.
 */

/**
 * Creature sizes ordered from smallest to largest.
 * @enum {ActorSizeConfiguration}
 */
DEGRINGO5E.actorSizes = {
  tiny: {
    label: "DEGRINGO5E.SizeTiny",
    abbreviation: "DEGRINGO5E.SizeTinyAbbr",
    hitDie: 4,
    token: 0.5,
    capacityMultiplier: 0.5
  },
  sm: {
    label: "DEGRINGO5E.SizeSmall",
    abbreviation: "DEGRINGO5E.SizeSmallAbbr",
    hitDie: 6,
    dynamicTokenScale: 0.8
  },
  med: {
    label: "DEGRINGO5E.SizeMedium",
    abbreviation: "DEGRINGO5E.SizeMediumAbbr",
    hitDie: 8
  },
  lg: {
    label: "DEGRINGO5E.SizeLarge",
    abbreviation: "DEGRINGO5E.SizeLargeAbbr",
    hitDie: 10,
    token: 2,
    capacityMultiplier: 2
  },
  huge: {
    label: "DEGRINGO5E.SizeHuge",
    abbreviation: "DEGRINGO5E.SizeHugeAbbr",
    hitDie: 12,
    token: 3,
    capacityMultiplier: 4
  },
  grg: {
    label: "DEGRINGO5E.SizeGargantuan",
    abbreviation: "DEGRINGO5E.SizeGargantuanAbbr",
    hitDie: 20,
    token: 4,
    capacityMultiplier: 8
  }
};
preLocalize("actorSizes", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */
/*  Canvas                                      */
/* -------------------------------------------- */

/**
 * Colors used to visualize temporary and temporary maximum HP in token health bars.
 * @enum {number}
 */
DEGRINGO5E.tokenHPColors = {
  damage: 0xFF0000,
  healing: 0x00FF00,
  temp: 0x66CCFF,
  tempmax: 0x440066,
  negmax: 0x550000
};

/* -------------------------------------------- */

/**
 * Colors used when a dynamic token ring effects.
 * @enum {number}
 */
DEGRINGO5E.tokenRingColors = {
  damage: 0xFF0000,
  defeated: 0x000000,
  healing: 0x00FF00,
  temp: 0x33AAFF
};

/* -------------------------------------------- */

/**
 * Configuration data for a map marker style. Options not included will fall back to the value set in `default` style.
 * Any additional styling options added will be passed into the custom marker class and be available for rendering.
 *
 * @typedef {object} MapLocationMarkerStyle
 * @property {typeof PIXI.Container} [icon]  Map marker class used to render the icon.
 * @property {number} [backgroundColor]      Color of the background inside the circle.
 * @property {number} [borderColor]          Color of the border in normal state.
 * @property {number} [borderHoverColor]     Color of the border when hovering over the marker.
 * @property {string} [fontFamily]           Font used for rendering the code on the marker.
 * @property {number} [shadowColor]          Color of the shadow under the marker.
 * @property {number} [textColor]            Color of the text on the marker.
 */

/**
 * Settings used to render map location markers on the canvas.
 * @enum {MapLocationMarkerStyle}
 */
DEGRINGO5E.mapLocationMarker = {
  default: {
    icon: MapLocationControlIcon,
    backgroundColor: 0xFBF8F5,
    borderColor: 0x000000,
    borderHoverColor: 0xFF5500,
    fontFamily: "Roboto Slab",
    shadowColor: 0x000000,
    textColor: 0x000000
  }
};

/* -------------------------------------------- */

/**
 * Configuration data for creature types.
 *
 * @typedef {object} CreatureTypeConfiguration
 * @property {string} label               Localized label.
 * @property {string} plural              Localized plural form used in swarm name.
 * @property {string} [reference]         Reference to a rule page describing this type.
 * @property {boolean} [detectAlignment]  Is this type detectable by spells such as "Detect Evil and Good"?
 */

/**
 * Default types of creatures.
 * @enum {CreatureTypeConfiguration}
 */
DEGRINGO5E.creatureTypes = {
  aberration: {
    label: "DEGRINGO5E.CreatureAberration",
    plural: "DEGRINGO5E.CreatureAberrationPl",
    icon: "icons/creatures/tentacles/tentacle-eyes-yellow-pink.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.yy50qVC1JhPHt4LC",
    detectAlignment: true
  },
  beast: {
    label: "DEGRINGO5E.CreatureBeast",
    plural: "DEGRINGO5E.CreatureBeastPl",
    icon: "icons/creatures/claws/claw-bear-paw-swipe-red.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6bTHn7pZek9YX2tv"
  },
  celestial: {
    label: "DEGRINGO5E.CreatureCelestial",
    plural: "DEGRINGO5E.CreatureCelestialPl",
    icon: "icons/creatures/abilities/wings-birdlike-blue.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.T5CJwxjhBbi6oqaM",
    detectAlignment: true
  },
  construct: {
    label: "DEGRINGO5E.CreatureConstruct",
    plural: "DEGRINGO5E.CreatureConstructPl",
    icon: "icons/creatures/magical/construct-stone-earth-gray.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.jQGAJZBZTqDFod8d"
  },
  dragon: {
    label: "DEGRINGO5E.CreatureDragon",
    plural: "DEGRINGO5E.CreatureDragonPl",
    icon: "icons/creatures/abilities/dragon-fire-breath-orange.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.k2IRXZwGk9W0PM2S"
  },
  elemental: {
    label: "DEGRINGO5E.CreatureElemental",
    plural: "DEGRINGO5E.CreatureElementalPl",
    icon: "icons/creatures/magical/spirit-fire-orange.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.7z1LXGGkXpHuzkFh",
    detectAlignment: true
  },
  fey: {
    label: "DEGRINGO5E.CreatureFey",
    plural: "DEGRINGO5E.CreatureFeyPl",
    icon: "icons/creatures/magical/fae-fairy-winged-glowing-green.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.OFsRUt3pWljgm8VC",
    detectAlignment: true
  },
  fiend: {
    label: "DEGRINGO5E.CreatureFiend",
    plural: "DEGRINGO5E.CreatureFiendPl",
    icon: "icons/magic/death/skull-horned-goat-pentagram-red.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ElHKBJeiJPC7gj6k",
    detectAlignment: true
  },
  giant: {
    label: "DEGRINGO5E.CreatureGiant",
    plural: "DEGRINGO5E.CreatureGiantPl",
    icon: "icons/creatures/magical/humanoid-giant-forest-blue.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.AOXn3Mv5vPZwo0Uf"
  },
  humanoid: {
    label: "DEGRINGO5E.CreatureHumanoid",
    plural: "DEGRINGO5E.CreatureHumanoidPl",
    icon: "icons/environment/people/group.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.iFzQs4AenN8ALRvw"
  },
  monstrosity: {
    label: "DEGRINGO5E.CreatureMonstrosity",
    plural: "DEGRINGO5E.CreatureMonstrosityPl",
    icon: "icons/creatures/abilities/mouth-teeth-rows-red.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.TX0yPEFTn79AMZ8P"
  },
  ooze: {
    label: "DEGRINGO5E.CreatureOoze",
    plural: "DEGRINGO5E.CreatureOozePl",
    icon: "icons/creatures/slimes/slime-movement-pseudopods-green.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.cgzIC1ecG03D97Fg"
  },
  plant: {
    label: "DEGRINGO5E.CreaturePlant",
    plural: "DEGRINGO5E.CreaturePlantPl",
    icon: "icons/magic/nature/tree-animated-strike.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.1oT7t6tHE4kZuSN1"
  },
  undead: {
    label: "DEGRINGO5E.CreatureUndead",
    plural: "DEGRINGO5E.CreatureUndeadPl",
    icon: "icons/magic/death/skull-horned-worn-fire-blue.webp",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.D2BdqS1GeD5rcZ6q",
    detectAlignment: true
  }
};
preLocalize("creatureTypes", { keys: ["label", "plural"], sort: true });

/* -------------------------------------------- */

/**
 * Classification types for item action types.
 * @enum {string}
 */
DEGRINGO5E.itemActionTypes = {
  mwak: "DEGRINGO5E.ActionMWAK",
  rwak: "DEGRINGO5E.ActionRWAK",
  msak: "DEGRINGO5E.ActionMSAK",
  rsak: "DEGRINGO5E.ActionRSAK",
  abil: "DEGRINGO5E.ActionAbil",
  save: "DEGRINGO5E.ActionSave",
  ench: "DEGRINGO5E.ActionEnch",
  summ: "DEGRINGO5E.ActionSumm",
  heal: "DEGRINGO5E.ActionHeal",
  util: "DEGRINGO5E.ActionUtil",
  other: "DEGRINGO5E.ActionOther"
};
preLocalize("itemActionTypes");

/* -------------------------------------------- */

/**
 * Different ways in which item capacity can be limited.
 * @enum {string}
 */
DEGRINGO5E.itemCapacityTypes = {
  items: "DEGRINGO5E.ItemContainerCapacityItems",
  weight: "DEGRINGO5E.ItemContainerCapacityWeight"
};
preLocalize("itemCapacityTypes", { sort: true });

/* -------------------------------------------- */

/**
 * List of various item rarities.
 * @enum {string}
 */
DEGRINGO5E.itemRarity = {
  common: "DEGRINGO5E.ItemRarityCommon",
  uncommon: "DEGRINGO5E.ItemRarityUncommon",
  rare: "DEGRINGO5E.ItemRarityRare",
  veryRare: "DEGRINGO5E.ItemRarityVeryRare",
  legendary: "DEGRINGO5E.ItemRarityLegendary",
  artifact: "DEGRINGO5E.ItemRarityArtifact"
};
preLocalize("itemRarity");

/* -------------------------------------------- */

/**
 * Configuration data for limited use periods.
 *
 * @typedef {object} LimitedUsePeriodConfiguration
 * @property {string} label                Localized label.
 * @property {string}  abbreviation        Shorthand form of the label.
 * @property {"combat"|"special"} [group]  Grouping if outside the normal "time" group.
 * @property {boolean} [formula]           Whether this limited use period restores charges via formula.
 */

/**
 * Enumerate the lengths of time over which an item can have limited use ability.
 * @enum {LimitedUsePeriodConfiguration}
 */
DEGRINGO5E.limitedUsePeriods = {
  lr: {
    label: "DEGRINGO5E.USES.Recovery.Period.LongRest.Label",
    abbreviation: "DEGRINGO5E.USES.Recovery.Period.LongRest.Abbreviation"
  },
  sr: {
    label: "DEGRINGO5E.USES.Recovery.Period.ShortRest.Label",
    abbreviation: "DEGRINGO5E.USES.Recovery.Period.ShortRest.Abbreviation"
  },
  day: {
    label: "DEGRINGO5E.USES.Recovery.Period.Day.Label",
    abbreviation: "DEGRINGO5E.USES.Recovery.Period.Day.Label"
  },
  dawn: {
    label: "DEGRINGO5E.USES.Recovery.Period.Dawn.Label",
    abbreviation: "DEGRINGO5E.USES.Recovery.Period.Dawn.Label",
    formula: true
  },
  dusk: {
    label: "DEGRINGO5E.USES.Recovery.Period.Dusk.Label",
    abbreviation: "DEGRINGO5E.USES.Recovery.Period.Dusk.Label",
    formula: true
  },
  initiative: {
    label: "DEGRINGO5E.USES.Recovery.Period.Initiative.Label",
    abbreviation: "DEGRINGO5E.USES.Recovery.Period.Initiative.Label",
    type: "special"
  },
  turnStart: {
    label: "DEGRINGO5E.USES.Recovery.Period.TurnStart.Label",
    abbreviation: "DEGRINGO5E.USES.Recovery.Period.TurnStart.Abbreviation",
    type: "combat"
  },
  turnEnd: {
    label: "DEGRINGO5E.USES.Recovery.Period.TurnEnd.Label",
    abbreviation: "DEGRINGO5E.USES.Recovery.Period.TurnEnd.Abbreviation",
    type: "combat"
  },
  turn: {
    label: "DEGRINGO5E.USES.Recovery.Period.Turn.Label",
    abbreviation: "DEGRINGO5E.USES.Recovery.Period.Turn.Label",
    type: "combat"
  }
};
preLocalize("limitedUsePeriods", { keys: ["label", "abbreviation"] });

Object.defineProperty(DEGRINGO5E.limitedUsePeriods, "recoveryOptions", {
  get() {
    return [
      ...Object.entries(CONFIG.DEGRINGO5E.limitedUsePeriods)
        .filter(([, config]) => !config.deprecated)
        .map(([value, { label, type }]) => ({
          value, label, group: game.i18n.localize(`DEGRINGO5E.USES.Recovery.${type?.capitalize() ?? "Time"}`)
        })),
      { value: "recharge", label: game.i18n.localize("DEGRINGO5E.USES.Recovery.Recharge.Label") }
    ];
  }
});

/* -------------------------------------------- */

/**
 * Periods at which enchantments can be re-bound to new items.
 * @enum {{ label: string }}
 */
DEGRINGO5E.enchantmentPeriods = {
  sr: {
    label: "DEGRINGO5E.ENCHANTMENT.Period.ShortRest"
  },
  lr: {
    label: "DEGRINGO5E.ENCHANTMENT.Period.LongRest"
  },
  atwill: {
    label: "DEGRINGO5E.ENCHANTMENT.Period.AtWill"
  }
};
preLocalize("enchantmentPeriods", { key: "label" });

/* -------------------------------------------- */

/**
 * Specific equipment types that modify base AC.
 * @enum {string}
 */
DEGRINGO5E.armorTypes = {
  light: "DEGRINGO5E.EquipmentLight",
  medium: "DEGRINGO5E.EquipmentMedium",
  heavy: "DEGRINGO5E.EquipmentHeavy",
  natural: "DEGRINGO5E.EquipmentNatural",
  shield: "DEGRINGO5E.EquipmentShield"
};
preLocalize("armorTypes");

/* -------------------------------------------- */

/**
 * Equipment types that aren't armor.
 * @enum {string}
 */
DEGRINGO5E.miscEquipmentTypes = {
  clothing: "DEGRINGO5E.EQUIPMENT.Type.Clothing.Label",
  ring: "DEGRINGO5E.EQUIPMENT.Type.Ring.Label",
  rod: "DEGRINGO5E.EQUIPMENT.Type.Rod.Label",
  trinket: "DEGRINGO5E.EQUIPMENT.Type.Trinket.Label",
  vehicle: "DEGRINGO5E.EQUIPMENT.Type.Vehicle.Label",
  wand: "DEGRINGO5E.EQUIPMENT.Type.Wand.Label",
  wondrous: "DEGRINGO5E.EQUIPMENT.Type.Wondrous.Label"
};
preLocalize("miscEquipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of equipment types for armor, clothing, and other objects which can be worn by the character.
 * @enum {string}
 */
DEGRINGO5E.equipmentTypes = {
  ...DEGRINGO5E.miscEquipmentTypes,
  ...DEGRINGO5E.armorTypes
};
preLocalize("equipmentTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The various types of vehicles in which characters can be proficient.
 * @enum {string}
 */
DEGRINGO5E.vehicleTypes = {
  air: "DEGRINGO5E.VehicleTypeAir",
  land: "DEGRINGO5E.VehicleTypeLand",
  space: "DEGRINGO5E.VehicleTypeSpace",
  water: "DEGRINGO5E.VehicleTypeWater"
};
preLocalize("vehicleTypes", { sort: true });

/* -------------------------------------------- */

/**
 * The set of Armor Proficiencies which a character may have.
 * @type {object}
 */
DEGRINGO5E.armorProficiencies = {
  lgt: "DEGRINGO5E.ArmorLightProficiency",
  med: "DEGRINGO5E.ArmorMediumProficiency",
  hvy: "DEGRINGO5E.ArmorHeavyProficiency",
  shl: "DEGRINGO5E.EquipmentShieldProficiency"
};
preLocalize("armorProficiencies");

/**
 * A mapping between `DEGRINGO5E.equipmentTypes` and `DEGRINGO5E.armorProficiencies` that
 * is used to determine if character has proficiency when adding an item.
 * @enum {(boolean|string)}
 */
DEGRINGO5E.armorProficienciesMap = {
  natural: true,
  clothing: true,
  light: "lgt",
  medium: "med",
  heavy: "hvy",
  shield: "shl"
};

/**
 * The basic armor types in 5e. This enables specific armor proficiencies,
 * automated AC calculation in NPCs, and starting equipment.
 * @enum {string}
 */
DEGRINGO5E.armorIds = {
  breastplate: "Compendium.degringo5e.equipment24.Item.phbarmBreastplat",
  chainmail: "Compendium.degringo5e.equipment24.Item.phbarmChainMail0",
  chainshirt: "Compendium.degringo5e.equipment24.Item.phbarmChainShirt",
  halfplate: "Compendium.degringo5e.equipment24.Item.phbarmHalfPlateA",
  hide: "Compendium.degringo5e.equipment24.Item.phbarmHideArmor0",
  leather: "Compendium.degringo5e.equipment24.Item.phbarmLeatherArm",
  padded: "Compendium.degringo5e.equipment24.Item.phbarmPaddedArmo",
  plate: "Compendium.degringo5e.equipment24.Item.phbarmPlateArmor",
  ringmail: "Compendium.degringo5e.equipment24.Item.phbarmRingMail00",
  scalemail: "Compendium.degringo5e.equipment24.Item.phbarmScaleMail0",
  splint: "Compendium.degringo5e.equipment24.Item.phbarmSplintArmo",
  studded: "Compendium.degringo5e.equipment24.Item.phbarmStuddedLea"
};

/**
 * The basic shield in 5e.
 * @enum {string}
 */
DEGRINGO5E.shieldIds = {
  shield: "Compendium.degringo5e.equipment24.Item.phbarmShield0000"
};

/**
 * Common armor class calculations.
 * @enum {{ label: string, [formula]: string }}
 */
DEGRINGO5E.armorClasses = {
  flat: {
    label: "DEGRINGO5E.ArmorClassFlat",
    formula: "@attributes.ac.flat"
  },
  natural: {
    label: "DEGRINGO5E.ArmorClassNatural",
    formula: "@attributes.ac.flat"
  },
  default: {
    label: "DEGRINGO5E.ArmorClassEquipment",
    formula: "@attributes.ac.armor + @attributes.ac.dex"
  },
  mage: {
    label: "DEGRINGO5E.ArmorClassMage",
    formula: "13 + @abilities.dex.mod"
  },
  draconic: {
    label: "DEGRINGO5E.ArmorClassDraconic",
    formula: "13 + @abilities.dex.mod"
  },
  unarmoredMonk: {
    label: "DEGRINGO5E.ArmorClassUnarmoredMonk",
    formula: "10 + @abilities.dex.mod + @abilities.wis.mod"
  },
  unarmoredBarb: {
    label: "DEGRINGO5E.ArmorClassUnarmoredBarbarian",
    formula: "10 + @abilities.dex.mod + @abilities.con.mod"
  },
  unarmoredBard: {
    label: "DEGRINGO5E.ArmorClassUnarmoredBard",
    formula: "10 + @abilities.dex.mod + @abilities.cha.mod"
  },
  custom: {
    label: "DEGRINGO5E.ArmorClassCustom"
  }
};
preLocalize("armorClasses", { key: "label" });

/* -------------------------------------------- */

/**
 * Configuration data for an items that have sub-types.
 *
 * @typedef {object} SubtypeTypeConfiguration
 * @property {string} label                       Localized label for this type.
 * @property {Record<string, string>} [subtypes]  Enum containing localized labels for subtypes.
 */

/**
 * Enumerate the valid consumable types which are recognized by the system.
 * @enum {SubtypeTypeConfiguration}
 */
DEGRINGO5E.consumableTypes = {
  ammo: {
    label: "DEGRINGO5E.CONSUMABLE.Type.Ammunition.Label",
    subtypes: {
      arrow: "DEGRINGO5E.CONSUMABLE.Type.Ammunition.Arrow",
      crossbowBolt: "DEGRINGO5E.CONSUMABLE.Type.Ammunition.Bolt",
      energyCell: "DEGRINGO5E.CONSUMABLE.Type.Ammunition.EnergyCell",
      firearmBullet: "DEGRINGO5E.CONSUMABLE.Type.Ammunition.BulletFirearm",
      slingBullet: "DEGRINGO5E.CONSUMABLE.Type.Ammunition.BulletSling",
      blowgunNeedle: "DEGRINGO5E.CONSUMABLE.Type.Ammunition.Needle"
    }
  },
  potion: {
    label: "DEGRINGO5E.CONSUMABLE.Type.Potion.Label"
  },
  poison: {
    label: "DEGRINGO5E.CONSUMABLE.Type.Poison.Label",
    subtypes: {
      contact: "DEGRINGO5E.CONSUMABLE.Type.Poison.Contact",
      ingested: "DEGRINGO5E.CONSUMABLE.Type.Poison.Ingested",
      inhaled: "DEGRINGO5E.CONSUMABLE.Type.Poison.Inhaled",
      injury: "DEGRINGO5E.CONSUMABLE.Type.Poison.Injury"
    }
  },
  food: {
    label: "DEGRINGO5E.CONSUMABLE.Type.Food.Label"
  },
  scroll: {
    label: "DEGRINGO5E.CONSUMABLE.Type.Scroll.Label"
  },
  wand: {
    label: "DEGRINGO5E.CONSUMABLE.Type.Wand.Label"
  },
  rod: {
    label: "DEGRINGO5E.CONSUMABLE.Type.Rod.Label"
  },
  trinket: {
    label: "DEGRINGO5E.CONSUMABLE.Type.Trinket.Label"
  }
};
preLocalize("consumableTypes", { key: "label", sort: true });
preLocalize("consumableTypes.ammo.subtypes", { sort: true });
preLocalize("consumableTypes.poison.subtypes", { sort: true });

/* -------------------------------------------- */

/**
 * Types of containers.
 * @enum {string}
 */
DEGRINGO5E.containerTypes = {
  backpack: "H8YCd689ezlD26aT",
  barrel: "7Yqbqg5EtVW16wfT",
  basket: "Wv7HzD6dv1P0q78N",
  boltcase: "eJtPBiZtr2pp6ynt",
  bottle: "HZp69hhyNZUUCipF",
  bucket: "mQVYcHmMSoCUnBnM",
  case: "5mIeX824uMklU3xq",
  chest: "2YbuclKfhDL0bU4u",
  flask: "lHS63sC6bypENNlR",
  jug: "0ZBWwjFz3nIAXMLW",
  pot: "M8xM8BLK4tpUayEE",
  pitcher: "nXWdGtzi8DXDLLsL",
  pouch: "9bWTRRDym06PzSAf",
  quiver: "4MtQKPn9qMWCFjDA",
  sack: "CNdDj8dsXVpRVpXt",
  saddlebags: "TmfaFUSZJAotndn9",
  tankard: "uw6fINSmZ2j2o57A",
  vial: "meJEfX3gZgtMX4x2"
};

/* -------------------------------------------- */

/**
 * Configuration data for spellcasting foci.
 *
 * @typedef {object} SpellcastingFocusConfiguration
 * @property {string} label                    Localized label for this category.
 * @property {Object<string, string>} itemIds  Item IDs or UUIDs.
 */

/**
 * Type of spellcasting foci.
 * @enum {SpellcastingFocusConfiguration}
 */
DEGRINGO5E.focusTypes = {
  arcane: {
    label: "DEGRINGO5E.Focus.Arcane",
    itemIds: {
      crystal: "Compendium.degringo5e.equipment24.Item.phbafcCrystal000",
      orb: "Compendium.degringo5e.equipment24.Item.phbafcOrb0000000",
      rod: "Compendium.degringo5e.equipment24.Item.phbafcRod0000000",
      staff: "Compendium.degringo5e.equipment24.Item.phbafcStaffalsoa",
      wand: "Compendium.degringo5e.equipment24.Item.phbafcWand000000"
    }
  },
  druidic: {
    label: "DEGRINGO5E.Focus.Druidic",
    itemIds: {
      mistletoe: "Compendium.degringo5e.equipment24.Item.phbdfcSprigofmis",
      woodenstaff: "Compendium.degringo5e.equipment24.Item.phbdfcWoodenstaf",
      yewwand: "Compendium.degringo5e.equipment24.Item.phbdfcYewwand000"
    }
  },
  holy: {
    label: "DEGRINGO5E.Focus.Holy",
    itemIds: {
      amulet: "Compendium.degringo5e.equipment24.Item.phbhsyAmuletworn",
      emblem: "Compendium.degringo5e.equipment24.Item.phbhsyEmblemborn",
      reliquary: "Compendium.degringo5e.equipment24.Item.phbhsyReliquaryh"
    }
  }
};
preLocalize("focusTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Types of "features" items.
 * @enum {SubtypeTypeConfiguration}
 */
DEGRINGO5E.featureTypes = {
  background: {
    label: "DEGRINGO5E.Feature.Background"
  },
  class: {
    label: "DEGRINGO5E.Feature.Class.Label",
    subtypes: {
      arcaneShot: "DEGRINGO5E.Feature.Class.ArcaneShot",
      artificerInfusion: "DEGRINGO5E.Feature.Class.ArtificerInfusion",
      channelDivinity: "DEGRINGO5E.Feature.Class.ChannelDivinity",
      defensiveTactic: "DEGRINGO5E.Feature.Class.DefensiveTactic",
      eldritchInvocation: "DEGRINGO5E.Feature.Class.EldritchInvocation",
      elementalDiscipline: "DEGRINGO5E.Feature.Class.ElementalDiscipline",
      fightingStyle: "DEGRINGO5E.Feature.Class.FightingStyle",
      huntersPrey: "DEGRINGO5E.Feature.Class.HuntersPrey",
      ki: "DEGRINGO5E.Feature.Class.Ki",
      maneuver: "DEGRINGO5E.Feature.Class.Maneuver",
      metamagic: "DEGRINGO5E.Feature.Class.Metamagic",
      multiattack: "DEGRINGO5E.Feature.Class.Multiattack",
      pact: "DEGRINGO5E.Feature.Class.PactBoon",
      psionicPower: "DEGRINGO5E.Feature.Class.PsionicPower",
      rune: "DEGRINGO5E.Feature.Class.Rune",
      superiorHuntersDefense: "DEGRINGO5E.Feature.Class.SuperiorHuntersDefense"
    }
  },
  monster: {
    label: "DEGRINGO5E.Feature.Monster"
  },
  race: {
    label: "DEGRINGO5E.Feature.Species"
  },
  enchantment: {
    label: "DEGRINGO5E.ENCHANTMENT.Label",
    subtypes: {
      artificerInfusion: "DEGRINGO5E.Feature.Class.ArtificerInfusion",
      rune: "DEGRINGO5E.Feature.Class.Rune"
    }
  },
  feat: {
    label: "DEGRINGO5E.Feature.Feat.Label",
    subtypes: {
      general: "DEGRINGO5E.Feature.Feat.General",
      origin: "DEGRINGO5E.Feature.Feat.Origin",
      fightingStyle: "DEGRINGO5E.Feature.Feat.FightingStyle",
      epicBoon: "DEGRINGO5E.Feature.Feat.EpicBoon"
    }
  },
  supernaturalGift: {
    label: "DEGRINGO5E.Feature.SupernaturalGift.Label",
    subtypes: {
      blessing: "DEGRINGO5E.Feature.SupernaturalGift.Blessing",
      charm: "DEGRINGO5E.Feature.SupernaturalGift.Charm",
      epicBoon: "DEGRINGO5E.Feature.SupernaturalGift.EpicBoon"
    }
  },
  vehicle: {
    label: "DEGRINGO5E.Feature.Vehicle.Label"
  }
};
preLocalize("featureTypes", { key: "label" });
preLocalize("featureTypes.class.subtypes", { sort: true });
preLocalize("featureTypes.enchantment.subtypes", { sort: true });
preLocalize("featureTypes.feat.subtypes", { sort: true });
preLocalize("featureTypes.supernaturalGift.subtypes", { sort: true });

/* -------------------------------------------- */

/**
 * Configuration data for item properties.
 *
 * @typedef {object} ItemPropertyConfiguration
 * @property {string} label           Localized label.
 * @property {string} [abbreviation]  Localized abbreviation.
 * @property {string} [icon]          Icon that can be used in certain places to represent this property.
 * @property {string} [reference]     Reference to a rule page describing this property.
 * @property {boolean} [isPhysical]   Is this property one that can cause damage resistance bypasses?
 * @property {boolean} [isTag]        Is this spell property a tag, rather than a component?
 */

/**
 * The various properties of all item types.
 * @enum {ItemPropertyConfiguration}
 */
DEGRINGO5E.itemProperties = {
  ada: {
    label: "DEGRINGO5E.ITEM.Property.Adamantine",
    isPhysical: true
  },
  amm: {
    label: "DEGRINGO5E.ITEM.Property.Ammunition"
  },
  concentration: {
    label: "DEGRINGO5E.ITEM.Property.Concentration",
    abbreviation: "DEGRINGO5E.ConcentrationAbbr",
    icon: "systems/degringo5e/icons/svg/statuses/concentrating.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.ow58p27ctAnr4VPH",
    isTag: true
  },
  fin: {
    label: "DEGRINGO5E.ITEM.Property.Finesse"
  },
  fir: {
    label: "DEGRINGO5E.ITEM.Property.Firearm"
  },
  foc: {
    label: "DEGRINGO5E.ITEM.Property.Focus"
  },
  hvy: {
    label: "DEGRINGO5E.ITEM.Property.Heavy"
  },
  lgt: {
    label: "DEGRINGO5E.ITEM.Property.Light"
  },
  lod: {
    label: "DEGRINGO5E.ITEM.Property.Loading"
  },
  material: {
    label: "DEGRINGO5E.ITEM.Property.Material",
    abbreviation: "DEGRINGO5E.ComponentMaterialAbbr",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.AeH5eDS4YeM9RETC"
  },
  mgc: {
    label: "DEGRINGO5E.ITEM.Property.Magical",
    icon: "systems/degringo5e/icons/svg/properties/magical.svg",
    isPhysical: true
  },
  rch: {
    label: "DEGRINGO5E.ITEM.Property.Reach"
  },
  rel: {
    label: "DEGRINGO5E.ITEM.Property.Reload"
  },
  ret: {
    label: "DEGRINGO5E.ITEM.Property.Returning"
  },
  ritual: {
    label: "DEGRINGO5E.ITEM.Property.Ritual",
    abbreviation: "DEGRINGO5E.RitualAbbr",
    icon: "systems/degringo5e/icons/svg/items/spell.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.FjWqT5iyJ89kohdA",
    isTag: true
  },
  sidekick: {
    label: "DEGRINGO5E.ITEM.Property.Sidekick"
  },
  sil: {
    label: "DEGRINGO5E.ITEM.Property.Silvered",
    isPhysical: true
  },
  somatic: {
    label: "DEGRINGO5E.ITEM.Property.Somatic",
    abbreviation: "DEGRINGO5E.ComponentSomaticAbbr",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.qwUNgUNilEmZkSC9"
  },
  spc: {
    label: "DEGRINGO5E.ITEM.Property.Special"
  },
  stealthDisadvantage: {
    label: "DEGRINGO5E.ITEM.Property.StealthDisadvantage"
  },
  thr: {
    label: "DEGRINGO5E.ITEM.Property.Thrown"
  },
  trait: {
    label: "DEGRINGO5E.ITEM.Property.Trait"
  },
  two: {
    label: "DEGRINGO5E.ITEM.Property.TwoHanded"
  },
  ver: {
    label: "DEGRINGO5E.ITEM.Property.Versatile"
  },
  vocal: {
    label: "DEGRINGO5E.ITEM.Property.Verbal",
    abbreviation: "DEGRINGO5E.ComponentVerbalAbbr",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6UXTNWMCQ0nSlwwx"
  },
  weightlessContents: {
    label: "DEGRINGO5E.ITEM.Property.WeightlessContents"
  }
};
preLocalize("itemProperties", { keys: ["label", "abbreviation"], sort: true });

/* -------------------------------------------- */

/**
 * The various properties of an item per item type.
 * @enum {object}
 */
DEGRINGO5E.validProperties = {
  class: new Set([
    "sidekick"
  ]),
  consumable: new Set([
    "mgc"
  ]),
  container: new Set([
    "mgc",
    "weightlessContents"
  ]),
  equipment: new Set([
    "ada",
    "foc",
    "mgc",
    "stealthDisadvantage"
  ]),
  feat: new Set([
    "mgc",
    "trait"
  ]),
  loot: new Set([
    "mgc"
  ]),
  weapon: new Set([
    "ada",
    "amm",
    "fin",
    "fir",
    "foc",
    "hvy",
    "lgt",
    "lod",
    "mgc",
    "rch",
    "rel",
    "ret",
    "sil",
    "spc",
    "thr",
    "two",
    "ver"
  ]),
  spell: new Set([
    "vocal",
    "somatic",
    "material",
    "concentration",
    "ritual"
  ]),
  tool: new Set([
    "mgc"
  ])
};

/* -------------------------------------------- */

/**
 * Configuration data for an item with the "loot" type.
 *
 * @typedef {object} LootTypeConfiguration
 * @property {string} label                       Localized label for this type.
 */

/**
 * Types of "loot" items.
 * @enum {LootTypeConfiguration}
 */
DEGRINGO5E.lootTypes = {
  art: {
    label: "DEGRINGO5E.Loot.Art"
  },
  gear: {
    label: "DEGRINGO5E.Loot.Gear"
  },
  gem: {
    label: "DEGRINGO5E.Loot.Gem"
  },
  junk: {
    label: "DEGRINGO5E.Loot.Junk"
  },
  material: {
    label: "DEGRINGO5E.Loot.Material"
  },
  resource: {
    label: "DEGRINGO5E.Loot.Resource"
  },
  treasure: {
    label: "DEGRINGO5E.Loot.Treasure"
  }
};
preLocalize("lootTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * @typedef {object} CurrencyConfiguration
 * @property {string} label         Localized label for the currency.
 * @property {string} abbreviation  Localized abbreviation for the currency.
 * @property {number} conversion    Number by which this currency should be multiplied to arrive at a standard value.
 * @property {string} icon          Icon representing the currency in the interface.
 */

/**
 * The valid currency denominations with localized labels, abbreviations, and conversions.
 * The conversion number defines how many of that currency are equal to one GP.
 * @enum {CurrencyConfiguration}
 */
DEGRINGO5E.currencies = {
  pp: {
    label: "DEGRINGO5E.CurrencyPP",
    abbreviation: "DEGRINGO5E.CurrencyAbbrPP",
    conversion: 0.1,
    icon: "systems/degringo5e/icons/currency/platinum.webp"
  },
  gp: {
    label: "DEGRINGO5E.CurrencyGP",
    abbreviation: "DEGRINGO5E.CurrencyAbbrGP",
    conversion: 1,
    icon: "systems/degringo5e/icons/currency/gold.webp"
  },
  ep: {
    label: "DEGRINGO5E.CurrencyEP",
    abbreviation: "DEGRINGO5E.CurrencyAbbrEP",
    conversion: 2,
    icon: "systems/degringo5e/icons/currency/electrum.webp"
  },
  sp: {
    label: "DEGRINGO5E.CurrencySP",
    abbreviation: "DEGRINGO5E.CurrencyAbbrSP",
    conversion: 10,
    icon: "systems/degringo5e/icons/currency/silver.webp"
  },
  cp: {
    label: "DEGRINGO5E.CurrencyCP",
    abbreviation: "DEGRINGO5E.CurrencyAbbrCP",
    conversion: 100,
    icon: "systems/degringo5e/icons/currency/copper.webp"
  }
};
preLocalize("currencies", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * @typedef CraftingConfiguration
 * @property {CraftingCostsMultiplier} consumable        Discounts for crafting a magical consumable.
 * @property {Record<string, CraftingCosts>} exceptions  Crafting costs for items that are exception to the general
 *                                                       crafting rules, by identifier.
 * @property {Record<string, CraftingCosts>} magic       Magic item crafting costs by rarity.
 * @property {CraftingCostsMultiplier} mundane           Multipliers for crafting mundane items.
 * @property {Record<number, CraftingCosts>} scrolls     Crafting costs for spell scrolls by level.
 */

/**
 * @typedef CraftingCostsMultiplier
 * @property {number} days  The days multiplier.
 * @property {number} gold  The gold multiplier.
 */

/**
 * @typedef CraftingCosts
 * @property {number} days  The number of days required to craft the item, not including its base item.
 * @property {number} gold  The amount of gold required for the raw materials, not including the base item.
 */

/**
 * Configuration data for crafting costs.
 * @type {CraftingConfiguration}
 */
DEGRINGO5E.crafting = {
  consumable: {
    days: .5,
    gold: .5
  },
  exceptions: {
    "potion-of-healing": {
      days: 1,
      gold: 25
    }
  },
  magic: {
    common: {
      days: 5,
      gold: 50
    },
    uncommon: {
      days: 10,
      gold: 200
    },
    rare: {
      days: 50,
      gold: 2_000
    },
    veryRare: {
      days: 125,
      gold: 20_000
    },
    legendary: {
      days: 250,
      gold: 100_000
    }
  },
  mundane: {
    days: .1,
    gold: .5
  },
  scrolls: {
    0: {
      days: 1,
      gold: 15
    },
    1: {
      days: 1,
      gold: 25
    },
    2: {
      days: 3,
      gold: 100
    },
    3: {
      days: 5,
      gold: 150
    },
    4: {
      days: 10,
      gold: 1_000
    },
    5: {
      days: 25,
      gold: 1_500
    },
    6: {
      days: 40,
      gold: 10_000
    },
    7: {
      days: 50,
      gold: 12_500
    },
    8: {
      days: 60,
      gold: 15_000
    },
    9: {
      days: 120,
      gold: 50_000
    }
  }
};

/* -------------------------------------------- */
/*  Damage                                      */
/* -------------------------------------------- */

/**
 * Standard dice spread available for things like damage.
 * @type {number[]}
 */
DEGRINGO5E.dieSteps = [4, 6, 8, 10, 12, 20, 100];

/* -------------------------------------------- */

/**
 * Methods by which damage scales relative to the overall scaling increase.
 * @enum {{ label: string, labelCantrip: string }}
 */
DEGRINGO5E.damageScalingModes = {
  whole: {
    label: "DEGRINGO5E.DAMAGE.Scaling.Whole",
    labelCantrip: "DEGRINGO5E.DAMAGE.Scaling.WholeCantrip"
  },
  half: {
    label: "DEGRINGO5E.DAMAGE.Scaling.Half",
    labelCantrip: "DEGRINGO5E.DAMAGE.Scaling.HalfCantrip"
  }
};
preLocalize("damageScalingModes", { keys: ["label", "labelCantrip"] });

/* -------------------------------------------- */

/**
 * Configuration data for damage types.
 *
 * @typedef {object} DamageTypeConfiguration
 * @property {string} label          Localized label.
 * @property {string} icon           Icon representing this type.
 * @property {boolean} [isPhysical]  Is this a type that can be bypassed by magical or silvered weapons?
 * @property {string} [reference]    Reference to a rule page describing this damage type.
 * @property {Color} [color]         Visual color of the damage type.
 */

/**
 * Types of damage the can be caused by abilities.
 * @enum {DamageTypeConfiguration}
 */
DEGRINGO5E.damageTypes = {
  acid: {
    label: "DEGRINGO5E.DamageAcid",
    icon: "systems/degringo5e/icons/svg/damage/acid.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.IQhbKRPe1vCPdh8v",
    color: new Color(0x839D50)
  },
  bludgeoning: {
    label: "DEGRINGO5E.DamageBludgeoning",
    icon: "systems/degringo5e/icons/svg/damage/bludgeoning.svg",
    isPhysical: true,
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.39LFrlef94JIYO8m",
    color: new Color(0x0000A0)
  },
  cold: {
    label: "DEGRINGO5E.DamageCold",
    icon: "systems/degringo5e/icons/svg/damage/cold.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.4xsFUooHDEdfhw6g",
    color: new Color(0xADD8E6)
  },
  fire: {
    label: "DEGRINGO5E.DamageFire",
    icon: "systems/degringo5e/icons/svg/damage/fire.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.f1S66aQJi4PmOng6",
    color: new Color(0xFF4500)
  },
  force: {
    label: "DEGRINGO5E.DamageForce",
    icon: "systems/degringo5e/icons/svg/damage/force.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.eFTWzngD8dKWQuUR",
    color: new Color(0x800080)
  },
  lightning: {
    label: "DEGRINGO5E.DamageLightning",
    icon: "systems/degringo5e/icons/svg/damage/lightning.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.9SaxFJ9bM3SutaMC",
    color: new Color(0x1E90FF)
  },
  necrotic: {
    label: "DEGRINGO5E.DamageNecrotic",
    icon: "systems/degringo5e/icons/svg/damage/necrotic.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.klOVUV5G1U7iaKoG",
    color: new Color(0x006400)
  },
  piercing: {
    label: "DEGRINGO5E.DamagePiercing",
    icon: "systems/degringo5e/icons/svg/damage/piercing.svg",
    isPhysical: true,
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.95agSnEGTdAmKhyC",
    color: new Color(0xC0C0C0)
  },
  poison: {
    label: "DEGRINGO5E.DamagePoison",
    icon: "systems/degringo5e/icons/svg/damage/poison.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.k5wOYXdWPzcWwds1",
    color: new Color(0x8A2BE2)
  },
  psychic: {
    label: "DEGRINGO5E.DamagePsychic",
    icon: "systems/degringo5e/icons/svg/damage/psychic.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.YIKbDv4zYqbE5teJ",
    color: new Color(0xFF1493)
  },
  radiant: {
    label: "DEGRINGO5E.DamageRadiant",
    icon: "systems/degringo5e/icons/svg/damage/radiant.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.5tcK9buXWDOw8yHH",
    color: new Color(0xFFD700)
  },
  slashing: {
    label: "DEGRINGO5E.DamageSlashing",
    icon: "systems/degringo5e/icons/svg/damage/slashing.svg",
    isPhysical: true,
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.sz2XKQ5lgsdPEJOa",
    color: new Color(0x8B0000)
  },
  thunder: {
    label: "DEGRINGO5E.DamageThunder",
    icon: "systems/degringo5e/icons/svg/damage/thunder.svg",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.iqsmMHk7FSpiNkQy",
    color: new Color(0x708090)
  }
};
preLocalize("damageTypes", { keys: ["label"], sort: true });

/* -------------------------------------------- */

/**
 * Display aggregated damage in chat cards.
 * @type {boolean}
 */
DEGRINGO5E.aggregateDamageDisplay = true;

/* -------------------------------------------- */
/*  Movement                                    */
/* -------------------------------------------- */

/**
 * Different types of healing that can be applied using abilities.
 * @enum {string}
 */
DEGRINGO5E.healingTypes = {
  healing: {
    label: "DEGRINGO5E.Healing",
    icon: "systems/degringo5e/icons/svg/damage/healing.svg",
    color: new Color(0x46C252)
  },
  temphp: {
    label: "DEGRINGO5E.HealingTemp",
    icon: "systems/degringo5e/icons/svg/damage/temphp.svg",
    color: new Color(0x4B66DE)
  }
};
preLocalize("healingTypes", { keys: ["label"] });

/* -------------------------------------------- */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
DEGRINGO5E.movementTypes = {
  burrow: "DEGRINGO5E.MovementBurrow",
  climb: "DEGRINGO5E.MovementClimb",
  fly: "DEGRINGO5E.MovementFly",
  swim: "DEGRINGO5E.MovementSwim",
  walk: "DEGRINGO5E.MovementWalk"
};
preLocalize("movementTypes", { sort: true });

/* -------------------------------------------- */
/*  Measurement                                 */
/* -------------------------------------------- */

/**
 * Default units used for imperial & metric settings.
 * @enum {{ imperial: string, metric: string }}
 */
DEGRINGO5E.defaultUnits = {
  length: {
    imperial: "ft",
    metric: "m"
  },
  volume: {
    imperial: "cubicFoot",
    metric: "liter"
  },
  weight: {
    imperial: "lb",
    metric: "kg"
  }
};

/* -------------------------------------------- */

/**
 * @typedef {object} UnitConfiguration
 * @property {string} label              Localized label for the unit.
 * @property {string} abbreviation       Localized abbreviation for the unit.
 * @property {number} conversion         Multiplier used to convert between various units.
 * @property {string} [counted]          Localization path for counted plural forms in various unit display modes.
 *                                       Only necessary if non-supported unit or using a non-standard name for a
 *                                       supported unit.
 * @property {string} [formattingUnit]   Unit formatting value as supported by javascript's internationalization system:
 *                                       https://tc39.es/ecma402/#table-sanctioned-single-unit-identifiers. Only
 *                                       required if the formatting name doesn't match the unit key.
 * @property {"imperial"|"metric"} type  Whether this is an "imperial" or "metric" unit.
 */

/**
 * The valid units of measure for movement distances in the game system.
 * By default this uses the imperial units of feet and miles.
 * @enum {string}
 */
DEGRINGO5E.movementUnits = {
  ft: {
    label: "DEGRINGO5E.UNITS.DISTANCE.Foot.Label",
    abbreviation: "DEGRINGO5E.UNITS.DISTANCE.Foot.Abbreviation",
    conversion: 1,
    formattingUnit: "foot",
    type: "imperial"
  },
  mi: {
    label: "DEGRINGO5E.UNITS.DISTANCE.Mile.Label",
    abbreviation: "DEGRINGO5E.UNITS.DISTANCE.Mile.Abbreviation",
    conversion: 5_280,
    formattingUnit: "mile",
    type: "imperial"
  },
  m: {
    label: "DEGRINGO5E.UNITS.DISTANCE.Meter.Label",
    abbreviation: "DEGRINGO5E.UNITS.DISTANCE.Meter.Abbreviation",
    conversion: 10 / 3, // D&D uses a simplified 5ft -> 1.5m conversion.
    formattingUnit: "meter",
    type: "metric"
  },
  km: {
    label: "DEGRINGO5E.UNITS.DISTANCE.Kilometer.Label",
    abbreviation: "DEGRINGO5E.UNITS.DISTANCE.Kilometer.Abbreviation",
    conversion: 10_000 / 3, // Matching simplified conversion
    formattingUnit: "kilometer",
    type: "metric"
  }
};
preLocalize("movementUnits", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * The types of range that are used for measuring actions and effects.
 * @enum {string}
 */
DEGRINGO5E.rangeTypes = {
  self: "DEGRINGO5E.DistSelf",
  touch: "DEGRINGO5E.DistTouch",
  spec: "DEGRINGO5E.Special",
  any: "DEGRINGO5E.DistAny"
};
preLocalize("rangeTypes");

/* -------------------------------------------- */

/**
 * The valid units of measure for the range of an action or effect. A combination of `DEGRINGO5E.movementUnits` and
 * `DEGRINGO5E.rangeUnits`.
 * @enum {string}
 */
DEGRINGO5E.distanceUnits = {
  ...Object.fromEntries(Object.entries(DEGRINGO5E.movementUnits).map(([k, { label }]) => [k, label])),
  ...DEGRINGO5E.rangeTypes
};
preLocalize("distanceUnits");

/* -------------------------------------------- */

/**
 * The valid units for measurement of volume.
 * @enum {UnitConfiguration}
 */
DEGRINGO5E.volumeUnits = {
  cubicFoot: {
    label: "DEGRINGO5E.UNITS.VOLUME.CubicFoot.Label",
    abbreviation: "DEGRINGO5E.UNITS.Volume.CubicFoot.Abbreviation",
    counted: "DEGRINGO5E.UNITS.Volume.CubicFoot.Counted",
    conversion: 1,
    type: "imperial"
  },
  liter: {
    label: "DEGRINGO5E.UNITS.VOLUME.Liter.Label",
    abbreviation: "DEGRINGO5E.UNITS.Volume.Liter.Abbreviation",
    conversion: 1 / 28.317,
    type: "metric"
  }
};
preLocalize("volumeUnits", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * The valid units for measurement of weight.
 * @enum {UnitConfiguration}
 */
DEGRINGO5E.weightUnits = {
  lb: {
    label: "DEGRINGO5E.UNITS.WEIGHT.Pound.Label",
    abbreviation: "DEGRINGO5E.UNITS.WEIGHT.Pound.Abbreviation",
    conversion: 1,
    formattingUnit: "pound",
    type: "imperial"
  },
  tn: {
    label: "DEGRINGO5E.UNITS.WEIGHT.Ton.Label",
    abbreviation: "DEGRINGO5E.UNITS.WEIGHT.Ton.Abbreviation",
    counted: "DEGRINGO5E.UNITS.WEIGHT.Ton.Counted",
    conversion: 2000,
    type: "imperial"
  },
  kg: {
    label: "DEGRINGO5E.UNITS.WEIGHT.Kilogram.Label",
    abbreviation: "DEGRINGO5E.UNITS.WEIGHT.Kilogram.Abbreviation",
    conversion: 2.5,
    formattingUnit: "kilogram",
    type: "metric"
  },
  Mg: {
    label: "DEGRINGO5E.UNITS.WEIGHT.Megagram.Label",
    abbreviation: "DEGRINGO5E.UNITS.WEIGHT.Megagram.Abbreviation",
    counted: "DEGRINGO5E.UNITS.WEIGHT.Megagram.Counted",
    conversion: 2500,
    type: "metric"
  }
};
preLocalize("weightUnits", { keys: ["label", "abbreviation"] });

/* -------------------------------------------- */

/**
 * Encumbrance configuration data.
 *
 * @typedef {object} EncumbranceConfiguration
 * @property {Record<string, number>} currencyPerWeight  Pieces of currency that equal a base weight (lbs or kgs).
 * @property {Record<string, object>} effects            Data used to create encumbrance-related Active Effects.
 * @property {object} threshold                          Amount to multiply strength to get given capacity threshold.
 * @property {Record<string, number>} threshold.encumbered
 * @property {Record<string, number>} threshold.heavilyEncumbered
 * @property {Record<string, number>} threshold.maximum
 * @property {Record<string, {ft: number, m: number}>} speedReduction  Speed reduction caused by encumbered status.
 * @property {Record<string, number>} vehicleWeightMultiplier  Multiplier used to determine vehicle carrying capacity.
 * @property {Record<string, Record<string, string>>} baseUnits  Base units used to calculate carrying weight.
 */

/**
 * Configure aspects of encumbrance calculation so that it could be configured by modules.
 * @type {EncumbranceConfiguration}
 */
DEGRINGO5E.encumbrance = {
  currencyPerWeight: {
    imperial: 50,
    metric: 110
  },
  effects: {
    encumbered: {
      name: "EFFECT.DEGRINGO5E.StatusEncumbered",
      img: "systems/degringo5e/icons/svg/statuses/encumbered.svg"
    },
    heavilyEncumbered: {
      name: "EFFECT.DEGRINGO5E.StatusHeavilyEncumbered",
      img: "systems/degringo5e/icons/svg/statuses/heavily-encumbered.svg"
    },
    exceedingCarryingCapacity: {
      name: "EFFECT.DEGRINGO5E.StatusExceedingCarryingCapacity",
      img: "systems/degringo5e/icons/svg/statuses/exceeding-carrying-capacity.svg"
    }
  },
  threshold: {
    encumbered: {
      imperial: 5,
      metric: 2.5
    },
    heavilyEncumbered: {
      imperial: 10,
      metric: 5
    },
    maximum: {
      imperial: 15,
      metric: 7.5
    }
  },
  speedReduction: {
    encumbered: {
      ft: 10,
      m: 3
    },
    heavilyEncumbered: {
      ft: 20,
      m: 6
    },
    exceedingCarryingCapacity: {
      ft: 5,
      m: 1.5
    }
  },
  baseUnits: {
    default: {
      imperial: "lb",
      metric: "kg"
    },
    vehicle: {
      imperial: "tn",
      metric: "Mg"
    }
  }
};
preLocalize("encumbrance.effects", { key: "name" });

/* -------------------------------------------- */
/*  Targeting                                   */
/* -------------------------------------------- */

/**
 * @typedef {object} IndividualTargetDefinition
 * @property {string} label           Localized label for this type.
 * @property {string} [counted]       Localization path for counted plural forms. Only necessary for scalar types.
 * @property {boolean} [scalar=true]  Can this target take an associated numeric value?
 */

/**
 * Targeting types that apply to one or more distinct targets.
 * @enum {IndividualTargetDefinition}
 */
DEGRINGO5E.individualTargetTypes = {
  self: {
    label: "DEGRINGO5E.TARGET.Type.Self.Label",
    scalar: false
  },
  ally: {
    label: "DEGRINGO5E.TARGET.Type.Ally.Label",
    counted: "DEGRINGO5E.TARGET.Type.Ally.Counted"
  },
  enemy: {
    label: "DEGRINGO5E.TARGET.Type.Enemy.Label",
    counted: "DEGRINGO5E.TARGET.Type.Enemy.Counted"
  },
  creature: {
    label: "DEGRINGO5E.TARGET.Type.Creature.Label",
    counted: "DEGRINGO5E.TARGET.Type.Creature.Counted"
  },
  object: {
    label: "DEGRINGO5E.TARGET.Type.Object.Label",
    counted: "DEGRINGO5E.TARGET.Type.Object.Counted"
  },
  space: {
    label: "DEGRINGO5E.TARGET.Type.Space.Label",
    counted: "DEGRINGO5E.TARGET.Type.Space.Counted"
  },
  creatureOrObject: {
    label: "DEGRINGO5E.TARGET.Type.CreatureOrObject.Label",
    counted: "DEGRINGO5E.TARGET.Type.CreatureOrObject.Counted"
  },
  any: {
    label: "DEGRINGO5E.TARGET.Type.Any.Label",
    counted: "DEGRINGO5E.TARGET.Type.Target.Counted"
  },
  willing: {
    label: "DEGRINGO5E.TARGET.Type.WillingCreature.Label",
    counted: "DEGRINGO5E.TARGET.Type.WillingCreature.Counted"
  }
};
preLocalize("individualTargetTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * Information needed to represent different area of effect target types.
 *
 * @typedef {object} AreaTargetDefinition
 * @property {string} label        Localized label for this type.
 * @property {string} counted      Localization path for counted plural forms.
 * @property {string} template     Type of `MeasuredTemplate` create for this target type.
 * @property {string} [reference]  Reference to a rule page describing this area of effect.
 * @property {string[]} [sizes]    List of available sizes for this template. Options are chosen from the list:
 *                                 "radius", "width", "height", "length", "thickness". No more than 3 dimensions
 *                                 may be specified.
 * @property {boolean} [standard]  Is this a standard area of effect as defined explicitly by the rules?
 */

/**
 * Targeting types that cover an area.
 * @enum {AreaTargetDefinition}
 */
DEGRINGO5E.areaTargetTypes = {
  circle: {
    label: "DEGRINGO5E.TARGET.Type.Circle.Label",
    counted: "DEGRINGO5E.TARGET.Type.Circle.Counted",
    template: "circle",
    sizes: ["radius"]
  },
  cone: {
    label: "DEGRINGO5E.TARGET.Type.Cone.Label",
    counted: "DEGRINGO5E.TARGET.Type.Cone.Counted",
    template: "cone",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.DqqAOr5JnX71OCOw",
    sizes: ["length"],
    standard: true
  },
  cube: {
    label: "DEGRINGO5E.TARGET.Type.Cube.Label",
    counted: "DEGRINGO5E.TARGET.Type.Cube.Counted",
    template: "rect",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.dRfDIwuaHmUQ06uA",
    sizes: ["width"],
    standard: true
  },
  cylinder: {
    label: "DEGRINGO5E.TARGET.Type.Cylinder.Label",
    counted: "DEGRINGO5E.TARGET.Type.Cylinder.Counted",
    template: "circle",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.jZFp4R7tXsIqkiG3",
    sizes: ["radius", "height"],
    standard: true
  },
  line: {
    label: "DEGRINGO5E.TARGET.Type.Line.Label",
    counted: "DEGRINGO5E.TARGET.Type.Line.Counted",
    template: "ray",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.6DOoBgg7okm9gBc6",
    sizes: ["length", "width"],
    standard: true
  },
  radius: {
    label: "DEGRINGO5E.TARGET.Type.Emanation.Label",
    counted: "DEGRINGO5E.TARGET.Type.Emanation.Counted",
    template: "circle",
    standard: true
  },
  sphere: {
    label: "DEGRINGO5E.TARGET.Type.Sphere.Label",
    counted: "DEGRINGO5E.TARGET.Type.Sphere.Counted",
    template: "circle",
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.npdEWb2egUPnB5Fa",
    sizes: ["radius"],
    standard: true
  },
  square: {
    label: "DEGRINGO5E.TARGET.Type.Square.Label",
    counted: "DEGRINGO5E.TARGET.Type.Square.Counted",
    template: "rect",
    sizes: ["width"]
  },
  wall: {
    label: "DEGRINGO5E.TARGET.Type.Wall.Label",
    counted: "DEGRINGO5E.TARGET.Type.Wall.Counted",
    template: "ray",
    sizes: ["length", "thickness", "height"]
  }
};
preLocalize("areaTargetTypes", { key: "label", sort: true });

Object.defineProperty(DEGRINGO5E, "areaTargetOptions", {
  get() {
    const { primary, secondary } = Object.entries(this.areaTargetTypes).reduce((obj, [value, data]) => {
      const entry = { value, label: data.label };
      if ( data.standard ) obj.primary.push(entry);
      else obj.secondary.push(entry);
      return obj;
    }, { primary: [], secondary: [] });
    return [{ value: "", label: "" }, ...primary, { rule: true }, ...secondary];
  }
});

/* -------------------------------------------- */

/**
 * The types of single or area targets which can be applied to abilities.
 * @enum {string}
 */
DEGRINGO5E.targetTypes = {
  ...Object.fromEntries(Object.entries(DEGRINGO5E.individualTargetTypes).map(([k, v]) => [k, v.label])),
  ...Object.fromEntries(Object.entries(DEGRINGO5E.areaTargetTypes).map(([k, v]) => [k, v.label]))
};
preLocalize("targetTypes", { sort: true });

/* -------------------------------------------- */

/**
 * Denominations of hit dice which can apply to classes.
 * @type {string[]}
 */
DEGRINGO5E.hitDieTypes = ["d4", "d6", "d8", "d10", "d12"];

/* -------------------------------------------- */

/**
 * Configuration data for rest types.
 *
 * @typedef {object} RestConfiguration
 * @property {Record<string, number>} duration      Duration of different rest variants in minutes.
 * @property {string} label                         Localized label for the rest type.
 * @property {string} icon                          Icon representing this rest type. Can be either a set of FontAwesome
 *                                                  classes or an image path.
 * @property {string[]} [activationPeriods]         Activation types that should be displayed in the chat card.
 * @property {boolean} [recoverHitDice]             Should hit dice be recovered during this rest?
 * @property {boolean} [recoverHitPoints]           Should hit points be recovered during this rest?
 * @property {string[]} [recoverPeriods]            What recovery periods should be applied when this rest is taken. The
 *                                                  ordering of the periods determines which is applied if more than one
 *                                                  recovery profile is found.
 * @property {Set<string>} [recoverSpellSlotTypes]  Types of spellcasting slots to recover during this rest.
 */

/**
 * Types of rests.
 * @enum {RestConfiguration}
 */
DEGRINGO5E.restTypes = {
  short: {
    duration: {
      normal: 60,
      gritty: 480,
      epic: 1
    },
    label: "DEGRINGO5E.REST.Short.Label",
    icon: "fa-solid fa-utensils",
    activationPeriods: ["shortRest"],
    recoverPeriods: ["sr"],
    recoverSpellSlotTypes: new Set(["pact"])
  },
  long: {
    duration: {
      normal: 480,
      gritty: 10_080,
      epic: 60
    },
    label: "DEGRINGO5E.REST.Long.Label",
    icon: "fa-solid fa-campground",
    activationPeriods: ["longRest"],
    recoverHitDice: true,
    recoverHitPoints: true,
    recoverPeriods: ["lr", "sr"],
    recoverSpellSlotTypes: new Set(["leveled", "pact"]),
    recoverTemp: true,
    recoverTempMax: true
  }
};
preLocalize("restTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * The set of possible sensory perception types which an Actor may have.
 * @enum {string}
 */
DEGRINGO5E.senses = {
  blindsight: "DEGRINGO5E.SenseBlindsight",
  darkvision: "DEGRINGO5E.SenseDarkvision",
  tremorsense: "DEGRINGO5E.SenseTremorsense",
  truesight: "DEGRINGO5E.SenseTruesight"
};
preLocalize("senses", { sort: true });

/* -------------------------------------------- */
/*  Attacks                                     */
/* -------------------------------------------- */

/**
 * Classifications of attacks based on what is performing them.
 * @enum {{ label: string }}
 */
DEGRINGO5E.attackClassifications = {
  weapon: {
    label: "DEGRINGO5E.ATTACK.Classification.Weapon"
  },
  spell: {
    label: "DEGRINGO5E.ATTACK.Classification.Spell"
  },
  unarmed: {
    label: "DEGRINGO5E.ATTACK.Classification.Unarmed"
  }
};
preLocalize("attackClassifications", { key: "label" });

/* -------------------------------------------- */

/**
 * Attack modes available for weapons.
 * @enum {string}
 */
DEGRINGO5E.attackModes = Object.seal({
  oneHanded: {
    label: "DEGRINGO5E.ATTACK.Mode.OneHanded"
  },
  twoHanded: {
    label: "DEGRINGO5E.ATTACK.Mode.TwoHanded"
  },
  offhand: {
    label: "DEGRINGO5E.ATTACK.Mode.Offhand"
  },
  ranged: {
    label: "DEGRINGO5E.ATTACK.Mode.Ranged"
  },
  thrown: {
    label: "DEGRINGO5E.ATTACK.Mode.Thrown"
  },
  "thrown-offhand": {
    label: "DEGRINGO5E.ATTACK.Mode.ThrownOffhand"
  }
});
preLocalize("attackModes", { key: "label" });

/* -------------------------------------------- */

/**
 * Types of attacks based on range.
 * @enum {{ label: string }}
 */
DEGRINGO5E.attackTypes = Object.seal({
  melee: {
    label: "DEGRINGO5E.ATTACK.Type.Melee"
  },
  ranged: {
    label: "DEGRINGO5E.ATTACK.Type.Ranged"
  }
});
preLocalize("attackTypes", { key: "label" });

/* -------------------------------------------- */
/*  Spellcasting                                */
/* -------------------------------------------- */

/**
 * Spell lists that will be registered by the system during init.
 * @type {string[]}
 */
DEGRINGO5E.SPELL_LISTS = Object.freeze([
  "Compendium.degringo5e.content24.JournalEntry.phbSpells0000000.JournalEntryPage.wwia6Wwo4BgE9GSI",
  "Compendium.degringo5e.content24.JournalEntry.phbSpells0000000.JournalEntryPage.SkHptN2PTzFGDaEj",
  "Compendium.degringo5e.content24.JournalEntry.phbSpells0000000.JournalEntryPage.LhvuDQEyrCdg5EfU",
  "Compendium.degringo5e.content24.JournalEntry.phbSpells0000000.JournalEntryPage.8yD9Jgp404hfZ9ie",
  "Compendium.degringo5e.content24.JournalEntry.phbSpells0000000.JournalEntryPage.5HnIk6HsrSxkvkz5",
  "Compendium.degringo5e.content24.JournalEntry.phbSpells0000000.JournalEntryPage.VfZ5mH2ZuyFq82Ga",
  "Compendium.degringo5e.content24.JournalEntry.phbSpells0000000.JournalEntryPage.sSzagq8GvYXpfmfs",
  "Compendium.degringo5e.content24.JournalEntry.phbSpells0000000.JournalEntryPage.6AnqLUowgdsqMFvz"
]);

/* -------------------------------------------- */

/**
 * Define the standard slot progression by character level.
 * The entries of this array represent the spell slot progression for a full spell-caster.
 * @type {number[][]}
 */
DEGRINGO5E.SPELL_SLOT_TABLE = [
  [2],
  [3],
  [4, 2],
  [4, 3],
  [4, 3, 2],
  [4, 3, 3],
  [4, 3, 3, 1],
  [4, 3, 3, 2],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1]
];

/* -------------------------------------------- */

/**
 * Configuration data for pact casting progression.
 *
 * @typedef {object} PactProgressionConfig
 * @property {number} slots  Number of spell slots granted.
 * @property {number} level  Level of spells that can be cast.
 */

/**
 * Define the pact slot & level progression by pact caster level.
 * @enum {PactProgressionConfig}
 */
DEGRINGO5E.pactCastingProgression = {
  1: { slots: 1, level: 1 },
  2: { slots: 2, level: 1 },
  3: { slots: 2, level: 2 },
  5: { slots: 2, level: 3 },
  7: { slots: 2, level: 4 },
  9: { slots: 2, level: 5 },
  11: { slots: 3, level: 5 },
  17: { slots: 4, level: 5 }
};

/* -------------------------------------------- */

/**
 * Configuration data for spell preparation modes.
 *
 * @typedef {object} SpellPreparationModeConfiguration
 * @property {string} label           Localized name of this spell preparation type.
 * @property {boolean} [upcast]       Whether this preparation mode allows for upcasting.
 * @property {boolean} [cantrips]     Whether this mode allows for cantrips in a spellbook.
 * @property {number} [order]         The sort order of this mode in a spellbook.
 * @property {boolean} [prepares]     Whether this preparation mode prepares spells.
 */

/**
 * Various different ways a spell can be prepared.
 * @enum {SpellPreparationModeConfiguration}
 */
DEGRINGO5E.spellPreparationModes = {
  prepared: {
    label: "DEGRINGO5E.SpellPrepPrepared",
    upcast: true,
    prepares: true
  },
  pact: {
    label: "DEGRINGO5E.PactMagic",
    upcast: true,
    cantrips: true,
    order: 0.5
  },
  always: {
    label: "DEGRINGO5E.SpellPrepAlways",
    upcast: true,
    prepares: true
  },
  atwill: {
    label: "DEGRINGO5E.SpellPrepAtWill",
    order: -30
  },
  innate: {
    label: "DEGRINGO5E.SpellPrepInnate",
    order: -20
  },
  ritual: {
    label: "DEGRINGO5E.SpellPrepRitual",
    order: -10
  }
};
preLocalize("spellPreparationModes", { key: "label" });

/* -------------------------------------------- */

/**
 * Configuration data for different types of spellcasting supported.
 *
 * @typedef {object} SpellcastingTypeConfiguration
 * @property {string} label                               Localized label.
 * @property {string} img                                 Image used when rendered as a favorite on the sheet.
 * @property {boolean} [shortRest]                        Are these spell slots additionally restored on a short rest?
 * @property {Object<string, SpellcastingProgressionConfiguration>} [progression]  Any progression modes for this type.
 */

/**
 * Configuration data for a spellcasting progression mode.
 *
 * @typedef {object} SpellcastingProgressionConfiguration
 * @property {string} label             Localized label.
 * @property {number} [divisor=1]       Value by which the class levels are divided to determine spellcasting level.
 * @property {boolean} [roundUp=false]  Should fractional values should be rounded up by default?
 */

/**
 * Different spellcasting types and their progression.
 * @type {SpellcastingTypeConfiguration}
 */
DEGRINGO5E.spellcastingTypes = {
  leveled: {
    label: "DEGRINGO5E.SpellProgLeveled",
    img: "systems/degringo5e/icons/spell-tiers/{id}.webp",
    progression: {
      full: {
        label: "DEGRINGO5E.SpellProgFull",
        divisor: 1
      },
      half: {
        label: "DEGRINGO5E.SpellProgHalf",
        divisor: 2,
        roundUp: true
      },
      third: {
        label: "DEGRINGO5E.SpellProgThird",
        divisor: 3
      },
      artificer: {
        label: "DEGRINGO5E.SpellProgArt",
        divisor: 2,
        roundUp: true
      }
    }
  },
  pact: {
    label: "DEGRINGO5E.SpellProgPact",
    img: "icons/magic/unholy/silhouette-robe-evil-power.webp",
    shortRest: true
  }
};
preLocalize("spellcastingTypes", { key: "label", sort: true });
preLocalize("spellcastingTypes.leveled.progression", { key: "label" });

/* -------------------------------------------- */

/**
 * Ways in which a class can contribute to spellcasting levels.
 * @enum {string}
 */
DEGRINGO5E.spellProgression = {
  none: "DEGRINGO5E.SpellNone",
  full: "DEGRINGO5E.SpellProgFull",
  half: "DEGRINGO5E.SpellProgHalf",
  third: "DEGRINGO5E.SpellProgThird",
  pact: "DEGRINGO5E.SpellProgPact",
  artificer: "DEGRINGO5E.SpellProgArt"
};
preLocalize("spellProgression", { key: "label" });

/* -------------------------------------------- */

/**
 * Valid spell levels.
 * @enum {string}
 */
DEGRINGO5E.spellLevels = {
  0: "DEGRINGO5E.SpellLevel0",
  1: "DEGRINGO5E.SpellLevel1",
  2: "DEGRINGO5E.SpellLevel2",
  3: "DEGRINGO5E.SpellLevel3",
  4: "DEGRINGO5E.SpellLevel4",
  5: "DEGRINGO5E.SpellLevel5",
  6: "DEGRINGO5E.SpellLevel6",
  7: "DEGRINGO5E.SpellLevel7",
  8: "DEGRINGO5E.SpellLevel8",
  9: "DEGRINGO5E.SpellLevel9"
};
preLocalize("spellLevels");

/* -------------------------------------------- */

/**
 * The available choices for how spell damage scaling may be computed.
 * @enum {string}
 */
DEGRINGO5E.spellScalingModes = {
  none: "DEGRINGO5E.SpellNone",
  cantrip: "DEGRINGO5E.SpellCantrip",
  level: "DEGRINGO5E.SpellLevel"
};
preLocalize("spellScalingModes", { sort: true });

/* -------------------------------------------- */

/**
 * Configuration data for spell schools.
 *
 * @typedef {object} SpellSchoolConfiguration
 * @property {string} label        Localized label.
 * @property {string} icon         Spell school icon.
 * @property {string} fullKey      Fully written key used as alternate for enrichers.
 * @property {string} [reference]  Reference to a rule page describing this school.
 */

/**
 * Schools to which a spell can belong.
 * @enum {SpellSchoolConfiguration}
 */
DEGRINGO5E.spellSchools = {
  abj: {
    label: "DEGRINGO5E.SchoolAbj",
    icon: "systems/degringo5e/icons/svg/schools/abjuration.svg",
    fullKey: "abjuration",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.849AYEWw9FHD6JNz"
  },
  con: {
    label: "DEGRINGO5E.SchoolCon",
    icon: "systems/degringo5e/icons/svg/schools/conjuration.svg",
    fullKey: "conjuration",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.TWyKMhZJZGqQ6uls"
  },
  div: {
    label: "DEGRINGO5E.SchoolDiv",
    icon: "systems/degringo5e/icons/svg/schools/divination.svg",
    fullKey: "divination",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HoD2MwzmVbMqj9se"
  },
  enc: {
    label: "DEGRINGO5E.SchoolEnc",
    icon: "systems/degringo5e/icons/svg/schools/enchantment.svg",
    fullKey: "enchantment",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.SehPXk24ySBVOwCZ"
  },
  evo: {
    label: "DEGRINGO5E.SchoolEvo",
    icon: "systems/degringo5e/icons/svg/schools/evocation.svg",
    fullKey: "evocation",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kGp1RNuxL2SELLRC"
  },
  ill: {
    label: "DEGRINGO5E.SchoolIll",
    icon: "systems/degringo5e/icons/svg/schools/illusion.svg",
    fullKey: "illusion",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.smEk7kvVyslFozrB"
  },
  nec: {
    label: "DEGRINGO5E.SchoolNec",
    icon: "systems/degringo5e/icons/svg/schools/necromancy.svg",
    fullKey: "necromancy",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.W0eyiV1FBmngb6Qh"
  },
  trs: {
    label: "DEGRINGO5E.SchoolTrs",
    icon: "systems/degringo5e/icons/svg/schools/transmutation.svg",
    fullKey: "transmutation",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.IYWewSailtmv6qEb"
  }
};
preLocalize("spellSchools", { key: "label", sort: true });

/* -------------------------------------------- */

/**
 * Types of spell lists.
 * @enum {string}
 */
DEGRINGO5E.spellListTypes = {
  class: "TYPES.Item.class",
  subclass: "TYPES.Item.subclass",
  background: "TYPES.Item.background",
  race: "TYPES.Item.race",
  other: "JOURNALENTRYPAGE.DEGRINGO5E.SpellList.Type.Other"
};
preLocalize("spellListTypes");

/* -------------------------------------------- */

/**
 * Spell scroll item ID within the `DEGRINGO5E.sourcePacks` compendium or a full UUID for each spell level.
 * @enum {string}
 */
DEGRINGO5E.spellScrollIds = {
  0: "rQ6sO7HDWzqMhSI3",
  1: "9GSfMg0VOA2b4uFN",
  2: "XdDp6CKh9qEvPTuS",
  3: "hqVKZie7x9w3Kqds",
  4: "DM7hzgL836ZyUFB1",
  5: "wa1VF8TXHmkrrR35",
  6: "tI3rWx4bxefNCexS",
  7: "mtyw4NS1s7j2EJaD",
  8: "aOrinPg7yuDZEuWr",
  9: "O4YbkJkLlnsgUszZ"
};

/* -------------------------------------------- */

/**
 * @typedef {object} SpellScrollValues
 * @property {number} bonus  Attack to hit bonus.
 * @property {number} dc     Saving throw DC.
 */

/**
 * Spell scroll save DCs and attack bonus values based on spell level. If matching level isn't found,
 * then the nearest level lower than it will be selected.
 * @enum {SpellScrollValues}
 */
DEGRINGO5E.spellScrollValues = {
  0: { dc: 13, bonus: 5 },
  3: { dc: 15, bonus: 7 },
  5: { dc: 17, bonus: 9 },
  7: { dc: 18, bonus: 10 },
  9: { dc: 19, bonus: 11 }
};

/* -------------------------------------------- */

/**
 * Compendium packs used for localized items.
 * @enum {string}
 */
DEGRINGO5E.sourcePacks = {
  BACKGROUNDS: "degringo5e.backgrounds",
  CLASSES: "degringo5e.classes",
  ITEMS: "degringo5e.items",
  RACES: "degringo5e.races"
};

/* -------------------------------------------- */

/**
 * @import { TransformationSettingData } from "./data/settings/transformation-setting.mjs";
 */

/**
 * @typedef TransformationConfiguration
 * @property {Record<string, TransformationFlagConfiguration>} effects
 * @property {Record<string, TransformationFlagConfiguration>} keep
 * @property {Record<string, TransformationFlagConfiguration>} merge
 * @property {Record<string, TransformationFlagConfiguration>} others
 * @property {Record<string, TransformationPresetConfiguration} presets
 */

/**
 * @typedef TransformationFlagConfiguration
 * @property {string} label         Localized label for the flag.
 * @property {string} [hint]        Localized hint for the flag.
 * @property {boolean} [default]    This should be part of the default transformation settings.
 * @property {string[]} [disables]  Names of specific settings to disable, or whole categories if an `*` is used.
 */

/**
 * @typedef TransformationPresetConfiguration
 * @property {string} icon                         Icon representing this preset on the button.
 * @property {string} label                        Localized label for the preset.
 * @property {TransformationSettingData} settings  Options that will be set for the preset.
 */

/**
 * Settings that configuration how actors are changed when transformation is applied.
 * @typedef {TransformationConfiguration}
 */
DEGRINGO5E.transformation = {
  effects: {
    all: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Effects.All.Label",
      hint: "DEGRINGO5E.TRANSFORM.Setting.Effects.All.Hint",
      disables: ["effects.*"]
    },
    origin: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Effects.Origin.Label",
      hint: "DEGRINGO5E.TRANSFORM.Setting.Effects.Origin.Hint",
      default: true
    },
    otherOrigin: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Effects.OtherOrigin.Label",
      hint: "DEGRINGO5E.TRANSFORM.Setting.Effects.OtherOrigin.Hint",
      default: true
    },
    background: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Effects.Background.Label",
      default: true
    },
    class: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Effects.Class.Label",
      default: true
    },
    feat: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Effects.Feature.Label",
      default: true
    },
    equipment: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Effects.Equipment.Label",
      default: true
    },
    spell: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Effects.Spell.Label",
      default: true
    }
  },
  keep: {
    physical: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Physical.Label",
      hint: "DEGRINGO5E.TRANSFORM.Setting.Keep.Physical.Hint"
    },
    mental: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Mental.Label",
      hint: "DEGRINGO5E.TRANSFORM.Setting.Keep.Mental.Hint"
    },
    saves: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Saves.Label",
      disables: ["merge.saves"]
    },
    skills: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Skills.Label",
      disables: ["merge.skills"]
    },
    class: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Proficiency.Label"
    },
    feats: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Features.Label"
    },
    items: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Equipment.Label"
    },
    spells: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Spells.Label"
    },
    bio: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Biography.Label"
    },
    type: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.CreatureType.Label"
    },
    hp: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Health.Label"
    },
    vision: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Vision.Label",
      default: true
    },
    self: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Keep.Self.Label",
      hint: "DEGRINGO5E.TRANSFORM.Setting.Keep.Self.Hint",
      disables: ["keep.*", "merge.*"]
    }
  },
  merge: {
    saves: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Merge.Saves.Label",
      disables: ["keep.saves"]
    },
    skills: {
      label: "DEGRINGO5E.TRANSFORM.Setting.Merge.Skills.Label",
      disables: ["keep.skills"]
    }
  },
  other: {},
  presets: {
    wildshape: {
      icon: '<i class="fas fa-paw" inert></i>',
      label: "DEGRINGO5E.TRANSFORM.Preset.WildShape.Label",
      settings: {
        effects: new Set(["otherOrigin", "origin", "feat", "spell", "class", "background"]),
        keep: new Set(["bio", "class", "feats", "hp", "mental", "type"]),
        merge: new Set(["saves", "skills"]),
        tempFormula: "max(@classes.druid.levels, @subclasses.moon.levels * 3)"
      }
    },
    polymorph: {
      icon: '<i class="fas fa-pastafarianism" inert></i>',
      label: "DEGRINGO5E.TRANSFORM.Preset.Polymorph.Label",
      settings: {
        effects: new Set(["otherOrigin", "origin", "spell"]),
        keep: new Set(["hp", "type"]),
        tempFormula: "@source.attributes.hp.max"
      }
    },
    polymorphSelf: {
      icon: '<i class="fas fa-eye" inert></i>',
      label: "DEGRINGO5E.TRANSFORM.Preset.Appearance.Label",
      settings: {
        effects: new Set(["all"]),
        keep: new Set(["self"])
      }
    }
  }
};
preLocalize("transformation.effects", { keys: ["label", "hint"] });
preLocalize("transformation.keep", { keys: ["label", "hint"] });
preLocalize("transformation.merge", { keys: ["label", "hint"] });
preLocalize("transformation.other", { keys: ["label", "hint"], sort: true });
preLocalize("transformation.presets", { key: "label", sort: true });

/**
 * Settings to configure how actors are merged when polymorphing is applied.
 * @enum {string}
 * @deprecated since DnD5e 4.4, available until DnD5e 5.0
 */
DEGRINGO5E.polymorphSettings = new Proxy(DEGRINGO5E.transformation, {
  get(target, prop) {
    if ( typeof prop !== "string" ) return target[prop];
    foundry.utils.logCompatibilityWarning(
      "`CONFIG.DEGRINGO5E.polymorphSettings` is deprecated, use `CONFIG.DEGRINGO5E.transformation` instead.",
      { since: "DnD5e 4.4", until: "DnD5e 5.2", once: true }
    );
    const [category, key] = TransformationSetting._splitDeprecatedKey(prop);
    return target[category]?.[key]?.label;
  },
  set(target, prop, value) {
    foundry.utils.logCompatibilityWarning(
      "`CONFIG.DEGRINGO5E.polymorphSettings` is deprecated, use `CONFIG.DEGRINGO5E.transformation` instead.",
      { since: "DnD5e 4.4", until: "DnD5e 5.2", once: true }
    );
    const [category, key] = TransformationSetting._splitDeprecatedKey(prop);
    if ( !category ) return false;
    target[category][key] = { label: value };
    return true;
  }
});

/**
 * Settings to configure how actors are effects are merged when polymorphing is applied.
 * @enum {string}
 * @deprecated since DnD5e 4.4, available until DnD5e 5.0
 */
DEGRINGO5E.polymorphEffectSettings = new Proxy(DEGRINGO5E.transformation, {
  get(target, prop) {
    if ( typeof prop !== "string" ) return target[prop];
    foundry.utils.logCompatibilityWarning(
      "`CONFIG.DEGRINGO5E.polymorphEffectSettings` is deprecated, use `CONFIG.DEGRINGO5E.transformation` instead.",
      { since: "DnD5e 4.4", until: "DnD5e 5.2", once: true }
    );
    if ( prop === "keepAE" ) return target.effects.all?.label;
    const [category, key] = TransformationSetting._splitDeprecatedKey(prop);
    return target[category]?.[key]?.label;
  },
  set(target, prop, value) {
    foundry.utils.logCompatibilityWarning(
      "`CONFIG.DEGRINGO5E.polymorphEffectSettings` is deprecated, use `CONFIG.DEGRINGO5E.transformation` instead.",
      { since: "DnD5e 4.4", until: "DnD5e 5.2", once: true }
    );
    if ( prop === "keepAE" ) {
      target.effects.all = { label: value };
      return true;
    }
    const [category, key] = TransformationSetting._splitDeprecatedKey(prop);
    if ( !category ) return false;
    target[category][key] = { label: value };
    return true;
  }
});

/**
 * Settings to configure how actors are merged when preset polymorphing is applied.
 * @enum {object}
 */
DEGRINGO5E.transformationPresets = new Proxy(DEGRINGO5E.transformation, {
  get(target, prop) {
    if ( typeof prop !== "string" ) return target[prop];
    foundry.utils.logCompatibilityWarning(
      "`CONFIG.DEGRINGO5E.transformationPresets` is deprecated, use `CONFIG.DEGRINGO5E.transformation.presets` instead.",
      { since: "DnD5e 4.4", until: "DnD5e 5.2", once: true }
    );
    const preset = target.presets[prop];
    if ( !preset ) return;
    const setting = new TransformationSetting(preset.settings);
    return {
      icon: preset.icon,
      label: preset.label,
      options: {
        ...setting._toDeprecatedConfig(),
        preset: prop
      }
    };
  },
  set(target, prop, value) {
    foundry.utils.logCompatibilityWarning(
      "`CONFIG.DEGRINGO5E.transformationPresets` is deprecated, use `CONFIG.DEGRINGO5E.transformation.presets` instead.",
      { since: "DnD5e 4.4", until: "DnD5e 5.2", once: true }
    );
    const preset = {
      label: value.label,
      icon: value.icon,
      settings: TransformationSetting._fromDeprecatedConfig(value.options ?? {})
    };
    target.presets[prop] = preset.toObject();
    return true;
  }
});

/* -------------------------------------------- */

/**
 * Skill, ability, and tool proficiency levels.
 * The key for each level represents its proficiency multiplier.
 * @enum {string}
 */
DEGRINGO5E.proficiencyLevels = {
  0: "DEGRINGO5E.NotProficient",
  1: "DEGRINGO5E.Proficient",
  0.5: "DEGRINGO5E.HalfProficient",
  2: "DEGRINGO5E.Expertise"
};
preLocalize("proficiencyLevels");

/* -------------------------------------------- */

/**
 * Weapon and armor item proficiency levels.
 * @enum {string}
 */
DEGRINGO5E.weaponAndArmorProficiencyLevels = {
  0: "DEGRINGO5E.NotProficient",
  1: "DEGRINGO5E.Proficient"
};
preLocalize("weaponAndArmorProficiencyLevels");

/* -------------------------------------------- */

/**
 * The amount of cover provided by an object. In cases where multiple pieces
 * of cover are in play, we take the highest value.
 * @enum {string}
 */
DEGRINGO5E.cover = {
  0: "DEGRINGO5E.None",
  .5: "DEGRINGO5E.CoverHalf",
  .75: "DEGRINGO5E.CoverThreeQuarters",
  1: "DEGRINGO5E.CoverTotal"
};
preLocalize("cover");

/* -------------------------------------------- */

/**
 * A selection of actor attributes that can be tracked on token resource bars.
 * @type {string[]}
 * @deprecated since v10
 */
DEGRINGO5E.trackableAttributes = [
  "attributes.ac.value", "attributes.init.bonus", "attributes.movement", "attributes.senses",
  "attributes.spell.attack", "attributes.spell.dc", "attributes.spell.level", "details.cr",
  "details.xp.value", "skills.*.passive", "abilities.*.value"
];

/* -------------------------------------------- */

/**
 * A selection of actor and item attributes that are valid targets for item resource consumption.
 * @type {string[]}
 */
DEGRINGO5E.consumableResources = [
  // Configured during init.
];

/* -------------------------------------------- */

/**
 * @typedef {object} _StatusEffectConfig5e
 * @property {string} img               Image used to represent the condition on the token.
 * @property {number} [order]           Order status to the start of the token HUD, rather than alphabetically.
 * @property {string} [reference]       UUID of a journal entry with details on this condition.
 * @property {string} [special]         Set this condition as a special status effect under this name.
 * @property {string[]} [riders]        Additional conditions, by id, to apply as part of this condition.
 * @property {string} [exclusiveGroup]  Any status effects with the same group will not be able to be applied at the
 *                                      same time through the token HUD (multiple statuses applied through other
 *                                      effects can still coexist).
 * @property {number} [coverBonus]      A bonus this condition provides to AC and dexterity saving throws.
 */

/**
 * Configuration data for system status effects.
 * @typedef {Omit<StatusEffectConfig, "img"> & _StatusEffectConfig5e} StatusEffectConfig5e
 */

/**
 * @typedef {object} _ConditionConfiguration
 * @property {string} name         Localized name for the condition.
 * @property {boolean} [pseudo]    Is this a pseudo-condition, i.e. one that does not appear in the conditions appendix
 *                                 but acts as a status effect?
 * @property {number} [levels]     The number of levels of exhaustion an actor can obtain.
 * @property {{ rolls: number, speed: number }} [reduction]  Amount D20 Tests & Speed are reduced per exhaustion level
 *                                                           when using the modern rules. Speed reduction is measured
 *                                                           in the default imperial units and converted to metric
 *                                                           if necessary.
 */

/**
 * Configuration data for system conditions.
 * @typedef {Omit<StatusEffectConfig5e, "name"> & _ConditionConfiguration} ConditionConfiguration
 */

/**
 * Conditions that can affect an actor.
 * @enum {ConditionConfiguration}
 */
DEGRINGO5E.conditionTypes = {
  bleeding: {
    name: "EFFECT.DEGRINGO5E.StatusBleeding",
    img: "systems/degringo5e/icons/svg/statuses/bleeding.svg",
    pseudo: true
  },
  blinded: {
    name: "DEGRINGO5E.ConBlinded",
    img: "systems/degringo5e/icons/svg/statuses/blinded.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.uDogReMO6QtH6NDw",
    special: "BLIND"
  },
  burning: {
    name: "EFFECT.DEGRINGO5E.StatusBurning",
    img: "systems/degringo5e/icons/svg/statuses/burning.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.mPBGM1vguT5IPzxT",
    pseudo: true
  },
  charmed: {
    name: "DEGRINGO5E.ConCharmed",
    img: "systems/degringo5e/icons/svg/statuses/charmed.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.vLAsIUa0FhZNsyLk"
  },
  cursed: {
    name: "EFFECT.DEGRINGO5E.StatusCursed",
    img: "systems/degringo5e/icons/svg/statuses/cursed.svg",
    pseudo: true
  },
  dehydration: {
    name: "EFFECT.DEGRINGO5E.StatusDehydration",
    img: "systems/degringo5e/icons/svg/statuses/dehydration.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.FZFvLNOX0lHaHZ1k",
    pseudo: true
  },
  deafened: {
    name: "DEGRINGO5E.ConDeafened",
    img: "systems/degringo5e/icons/svg/statuses/deafened.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.qlRw66tJhk0zLnwq"
  },
  diseased: {
    name: "DEGRINGO5E.ConDiseased",
    img: "systems/degringo5e/icons/svg/statuses/diseased.svg",
    pseudo: true,
    reference: "Compendium.degringo5e.rules.JournalEntry.NizgRXLNUqtdlC1s.JournalEntryPage.oNQWvyRZkTOJ8PBq"
  },
  exhaustion: {
    name: "DEGRINGO5E.ConExhaustion",
    img: "systems/degringo5e/icons/svg/statuses/exhaustion.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.jSQtPgNm0i4f3Qi3",
    levels: 6,
    reduction: { rolls: 2, speed: 5 }
  },
  falling: {
    name: "EFFECT.DEGRINGO5E.StatusFalling",
    img: "systems/degringo5e/icons/svg/statuses/falling.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kREHL5pgNUOhay9f",
    pseudo: true
  },
  frightened: {
    name: "DEGRINGO5E.ConFrightened",
    img: "systems/degringo5e/icons/svg/statuses/frightened.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.93uaingTESo8N1qL"
  },
  grappled: {
    name: "DEGRINGO5E.ConGrappled",
    img: "systems/degringo5e/icons/svg/statuses/grappled.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.KbQ1k0OIowtZeQgp"
  },
  incapacitated: {
    name: "DEGRINGO5E.ConIncapacitated",
    img: "systems/degringo5e/icons/svg/statuses/incapacitated.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.4i3G895hy99piand"
  },
  invisible: {
    name: "DEGRINGO5E.ConInvisible",
    img: "systems/degringo5e/icons/svg/statuses/invisible.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.MQIZ1zRLWRcNOtPN"
  },
  malnutrition: {
    name: "EFFECT.DEGRINGO5E.StatusMalnutrition",
    img: "systems/degringo5e/icons/svg/statuses/malnutrition.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.earBo4vQPC1ti4g7",
    pseudo: true
  },
  paralyzed: {
    name: "DEGRINGO5E.ConParalyzed",
    img: "systems/degringo5e/icons/svg/statuses/paralyzed.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.RnxZoTglPnLc6UPb",
    statuses: ["incapacitated"]
  },
  petrified: {
    name: "DEGRINGO5E.ConPetrified",
    img: "systems/degringo5e/icons/svg/statuses/petrified.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.6vtLuQT9lwZ9N299",
    statuses: ["incapacitated"]
  },
  poisoned: {
    name: "DEGRINGO5E.ConPoisoned",
    img: "systems/degringo5e/icons/svg/statuses/poisoned.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.HWs8kEojffqwTSJz"
  },
  prone: {
    name: "DEGRINGO5E.ConProne",
    img: "systems/degringo5e/icons/svg/statuses/prone.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.QxCrRcgMdUd3gfzz"
  },
  restrained: {
    name: "DEGRINGO5E.ConRestrained",
    img: "systems/degringo5e/icons/svg/statuses/restrained.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.dqLeGdpHtb8FfcxX"
  },
  silenced: {
    name: "EFFECT.DEGRINGO5E.StatusSilenced",
    img: "systems/degringo5e/icons/svg/statuses/silenced.svg",
    pseudo: true
  },
  stunned: {
    name: "DEGRINGO5E.ConStunned",
    img: "systems/degringo5e/icons/svg/statuses/stunned.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.EjbXjvyQAMlDyANI",
    statuses: ["incapacitated"]
  },
  suffocation: {
    name: "EFFECT.DEGRINGO5E.StatusSuffocation",
    img: "systems/degringo5e/icons/svg/statuses/suffocation.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.gAvV8TLyS8UGq00x",
    pseudo: true
  },
  surprised: {
    name: "EFFECT.DEGRINGO5E.StatusSurprised",
    img: "systems/degringo5e/icons/svg/statuses/surprised.svg",
    pseudo: true
  },
  transformed: {
    name: "EFFECT.DEGRINGO5E.StatusTransformed",
    img: "systems/degringo5e/icons/svg/statuses/transformed.svg",
    pseudo: true
  },
  unconscious: {
    name: "DEGRINGO5E.ConUnconscious",
    img: "systems/degringo5e/icons/svg/statuses/unconscious.svg",
    reference: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.fZCRaKEJd4KoQCqH",
    statuses: ["incapacitated"],
    riders: ["prone"]
  }
};
preLocalize("conditionTypes", { keys: ["name", "label"], sort: true }); // TODO: Remove 'label' in 5.2.

/* -------------------------------------------- */

/**
 * Various effects of conditions and which conditions apply it. Either keys for the conditions,
 * and with a number appended for a level of exhaustion.
 * @enum {object}
 */
DEGRINGO5E.conditionEffects = {
  noMovement: new Set(["exhaustion-5", "grappled", "paralyzed", "petrified", "restrained", "unconscious"]),
  halfMovement: new Set(["exhaustion-2"]),
  crawl: new Set(["prone", "exceedingCarryingCapacity"]),
  petrification: new Set(["petrified"]),
  halfHealth: new Set(["exhaustion-4"]),
  initiativeAdvantage: new Set(["invisible"]),
  initiativeDisadvantage: new Set(["incapacitated", "surprised"])
};

/* -------------------------------------------- */

/**
 * Extra status effects not specified in `conditionTypes`. If the ID matches a core-provided effect, then this
 * data will be merged into the core data.
 * @enum {Omit<StatusEffectConfig5e, "img"> & { icon: string }}
 */
DEGRINGO5E.statusEffects = {
  burrowing: {
    name: "EFFECT.DEGRINGO5E.StatusBurrowing",
    img: "systems/degringo5e/icons/svg/statuses/burrowing.svg",
    special: "BURROW"
  },
  concentrating: {
    name: "EFFECT.DEGRINGO5E.StatusConcentrating",
    img: "systems/degringo5e/icons/svg/statuses/concentrating.svg",
    special: "CONCENTRATING"
  },
  coverHalf: {
    name: "EFFECT.DEGRINGO5E.StatusHalfCover",
    img: "systems/degringo5e/icons/svg/statuses/cover-half.svg",
    order: 2,
    exclusiveGroup: "cover",
    coverBonus: 2
  },
  coverThreeQuarters: {
    name: "EFFECT.DEGRINGO5E.StatusThreeQuartersCover",
    img: "systems/degringo5e/icons/svg/statuses/cover-three-quarters.svg",
    order: 3,
    exclusiveGroup: "cover",
    coverBonus: 5
  },
  coverTotal: {
    name: "EFFECT.DEGRINGO5E.StatusTotalCover",
    img: "systems/degringo5e/icons/svg/statuses/cover-total.svg",
    order: 4,
    exclusiveGroup: "cover"
  },
  dead: {
    name: "EFFECT.DEGRINGO5E.StatusDead",
    img: "systems/degringo5e/icons/svg/statuses/dead.svg",
    special: "DEFEATED",
    order: 1
  },
  dodging: {
    name: "EFFECT.DEGRINGO5E.StatusDodging",
    img: "systems/degringo5e/icons/svg/statuses/dodging.svg"
  },
  ethereal: {
    name: "EFFECT.DEGRINGO5E.StatusEthereal",
    img: "systems/degringo5e/icons/svg/statuses/ethereal.svg"
  },
  flying: {
    name: "EFFECT.DEGRINGO5E.StatusFlying",
    img: "systems/degringo5e/icons/svg/statuses/flying.svg",
    special: "FLY"
  },
  hiding: {
    name: "EFFECT.DEGRINGO5E.StatusHiding",
    img: "systems/degringo5e/icons/svg/statuses/hiding.svg"
  },
  hovering: {
    name: "EFFECT.DEGRINGO5E.StatusHovering",
    img: "systems/degringo5e/icons/svg/statuses/hovering.svg",
    special: "HOVER"
  },
  marked: {
    name: "EFFECT.DEGRINGO5E.StatusMarked",
    img: "systems/degringo5e/icons/svg/statuses/marked.svg"
  },
  sleeping: {
    name: "EFFECT.DEGRINGO5E.StatusSleeping",
    img: "systems/degringo5e/icons/svg/statuses/sleeping.svg",
    statuses: ["incapacitated", "unconscious"]
  },
  stable: {
    name: "EFFECT.DEGRINGO5E.StatusStable",
    img: "systems/degringo5e/icons/svg/statuses/stable.svg"
  }
};

/* -------------------------------------------- */

/**
 * Configuration for the special bloodied status effect.
 * @type {{ name: string, icon: string, threshold: number }}
 */
DEGRINGO5E.bloodied = {
  name: "EFFECT.DEGRINGO5E.StatusBloodied",
  img: "systems/degringo5e/icons/svg/statuses/bloodied.svg",
  threshold: .5
};

/* -------------------------------------------- */
/*  Languages                                   */
/* -------------------------------------------- */

/**
 * Languages a character can learn.
 * @enum {object}
 */
DEGRINGO5E.languages = {
  standard: {
    label: "DEGRINGO5E.Language.Category.Standard",
    selectable: false,
    children: {
      common: "DEGRINGO5E.Language.Language.Common",
      draconic: "DEGRINGO5E.Language.Language.Draconic",
      dwarvish: "DEGRINGO5E.Language.Language.Dwarvish",
      elvish: "DEGRINGO5E.Language.Language.Elvish",
      giant: "DEGRINGO5E.Language.Language.Giant",
      gnomish: "DEGRINGO5E.Language.Language.Gnomish",
      goblin: "DEGRINGO5E.Language.Language.Goblin",
      halfling: "DEGRINGO5E.Language.Language.Halfling",
      orc: "DEGRINGO5E.Language.Language.Orc",
      sign: "DEGRINGO5E.Language.Language.CommonSign"
    }
  },
  exotic: {
    label: "DEGRINGO5E.Language.Category.Rare",
    selectable: false,
    children: {
      aarakocra: "DEGRINGO5E.Language.Language.Aarakocra",
      abyssal: "DEGRINGO5E.Language.Language.Abyssal",
      cant: "DEGRINGO5E.Language.Language.ThievesCant",
      celestial: "DEGRINGO5E.Language.Language.Celestial",
      deep: "DEGRINGO5E.Language.Language.DeepSpeech",
      druidic: "DEGRINGO5E.Language.Language.Druidic",
      gith: "DEGRINGO5E.Language.Language.Gith",
      gnoll: "DEGRINGO5E.Language.Language.Gnoll",
      infernal: "DEGRINGO5E.Language.Language.Infernal",
      primordial: {
        label: "DEGRINGO5E.Language.Language.Primordial",
        children: {
          aquan: "DEGRINGO5E.Language.Language.Aquan",
          auran: "DEGRINGO5E.Language.Language.Auran",
          ignan: "DEGRINGO5E.Language.Language.Ignan",
          terran: "DEGRINGO5E.Language.Language.Terran"
        }
      },
      sylvan: "DEGRINGO5E.Language.Language.Sylvan",
      undercommon: "DEGRINGO5E.Language.Language.Undercommon"
    }
  }
};
preLocalize("languages", { key: "label" });
preLocalize("languages.standard.children", { key: "label", sort: true });
preLocalize("languages.exotic.children", { key: "label", sort: true });
preLocalize("languages.exotic.children.primordial.children", { sort: true });

/* -------------------------------------------- */

/**
 * Communication types that take ranges such as telepathy.
 * @enum {{ label: string }}
 */
DEGRINGO5E.communicationTypes = {
  telepathy: {
    label: "DEGRINGO5E.Language.Communication.Telepathy"
  }
};
preLocalize("communicationTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * @typedef HabitatConfiguration5e
 * @property {string} label        The human-readable habitat name.
 * @property {boolean} [subtypes]  Whether this habitat is divided into sub-types.
 */

/**
 * NPC habitats.
 * @type {Record<string, HabitatConfiguration5e>}
 */
DEGRINGO5E.habitats = {
  any: {
    label: "DEGRINGO5E.Habitat.Categories.Any"
  },
  arctic: {
    label: "DEGRINGO5E.Habitat.Categories.Arctic"
  },
  coastal: {
    label: "DEGRINGO5E.Habitat.Categories.Coastal"
  },
  desert: {
    label: "DEGRINGO5E.Habitat.Categories.Desert"
  },
  forest: {
    label: "DEGRINGO5E.Habitat.Categories.Forest"
  },
  grassland: {
    label: "DEGRINGO5E.Habitat.Categories.Grassland"
  },
  hill: {
    label: "DEGRINGO5E.Habitat.Categories.Hill"
  },
  mountain: {
    label: "DEGRINGO5E.Habitat.Categories.Mountain"
  },
  planar: {
    label: "DEGRINGO5E.Habitat.Categories.Planar",
    subtypes: true
  },
  swamp: {
    label: "DEGRINGO5E.Habitat.Categories.Swamp"
  },
  underdark: {
    label: "DEGRINGO5E.Habitat.Categories.Underdark"
  },
  underwater: {
    label: "DEGRINGO5E.Habitat.Categories.Underwater"
  },
  urban: {
    label: "DEGRINGO5E.Habitat.Categories.Urban"
  }
};
preLocalize("habitats", { key: "label" });

/* -------------------------------------------- */

/**
 * @typedef TreasureConfiguration5e
 * @property {string} label  The human-readable treasure category name.
 */

/**
 * NPC Treasure
 * @type {Record<string, TreasureConfiguration5e>}
 */
DEGRINGO5E.treasure = {
  any: {
    label: "DEGRINGO5E.Treasure.Categories.Any"
  },
  arcana: {
    label: "DEGRINGO5E.Treasure.Categories.Arcana"
  },
  armaments: {
    label: "DEGRINGO5E.Treasure.Categories.Armaments"
  },
  implements: {
    label: "DEGRINGO5E.Treasure.Categories.Implements"
  },
  individual: {
    label: "DEGRINGO5E.Treasure.Categories.Individual"
  },
  relics: {
    label: "DEGRINGO5E.Treasure.Categories.Relics"
  }
};
preLocalize("treasure", { key: "label" });

/* -------------------------------------------- */

/**
 * Maximum allowed character level.
 * @type {number}
 */
DEGRINGO5E.maxLevel = 20;

/**
 * Maximum ability score value allowed by default.
 * @type {number}
 */
DEGRINGO5E.maxAbilityScore = 20;

/**
 * XP required to achieve each character level.
 * @type {number[]}
 */
DEGRINGO5E.CHARACTER_EXP_LEVELS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000
];

/**
 * XP granted for each challenge rating.
 * @type {number[]}
 */
DEGRINGO5E.CR_EXP_LEVELS = [
  10, 200, 450, 700, 1100, 1800, 2300, 2900, 3900, 5000, 5900, 7200, 8400, 10000, 11500, 13000, 15000, 18000,
  20000, 22000, 25000, 33000, 41000, 50000, 62000, 75000, 90000, 105000, 120000, 135000, 155000
];

/**
 * Intervals above the maximum XP that result in an epic boon.
 * @type {number}
 */
DEGRINGO5E.epicBoonInterval = 30000;

/* -------------------------------------------- */

/**
 * Trait configuration information.
 *
 * @typedef {object} TraitConfiguration
 * @property {object} labels
 * @property {string} labels.title         Localization key for the trait name.
 * @property {string} labels.localization  Prefix for a localization key that can be used to generate various
 *                                         plural variants of the trait type.
 * @property {string} [labels.all]         Localization to use for the "all" option for this trait. If not provided,
 *                                         then no all option will be available.
 * @property {string} icon                 Path to the icon used to represent this trait.
 * @property {string} [actorKeyPath]       If the trait doesn't directly map to an entry as `traits.[key]`, where is
 *                                         this trait's data stored on the actor?
 * @property {string} [configKey]          If the list of trait options doesn't match the name of the trait, where can
 *                                         the options be found within `CONFIG.DEGRINGO5E`?
 * @property {boolean|number} [dataType]   Type of data represented.
 * @property {string} [labelKeyPath]       If config is an enum of objects, where can the label be found?
 * @property {object} [subtypes]           Configuration for traits that take some sort of base item.
 * @property {string} [subtypes.keyPath]   Path to subtype value on base items, should match a category key.
 *                                         Deprecated in favor of the standardized `system.type.value`.
 * @property {string[]} [subtypes.ids]     Key for base item ID objects within `CONFIG.DEGRINGO5E`.
 * @property {object} [children]           Mapping of category key to an object defining its children.
 * @property {boolean} [sortCategories]    Whether top-level categories should be sorted.
 * @property {boolean} [expertise]         Can an actor receive expertise in this trait?
 * @property {boolean} [mastery]           Can an actor receive mastery in this trait?
 */

/**
 * Configurable traits on actors.
 * @enum {TraitConfiguration}
 */
DEGRINGO5E.traits = {
  saves: {
    labels: {
      title: "DEGRINGO5E.ClassSaves",
      localization: "DEGRINGO5E.TraitSavesPlural"
    },
    icon: "icons/magic/life/ankh-gold-blue.webp",
    actorKeyPath: "system.abilities",
    configKey: "abilities",
    labelKeyPath: "label"
  },
  skills: {
    labels: {
      title: "DEGRINGO5E.Skills",
      localization: "DEGRINGO5E.TraitSkillsPlural"
    },
    icon: "icons/tools/instruments/harp-yellow-teal.webp",
    actorKeyPath: "system.skills",
    labelKeyPath: "label",
    expertise: true,
    dataType: MappingField
  },
  languages: {
    labels: {
      title: "DEGRINGO5E.Languages",
      localization: "DEGRINGO5E.TraitLanguagesPlural",
      all: "DEGRINGO5E.Language.All"
    },
    icon: "icons/skills/social/diplomacy-peace-alliance.webp"
  },
  armor: {
    labels: {
      title: "DEGRINGO5E.TraitArmorProf",
      localization: "DEGRINGO5E.TraitArmorPlural"
    },
    icon: "icons/equipment/chest/breastplate-helmet-metal.webp",
    actorKeyPath: "system.traits.armorProf",
    configKey: "armorProficiencies",
    subtypes: { keyPath: "armor.type", ids: ["armorIds", "shieldIds"] }
  },
  weapon: {
    labels: {
      title: "DEGRINGO5E.TraitWeaponProf",
      localization: "DEGRINGO5E.TraitWeaponPlural"
    },
    icon: "icons/skills/melee/weapons-crossed-swords-purple.webp",
    actorKeyPath: "system.traits.weaponProf",
    configKey: "weaponProficiencies",
    subtypes: { keyPath: "weaponType", ids: ["weaponIds"] },
    mastery: true
  },
  tool: {
    labels: {
      title: "DEGRINGO5E.TraitToolProf",
      localization: "DEGRINGO5E.TraitToolPlural"
    },
    icon: "icons/skills/trades/smithing-anvil-silver-red.webp",
    actorKeyPath: "system.tools",
    configKey: "toolProficiencies",
    subtypes: { keyPath: "toolType", ids: ["tools"] },
    children: { vehicle: "vehicleTypes" },
    sortCategories: true,
    expertise: true,
    dataType: MappingField
  },
  di: {
    labels: {
      title: "DEGRINGO5E.DamImm",
      localization: "DEGRINGO5E.TraitDIPlural"
    },
    icon: "systems/degringo5e/icons/svg/trait-damage-immunities.svg",
    configKey: "damageTypes"
  },
  dr: {
    labels: {
      title: "DEGRINGO5E.DamRes",
      localization: "DEGRINGO5E.TraitDRPlural"
    },
    icon: "systems/degringo5e/icons/svg/trait-damage-resistances.svg",
    configKey: "damageTypes"
  },
  dv: {
    labels: {
      title: "DEGRINGO5E.DamVuln",
      localization: "DEGRINGO5E.TraitDVPlural"
    },
    icon: "systems/degringo5e/icons/svg/trait-damage-vulnerabilities.svg",
    configKey: "damageTypes"
  },
  dm: {
    labels: {
      title: "DEGRINGO5E.DamMod",
      localization: "DEGRINGO5E.TraitDMPlural"
    },
    configKey: "damageTypes",
    dataType: Number
  },
  ci: {
    labels: {
      title: "DEGRINGO5E.ConImm",
      localization: "DEGRINGO5E.TraitCIPlural"
    },
    icon: "systems/degringo5e/icons/svg/trait-condition-immunities.svg",
    configKey: "conditionTypes",
    labelKeyPath: "name"
  }
};
preLocalize("traits", { keys: ["labels.title", "labels.all"] });

/* -------------------------------------------- */

/**
 * Modes used within a trait advancement.
 * @enum {object}
 */
DEGRINGO5E.traitModes = {
  default: {
    label: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Default.Label",
    hint: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Default.Hint"
  },
  expertise: {
    label: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Expertise.Label",
    hint: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Expertise.Hint"
  },
  forcedExpertise: {
    label: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Force.Label",
    hint: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Force.Hint"
  },
  upgrade: {
    label: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Upgrade.Label",
    hint: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Upgrade.Hint"
  },
  mastery: {
    label: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Mastery.Label",
    hint: "DEGRINGO5E.ADVANCEMENT.Trait.Mode.Mastery.Hint"
  }
};
preLocalize("traitModes", { keys: ["label", "hint"] });

/* -------------------------------------------- */

/**
 * @typedef {object} CharacterFlagConfig
 * @property {string} name
 * @property {string} hint
 * @property {string} section
 * @property {typeof boolean|string|number} type
 * @property {string} placeholder
 * @property {string[]} [abilities]
 * @property {Object<string, string>} [choices]
 * @property {boolean} [deprecated]               Hide the flag unless it already has a value.
 * @property {string[]} [skills]
 */

/**
 * Special character flags.
 * @enum {CharacterFlagConfig}
 */
DEGRINGO5E.characterFlags = {
  diamondSoul: {
    name: "DEGRINGO5E.FlagsDiamondSoul",
    hint: "DEGRINGO5E.FlagsDiamondSoulHint",
    section: "DEGRINGO5E.Feats",
    type: Boolean
  },
  enhancedDualWielding: {
    name: "DEGRINGO5E.FLAGS.EnhancedDualWielding.Name",
    hint: "DEGRINGO5E.FLAGS.EnhancedDualWielding.Hint",
    section: "DEGRINGO5E.Feats",
    type: Boolean
  },
  elvenAccuracy: {
    name: "DEGRINGO5E.FlagsElvenAccuracy",
    hint: "DEGRINGO5E.FlagsElvenAccuracyHint",
    section: "DEGRINGO5E.RacialTraits",
    abilities: ["dex", "int", "wis", "cha"],
    type: Boolean
  },
  halflingLucky: {
    name: "DEGRINGO5E.FlagsHalflingLucky",
    hint: "DEGRINGO5E.FlagsHalflingLuckyHint",
    section: "DEGRINGO5E.RacialTraits",
    type: Boolean
  },
  initiativeAlert: {
    name: "DEGRINGO5E.FlagsAlert",
    hint: "DEGRINGO5E.FlagsAlertHint",
    section: "DEGRINGO5E.Feats",
    type: Boolean
  },
  jackOfAllTrades: {
    name: "DEGRINGO5E.FlagsJOAT",
    hint: "DEGRINGO5E.FlagsJOATHint",
    section: "DEGRINGO5E.Feats",
    type: Boolean
  },
  observantFeat: {
    name: "DEGRINGO5E.FlagsObservant",
    hint: "DEGRINGO5E.FlagsObservantHint",
    skills: ["prc", "inv"],
    section: "DEGRINGO5E.Feats",
    type: Boolean
  },
  tavernBrawlerFeat: {
    name: "DEGRINGO5E.FlagsTavernBrawler",
    hint: "DEGRINGO5E.FlagsTavernBrawlerHint",
    section: "DEGRINGO5E.Feats",
    type: Boolean
  },
  powerfulBuild: {
    name: "DEGRINGO5E.FlagsPowerfulBuild",
    hint: "DEGRINGO5E.FlagsPowerfulBuildHint",
    section: "DEGRINGO5E.RacialTraits",
    type: Boolean
  },
  reliableTalent: {
    name: "DEGRINGO5E.FlagsReliableTalent",
    hint: "DEGRINGO5E.FlagsReliableTalentHint",
    section: "DEGRINGO5E.Feats",
    type: Boolean
  },
  remarkableAthlete: {
    name: "DEGRINGO5E.FlagsRemarkableAthlete",
    hint: "DEGRINGO5E.FlagsRemarkableAthleteHint",
    abilities: ["str", "dex", "con"],
    section: "DEGRINGO5E.Feats",
    type: Boolean
  },
  weaponCriticalThreshold: {
    name: "DEGRINGO5E.FlagsWeaponCritThreshold",
    hint: "DEGRINGO5E.FlagsWeaponCritThresholdHint",
    section: "DEGRINGO5E.Feats",
    type: Number,
    placeholder: 20
  },
  spellCriticalThreshold: {
    name: "DEGRINGO5E.FlagsSpellCritThreshold",
    hint: "DEGRINGO5E.FlagsSpellCritThresholdHint",
    section: "DEGRINGO5E.Feats",
    type: Number,
    placeholder: 20
  },
  meleeCriticalDamageDice: {
    name: "DEGRINGO5E.FlagsMeleeCriticalDice",
    hint: "DEGRINGO5E.FlagsMeleeCriticalDiceHint",
    section: "DEGRINGO5E.Feats",
    type: Number,
    placeholder: 0
  }
};
preLocalize("characterFlags", { keys: ["name", "hint", "section"] });

/**
 * Flags allowed on actors. Any flags not in the list may be deleted during a migration.
 * @type {string[]}
 */
DEGRINGO5E.allowedActorFlags = ["isPolymorphed", "originalActor"].concat(Object.keys(DEGRINGO5E.characterFlags));

/* -------------------------------------------- */

/**
 * Different types of actor structures that groups can represent.
 * @enum {object}
 */
DEGRINGO5E.groupTypes = {
  party: "DEGRINGO5E.Group.TypeParty",
  encounter: "DEGRINGO5E.Group.TypeEncounter"
};
preLocalize("groupTypes");

/* -------------------------------------------- */

/**
 * Configuration information for activity types.
 *
 * @typedef {object} ActivityTypeConfiguration
 * @property {typeof Activity} documentClass  The activity's document class.
 * @property {boolean} [configurable=true]    Whether the activity is editable via the UI.
 * @property {boolean} [hidden]               Should this activity type be hidden in the selection dialog?
 */
DEGRINGO5E.activityTypes = {
  attack: {
    documentClass: activities.AttackActivity
  },
  cast: {
    documentClass: activities.CastActivity
  },
  check: {
    documentClass: activities.CheckActivity
  },
  damage: {
    documentClass: activities.DamageActivity
  },
  enchant: {
    documentClass: activities.EnchantActivity
  },
  forward: {
    documentClass: activities.ForwardActivity
  },
  heal: {
    documentClass: activities.HealActivity
  },
  order: {
    documentClass: activities.OrderActivity,
    configurable: false
  },
  save: {
    documentClass: activities.SaveActivity
  },
  summon: {
    documentClass: activities.SummonActivity
  },
  transform: {
    documentClass: activities.TransformActivity
  },
  utility: {
    documentClass: activities.UtilityActivity
  }
};

/* -------------------------------------------- */

/**
 * Configuration information for advancement types.
 *
 * @typedef {object} AdvancementTypeConfiguration
 * @property {typeof Advancement} documentClass  The advancement's document class.
 * @property {Set<string>} validItemTypes        What item types this advancement can be used with.
 * @property {boolean} [hidden]                  Should this advancement type be hidden in the selection dialog?
 */

const _ALL_ITEM_TYPES = ["background", "class", "race", "subclass"];

/**
 * Advancement types that can be added to items.
 * @enum {AdvancementTypeConfiguration}
 */
DEGRINGO5E.advancementTypes = {
  AbilityScoreImprovement: {
    documentClass: advancement.AbilityScoreImprovementAdvancement,
    validItemTypes: new Set(["background", "class", "race", "feat"])
  },
  HitPoints: {
    documentClass: advancement.HitPointsAdvancement,
    validItemTypes: new Set(["class"])
  },
  ItemChoice: {
    documentClass: advancement.ItemChoiceAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  },
  ItemGrant: {
    documentClass: advancement.ItemGrantAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  },
  ScaleValue: {
    documentClass: advancement.ScaleValueAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  },
  Size: {
    documentClass: advancement.SizeAdvancement,
    validItemTypes: new Set(["race"])
  },
  Subclass: {
    documentClass: advancement.SubclassAdvancement,
    validItemTypes: new Set(["class"])
  },
  Trait: {
    documentClass: advancement.TraitAdvancement,
    validItemTypes: new Set(_ALL_ITEM_TYPES)
  }
};

/* -------------------------------------------- */

/**
 * Default artwork configuration for each Document type and sub-type.
 * @type {Record<string, Record<string, string>>}
 */
DEGRINGO5E.defaultArtwork = {
  Item: {
    background: "systems/degringo5e/icons/svg/items/background.svg",
    class: "systems/degringo5e/icons/svg/items/class.svg",
    consumable: "systems/degringo5e/icons/svg/items/consumable.svg",
    container: "systems/degringo5e/icons/svg/items/container.svg",
    equipment: "systems/degringo5e/icons/svg/items/equipment.svg",
    facility: "systems/degringo5e/icons/svg/items/facility.svg",
    feat: "systems/degringo5e/icons/svg/items/feature.svg",
    loot: "systems/degringo5e/icons/svg/items/loot.svg",
    race: "systems/degringo5e/icons/svg/items/race.svg",
    spell: "systems/degringo5e/icons/svg/items/spell.svg",
    subclass: "systems/degringo5e/icons/svg/items/subclass.svg",
    tool: "systems/degringo5e/icons/svg/items/tool.svg",
    weapon: "systems/degringo5e/icons/svg/items/weapon.svg"
  }
};

/* -------------------------------------------- */
/*  Requests                                    */
/* -------------------------------------------- */

/**
 * Handler functions for named request/response operations
 * @type {Record<string, Function>}
 */
DEGRINGO5E.requests = {
  rest: Actor5e.handleRestRequest
};

/* -------------------------------------------- */
/*  Rules                                       */
/* -------------------------------------------- */

/**
 * Configuration information for rule types.
 *
 * @typedef {object} RuleTypeConfiguration
 * @property {string} label         Localized label for the rule type.
 * @property {string} [references]  Key path for a configuration object that contains reference data.
 */

/**
 * Types of rules that can be used in rule pages and the &Reference enricher.
 * @enum {RuleTypeConfiguration}
 */
DEGRINGO5E.ruleTypes = {
  rule: {
    label: "DEGRINGO5E.Rule.Type.Rule",
    references: "rules"
  },
  ability: {
    label: "DEGRINGO5E.Ability",
    references: "enrichmentLookup.abilities"
  },
  areaOfEffect: {
    label: "DEGRINGO5E.AreaOfEffect.Label",
    references: "areaTargetTypes"
  },
  condition: {
    label: "DEGRINGO5E.Rule.Type.Condition",
    references: "conditionTypes"
  },
  creatureType: {
    label: "DEGRINGO5E.CreatureType",
    references: "creatureTypes"
  },
  damage: {
    label: "DEGRINGO5E.DamageType",
    references: "damageTypes"
  },
  skill: {
    label: "DEGRINGO5E.Skill",
    references: "enrichmentLookup.skills"
  },
  spellComponent: {
    label: "DEGRINGO5E.SpellComponent",
    references: "itemProperties"
  },
  spellSchool: {
    label: "DEGRINGO5E.SpellSchool",
    references: "enrichmentLookup.spellSchools"
  },
  spellTag: {
    label: "DEGRINGO5E.SpellTag",
    references: "itemProperties"
  },
  weaponMastery: {
    label: "DEGRINGO5E.WEAPON.Mastery.Label",
    references: "weaponMasteries"
  }
};
preLocalize("ruleTypes", { key: "label" });

/* -------------------------------------------- */

/**
 * List of rules that can be referenced from enrichers.
 * @enum {string}
 */
DEGRINGO5E.rules = {
  inspiration: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.nkEPI89CiQnOaLYh",
  carryingcapacity: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.1PnjDBKbQJIVyc2t",
  push: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Hni8DjqLzoqsVjb6",
  lift: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Hni8DjqLzoqsVjb6",
  drag: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Hni8DjqLzoqsVjb6",
  encumbrance: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.JwqYf9qb6gJAWZKs",
  hiding: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.plHuoNdS0j3umPNS",
  passiveperception: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.988C2hQNyvqkdbND",
  time: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.eihqNjwpZ3HM4IqY",
  speed: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HhqeIiSj8sE1v1qZ",
  travelpace: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.eFAISahBloR2X8MX",
  forcedmarch: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.uQWQpRKQ1kWhuvjZ",
  difficultterrainpace: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hFW5BR2yHHwwgurD",
  climbing: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.KxUXbMrUCIAhv4AF",
  swimming: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.KxUXbMrUCIAhv4AF",
  longjump: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.1U0myNrOvIVBUdJV",
  highjump: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.raPwIkqKSv60ELmy",
  falling: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kREHL5pgNUOhay9f",
  suffocating: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.BIlnr0xYhqt4TGsi",
  vision: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.O6hamUbI9kVASN8b",
  light: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.O6hamUbI9kVASN8b",
  lightlyobscured: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.MAxtfJyvJV7EpzWN",
  heavilyobscured: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.wPFjfRruboxhtL4b",
  brightlight: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.RnMokVPyKGbbL8vi",
  dimlight: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.n1Ocpbyhr6HhgbCG",
  darkness: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4dfREIDjG5N4fvxd",
  blindsight: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.sacjsfm9ZXnw4Tqc",
  darkvision: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ldmA1PbnEGVkmE11",
  tremorsense: "Compendium.degringo5e.rules.JournalEntry.eVtpEGXjA2tamEIJ.JournalEntryPage.8AIlZ95v54mL531X",
  truesight: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kNa8rJFbtaTM3Rmk",
  food: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.jayo7XVgGnRCpTW0",
  water: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.iIEI87J7lr2sqtb5",
  resting: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.dpHJXYLigIdEseIb",
  shortrest: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.1s2swI3UsjUUgbt2",
  longrest: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6cLtjbHn4KV2R7G9",
  surprise: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.YmOt8HderKveA19K",
  initiative: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.RcwElV4GAcVXKWxo",
  bonusaction: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.2fu2CXsDg8gQmGGw",
  reaction: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.2VqLyxMyMxgXe2wC",
  difficultterrain: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6tqz947qO8vPyxvD",
  beingprone: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.bV8akkBdVUUG21CO",
  droppingprone: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hwTLpAtSS5OqQsI1",
  standingup: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hwTLpAtSS5OqQsI1",
  crawling: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.VWG9qe8PUNtS28Pw",
  movingaroundothercreatures: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9ZWCknaXCOdhyOrX",
  flying: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.0B1fxfmw0a48tPsc",
  size: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HWHRQVBVG7K0RVVW",
  space: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.WIA5bs3P45PmO3OS",
  squeezing: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.wKtOwagDAiNfVoPS",
  attack: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.f4fZHwBvpbpzRyn4",
  castaspell: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.GLwN36E4WXn3Cp4Z",
  dash: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.6l6nBKip4LqB1sCU",
  disengage: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.w1AGsemFERfjqWNx",
  dodge: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.3YJIuyCMmuUrfmuX",
  help: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.5S8i59qskkd9GGcJ",
  hide: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.rqhOsUY4wWa1oHTy",
  ready: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.nI9tN6Oq7fCV7hcA",
  search: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.ySj4gYZ4ADZoia7R",
  useanobject: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ljqhJx8Qxu2ivo69",
  attackrolls: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.W8uJrd1D8NeOuawp",
  unseenattackers: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.5ZJNwEPlsGurecg5",
  unseentargets: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.5ZJNwEPlsGurecg5",
  rangedattacks: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.S9aclVOCbusLE3kC",
  range: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HjKXuB8ndjcqOds7",
  rangedattacksinclosecombat: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.qEZvxW0NM7ixSQP5",
  meleeattacks: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.GTk6emvzNxl8Oosl",
  reach: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hgZ5ZN4B3y7tmFlt",
  unarmedstrike: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.xJjJ4lhymAYXAOvO",
  opportunityattacks: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.zeU0NyCyP10lkLg3",
  twoweaponfighting: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.FQTS08uH74A6psL2",
  grappling: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.YSLWJcQCP6kzsPql",
  escapingagrapple: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.2TZKy9YbMN3ZY3h8",
  movingagrappledcreature: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.x5bUdhAD7u5Bt2rg",
  shoving: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hrdqMF8hRXJdNzJx",
  cover: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.W7f7PcRubNUMIq2S",
  halfcover: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hv0J61IAfofuhy3Q",
  threequarterscover: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.zAMStUjUrPV10dFm",
  totalcover: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.BKUAxXuPEzxiEOeL",
  hitpoints: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.PFbzoMBviI2DD9QP",
  damagerolls: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.hd26AqKrCqtcQBWy",
  criticalhits: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.gFL1VhSEljL1zvje",
  damagetypes: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.jVOgf7DNEhkzYNIe",
  damageresistance: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.v0WE18nT5SJO8Ft7",
  damagevulnerability: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.v0WE18nT5SJO8Ft7",
  healing: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ICketFqbFslqKiX9",
  instantdeath: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.8BG05mA0mEzwmrHU",
  deathsavingthrows: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.JL8LePEJQYFdNuLL",
  deathsaves: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.JL8LePEJQYFdNuLL",
  stabilizing: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.r1CgZXLcqFop6Dlx",
  knockingacreatureout: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.uEwjgKGuCRTNADYv",
  temporaryhitpoints: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.AW6HpJZHqxfESXaq",
  temphp: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.AW6HpJZHqxfESXaq",
  mounting: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.MFpyvUIdcBpC9kIE",
  dismounting: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.MFpyvUIdcBpC9kIE",
  controllingamount: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.khmR2xFk1NxoQUgZ",
  underwatercombat: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6zVOeLyq4iMnrQT4",
  spelllevel: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.A6k5fS0kFqPXTW3v",
  knownspells: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.oezg742GlxmEwT85",
  preparedspells: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.oezg742GlxmEwT85",
  spellslots: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Su6wbb0O9UN4ZDIH",
  castingatahigherlevel: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4H9SLM95OCLfFizz",
  upcasting: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.4H9SLM95OCLfFizz",
  castinginarmor: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.z4A8vHSK2pb8YA9X",
  cantrips: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.jZD5mCTnMPJ9jW67",
  rituals: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.FjWqT5iyJ89kohdA",
  castingtime: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.zRVW8Tvyk6BECjZD",
  bonusactioncasting: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.RP1WL9FXI3aknlxZ",
  reactioncasting: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.t62lCfinwU9H7Lji",
  longercastingtimes: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.gOAIRFCyPUx42axn",
  spellrange: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.RBYPyE5z5hAZSbH6",
  components: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.xeHthAF9lxfn2tII",
  verbal: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6UXTNWMCQ0nSlwwx",
  spellduration: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9mp0SRsptjvJcq1e",
  instantaneous: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kdlgZOpRMB6bGCod",
  concentrating: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.ow58p27ctAnr4VPH",
  spelltargets: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.G80AIQr04sxdVpw4",
  areaofeffect: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.wvtCeGHgnUmh0cuj",
  pointoforigin: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.8HxbRceQQUAhyWRt",
  spellsavingthrows: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.8DajfNll90eeKcmB",
  spellattackrolls: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.qAFzmGZKhVvAEUF3",
  combiningmagicaleffects: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.TMIN963hG773yZzO",
  schoolsofmagic: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.TeF6CKMDRpYpsLd4",
  detectingtraps: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.DZ7AhdQ94xggG4bj",
  disablingtraps: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.DZ7AhdQ94xggG4bj",
  curingmadness: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.6Icem7G3CICdNOkM",
  damagethreshold: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9LJZhqvCburpags3",
  poisontypes: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.I6OMMWUaYCWR9xip",
  contactpoison: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.kXnCEqqGUWRZeZDj",
  ingestedpoison: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.Y0vsJYSWeQcFpJ27",
  inhaledpoison: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.KUyN4eK1xTBzXsjP",
  injurypoison: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.LUL48OUq6SJeMGc7",
  attunement: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.UQ65OwIyGK65eiOK",
  wearingitems: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.iPB8mGKuQx3X0Z2J",
  wieldingitems: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.iPB8mGKuQx3X0Z2J",
  multipleitemsofthesamekind: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.rLJdvz4Mde8GkEYQ",
  paireditems: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.rd9pCH8yFraSGN34",
  commandword: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.HiXixxLYesv6Ff3t",
  consumables: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.UEPAcZFzQ5x196zE",
  itemspells: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.DABoaeeF6w31UCsj",
  charges: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.NLRXcgrpRCfsA5mO",
  spellscroll: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.gi8IKhtOlBVhMJrN",
  creaturetags: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.9jV1fFF163dr68vd",
  telepathy: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.geTidcFIYWuUvD2L",
  legendaryactions: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.C1awOyZh78pq1xmY",
  lairactions: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.07PtjpMxiRIhkBEp",
  regionaleffects: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.uj8W27NKFyzygPUd",
  disease: "Compendium.degringo5e.content24.JournalEntry.phbAppendixDRule.JournalEntryPage.oNQWvyRZkTOJ8PBq",
  d20test: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.nxPH59t3iNtWJxnU",
  advantage: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.lvs9RRDi1UA1Lff8",
  disadvantage: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.fFrHBgqKUMY0Nnco",
  difficultyclass: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.afnB0KZZk2hKtjv4",
  armorclass: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.IL73rq9BlQowdon7",
  abilitycheck: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.XBQqXCoTbvp5Dika",
  savingthrow: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.Vlri6Mp6grn9wt3g",
  challengerating: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.BMoxmXB8pX6bOBus",
  expertise: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.69nu4Sk3V5O15GFf",
  influence: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.4V59Q1dlWjNhpJGo",
  magic: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.iIIDUsmSOkL0xNzF",
  study: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.Nuz0Wx4a4aAPcC34",
  utilize: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.UDlogfdiT2uYEZz4",
  friendly: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.RVcWSqblHIs7SUzn",
  indifferent: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.eYX5eimGuYhHPoj4",
  hostile: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.BNxLbtJofbNGzjsp",
  breakingobjects: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.RXTLVpAwcGm1qtKf",
  hazards: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.5hyEitPd1Kb27fP5",
  bloodied: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.shZaSIlFPpHufPFn",
  jumping: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.aaJOlRhI1H6vAxt9",
  resistance: "Compendium.degringo5e.content24.JournalEntry.phbAppendixCRule.JournalEntryPage.Uk3xhCTvEfx8BN1O"
};

/* -------------------------------------------- */
/*  Token Rings Framework                       */
/* -------------------------------------------- */

/**
 * Token Rings configuration data
 *
 * @typedef {object} TokenRingsConfiguration
 * @property {Record<string, string>} effects        Localized names of the configurable ring effects.
 * @property {string} spriteSheet                    The sprite sheet json source.
 * @property {typeof BaseSamplerShader} shaderClass  The shader class definition associated with the token ring.
 */

/**
 * @type {TokenRingsConfiguration}
 */
DEGRINGO5E.tokenRings = {
  effects: {
    RING_PULSE: "DEGRINGO5E.TokenRings.Effects.RingPulse",
    RING_GRADIENT: "DEGRINGO5E.TokenRings.Effects.RingGradient",
    BKG_WAVE: "DEGRINGO5E.TokenRings.Effects.BackgroundWave"
  },
  spriteSheet: "systems/degringo5e/tokens/composite/token-rings.json",
  shaderClass: null
};
preLocalize("tokenRings.effects");

/* -------------------------------------------- */
/*  Sources                                     */
/* -------------------------------------------- */

/**
 * List of books available as sources.
 * @enum {string}
 */
DEGRINGO5E.sourceBooks = {};
preLocalize("sourceBooks", { sort: true });

/* -------------------------------------------- */
/*  Themes                                      */
/* -------------------------------------------- */

/**
 * Themes that can be set for the system or on sheets.
 * @enum {string}
 */
DEGRINGO5E.themes = {
  light: "SHEETS.DEGRINGO5E.THEME.Light",
  dark: "SHEETS.DEGRINGO5E.THEME.Dark"
};
preLocalize("themes");

/* -------------------------------------------- */
/*  Enrichment                                  */
/* -------------------------------------------- */

let _enrichmentLookup;
Object.defineProperty(DEGRINGO5E, "enrichmentLookup", {
  get() {
    const slugify = value => value?.slugify().replaceAll("-", "");
    if ( !_enrichmentLookup ) {
      _enrichmentLookup = {
        abilities: foundry.utils.deepClone(DEGRINGO5E.abilities),
        skills: foundry.utils.deepClone(DEGRINGO5E.skills),
        spellSchools: foundry.utils.deepClone(DEGRINGO5E.spellSchools),
        tools: foundry.utils.deepClone(DEGRINGO5E.tools)
      };
      const addFullKeys = key => Object.entries(DEGRINGO5E[key]).forEach(([k, v]) =>
        _enrichmentLookup[key][slugify(v.fullKey)] = { ...v, key: k }
      );
      addFullKeys("abilities");
      addFullKeys("skills");
      addFullKeys("spellSchools");
    }
    return _enrichmentLookup;
  },
  enumerable: true
});

/* -------------------------------------------- */

/**
 * Patch an existing config enum to allow conversion from string values to object values without
 * breaking existing modules that are expecting strings.
 * @param {string} key          Key within DEGRINGO5E that has been replaced with an enum of objects.
 * @param {string} fallbackKey  Key within the new config object from which to get the fallback value.
 * @param {object} [options]    Additional options passed through to logCompatibilityWarning.
 */
function patchConfig(key, fallbackKey, options) {
  /** @override */
  function toString() {
    const message = `The value of CONFIG.DEGRINGO5E.${key} has been changed to an object.`
      +` The former value can be acccessed from .${fallbackKey}.`;
    foundry.utils.logCompatibilityWarning(message, options);
    return this[fallbackKey];
  }

  Object.values(DEGRINGO5E[key]).forEach(o => {
    if ( foundry.utils.getType(o) !== "Object" ) return;
    Object.defineProperty(o, "toString", {value: toString});
  });
}

/* -------------------------------------------- */

export default DEGRINGO5E;
