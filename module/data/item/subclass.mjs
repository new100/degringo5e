import ItemDataModel from "../abstract/item-data-model.mjs";
import AdvancementField from "../fields/advancement-field.mjs";
import IdentifierField from "../fields/identifier-field.mjs";
import SpellcastingField from "./fields/spellcasting-field.mjs";
import ItemDescriptionTemplate from "./templates/item-description.mjs";

const { ArrayField } = foundry.data.fields;

/**
 * Data definition for Subclass items.
 * @mixes ItemDescriptionTemplate
 *
 * @property {object[]} advancement    Advancement objects for this subclass.
 * @property {string} classIdentifier  Identifier slug for the class with which this subclass should be associated.
 * @property {SpellcastingField} spellcasting  Details on subclass's spellcasting ability.
 */
export default class SubclassData extends ItemDataModel.mixin(ItemDescriptionTemplate) {

  /* -------------------------------------------- */
  /*  Model Configuration                         */
  /* -------------------------------------------- */

  /** @override */
  static LOCALIZATION_PREFIXES = ["DEGRINGO5E.SOURCE"];

  /* -------------------------------------------- */

  /** @inheritDoc */
  static defineSchema() {
    return this.mergeSchema(super.defineSchema(), {
      advancement: new ArrayField(new AdvancementField(), { label: "DEGRINGO5E.AdvancementTitle" }),
      classIdentifier: new IdentifierField({
        required: true, label: "DEGRINGO5E.ClassIdentifier", hint: "DEGRINGO5E.ClassIdentifierHint"
      }),
      spellcasting: new SpellcastingField()
    });
  }

  /* -------------------------------------------- */

  /** @override */
  static get compendiumBrowserFilters() {
    return new Map([
      ["class", {
        label: "TYPES.Item.class",
        type: "set",
        config: {
          choices: degringo5e.registry.classes.choices,
          keyPath: "system.classIdentifier"
        }
      }],
      ["hasSpellcasting", {
        label: "DEGRINGO5E.CompendiumBrowser.Filters.HasSpellcasting",
        type: "boolean",
        createFilter: (filters, value, def) => {
          if ( value === 0 ) return;
          const filter = { k: "system.spellcasting.progression", v: "none" };
          if ( value === -1 ) filters.push(filter);
          else filters.push({ o: "NOT", v: filter });
        }
      }]
    ]);
  }

  /* -------------------------------------------- */
  /*  Data Preparation                            */
  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareBaseData() {
    this.spellcasting.preparation.value = 0;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareDerivedData() {
    super.prepareDerivedData();
    this.prepareDescriptionData();
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  prepareFinalData() {
    SpellcastingField.prepareData.call(this, this.parent.getRollData({ deterministic: true }));
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async getSheetData(context) {
    context.subtitles = [{ label: game.i18n.localize(CONFIG.Item.typeLabels.subclass) }];
    context.singleDescription = true;
    context.parts = ["degringo5e.details-subclass", "degringo5e.details-spellcasting"];
  }

  /* -------------------------------------------- */
  /*  Socket Event Handlers                       */
  /* -------------------------------------------- */

  /** @inheritDoc */
  _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    const actor = this.parent.actor;
    if ( !actor || (userId !== game.user.id) ) return;
    if ( !actor.system.attributes?.spellcasting && this.parent.spellcasting?.ability ) {
      actor.update({ "system.attributes.spellcasting": this.parent.spellcasting.ability });
    }
  }
}
