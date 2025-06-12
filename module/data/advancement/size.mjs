const { SetField, StringField } = foundry.data.fields;

/**
 * Configuration data for the size advancement type.
 */
export class SizeConfigurationData extends foundry.abstract.DataModel {
  /** @inheritDoc */
  static defineSchema() {
    return {
      sizes: new SetField(new StringField(), { required: false, initial: ["med"], label: "DEGRINGO5E.Size" })
    };
  }
}

/**
 * Value data for the size advancement type.
 */
export class SizeValueData extends foundry.abstract.DataModel {
  /** @inheritDoc */
  static defineSchema() {
    return {
      size: new StringField({ required: false, label: "DEGRINGO5E.Size" })
    };
  }
}
