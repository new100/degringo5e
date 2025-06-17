const { StringField } = foundry.data.fields;

/**
 * Field for storing creature type data.
 */
export default class CreatureTypeField extends foundry.data.fields.SchemaField {
  constructor(fields={}, options={}) {
    fields = {
      value: new StringField({ blank: true, label: "DEGRINGO5E.CreatureType" }),
      subtype: new StringField({ label: "DEGRINGO5E.CreatureTypeSelectorSubtype" }),
      swarm: new StringField({ blank: true, label: "DEGRINGO5E.CreatureSwarmSize" }),
      custom: new StringField({ label: "DEGRINGO5E.CreatureTypeSelectorCustom" }),
      ...fields
    };
    Object.entries(fields).forEach(([k, v]) => !v ? delete fields[k] : null);
    super(fields, { label: "DEGRINGO5E.CreatureType", ...options });
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  initialize(value, model, options={}) {
    const obj = super.initialize(value, model, options);

    Object.defineProperty(obj, "label", {
      get() {
        return degringo5e.documents.Actor5e.formatCreatureType(this);
      },
      enumerable: false
    });
    Object.defineProperty(obj, "config", {
      get() {
        return CONFIG.DEGRINGO5E.creatureTypes[this.value];
      },
      enumerable: false
    });

    return obj;
  }
}
