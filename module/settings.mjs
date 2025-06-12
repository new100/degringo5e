import BastionSettingsConfig from "./applications/settings/bastion-settings.mjs";
import CombatSettingsConfig from "./applications/settings/combat-settings.mjs";
import CompendiumBrowserSettingsConfig from "./applications/settings/compendium-browser-settings.mjs";
import ModuleArtSettingsConfig from "./applications/settings/module-art-settings.mjs";
import VariantRulesSettingsConfig from "./applications/settings/variant-rules-settings.mjs";
import VisibilitySettingsConfig from "./applications/settings/visibility-settings.mjs";
import BastionSetting from "./data/settings/bastion-setting.mjs";
import PrimaryPartySetting from "./data/settings/primary-party-setting.mjs";
import TransformationSetting from "./data/settings/transformation-setting.mjs";
import * as LEGACY from "./config-legacy.mjs";

/**
 * Register all of the system's keybindings.
 */
export function registerSystemKeybindings() {
  game.keybindings.register("degringo5e", "skipDialogNormal", {
    name: "KEYBINDINGS.DEGRINGO5E.SkipDialogNormal",
    editable: [{ key: "ShiftLeft" }, { key: "ShiftRight" }]
  });

  game.keybindings.register("degringo5e", "skipDialogAdvantage", {
    name: "KEYBINDINGS.DEGRINGO5E.SkipDialogAdvantage",
    editable: [{ key: "AltLeft" }, { key: "AltRight" }]
  });

  game.keybindings.register("degringo5e", "skipDialogDisadvantage", {
    name: "KEYBINDINGS.DEGRINGO5E.SkipDialogDisadvantage",
    editable: [{ key: "ControlLeft" }, { key: "ControlRight" }, { key: "OsLeft" }, { key: "OsRight" }]
  });

  game.keybindings.register("degringo5e", "dragCopy", {
    name: "KEYBINDINGS.DEGRINGO5E.DragCopy",
    editable: [{ key: "ControlLeft" }, { key: "ControlRight" }, { key: "AltLeft" }, { key: "AltRight" }]
  });

  game.keybindings.register("degringo5e", "dragMove", {
    name: "KEYBINDINGS.DEGRINGO5E.DragMove",
    editable: [{ key: "ShiftLeft" }, { key: "ShiftRight" }, { key: "OsLeft" }, { key: "OsRight" }]
  });
}

/* -------------------------------------------- */

/**
 * Register all of the system's settings.
 */
export function registerSystemSettings() {
  // Internal System Migration Version
  game.settings.register("degringo5e", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // Polymorph Settings
  game.settings.register("degringo5e", "transformationSettings", {
    scope: "client",
    config: false,
    type: TransformationSetting
  });

  // Rules version
  game.settings.register("degringo5e", "rulesVersion", {
    name: "SETTINGS.DEGRINGO5E.RULESVERSION.Name",
    hint: "SETTINGS.DEGRINGO5E.RULESVERSION.Hint",
    scope: "world",
    config: true,
    default: "modern",
    type: String,
    choices: {
      modern: "SETTINGS.DEGRINGO5E.RULESVERSION.Modern",
      legacy: "SETTINGS.DEGRINGO5E.RULESVERSION.Legacy"
    },
    requiresReload: true
  });

  // Allow rotating square templates
  game.settings.register("degringo5e", "gridAlignedSquareTemplates", {
    name: "SETTINGS.5eGridAlignedSquareTemplatesN",
    hint: "SETTINGS.5eGridAlignedSquareTemplatesL",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  // Loyalty
  game.settings.register("degringo5e", "loyaltyScore", {
    name: "SETTINGS.DEGRINGO5E.LOYALTY.Name",
    hint: "SETTINGS.DEGRINGO5E.LOYALTY.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Disable Advancements
  game.settings.register("degringo5e", "disableAdvancements", {
    name: "SETTINGS.5eNoAdvancementsN",
    hint: "SETTINGS.5eNoAdvancementsL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Disable Concentration Tracking
  game.settings.register("degringo5e", "disableConcentration", {
    name: "SETTINGS.5eNoConcentrationN",
    hint: "SETTINGS.5eNoConcentrationL",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Collapse Item Cards (by default)
  game.settings.register("degringo5e", "autoCollapseItemCards", {
    name: "SETTINGS.5eAutoCollapseCardN",
    hint: "SETTINGS.5eAutoCollapseCardL",
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
    onChange: s => {
      ui.chat.render();
    }
  });

  // Collapse Chat Card Trays
  game.settings.register("degringo5e", "autoCollapseChatTrays", {
    name: "SETTINGS.DEGRINGO5E.COLLAPSETRAYS.Name",
    hint: "SETTINGS.DEGRINGO5E.COLLAPSETRAYS.Hint",
    scope: "client",
    config: true,
    default: "older",
    type: String,
    choices: {
      never: "SETTINGS.DEGRINGO5E.COLLAPSETRAYS.Never",
      older: "SETTINGS.DEGRINGO5E.COLLAPSETRAYS.Older",
      always: "SETTINGS.DEGRINGO5E.COLLAPSETRAYS.Always"
    }
  });

  // Allow Polymorphing
  game.settings.register("degringo5e", "allowPolymorphing", {
    name: "SETTINGS.DEGRINGO5E.PERMISSIONS.AllowTransformation.Name",
    hint: "SETTINGS.DEGRINGO5E.PERMISSIONS.AllowTransformation.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Allow Summoning
  game.settings.register("degringo5e", "allowSummoning", {
    name: "SETTINGS.DEGRINGO5E.PERMISSIONS.AllowSummoning.Name",
    hint: "SETTINGS.DEGRINGO5E.PERMISSIONS.AllowSummoning.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // Metric Length Weights
  game.settings.register("degringo5e", "metricLengthUnits", {
    name: "SETTINGS.DEGRINGO5E.METRIC.LengthUnits.Name",
    hint: "SETTINGS.DEGRINGO5E.METRIC.LengthUnits.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Metric Volume Weights
  game.settings.register("degringo5e", "metricVolumeUnits", {
    name: "SETTINGS.DEGRINGO5E.METRIC.VolumeUnits.Name",
    hint: "SETTINGS.DEGRINGO5E.METRIC.VolumeUnits.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Metric Unit Weights
  game.settings.register("degringo5e", "metricWeightUnits", {
    name: "SETTINGS.DEGRINGO5E.METRIC.WeightUnits.Name",
    hint: "SETTINGS.DEGRINGO5E.METRIC.WeightUnits.Hint",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  // Strict validation
  game.settings.register("degringo5e", "strictValidation", {
    scope: "world",
    config: false,
    type: Boolean,
    default: true
  });

  // Dynamic art.
  game.settings.registerMenu("degringo5e", "moduleArtConfiguration", {
    name: "DEGRINGO5E.ModuleArtConfigN",
    label: "DEGRINGO5E.ModuleArtConfigL",
    hint: "DEGRINGO5E.ModuleArtConfigH",
    icon: "fa-solid fa-palette",
    type: ModuleArtSettingsConfig,
    restricted: true
  });

  game.settings.register("degringo5e", "moduleArtConfiguration", {
    name: "Module Art Configuration",
    scope: "world",
    config: false,
    type: Object,
    default: {
      degringo5e: {
        portraits: true,
        tokens: true
      }
    }
  });

  // Compendium Browser source exclusion
  game.settings.registerMenu("degringo5e", "packSourceConfiguration", {
    name: "DEGRINGO5E.CompendiumBrowser.Sources.Name",
    label: "DEGRINGO5E.CompendiumBrowser.Sources.Label",
    hint: "DEGRINGO5E.CompendiumBrowser.Sources.Hint",
    icon: "fas fa-book-open-reader",
    type: CompendiumBrowserSettingsConfig,
    restricted: true
  });

  game.settings.register("degringo5e", "packSourceConfiguration", {
    name: "Pack Source Configuration",
    scope: "world",
    config: false,
    type: Object,
    default: {}
  });

  // Bastions
  game.settings.registerMenu("degringo5e", "bastionConfiguration", {
    name: "DEGRINGO5E.Bastion.Configuration.Name",
    label: "DEGRINGO5E.Bastion.Configuration.Label",
    hint: "DEGRINGO5E.Bastion.Configuration.Hint",
    icon: "fas fa-chess-rook",
    type: BastionSettingsConfig,
    restricted: true
  });

  game.settings.register("degringo5e", "bastionConfiguration", {
    name: "Bastion Configuration",
    scope: "world",
    config: false,
    type: BastionSetting,
    default: {
      button: false,
      enabled: false,
      duration: 7
    },
    onChange: () => game.degringo5e.bastion.initializeUI()
  });

  // Combat Settings
  game.settings.registerMenu("degringo5e", "combatConfiguration", {
    name: "SETTINGS.DEGRINGO5E.COMBAT.Name",
    label: "SETTINGS.DEGRINGO5E.COMBAT.Label",
    hint: "SETTINGS.DEGRINGO5E.COMBAT.Hint",
    icon: "fas fa-explosion",
    type: CombatSettingsConfig,
    restricted: true
  });

  game.settings.register("degringo5e", "autoRecharge", {
    name: "SETTINGS.DEGRINGO5E.NPCS.AutoRecharge.Name",
    hint: "SETTINGS.DEGRINGO5E.NPCS.AutoRecharge.Hint",
    scope: "world",
    config: false,
    default: "no",
    type: String,
    choices: {
      no: "SETTINGS.DEGRINGO5E.NPCS.AutoRecharge.No",
      silent: "SETTINGS.DEGRINGO5E.NPCS.AutoRecharge.Silent",
      yes: "SETTINGS.DEGRINGO5E.NPCS.AutoRecharge.Yes"
    }
  });

  game.settings.register("degringo5e", "autoRollNPCHP", {
    name: "SETTINGS.DEGRINGO5E.NPCS.AutoRollNPCHP.Name",
    hint: "SETTINGS.DEGRINGO5E.NPCS.AutoRollNPCHP.Hint",
    scope: "world",
    config: false,
    default: "no",
    type: String,
    choices: {
      no: "SETTINGS.DEGRINGO5E.NPCS.AutoRollNPCHP.No",
      silent: "SETTINGS.DEGRINGO5E.NPCS.AutoRollNPCHP.Silent",
      yes: "SETTINGS.DEGRINGO5E.NPCS.AutoRollNPCHP.Yes"
    }
  });

  game.settings.register("degringo5e", "criticalDamageModifiers", {
    name: "SETTINGS.DEGRINGO5E.CRITICAL.MultiplyModifiers.Name",
    hint: "SETTINGS.DEGRINGO5E.CRITICAL.MultiplyModifiers.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.register("degringo5e", "criticalDamageMaxDice", {
    name: "SETTINGS.DEGRINGO5E.CRITICAL.MaxDice.Name",
    hint: "SETTINGS.DEGRINGO5E.CRITICAL.MaxDice.Hint",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.register("degringo5e", "initiativeDexTiebreaker", {
    name: "SETTINGS.DEGRINGO5E.COMBAT.DexTiebreaker.Name",
    hint: "SETTINGS.DEGRINGO5E.COMBAT.DexTiebreaker.Hint",
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });

  game.settings.register("degringo5e", "initiativeScore", {
    name: "SETTINGS.DEGRINGO5E.COMBAT.InitiativeScore.Name",
    hint: "SETTINGS.DEGRINGO5E.COMBAT.InitiativeScore.Hint",
    scope: "world",
    config: false,
    default: "none",
    type: String,
    choices: {
      none: "SETTINGS.DEGRINGO5E.COMBAT.InitiativeScore.None",
      npcs: "SETTINGS.DEGRINGO5E.COMBAT.InitiativeScore.NPCs",
      all: "SETTINGS.DEGRINGO5E.COMBAT.InitiativeScore.All"
    }
  });

  // Variant Rules
  game.settings.registerMenu("degringo5e", "variantRulesConfiguration", {
    name: "SETTINGS.DEGRINGO5E.VARIANT.Name",
    label: "SETTINGS.DEGRINGO5E.VARIANT.Label",
    hint: "SETTINGS.DEGRINGO5E.VARIANT.Hint",
    icon: "fas fa-list-check",
    type: VariantRulesSettingsConfig,
    restricted: true
  });

  game.settings.register("degringo5e", "allowFeats", {
    name: "SETTINGS.DEGRINGO5E.VARIANT.AllowFeats.Name",
    hint: "SETTINGS.DEGRINGO5E.VARIANT.AllowFeats.Hint",
    scope: "world",
    config: false,
    default: true,
    type: Boolean
  });

  game.settings.register("degringo5e", "currencyWeight", {
    name: "SETTINGS.DEGRINGO5E.VARIANT.CurrencyWeight.Name",
    hint: "SETTINGS.DEGRINGO5E.VARIANT.CurrencyWeight.Hint",
    scope: "world",
    config: false,
    default: true,
    type: Boolean
  });

  game.settings.register("degringo5e", "encumbrance", {
    name: "SETTINGS.DEGRINGO5E.VARIANT.Encumbrance.Name",
    hint: "SETTINGS.DEGRINGO5E.VARIANT.Encumbrance.Hint",
    scope: "world",
    config: false,
    default: "none",
    type: String,
    choices: {
      none: "SETTINGS.DEGRINGO5E.VARIANT.Encumbrance.None",
      normal: "SETTINGS.DEGRINGO5E.VARIANT.Encumbrance.Normal",
      variant: "SETTINGS.DEGRINGO5E.VARIANT.Encumbrance.Variant"
    }
  });

  game.settings.register("degringo5e", "honorScore", {
    name: "SETTINGS.DEGRINGO5E.VARIANT.HonorScore.Name",
    hint: "SETTINGS.DEGRINGO5E.VARIANT.HonorScore.Hint",
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  game.settings.register("degringo5e", "levelingMode", {
    name: "SETTINGS.DEGRINGO5E.VARIANT.LevelingMode.Name",
    hint: "SETTINGS.DEGRINGO5E.VARIANT.LevelingMode.Hint",
    scope: "world",
    config: false,
    default: "xpBoons",
    type: String,
    choices: {
      noxp: "SETTINGS.DEGRINGO5E.VARIANT.LevelingMode.NoXP",
      xp: "SETTINGS.DEGRINGO5E.VARIANT.LevelingMode.XP",
      xpBoons: "SETTINGS.DEGRINGO5E.VARIANT.LevelingMode.XPBoons"
    }
  });

  game.settings.register("degringo5e", "proficiencyModifier", {
    name: "SETTINGS.DEGRINGO5E.VARIANT.ProficiencyModifier.Name",
    hint: "SETTINGS.DEGRINGO5E.VARIANT.ProficiencyModifier.Hint",
    scope: "world",
    config: false,
    default: "bonus",
    type: String,
    choices: {
      bonus: "SETTINGS.DEGRINGO5E.VARIANT.ProficiencyModifier.Bonus",
      dice: "SETTINGS.DEGRINGO5E.VARIANT.ProficiencyModifier.Dice"
    }
  });

  game.settings.register("degringo5e", "restVariant", {
    name: "SETTINGS.DEGRINGO5E.VARIANT.Rest.Name",
    hint: "SETTINGS.DEGRINGO5E.VARIANT.Rest.Hint",
    scope: "world",
    config: false,
    default: "normal",
    type: String,
    choices: {
      normal: "SETTINGS.DEGRINGO5E.VARIANT.Rest.Normal",
      gritty: "SETTINGS.DEGRINGO5E.VARIANT.Rest.Gritty",
      epic: "SETTINGS.DEGRINGO5E.VARIANT.Rest.Epic"
    }
  });

  game.settings.register("degringo5e", "sanityScore", {
    name: "SETTINGS.DEGRINGO5E.VARIANT.SanityScore.Name",
    hint: "SETTINGS.DEGRINGO5E.VARIANT.SanityScore.Hint",
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
    requiresReload: true
  });

  // Visibility Settings
  game.settings.registerMenu("degringo5e", "visibilityConfiguration", {
    name: "SETTINGS.DEGRINGO5E.VISIBILITY.Name",
    label: "SETTINGS.DEGRINGO5E.VISIBILITY.Label",
    hint: "SETTINGS.DEGRINGO5E.VISIBILITY.Hint",
    icon: "fas fa-eye",
    type: VisibilitySettingsConfig,
    restricted: true
  });

  game.settings.register("degringo5e", "attackRollVisibility", {
    name: "SETTINGS.DEGRINGO5E.VISIBILITY.Attack.Name",
    hint: "SETTINGS.DEGRINGO5E.VISIBILITY.Attack.Hint",
    scope: "world",
    config: false,
    default: "none",
    type: String,
    choices: {
      all: "SETTINGS.DEGRINGO5E.VISIBILITY.Attack.All",
      hideAC: "SETTINGS.DEGRINGO5E.VISIBILITY.Attack.HideAC",
      none: "SETTINGS.DEGRINGO5E.VISIBILITY.Attack.None"
    }
  });

  game.settings.register("degringo5e", "bloodied", {
    name: "SETTINGS.DEGRINGO5E.BLOODIED.Name",
    hint: "SETTINGS.DEGRINGO5E.BLOODIED.Hint",
    scope: "world",
    config: false,
    default: "player",
    type: String,
    choices: {
      all: "SETTINGS.DEGRINGO5E.BLOODIED.All",
      player: "SETTINGS.DEGRINGO5E.BLOODIED.Player",
      none: "SETTINGS.DEGRINGO5E.BLOODIED.None"
    }
  });

  game.settings.register("degringo5e", "challengeVisibility", {
    name: "SETTINGS.DEGRINGO5E.VISIBILITY.Challenge.Name",
    hint: "SETTINGS.DEGRINGO5E.VISIBILITY.Challenge.Hint",
    scope: "world",
    config: false,
    default: "player",
    type: String,
    choices: {
      all: "SETTINGS.DEGRINGO5E.VISIBILITY.Challenge.All",
      player: "SETTINGS.DEGRINGO5E.VISIBILITY.Challenge.Player",
      none: "SETTINGS.DEGRINGO5E.VISIBILITY.Challenge.None"
    }
  });

  game.settings.register("degringo5e", "concealItemDescriptions", {
    name: "SETTINGS.DEGRINGO5E.VISIBILITY.ItemDescriptions.Name",
    hint: "SETTINGS.DEGRINGO5E.VISIBILITY.ItemDescriptions.Hint",
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });

  // Primary Group
  game.settings.register("degringo5e", "primaryParty", {
    name: "Primary Party",
    scope: "world",
    config: false,
    default: null,
    type: PrimaryPartySetting,
    onChange: s => ui.actors.render()
  });

  // Control hints
  game.settings.register("degringo5e", "controlHints", {
    name: "DEGRINGO5E.Controls.Name",
    hint: "DEGRINGO5E.Controls.Hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  // NPC sheet default skills
  game.settings.register("degringo5e", "defaultSkills", {
    name: "SETTINGS.DEGRINGO5E.DEFAULTSKILLS.Name",
    hint: "SETTINGS.DEGRINGO5E.DEFAULTSKILLS.Hint",
    type: new foundry.data.fields.SetField(
      new foundry.data.fields.StringField({
        choices: () => CONFIG.DEGRINGO5E.skills
      })
    ),
    default: [],
    config: true
  });
}

/* -------------------------------------------- */

/**
 * Register additional settings after modules have had a chance to initialize to give them a chance to modify choices.
 */
export function registerDeferredSettings() {
  game.settings.register("degringo5e", "theme", {
    name: "SETTINGS.DEGRINGO5E.THEME.Name",
    hint: "SETTINGS.DEGRINGO5E.THEME.Hint",
    scope: "client",
    config: false,
    default: "",
    type: String,
    choices: {
      "": "SHEETS.DEGRINGO5E.THEME.Automatic",
      ...CONFIG.DEGRINGO5E.themes
    },
    onChange: s => setTheme(document.body, s)
  });

  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    setTheme(document.body, game.settings.get("degringo5e", "theme"));
  });
  matchMedia("(prefers-contrast: more)").addEventListener("change", () => {
    setTheme(document.body, game.settings.get("degringo5e", "theme"));
  });

  // Hook into core color scheme setting.
  const setting = game.settings.get("core", "uiConfig");
  const settingConfig = game.settings.settings.get("core.uiConfig");
  const { onChange } = settingConfig ?? {};
  if ( onChange ) settingConfig.onChange = (s, ...args) => {
    onChange(s, ...args);
    setTheme(document.body, s.colorScheme);
  };
  setTheme(document.body, setting.colorScheme);
}

/* -------------------------------------------- */

/**
 * Update configuration data when legacy rules are set.
 */
export function applyLegacyRules() {
  const DEGRINGO5E = CONFIG.DEGRINGO5E;

  // Set half-casters to round down.
  delete DEGRINGO5E.spellcastingTypes.leveled.progression.half.roundUp;

  // Adjust Wild Shape and Polymorph presets.
  for ( const preset of ["polymorph", "wildshape"] ) {
    DEGRINGO5E.transformation.presets[preset].settings.keep.delete("hp");
    DEGRINGO5E.transformation.presets[preset].settings.keep.delete("type");
    delete DEGRINGO5E.transformation.presets[preset].settings.tempFormula;
  }

  // Adjust language categories.
  delete DEGRINGO5E.languages.standard.children.sign;
  DEGRINGO5E.languages.exotic.children.draconic = DEGRINGO5E.languages.standard.children.draconic;
  delete DEGRINGO5E.languages.standard.children.draconic;
  DEGRINGO5E.languages.cant = DEGRINGO5E.languages.exotic.children.cant;
  delete DEGRINGO5E.languages.exotic.children.cant;
  DEGRINGO5E.languages.druidic = DEGRINGO5E.languages.exotic.children.druidic;
  delete DEGRINGO5E.languages.exotic.children.druidic;

  // Stunned stops movement in legacy & surprised doesn't provide initiative disadvantage.
  DEGRINGO5E.conditionEffects.noMovement.add("stunned");
  DEGRINGO5E.conditionEffects.initiativeAdvantage.delete("invisible");
  DEGRINGO5E.conditionEffects.initiativeDisadvantage.delete("incapacitated");
  DEGRINGO5E.conditionEffects.initiativeDisadvantage.delete("surprised");

  // Adjust references.
  Object.assign(DEGRINGO5E.rules, LEGACY.RULES);
  for ( const [cat, value] of Object.entries(LEGACY.REFERENCES) ) {
    Object.entries(value).forEach(([k, v]) => DEGRINGO5E[cat][k].reference = v);
  }

  // Adjust base item IDs.
  for ( const [cat, value] of Object.entries(LEGACY.IDS) ) {
    if ( cat === "focusTypes" ) Object.entries(value).forEach(([k, v]) => DEGRINGO5E[cat][k].itemIds = v);
    else if ( cat === "tools" ) Object.entries(value).forEach(([k, v]) => DEGRINGO5E[cat][k].id = v);
    else DEGRINGO5E[cat] = value;
  }

  // Swap spell lists.
  DEGRINGO5E.SPELL_LISTS = LEGACY.SPELL_LISTS;
}

/* -------------------------------------------- */

/**
 * Set the theme on an element, removing the previous theme class in the process.
 * @param {HTMLElement} element     Body or sheet element on which to set the theme data.
 * @param {string} [theme=""]       Theme key to set.
 * @param {Set<string>} [flags=[]]  Additional theming flags to set.
 */
export function setTheme(element, theme="", flags=new Set()) {
  if ( foundry.utils.getType(theme) === "Object" ) theme = theme.applications;
  element.className = element.className.replace(/\bdegringo5e-(theme|flag)-[\w-]+\b/g, "");

  // Primary Theme
  if ( !theme && (element === document.body) ) {
    if ( matchMedia("(prefers-color-scheme: dark)").matches ) theme = "dark";
    if ( matchMedia("(prefers-color-scheme: light)").matches ) theme = "light";
  }
  if ( theme ) {
    element.classList.add(`degringo5e-theme-${theme.slugify()}`);
    element.dataset.theme = theme;
  }
  else delete element.dataset.theme;

  // Additional Flags
  if ( (element === document.body) && matchMedia("(prefers-contrast: more)").matches ) flags.add("high-contrast");
  for ( const flag of flags ) element.classList.add(`degringo5e-flag-${flag.slugify()}`);
  element.dataset.themeFlags = Array.from(flags).join(" ");
}
