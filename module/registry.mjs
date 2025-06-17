import CompendiumBrowser from "./applications/compendium-browser.mjs";

/* -------------------------------------------- */
/*  Helper para buscar UUID de forma dinâmica   */
/* -------------------------------------------- */

async function getJournalPageUuid({ compendiumKey, journalName, pageName }) {
  const pack = game.packs.get(compendiumKey);
  if (!pack) {
    console.warn(`❌ Compendium "${compendiumKey}" não encontrado.`);
    return null;
  }

  const index = await pack.getIndex();
  const entry = index.find(e => e.name === journalName);
  if (!entry) {
    console.warn(`❌ Journal "${journalName}" não encontrado no compendium "${compendiumKey}".`);
    return null;
  }

  const journal = await pack.getDocument(entry._id);
  const page = journal.pages.find(p => p.name === pageName);

  if (!page) {
    console.warn(`❌ Página "${pageName}" não encontrada dentro de "${journalName}".`);
    return null;
  }

  return page.uuid;
}

/* -------------------------------------------- */
/*  Enchantment Registry                        */
/* -------------------------------------------- */

class EnchantmentRegistry {
  static #appliedEnchantments = new Map();

  static applied(uuid) {
    const source = fromUuidSync(uuid);
    if (source instanceof Item) {
      return source.system.activities?.getByType("enchant")
        .map(a => EnchantmentRegistry.applied(a.uuid))
        .flat() ?? [];
    }
    return Array.from(EnchantmentRegistry.#appliedEnchantments.get(uuid) ?? [])
      .map(uuid => fromUuidSync(uuid))
      .filter(effect => effect?.isAppliedEnchantment);
  }

  static track(source, enchanted) {
    if (enchanted.startsWith("Compendium.")) return;
    if (!EnchantmentRegistry.#appliedEnchantments.has(source)) {
      EnchantmentRegistry.#appliedEnchantments.set(source, new Set());
    }
    EnchantmentRegistry.#appliedEnchantments.get(source).add(enchanted);
  }

  static untrack(source, enchanted) {
    EnchantmentRegistry.#appliedEnchantments.get(source)?.delete(enchanted);
  }
}

/* -------------------------------------------- */
/*  Item Registry                               */
/* -------------------------------------------- */

class ItemRegistry {
  constructor(itemType) {
    this.#itemType = itemType;
  }

  #items = new Map();
  #itemType;
  #status = ItemRegistry.#STATUS_STATES.NONE;

  static #STATUS_STATES = Object.freeze({
    NONE: 0,
    LOADING: 1,
    READY: 2
  });

  get choices() {
    return this.options.reduce((obj, { value, label }) => {
      obj[value] = label;
      return obj;
    }, {});
  }

  get options() {
    return Array.from(this.#items.entries())
      .map(([value, data]) => ({ value, label: data.name }))
      .sort((lhs, rhs) => lhs.label.localeCompare(rhs.label, game.i18n.lang));
  }

  get(identifier) {
    return this.#items.get(identifier);
  }

  async initialize() {
    if (this.#status > ItemRegistry.#STATUS_STATES.NONE) return;
    RegistryStatus.set(this.#itemType, false);

    if (game.modules.get("babele")?.active && (game.babele?.initialized === false)) {
      Hooks.once("babele.ready", () => this.initialize());
      return;
    } else if (!game.ready) {
      Hooks.once("ready", () => this.initialize());
      return;
    }

    this.#status = ItemRegistry.#STATUS_STATES.LOADING;

    const indexes = await CompendiumBrowser.fetch(Item, {
      types: new Set([this.#itemType]),
      indexFields: new Set(["system.identifier"]),
      sort: false
    });

    for (const item of indexes) {
      const identifier = item.system?.identifier ?? slugify(item.name, { strict: true });
      if (!this.#items.has(identifier)) this.#items.set(identifier, { sources: [] });
      const itemData = this.#items.get(identifier);
      itemData.name = item.name;
      itemData.img = item.img;
      itemData.identifier = identifier;
      itemData.sources.push(item.uuid);
    }

    this.#status = ItemRegistry.#STATUS_STATES.READY;
    RegistryStatus.set(this.#itemType, true);
  }
}

/* -------------------------------------------- */
/*  Message Rolls                               */
/* -------------------------------------------- */

class MessageRegistry {
  static #messages = new Map();

  static get(origin, type) {
    const originMap = MessageRegistry.#messages.get(origin);
    if (!originMap) return [];
    let ids;
    if (type) ids = Array.from(originMap.get(type) ?? []);
    else ids = Array.from(originMap.values()).map(v => Array.from(v)).flat();
    return ids
      .map(id => game.messages.get(id))
      .filter(m => m)
      .sort((lhs, rhs) => lhs.timestamp - rhs.timestamp);
  }

  static track(message) {
    const origin = message.getFlag("degringo5e", "originatingMessage");
    const type = message.getFlag("degringo5e", "roll.type");
    if (!origin || !type) return;
    if (!MessageRegistry.#messages.has(origin)) MessageRegistry.#messages.set(origin, new Map());
    const originMap = MessageRegistry.#messages.get(origin);
    if (!originMap.has(type)) originMap.set(type, new Set());
    originMap.get(type).add(message.id);
  }

  static untrack(message) {
    const origin = message.getFlag("degringo5e", "originatingMessage");
    const type = message.getFlag("degringo5e", "roll.type");
    MessageRegistry.#messages.get(origin)?.get(type)?.delete(message.id);
  }
}

/* -------------------------------------------- */
/*  Spell Lists                                 */
/* -------------------------------------------- */

class SpellListRegistry {
  static #bySpell = new Map();
  static #byType = new Map();
  static #loading = new Set();

  static get options() {
    return Object.entries(CONFIG.DEGRINGO5E.spellListTypes).map(([type, group]) => {
      const lists = this.#byType.get(type);
      if (!lists) return [];
      return Array.from(lists.entries())
        .map(([value, list]) => ({ value, label: list.name, group, type }))
        .sort((lhs, rhs) => lhs.label.localeCompare(rhs.label, game.i18n.lang));
    }).flat();
  }

  static get ready() {
    return this.#loading.size === 0;
  }

  static forSpell(uuid) {
    return SpellListRegistry.#bySpell.get(uuid) ?? new Set();
  }

  static forType(type, identifier) {
    return SpellListRegistry.#byType.get(type)?.get(identifier) ?? null;
  }

  static async registerByName({ compendium, journal, page }) {
    const uuid = await getJournalPageUuid({
      compendiumKey: compendium,
      journalName: journal,
      pageName: page
    });
    if (uuid) {
      await this.register(uuid);
    } else {
      console.warn(`❌ Falha ao registrar spell list: ${journal} -> ${page}`);
    }
  }

  static async register(uuid) {
    RegistryStatus.set("spellLists", false);
    this.#loading.add(uuid);

    if (!game.ready) {
      Hooks.once("ready", () => this.register(uuid));
      return;
    }

    const page = await fromUuid(uuid);
    if (!page) {
      console.warn(`❌ Journal entry page "${uuid}" não encontrada.`);
      this.#loading.delete(uuid);
      return;
    }
    if (page.type !== "spells") {
      console.warn(`❌ Journal entry page "${uuid}" não é do tipo Spell List.`);
      this.#loading.delete(uuid);
      return;
    }

    if (!SpellListRegistry.#byType.has(page.system.type)) {
      SpellListRegistry.#byType.set(page.system.type, new Map());
    }

    const type = SpellListRegistry.#byType.get(page.system.type);
    if (!type.has(page.system.identifier)) {
      type.set(page.system.identifier, new SpellList({
        identifier: page.system.identifier,
        name: page.name,
        type: page.system.type
      }));
    }

    const list = type.get(page.system.identifier);
    list.contribute(page).forEach(uuid => {
      if (!SpellListRegistry.#bySpell.has(uuid)) {
        SpellListRegistry.#bySpell.set(uuid, new Set());
      }
      SpellListRegistry.#bySpell.get(uuid).add(list);
    });

    this.#loading.delete(uuid);
    if (this.ready) RegistryStatus.set("spellLists", true);
  }
}

/* -------------------------------------------- */
/*  SpellList Class                             */
/* -------------------------------------------- */

export class SpellList {
  constructor(metadata) {
    this.#metadata = Object.freeze(metadata);
  }

  static #REGISTRIES = {
    class: "classes"
  };

  #metadata;
  #spells = new Map();
  #unlinked = [];

  get metadata() {
    return this.#metadata;
  }

  get name() {
    return degringo5e.registry[SpellList.#REGISTRIES[this.metadata.type]]?.get(this.metadata.identifier)?.name
      ?? this.metadata.name;
  }

  get uuids() {
    return new Set(this.#spells.keys());
  }

  contribute(page) {
    const added = new Set();

    page.system.spells.forEach(s => {
      if (!this.#spells.has(s)) added.add(s);
      this.#spells.set(s, { page: page.uuid });
    });

    for (const unlinked of page.system.unlinkedSpells) {
      if (fromUuidSync(unlinked.source?.uuid)) {
        if (!this.#spells.has(unlinked.source.uuid)) added.add(unlinked.source.uuid);
        this.#spells.set(unlinked.source.uuid, { page: page.uuid });
      } else {
        this.#unlinked.push(foundry.utils.mergeObject({ page: page.uuid }, unlinked));
      }
    }

    return added;
  }

  async getSpells() {
    return Promise.all(Array.from(this.#spells.keys()).map(s => fromUuid(s)));
  }
}

/* -------------------------------------------- */
/*  Summon Registry                             */
/* -------------------------------------------- */

class SummonRegistry {
  static #creatures = new Map();

  static creatures(actor) {
    return Array.from(SummonRegistry.#creatures.get(actor.uuid) ?? []).map(uuid => fromUuidSync(uuid));
  }

  static track(summoner, summoned) {
    if (summoned.startsWith("Compendium.")) return;
    if (!SummonRegistry.#creatures.has(summoner)) {
      SummonRegistry.#creatures.set(summoner, new Set());
    }
    SummonRegistry.#creatures.get(summoner).add(summoned);
  }

  static untrack(summoner, summoned) {
    SummonRegistry.#creatures.get(summoner)?.delete(summoned);
  }
}

/* -------------------------------------------- */
/*  Registry Status                             */
/* -------------------------------------------- */

const RegistryStatus = new class extends Map {
  constructor(iterable) {
    super(iterable);
    const { promise, resolve } = Promise.withResolvers();
    this.#ready = promise;
    this.#resolve = resolve;
  }

  #ready;
  #resolve;

  get ready() {
    return this.#ready;
  }

  set(key, value) {
    super.set(key, value);
    if (Array.from(this.values()).every(s => s)) this.#resolve();
    return this;
  }
}();

/* -------------------------------------------- */
/*  Exporta Registries                          */
/* -------------------------------------------- */

export default {
  classes: new ItemRegistry("class"),
  enchantments: EnchantmentRegistry,
  messages: MessageRegistry,
  ready: RegistryStatus.ready,
  spellLists: SpellListRegistry,
  summons: SummonRegistry
};
