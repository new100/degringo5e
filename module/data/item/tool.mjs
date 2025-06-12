import ItemDataModel from "../abstract/item-data-model.mjs";
import FormulaField from "../fields/formula-field.mjs";
import ItemTypeField from "./fields/item-type-field.mjs";
import ActivitiesTemplate from "./templates/activities.mjs";
import EquippableItemTemplate from "./templates/equippable-item.mjs";
import IdentifiableTemplate from "./templates/identifiable.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";
import ItemTypeTemplate from "./templates/item-type.mjs";
import PhysicalItemTemplate from "./templates/physical-item.mjs";

const { NumberField, SetField, StringField } = foundry.data.fields;

/**
 * @import { ItemTypeData } from "./fields/item-type-field.mjs";
 */

/**
 * Data definition for Tool items.
 * @mixes ActivitiesTemplate
 * @mixes ItemDescriptionTemplate
 * @mixes ItemTypeTemplate
 * @mixes IdentifiableTemplate
 * @mixes PhysicalItemTemplate
 * @mixes EquippableItemTemplate
 *
 * @property {string} ability                      Default ability when this tool is being used.
 * @property {string} bonus                        Bonus formula added to tool rolls.
 * @property {string} chatFlavor                   Additional text added to chat when this tool is used.
 * @property {number} proficient                   Level of proficiency as defined in `DEGRINGO5E.proficiencyLevels`.
 * @property {Set<string>} properties              Tool properties.
 * @property {Omit<ItemTypeData, "subtype">} type  Tool type and base item.
 */
export default class ToolData extends ItemDataModel.mixin(
  ActivitiesTemplate, ItemDescriptionTemplate, IdentifiableTemplate, ItemTypeTemplate,
  PhysicalItemTemplate, EquippableItemTemplate
) {

  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** @override */
  static LOCALIZATION_PREFIXES = ["DEGRINGO5E.SOURCE"];

  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      type: new ItemTypeField({ subtype: false }, { label: "DEGRINGO5E.ItemToolType" }),
      ability: new StringField({ required: true, blank: true, label: "DEGRINGO5E.DefaultAbilityCheck" }),
      chatFlavor: new StringField({ required: true, label: "DEGRINGO5E.ChatFlavor" }),
      proficient: new NumberField({
        required: true, initial: null, min: 0, max: 2, step: 0.5, label: "DEGRINGO5E.ItemToolProficiency"
      }),
      properties: new SetField(new StringField(), { label: "DEGRINGO5E.ItemToolProperties" }),
      bonus: new FormulaField({ required: true, label: "DEGRINGO5E.ItemToolBonus" })
    });
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  static metadata = Object.freeze(foundry.utils.mergeObject(super.metadata, {
    hasEffects: true,
    enchantable: true
  }, {inplace: false}));

  /* -------------------------------------------- */

  /** @override */
  static get compendiumBrowserFilters() {
    return new Map([
      ["type", {
        label: "DEGRINGO5E.ItemToolType",
        type: "set",
        config: {
          choices: CONFIG.DEGRINGO5E.toolTypes,
          keyPath: "system.type.value"
        }
      }],
      ["attunement", this.compendiumBrowserAttunementFilter],
      ...this.compendiumBrowserPhysicalItemFilters,
      ["properties", this.compendiumBrowserPropertiesFilter("tool")]
    ]);
  }

  /* -------------------------------------------- */

  /**
   * Default configuration for this item type's inventory section.
   * @returns {InventorySectionDescriptor}
   */
  static get inventorySection() {
    return {
      id: "tool",
      order: 400,
      label: "TYPES.Item.toolPl",
      groups: { type: "tool" },
      columns: ["price", "weight", "quantity", "charges", "controls"]
    };
  }

  /* -------------------------------------------- */
  /*  Migrations                                  */
  /* -------------------------------------------- */

  /** @inheritDoc */
  static _migrateData(source) {
    super._migrateData(source);
    ActivitiesTemplate.migrateActivities(source);
    ToolData.#migrateAbility(source);
  }

  /* -------------------------------------------- */

  /**
   * Migrate the ability field.
   * @param {object} source  The candidate source data from which the model will be constructed.
   */
  static #migrateAbility(source) {
    if ( Array.isArray(source.ability) ) source.ability = source.ability[0];
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    this.prepareDescriptionData();
    this.prepareIdentifiable();
    this.preparePhysicalData();
    this.type.label = CONFIG.DEGRINGO5E.toolTypes[this.type.value] ?? game.i18n.localize(CONFIG.Item.typeLabels.tool);
    this.type.identifier = CONFIG.DEGRINGO5E.tools[this.type.baseItem]?.id;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareFinalData() {
    this.prepareFinalActivityData(this.parent.getRollData({ deterministic: true }));
    this.prepareFinalEquippableData();
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async getFavoriteData() {
    return foundry.utils.mergeObject(await super.getFavoriteData(), {
      subtitle: this.type.label,
      modifier: this.parent.parent?.system.tools?.[this.type.baseItem]?.total
    });
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async getSheetData(context) {
    context.subtitles = [
      { label: this.type.label },
      ...this.physicalItemSheetFields
    ];
    context.parts = ["degringo5e.details-tool", "degringo5e.field-uses"];
  }

  /* -------------------------------------------- */
  /*  Getters                                     */
  /* -------------------------------------------- */

  /**
   * Properties displayed in chat.
   * @type {string[]}
   */
  get chatProperties() {
    return [CONFIG.DEGRINGO5E.abilities[this.ability]?.label];
  }

  /* -------------------------------------------- */

  /**
   * Properties displayed on the item card.
   * @type {string[]}
   */
  get cardProperties() {
    return [CONFIG.DEGRINGO5E.abilities[this.ability]?.label];
  }

  /* -------------------------------------------- */

  /**
   * Which ability score modifier is used by this item?
   * @type {string|null}
   */
  get abilityMod() {
    return this.ability || "int";
  }

  /* -------------------------------------------- */

  /** @override */
  static get itemCategories() {
    return CONFIG.DEGRINGO5E.toolTypes;
  }

  /* -------------------------------------------- */

  /**
   * The proficiency multiplier for this item.
   * @returns {number}
   */
  get proficiencyMultiplier() {
    if ( Number.isFinite(this.proficient) ) return this.proficient;
    const actor = this.parent.actor;
    if ( !actor ) return 0;
    if ( actor.type === "npc" ) return 1;
    const baseItemProf = actor.system.tools?.[this.type.baseItem];
    const categoryProf = actor.system.tools?.[this.type.value];
    return Math.max(baseItemProf?.value ?? 0, categoryProf?.value ?? 0);
  }

  /* -------------------------------------------- */
  /*  Socket Event Handlers                       */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preCreate(data, options, user) {
    if ( (await super._preCreate(data, options, user)) === false ) return false;
    if ( this.activities.size ) return;

    const activityData = new CONFIG.DEGRINGO5E.activityTypes.check.documentClass({}, { parent: this.parent }).toObject();
    this.parent.updateSource({ [`system.activities.${activityData._id}`]: activityData });
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preUpdate(changed, options, user) {
    if ( (await super._preUpdate(changed, options, user)) === false ) return false;
    await this.preUpdateIdentifiable(changed, options, user);
  }
}
