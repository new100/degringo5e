import ActivitySheet from "./activity-sheet.mjs";

/**
 * Sheet for the damage activity.
 */
export default class DamageSheet extends ActivitySheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["damage-activity"]
  };

  /* -------------------------------------------- */

  /** @inheritDoc */
  static PARTS = {
    ...super.PARTS,
    effect: {
      template: "systems/degringo5e/templates/activity/damage-effect.hbs",
      templates: [
        ...super.PARTS.effect.templates,
        "systems/degringo5e/templates/activity/parts/damage-damage.hbs",
        "systems/degringo5e/templates/activity/parts/damage-part.hbs",
        "systems/degringo5e/templates/activity/parts/damage-parts.hbs"
      ]
    }
  };
}
