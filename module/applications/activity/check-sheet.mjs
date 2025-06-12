import * as Trait from "../../documents/actor/trait.mjs";
import ActivitySheet from "./activity-sheet.mjs";

/**
 * Sheet for the check activity.
 */
export default class CheckSheet extends ActivitySheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["check-activity"]
  };

  /* -------------------------------------------- */

  /** @inheritDoc */
  static PARTS = {
    ...super.PARTS,
    effect: {
      template: "systems/degringo5e/templates/activity/check-effect.hbs",
      templates: [
        ...super.PARTS.effect.templates,
        "systems/degringo5e/templates/activity/parts/check-details.hbs"
      ]
    }
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _prepareEffectContext(context) {
    context = await super._prepareEffectContext(context);

    const group = game.i18n.localize("DEGRINGO5E.Abilities");
    context.abilityOptions = [
      { value: "", label: "" },
      { rule: true },
      { value: "spellcasting", label: game.i18n.localize("DEGRINGO5E.SpellAbility") },
      ...Object.entries(CONFIG.DEGRINGO5E.abilities).map(([value, config]) => ({ value, label: config.label, group }))
    ];
    let ability;
    const associated = this.activity.check.associated;
    if ( (this.item.type === "tool") && !associated.size ) {
      ability = CONFIG.DEGRINGO5E.abilities[this.item.system.ability]?.label?.toLowerCase();
    } else if ( (associated.size === 1) && (associated.first() in CONFIG.DEGRINGO5E.skills) ) {
      ability = CONFIG.DEGRINGO5E.abilities[CONFIG.DEGRINGO5E.skills[associated.first()].ability]?.label?.toLowerCase();
    }
    if ( ability ) context.abilityOptions[0].label = game.i18n.format("DEGRINGO5E.DefaultSpecific", { default: ability });

    context.associatedOptions = [
      ...Object.entries(CONFIG.DEGRINGO5E.skills).map(([value, { label }]) => ({
        value, label, group: game.i18n.localize("DEGRINGO5E.Skills")
      })),
      ...Object.keys(CONFIG.DEGRINGO5E.tools).map(value => ({
        value, label: Trait.keyLabel(value, { trait: "tool" }), group: game.i18n.localize("TYPES.Item.toolPl")
      })).sort((lhs, rhs) => lhs.label.localeCompare(rhs.label, game.i18n.lang))
    ];

    context.calculationOptions = [
      { value: "", label: game.i18n.localize("DEGRINGO5E.SAVE.FIELDS.save.dc.CustomFormula") },
      { rule: true },
      { value: "spellcasting", label: game.i18n.localize("DEGRINGO5E.SpellAbility") },
      ...Object.entries(CONFIG.DEGRINGO5E.abilities).map(([value, config]) => ({ value, label: config.label, group }))
    ];

    return context;
  }
}
