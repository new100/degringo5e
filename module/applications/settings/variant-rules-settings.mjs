import BaseSettingsConfig from "./base-settings.mjs";

/**
 * An application for configuring variant rules settings.
 */
export default class VariantRulesSettingsConfig extends BaseSettingsConfig {
  /** @override */
  static DEFAULT_OPTIONS = {
    window: {
      title: "SETTINGS.DEGRINGO5E.VARIANT.Label"
    }
  };

  /* -------------------------------------------- */

  /** @override */
  static PARTS = {
    general: {
      template: "systems/degringo5e/templates/settings/base-config.hbs"
    },
    encumbrance: {
      template: "systems/degringo5e/templates/settings/base-config.hbs"
    },
    abilities: {
      template: "systems/degringo5e/templates/settings/base-config.hbs"
    },
    footer: {
      template: "templates/generic/form-footer.hbs"
    }
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritDoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    switch ( partId ) {
      case "general":
        context.fields = [
          game.settings.get("degringo5e", "rulesVersion") === "legacy" ? this.createSettingField("allowFeats") : null,
          this.createSettingField("restVariant"),
          this.createSettingField("proficiencyModifier"),
          this.createSettingField("levelingMode")
        ].filter(_ => _);
        context.legend = game.i18n.localize("SETTINGS.DEGRINGO5E.General");
        break;
      case "encumbrance":
        context.fields = [
          this.createSettingField("encumbrance"),
          this.createSettingField("currencyWeight")
        ];
        context.legend = game.i18n.localize("DEGRINGO5E.Encumbrance");
        break;
      case "abilities":
        context.fields = [
          this.createSettingField("honorScore"),
          this.createSettingField("sanityScore")
        ];
        context.legend = game.i18n.localize("DEGRINGO5E.Abilities");
        break;
    }
    return context;
  }
}
