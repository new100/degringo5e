import BaseConfigSheet from "../api/base-config-sheet.mjs";

/**
 * Configuration application for an actor's concentration checks.
 */
export default class ConcentrationConfig extends BaseConfigSheet {
  /** @override */
  static DEFAULT_OPTIONS = {
    ability: null,
    position: {
      width: 500
    }
  };

  /* -------------------------------------------- */

  /** @override */
  static PARTS = {
    config: {
      template: "systems/degringo5e/templates/actors/config/concentration-config.hbs"
    }
  };

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /** @override */
  get title() {
    return game.i18n.format("DEGRINGO5E.ABILITY.Configure.Title", { ability: game.i18n.localize("DEGRINGO5E.Concentration") });
  }

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    const source = this.document.system._source;

    context.data = source.attributes?.concentration ?? {};
    context.fields = this.document.system.schema.fields.attributes.fields.concentration.fields;
    const ability = CONFIG.DEGRINGO5E.abilities[CONFIG.DEGRINGO5E.defaultAbilities.concentration]?.label?.toLowerCase();
    context.abilityOptions = [
      { value: "", label: ability ? game.i18n.format("DEGRINGO5E.DefaultSpecific", { default: ability }) : "" },
      { rule: true },
      ...Object.entries(CONFIG.DEGRINGO5E.abilities).map(([value, { label }]) => ({ value, label }))
    ];

    if ( this.document.system.bonuses?.abilities ) context.global = {
      data: source.bonuses?.abilities ?? {},
      fields: this.document.system.schema.fields.bonuses.fields.abilities.fields
    };

    return context;
  }
}
