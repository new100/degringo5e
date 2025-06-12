const { NumberField, StringField } = foundry.data.fields;

/**
 * @typedef {object} SensesData
 * @property {number} darkvision       Creature's darkvision range.
 * @property {number} blindsight       Creature's blindsight range.
 * @property {number} tremorsense      Creature's tremorsense range.
 * @property {number} truesight        Creature's truesight range.
 * @property {string} units            Distance units used to measure senses.
 * @property {string} special          Description of any special senses or restrictions.
 */

/**
 * Field for storing senses data.
 */
export default class SensesField extends foundry.data.fields.SchemaField {
  constructor(fields={}, { initialUnits=null, ...options }={}) {
    const numberConfig = { required: true, nullable: true, integer: true, min: 0, initial: null };
    fields = {
      darkvision: new NumberField({ ...numberConfig, label: "DEGRINGO5E.SenseDarkvision" }),
      blindsight: new NumberField({ ...numberConfig, label: "DEGRINGO5E.SenseBlindsight" }),
      tremorsense: new NumberField({ ...numberConfig, label: "DEGRINGO5E.SenseTremorsense" }),
      truesight: new NumberField({ ...numberConfig, label: "DEGRINGO5E.SenseTruesight" }),
      units: new StringField({
        required: true, nullable: true, blank: false, initial: initialUnits, label: "DEGRINGO5E.SenseUnits"
      }),
      special: new StringField({ required: true, label: "DEGRINGO5E.SenseSpecial" }),
      ...fields
    };
    Object.entries(fields).forEach(([k, v]) => !v ? delete fields[k] : null);
    super(fields, { label: "DEGRINGO5E.Senses", ...options });
  }
}
