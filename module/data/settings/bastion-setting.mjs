const { BooleanField, NumberField } = foundry.data.fields;

/**
 * A data model that represents the Bastion configuration options.
 */
export default class BastionSetting extends foundry.abstract.DataModel {
  /** @override */
  static defineSchema() {
    return {
      button: new BooleanField({
        required: true, label: "DEGRINGO5E.Bastion.Button.Label", hint: "DEGRINGO5E.Bastion.Button.Hint"
      }),
      duration: new NumberField({
        required: true, positive: true, integer: true, initial: 7, label: "DEGRINGO5E.Bastion.Duration.Label"
      }),
      enabled: new BooleanField({
        required: true, label: "DEGRINGO5E.Bastion.Enabled.Label", hint: "DEGRINGO5E.Bastion.Enabled.Hint"
      })
    };
  }
}
