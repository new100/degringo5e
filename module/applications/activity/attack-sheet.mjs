import ActivitySheet from "./activity-sheet.mjs";

/**
 * Sheet for the attack activity.
 */
export default class AttackSheet extends ActivitySheet {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["attack-activity"]
  };

  /* -------------------------------------------- */

  /** @inheritDoc */
  static PARTS = {
    ...super.PARTS,
    identity: {
      template: "systems/degringo5e/templates/activity/attack-identity.hbs",
      templates: [
        ...super.PARTS.identity.templates,
        "systems/degringo5e/templates/activity/parts/attack-identity.hbs"
      ]
    },
    effect: {
      template: "systems/degringo5e/templates/activity/attack-effect.hbs",
      templates: [
        ...super.PARTS.effect.templates,
        "systems/degringo5e/templates/activity/parts/attack-damage.hbs",
        "systems/degringo5e/templates/activity/parts/attack-details.hbs",
        "systems/degringo5e/templates/activity/parts/damage-part.hbs",
        "systems/degringo5e/templates/activity/parts/damage-parts.hbs"
      ]
    }
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _prepareEffectContext(context) {
    context = await super._prepareEffectContext(context);

    const availableAbilities = this.activity.availableAbilities;
    context.abilityOptions = [
      {
        value: "", label: game.i18n.format("DEGRINGO5E.DefaultSpecific", {
          default: this.activity.attack.type.classification === "spell"
            ? game.i18n.localize("DEGRINGO5E.Spellcasting").toLowerCase()
            : availableAbilities.size
              ? game.i18n.getListFormatter({ style: "short", type: "disjunction" }).format(
                Array.from(availableAbilities).map(a => CONFIG.DEGRINGO5E.abilities[a].label.toLowerCase())
              )
              : game.i18n.localize("DEGRINGO5E.None").toLowerCase()
        })
      },
      { rule: true },
      { value: "none", label: game.i18n.localize("DEGRINGO5E.None") },
      { value: "spellcasting", label: game.i18n.localize("DEGRINGO5E.Spellcasting") },
      ...Object.entries(CONFIG.DEGRINGO5E.abilities).map(([value, config]) => ({
        value, label: config.label, group: game.i18n.localize("DEGRINGO5E.Abilities")
      }))
    ];

    context.hasBaseDamage = this.item.system.offersBaseDamage;

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _prepareIdentityContext(context) {
    context = await super._prepareIdentityContext(context);

    context.attackTypeOptions = Object.entries(CONFIG.DEGRINGO5E.attackTypes)
      .map(([value, config]) => ({ value, label: config.label }));
    if ( this.item.system.validAttackTypes?.size ) context.attackTypeOptions.unshift({
      value: "",
      label: game.i18n.format("DEGRINGO5E.DefaultSpecific", {
        default: game.i18n.getListFormatter({ type: "disjunction" }).format(
          Array.from(this.item.system.validAttackTypes).map(t => CONFIG.DEGRINGO5E.attackTypes[t].label.toLowerCase())
        )
      })
    });

    context.attackClassificationOptions = Object.entries(CONFIG.DEGRINGO5E.attackClassifications)
      .map(([value, config]) => ({ value, label: config.label }));
    if ( this.item.system.attackClassification ) context.attackClassificationOptions.unshift({
      value: "",
      label: game.i18n.format("DEGRINGO5E.DefaultSpecific", {
        default: CONFIG.DEGRINGO5E.attackClassifications[this.item.system.attackClassification].label.toLowerCase()
      })
    });

    return context;
  }
}
