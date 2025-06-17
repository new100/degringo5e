/**
 * The D&D fifth edition game system for Foundry Virtual Tabletop
 * A system for playing the fifth edition of the world's most popular role-playing game.
 * Author: Atropos
 * Software License: MIT
 * Content License: https://www.dndbeyond.com/attachments/39j2li89/SRD5.1-CCBY4.0License.pdf
 *                  https://media.dndbeyond.com/compendium-images/srd/5.2/SRD_CC_v5.2.pdf
 * Repository: https://github.com/foundryvtt/degringo5e
 * Issue Tracker: https://github.com/foundryvtt/degringo5e/issues
 */

// Import Configuration
import DEGRINGO5E from "./module/config.mjs";
import {
  applyLegacyRules, registerDeferredSettings, registerSystemKeybindings, registerSystemSettings
} from "./module/settings.mjs";

// Import Submodules
import * as applications from "./module/applications/_module.mjs";
import * as canvas from "./module/canvas/_module.mjs";
import * as dataModels from "./module/data/_module.mjs";
import * as dice from "./module/dice/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as enrichers from "./module/enrichers.mjs";
import * as Filter from "./module/filter.mjs";
import * as migrations from "./module/migration.mjs";
import ModuleArt from "./module/module-art.mjs";
import { registerModuleData, setupModulePacks } from "./module/module-registration.mjs";
import { default as registry } from "./module/registry.mjs";
import Tooltips5e from "./module/tooltips.mjs";
import * as utils from "./module/utils.mjs";
import DragDrop5e from "./module/drag-drop.mjs";

/* -------------------------------------------- */
/*  Define Module Structure                     */
/* -------------------------------------------- */

globalThis.degringo5e = {
  applications,
  canvas,
  config: DEGRINGO5E,
  dataModels,
  dice,
  documents,
  enrichers,
  Filter,
  migrations,
  registry,
  utils
};

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", function() {
  globalThis.degringo5e = game.degringo5e = Object.assign(game.system, globalThis.degringo5e);
  utils.log(`Initializing the D&D Fifth Game System - Version ${degringo5e.version}\n${DEGRINGO5E.ASCII}`);

  // Record Configuration Values
  CONFIG.DEGRINGO5E = DEGRINGO5E;
  CONFIG.ActiveEffect.documentClass = documents.ActiveEffect5e;
  CONFIG.ActiveEffect.legacyTransferral = false;
  CONFIG.Actor.documentClass = documents.Actor5e;
  CONFIG.ChatMessage.documentClass = documents.ChatMessage5e;
  CONFIG.Combat.documentClass = documents.Combat5e;
  CONFIG.Combatant.documentClass = documents.Combatant5e;
  CONFIG.CombatantGroup.documentClass = documents.CombatantGroup5e;
  CONFIG.Item.collection = dataModels.collection.Items5e;
  CONFIG.Item.compendiumIndexFields.push("system.container");
  CONFIG.Item.documentClass = documents.Item5e;
  CONFIG.JournalEntryPage.documentClass = documents.JournalEntryPage5e;
  CONFIG.Token.documentClass = documents.TokenDocument5e;
  CONFIG.Token.objectClass = canvas.Token5e;
  CONFIG.User.documentClass = documents.User5e;
  CONFIG.time.roundTime = 6;
  Roll.TOOLTIP_TEMPLATE = "systems/degringo5e/templates/chat/roll-breakdown.hbs";
  CONFIG.Dice.BasicRoll = dice.BasicRoll;
  CONFIG.Dice.DamageRoll = dice.DamageRoll;
  CONFIG.Dice.D20Die = dice.D20Die;
  CONFIG.Dice.D20Roll = dice.D20Roll;
  CONFIG.MeasuredTemplate.defaults.angle = 53.13; // 5e cone RAW should be 53.13 degrees
  CONFIG.Note.objectClass = canvas.Note5e;
  CONFIG.ui.chat = applications.ChatLog5e;
  CONFIG.ui.combat = applications.combat.CombatTracker5e;
  CONFIG.ui.items = applications.item.ItemDirectory5e;
  CONFIG.ux.DragDrop = DragDrop5e;

  // Register System Settings
  registerSystemSettings();
  registerSystemKeybindings();

  // Configure module art
  game.degringo5e.moduleArt = new ModuleArt();

  // Configure bastions
  game.degringo5e.bastion = new documents.Bastion();

  // Configure tooltips
  game.degringo5e.tooltips = new Tooltips5e();

  // Remove honor & sanity from configuration if they aren't enabled
  if ( !game.settings.get("degringo5e", "honorScore") ) delete DEGRINGO5E.abilities.hon;
  if ( !game.settings.get("degringo5e", "sanityScore") ) delete DEGRINGO5E.abilities.san;

  // Legacy rules.
  if ( game.settings.get("degringo5e", "rulesVersion") === "legacy" ) applyLegacyRules();

  // Register system
  DEGRINGO5E.SPELL_LISTS.forEach(uuid => degringo5e.registry.spellLists.register(uuid));

  // Register module data from manifests
  registerModuleData();

  // Register Roll Extensions
  CONFIG.Dice.rolls = [dice.BasicRoll, dice.D20Roll, dice.DamageRoll];

  // Hook up system data types
  CONFIG.ActiveEffect.dataModels = dataModels.activeEffect.config;
  CONFIG.Actor.dataModels = dataModels.actor.config;
  CONFIG.ChatMessage.dataModels = dataModels.chatMessage.config;
  CONFIG.Item.dataModels = dataModels.item.config;
  CONFIG.JournalEntryPage.dataModels = dataModels.journal.config;
  Object.assign(CONFIG.RegionBehavior.dataModels, dataModels.regionBehavior.config);
  Object.assign(CONFIG.RegionBehavior.typeIcons, dataModels.regionBehavior.icons);

  // Add fonts
  _configureFonts();

  // Register sheet application classes
  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
  DocumentSheetConfig.unregisterSheet(Actor, "core", foundry.appv1.sheets.ActorSheet);
  DocumentSheetConfig.registerSheet(Actor, "degringo5e", applications.actor.CharacterActorSheet, {
    types: ["character"],
    makeDefault: true,
    label: "DEGRINGO5E.SheetClass.Character"
  });
  DocumentSheetConfig.registerSheet(Actor, "degringo5e", applications.actor.NPCActorSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "DEGRINGO5E.SheetClass.NPC"
  });
  DocumentSheetConfig.registerSheet(Actor, "degringo5e", applications.actor.ActorSheet5eVehicle, {
    types: ["vehicle"],
    makeDefault: true,
    label: "DEGRINGO5E.SheetClass.Vehicle"
  });
  DocumentSheetConfig.registerSheet(Actor, "degringo5e", applications.actor.GroupActorSheet, {
    types: ["group"],
    makeDefault: true,
    label: "DEGRINGO5E.SheetClass.Group"
  });

  DocumentSheetConfig.unregisterSheet(Item, "core", foundry.appv1.sheets.ItemSheet);
  DocumentSheetConfig.registerSheet(Item, "degringo5e", applications.item.ItemSheet5e, {
    makeDefault: true,
    label: "DEGRINGO5E.SheetClass.Item"
  });
  DocumentSheetConfig.unregisterSheet(Item, "degringo5e", applications.item.ItemSheet5e, { types: ["container"] });
  DocumentSheetConfig.registerSheet(Item, "degringo5e", applications.item.ContainerSheet, {
    makeDefault: true,
    types: ["container"],
    label: "DEGRINGO5E.SheetClass.Container"
  });

  DocumentSheetConfig.registerSheet(JournalEntry, "degringo5e", applications.journal.JournalSheet5e, {
    makeDefault: true,
    label: "DEGRINGO5E.SheetClass.JournalEntry"
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "degringo5e", applications.journal.JournalClassPageSheet, {
    label: "DEGRINGO5E.SheetClass.ClassSummary",
    types: ["class", "subclass"]
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "degringo5e", applications.journal.JournalMapLocationPageSheet, {
    label: "DEGRINGO5E.SheetClass.MapLocation",
    types: ["map"]
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "degringo5e", applications.journal.JournalRulePageSheet, {
    label: "DEGRINGO5E.SheetClass.Rule",
    types: ["rule"]
  });
  DocumentSheetConfig.registerSheet(JournalEntryPage, "degringo5e", applications.journal.JournalSpellListPageSheet, {
    label: "DEGRINGO5E.SheetClass.SpellList",
    types: ["spells"]
  });

  DocumentSheetConfig.unregisterSheet(RegionBehavior, "core", foundry.applications.sheets.RegionBehaviorConfig, {
    types: ["degringo5e.rotateArea"]
  });
  DocumentSheetConfig.registerSheet(RegionBehavior, "degringo5e", applications.regionBehavior.RotateAreaConfig, {
    label: "DEGRINGO5E.SheetClass.RotateArea",
    types: ["degringo5e.rotateArea"]
  });

  CONFIG.Token.prototypeSheetClass = applications.PrototypeTokenConfig5e;
  DocumentSheetConfig.unregisterSheet(TokenDocument, "core", foundry.applications.sheets.TokenConfig);
  DocumentSheetConfig.registerSheet(TokenDocument, "degringo5e", applications.TokenConfig5e, {
    label: "DEGRINGO5E.SheetClass.Token"
  });

  // Preload Handlebars helpers & partials
  utils.registerHandlebarsHelpers();
  utils.preloadHandlebarsTemplates();

  // Enrichers
  enrichers.registerCustomEnrichers();

  // Exhaustion handling
  documents.ActiveEffect5e.registerHUDListeners();
});

/* -------------------------------------------- */

/**
 * Configure explicit lists of attributes that are trackable on the token HUD and in the combat tracker.
 * @internal
 */
function _configureTrackableAttributes() {
  const common = {
    bar: [],
    value: [
      ...Object.keys(DEGRINGO5E.abilities).map(ability => `abilities.${ability}.value`),
      ...Object.keys(DEGRINGO5E.movementTypes).map(movement => `attributes.movement.${movement}`),
      "attributes.ac.value", "attributes.init.total"
    ]
  };

  const altSpells = Object.entries(DEGRINGO5E.spellPreparationModes).reduce((acc, [k, v]) => {
    if ( !["prepared", "always"].includes(k) && v.upcast ) acc.push(`spells.${k}`);
    return acc;
  }, []);

  const creature = {
    bar: [
      ...common.bar,
      "attributes.hp",
      ...altSpells,
      ...Array.fromRange(Object.keys(DEGRINGO5E.spellLevels).length - 1, 1).map(l => `spells.spell${l}`)
    ],
    value: [
      ...common.value,
      ...Object.keys(DEGRINGO5E.skills).map(skill => `skills.${skill}.passive`),
      ...Object.keys(DEGRINGO5E.senses).map(sense => `attributes.senses.${sense}`),
      "attributes.spell.attack", "attributes.spell.dc"
    ]
  };

  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: [...creature.bar, "resources.primary", "resources.secondary", "resources.tertiary", "details.xp"],
      value: [...creature.value]
    },
    npc: {
      bar: [...creature.bar, "resources.legact", "resources.legres"],
      value: [...creature.value, "attributes.spell.level", "details.cr", "details.xp.value"]
    },
    vehicle: {
      bar: [...common.bar, "attributes.hp"],
      value: [...common.value]
    },
    group: {
      bar: [],
      value: []
    }
  };
}

/* -------------------------------------------- */

/**
 * Configure which attributes are available for item consumption.
 * @internal
 */
function _configureConsumableAttributes() {
  const altSpells = Object.entries(DEGRINGO5E.spellPreparationModes).reduce((acc, [k, v]) => {
    if ( !["prepared", "always"].includes(k) && v.upcast ) acc.push(`spells.${k}.value`);
    return acc;
  }, []);

  CONFIG.DEGRINGO5E.consumableResources = [
    ...Object.keys(DEGRINGO5E.abilities).map(ability => `abilities.${ability}.value`),
    "attributes.ac.flat",
    "attributes.hp.value",
    "attributes.exhaustion",
    ...Object.keys(DEGRINGO5E.senses).map(sense => `attributes.senses.${sense}`),
    ...Object.keys(DEGRINGO5E.movementTypes).map(type => `attributes.movement.${type}`),
    ...Object.keys(DEGRINGO5E.currencies).map(denom => `currency.${denom}`),
    "details.xp.value",
    "resources.primary.value", "resources.secondary.value", "resources.tertiary.value",
    "resources.legact.value", "resources.legres.value",
    ...altSpells,
    ...Array.fromRange(Object.keys(DEGRINGO5E.spellLevels).length - 1, 1).map(level => `spells.spell${level}.value`)
  ];
}

/* -------------------------------------------- */

/**
 * Configure additional system fonts.
 */
function _configureFonts() {
  Object.assign(CONFIG.fontDefinitions, {
    Roboto: {
      editor: true,
      fonts: [
        { urls: ["systems/degringo5e/fonts/roboto/Roboto-Regular.woff2"] },
        { urls: ["systems/degringo5e/fonts/roboto/Roboto-Bold.woff2"], weight: "bold" },
        { urls: ["systems/degringo5e/fonts/roboto/Roboto-Italic.woff2"], style: "italic" },
        { urls: ["systems/degringo5e/fonts/roboto/Roboto-BoldItalic.woff2"], weight: "bold", style: "italic" }
      ]
    },
    "Roboto Condensed": {
      editor: true,
      fonts: [
        { urls: ["systems/degringo5e/fonts/roboto-condensed/RobotoCondensed-Regular.woff2"] },
        { urls: ["systems/degringo5e/fonts/roboto-condensed/RobotoCondensed-Bold.woff2"], weight: "bold" },
        { urls: ["systems/degringo5e/fonts/roboto-condensed/RobotoCondensed-Italic.woff2"], style: "italic" },
        {
          urls: ["systems/degringo5e/fonts/roboto-condensed/RobotoCondensed-BoldItalic.woff2"], weight: "bold",
          style: "italic"
        }
      ]
    },
    "Roboto Slab": {
      editor: true,
      fonts: [
        { urls: ["systems/degringo5e/fonts/roboto-slab/RobotoSlab-Regular.ttf"] },
        { urls: ["systems/degringo5e/fonts/roboto-slab/RobotoSlab-Bold.ttf"], weight: "bold" }
      ]
    }
  });
}

/* -------------------------------------------- */

/**
 * Configure system status effects.
 */
function _configureStatusEffects() {
  const addEffect = (effects, {special, ...data}) => {
    data = foundry.utils.deepClone(data);
    data._id = utils.staticID(`degringo5e${data.id}`);
    if ( data.icon ) {
      foundry.utils.logCompatibilityWarning(
        "The `icon` property of status conditions has been deprecated in place of using `img`.",
        { since: "DnD5e 5.0", until: "DnD5e 5.2" }
      );
      data.img = data.icon;
      delete data.icon;
    }
    if ( data.label ) {
      foundry.utils.logCompatibilityWarning(
        "The `label` property of status conditions has been deprecated in place of using `name`.",
        { since: "DnD5e 5.0", until: "DnD5e 5.2" }
      );
      data.name = data.label;
      delete data.label;
    }
    effects.push(data);
    if ( special ) CONFIG.specialStatusEffects[special] = data.id;
  };
  CONFIG.statusEffects = Object.entries(CONFIG.DEGRINGO5E.statusEffects).reduce((arr, [id, data]) => {
    const original = CONFIG.statusEffects.find(s => s.id === id);
    addEffect(arr, foundry.utils.mergeObject(original ?? {}, { id, ...data }, { inplace: false }));
    return arr;
  }, []);
  for ( const [id, data] of Object.entries(CONFIG.DEGRINGO5E.conditionTypes) ) {
    addEffect(CONFIG.statusEffects, { id, ...data });
  }
  for ( const [id, data] of Object.entries(CONFIG.DEGRINGO5E.encumbrance.effects) ) {
    addEffect(CONFIG.statusEffects, { id, ...data, hud: false });
  }
}

/* -------------------------------------------- */
/*  Foundry VTT Setup                           */
/* -------------------------------------------- */

/**
 * Prepare attribute lists.
 */
Hooks.once("setup", function() {
  // Configure trackable & consumable attributes.
  _configureTrackableAttributes();
  _configureConsumableAttributes();

  CONFIG.DEGRINGO5E.trackableAttributes = expandAttributeList(CONFIG.DEGRINGO5E.trackableAttributes);
  game.degringo5e.moduleArt.registerModuleArt();
  Tooltips5e.activateListeners();
  game.degringo5e.tooltips.observe();

  // Register settings after modules have had a chance to initialize
  registerDeferredSettings();

  // Set up compendiums with custom applications & sorting
  setupModulePacks();

  // Create CSS for currencies
  const style = document.createElement("style");
  const currencies = append => Object.entries(CONFIG.DEGRINGO5E.currencies)
    .map(([key, { icon }]) => `&.${key}${append ?? ""} { background-image: url("${icon}"); }`);
  style.innerHTML = `
    :is(.degringo5e2, .degringo5e2-journal) :is(i, span).currency {
      ${currencies().join("\n")}
    }
    .degringo5e2 .form-group label.label-icon.currency {
      ${currencies("::after").join("\n")}
    }
  `;
  document.head.append(style);

  _migrateInventoryMetadata();
});

/* --------------------------------------------- */

/**
 * Expand a list of attribute paths into an object that can be traversed.
 * @param {string[]} attributes  The initial attributes configuration.
 * @returns {object}  The expanded object structure.
 */
function expandAttributeList(attributes) {
  return attributes.reduce((obj, attr) => {
    foundry.utils.setProperty(obj, attr, true);
    return obj;
  }, {});
}

/* --------------------------------------------- */

/**
 * Perform one-time pre-localization and sorting of some configuration objects
 */
Hooks.once("i18nInit", () => {
  // Set up status effects. Explicitly performed after init and before prelocalization.
  _configureStatusEffects();

  if ( game.settings.get("degringo5e", "rulesVersion") === "legacy" ) {
    const { translations, _fallback } = game.i18n;
    foundry.utils.mergeObject(translations, {
      "TYPES.Item": {
        race: game.i18n.localize("TYPES.Item.raceLegacy"),
        racePl: game.i18n.localize("TYPES.Item.raceLegacyPl")
      },
      DEGRINGO5E: {
        "Feature.Species": game.i18n.localize("DEGRINGO5E.Feature.SpeciesLegacy"),
        FlagsAlertHint: game.i18n.localize("DEGRINGO5E.FlagsAlertHintLegacy"),
        ItemSpeciesDetails: game.i18n.localize("DEGRINGO5E.ItemSpeciesDetailsLegacy"),
        "Language.Category.Rare": game.i18n.localize("DEGRINGO5E.Language.Category.Exotic"),
        RacialTraits: game.i18n.localize("DEGRINGO5E.RacialTraitsLegacy"),
        "REST.Long.Hint.Normal": game.i18n.localize("DEGRINGO5E.REST.Long.Hint.NormalLegacy"),
        "REST.Long.Hint.Group": game.i18n.localize("DEGRINGO5E.REST.Long.Hint.GroupLegacy"),
        "Species.Add": game.i18n.localize("DEGRINGO5E.Species.AddLegacy"),
        "Species.Features": game.i18n.localize("DEGRINGO5E.Species.FeaturesLegacy"),
        "TARGET.Type.Emanation": foundry.utils.mergeObject(
          _fallback.DEGRINGO5E?.TARGET?.Type?.Radius ?? {},
          translations.DEGRINGO5E?.TARGET?.Type?.Radius ?? {},
          { inplace: false }
        ),
        TraitArmorPlural: foundry.utils.mergeObject(
          _fallback.DEGRINGO5E?.TraitArmorLegacyPlural ?? {},
          translations.DEGRINGO5E?.TraitArmorLegacyPlural ?? {},
          { inplace: false }
        ),
        TraitArmorProf: game.i18n.localize("DEGRINGO5E.TraitArmorLegacyProf")
      }
    });
  }
  utils.performPreLocalization(CONFIG.DEGRINGO5E);
  Object.values(CONFIG.DEGRINGO5E.activityTypes).forEach(c => c.documentClass.localize());
  Object.values(CONFIG.DEGRINGO5E.advancementTypes).forEach(c => c.documentClass.localize());
  foundry.helpers.Localization.localizeDataModel(dataModels.settings.TransformationSetting);
});

/* -------------------------------------------- */
/*  Foundry VTT Ready                           */
/* -------------------------------------------- */

/**
 * Once the entire VTT framework is initialized, check to see if we should perform a data migration
 */
Hooks.once("ready", function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if ( ["ActiveEffect", "Activity", "Item"].includes(data.type) ) {
      documents.macro.create5eMacro(data, slot);
      return false;
    }
  });

  // Adjust sourced items on actors now that compendium UUID redirects have been initialized
  game.actors.forEach(a => a.sourcedItems._redirectKeys());

  // Register items by type
  degringo5e.registry.classes.initialize();

  // Chat message listeners
  documents.ChatMessage5e.activateListeners();

  // Bastion initialization
  game.degringo5e.bastion.initializeUI();

  // Determine whether a system migration is required and feasible
  if ( !game.user.isGM ) return;
  const cv = game.settings.get("degringo5e", "systemMigrationVersion") || game.world.flags.degringo5e?.version;
  const totalDocuments = game.actors.size + game.scenes.size + game.items.size;
  if ( !cv && totalDocuments === 0 ) return game.settings.set("degringo5e", "systemMigrationVersion", game.system.version);
  if ( cv && !foundry.utils.isNewerVersion(game.system.flags.needsMigrationVersion, cv) ) return;

  // Compendium pack folder migration.
  if ( foundry.utils.isNewerVersion("3.0.0", cv) ) {
    migrations.reparentCompendiums("DnD5e SRD Content", "D&D SRD Content");
  }

  // Perform the migration
  if ( cv && foundry.utils.isNewerVersion(game.system.flags.compatibleMigrationVersion, cv) ) {
    ui.notifications.error("MIGRATION.5eVersionTooOldWarning", {localize: true, permanent: true});
  }
  migrations.migrateWorld();
});

/* -------------------------------------------- */
/*  System Styling                              */
/* -------------------------------------------- */

Hooks.on("renderPause", (app, [html]) => {
  html.classList.add("degringo5e2");
  const img = html.querySelector("img");
  img.src = "systems/degringo5e/ui/official/ampersand.svg";
  img.className = "";
});

Hooks.on("renderSettings", (app, html) => applications.settings.sidebar.renderSettings(html));

/* -------------------------------------------- */
/*  Other Hooks                                 */
/* -------------------------------------------- */

Hooks.on("applyCompendiumArt", (documentClass, ...args) => documentClass.applyCompendiumArt?.(...args));

Hooks.on("renderChatPopout", documents.ChatMessage5e.onRenderChatPopout);
Hooks.on("getChatMessageContextOptions", documents.ChatMessage5e.addChatMessageContextOptions);

Hooks.on("renderChatLog", (app, html, data) => {
  documents.Item5e.chatListeners(html);
  documents.ChatMessage5e.onRenderChatLog(html);
});
Hooks.on("renderChatPopout", (app, html, data) => documents.Item5e.chatListeners(html));

Hooks.on("chatMessage", (app, message, data) => applications.Award.chatMessage(message));
Hooks.on("updateChatMessage", dataModels.chatMessage.RequestMessageData.onUpdateResultMessage);

Hooks.on("renderActorDirectory", (app, html, data) => documents.Actor5e.onRenderActorDirectory(html));

Hooks.on("getActorContextOptions", documents.Actor5e.addDirectoryContextOptions);
Hooks.on("getItemContextOptions", documents.Item5e.addDirectoryContextOptions);

Hooks.on("renderCompendiumDirectory", (app, html) => applications.CompendiumBrowser.injectSidebarButton(html));

Hooks.on("renderJournalPageSheet", applications.journal.JournalSheet5e.onRenderJournalPageSheet);
Hooks.on(
  "renderJournalEntryPageProseMirrorSheet",
  applications.journal.JournalSheet5e.onRenderJournalEntryPageProseMirrorSheet
);

Hooks.on("renderActiveEffectConfig", documents.ActiveEffect5e.onRenderActiveEffectConfig);

Hooks.on("targetToken", canvas.Token5e.onTargetToken);

Hooks.on("renderCombatTracker", (app, html, data) => app.renderGroups(html));

Hooks.on("preCreateScene", (doc, createData, options, userId) => {
  // Set default grid units based on metric length setting
  const units = utils.defaultUnits("length");
  if ( (units !== degringo5e.grid.units) && !foundry.utils.getProperty(createData, "grid.distance")
    && !foundry.utils.getProperty(createData, "grid.units") ) {
    doc.updateSource({
      grid: { distance: utils.convertLength(degringo5e.grid.distance, degringo5e.grid.units, units, { strict: false }), units }
    });
  }
});

/* -------------------------------------------- */
/*  Deprecations                                */
/* -------------------------------------------- */

/**
 * Migrate legacy inventory metadata.
 */
function _migrateInventoryMetadata() {
  Object.entries(CONFIG.Item.dataModels).forEach(([type, model]) => {
    if ( ("inventorySection" in model) || (model.metadata.inventoryItem === false) ) return;
    if ( !("inventoryItem" in model.metadata) && !("inventoryOrder" in model.metadata) ) return;
    const { inventoryOrder=Infinity } = model.metadata;
    foundry.utils.logCompatibilityWarning("ItemDataModel.metadata.inventoryItem and "
      + "ItemDataModel.metadata.inventoryOrder are deprecated. Please define an inventorySection getter on the model "
      + "instead.", { since: "degringo5e 5.0", until: "degringo5e 5.2" });
    Object.defineProperty(model, "inventorySection", {
      get() {
        return {
          id: type,
          order: inventoryOrder,
          label: `${CONFIG.Item.typeLabels[type]}Pl`,
          groups: { type },
          columns: ["price", "weight", "quantity", "charges", "controls"]
        };
      }
    });
  });
}

/* -------------------------------------------- */
/*  Bundled Module Exports                      */
/* -------------------------------------------- */

export {
  applications,
  canvas,
  dataModels,
  dice,
  documents,
  enrichers,
  Filter,
  migrations,
  registry,
  utils,
  DEGRINGO5E
};
