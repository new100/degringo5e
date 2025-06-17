import _ActorDataModel from "./abstract/actor-data-model.mjs";
import _ItemDataModel from "./abstract/item-data-model.mjs";
import _SparseDataModel from "./abstract/sparse-data-model.mjs";
import _SystemDataModel from "./abstract/system-data-model.mjs";

export default class SystemDataModel extends _SystemDataModel {
  constructor(...args) {
    foundry.utils.logCompatibilityWarning(
      "`degringo5e.dataModels.SystemDataModel has been moved to `degringo5e.dataModels.abstract.SystemDataModel",
      { since: "DnD5e 5.1", until: "DnD5e 5.3", once: true }
    );
    super(...args);
  }
}

export class ActorDataModel extends _ActorDataModel {
  constructor(...args) {
    foundry.utils.logCompatibilityWarning(
      "`degringo5e.dataModels.ActorDataModel has been moved to `degringo5e.dataModels.abstract.ActorDataModel",
      { since: "DnD5e 5.1", until: "DnD5e 5.3", once: true }
    );
    super(...args);
  }
}

export class ItemDataModel extends _ItemDataModel {
  constructor(...args) {
    foundry.utils.logCompatibilityWarning(
      "`degringo5e.dataModels.ItemDataModel has been moved to `degringo5e.dataModels.abstract.ItemDataModel",
      { since: "DnD5e 5.1", until: "DnD5e 5.3", once: true }
    );
    super(...args);
  }
}

export class SparseDataModel extends _SparseDataModel {
  constructor(...args) {
    foundry.utils.logCompatibilityWarning(
      "`degringo5e.dataModels.SparseDataModel has been moved to `degringo5e.dataModels.abstract.SparseDataModel",
      { since: "DnD5e 5.1", until: "DnD5e 5.3", once: true }
    );
    super(...args);
  }
}
