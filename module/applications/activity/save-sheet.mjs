import ActivitySheet from "./activity-sheet.mjs";

/**
 * Sheet for the save activity.
 */
export default class SaveSheet extends ActivitySheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["save-activity"]
  };

  /* -------------------------------------------- */

  /** @inheritDoc */
  static PARTS = {
    ...super.PARTS,
    effect: {
      template: "systems/degringo5e/templates/activity/save-effect.hbs",
      templates: [
        ...super.PARTS.effect.templates,
        "systems/degringo5e/templates/activity/parts/damage-part.hbs",
        "systems/degringo5e/templates/activity/parts/damage-parts.hbs",
        "systems/degringo5e/templates/activity/parts/save-damage.hbs",
        "systems/degringo5e/templates/activity/parts/save-details.hbs",
        "systems/degringo5e/templates/activity/parts/save-effect-settings.hbs"
      ]
    }
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @override */
  _prepareAppliedEffectContext(context, effect) {
    effect.additionalSettings = "systems/degringo5e/templates/activity/parts/save-effect-settings.hbs";
    return effect;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _prepareEffectContext(context) {
    context = await super._prepareEffectContext(context);

    context.abilityOptions = Object.entries(CONFIG.DEGRINGO5E.abilities).map(([value, config]) => ({
      value, label: config.label
    }));
    context.calculationOptions = [
      { value: "", label: game.i18n.localize("DEGRINGO5E.SAVE.FIELDS.save.dc.CustomFormula") },
      { rule: true },
      { value: "spellcasting", label: game.i18n.localize("DEGRINGO5E.SpellAbility") },
      ...Object.entries(CONFIG.DEGRINGO5E.abilities).map(([value, config]) => ({
        value, label: config.label, group: game.i18n.localize("DEGRINGO5E.Abilities")
      }))
    ];
    context.onSaveOptions = [
      { value: "none", label: game.i18n.localize("DEGRINGO5E.SAVE.FIELDS.damage.onSave.None") },
      { value: "half", label: game.i18n.localize("DEGRINGO5E.SAVE.FIELDS.damage.onSave.Half") },
      { value: "full", label: game.i18n.localize("DEGRINGO5E.SAVE.FIELDS.damage.onSave.Full") }
    ];

    return context;
  }
}
