
const metadataStore = new WeakMap<object, Map<string | symbol, any>>();

export const Reflect = {
  defineMetadata(key: string | symbol, value: any, target: object) {
    let targetMetadata = metadataStore.get(target);
    if (!targetMetadata) {
      targetMetadata = new Map();
      metadataStore.set(target, targetMetadata);
    }
    targetMetadata.set(key, value);
  },

  getMetadata<T = any>(key: string | symbol, target: object): T | undefined {
    const targetMetadata = metadataStore.get(target);
    return targetMetadata ? targetMetadata.get(key) : undefined;
  }
};
