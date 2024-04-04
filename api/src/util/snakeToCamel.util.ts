type SnakeToCamel<T> = T extends object
  ? {
    [K in keyof T as K extends string
    ? K extends `${infer A}_${infer B}`
    ? `${Lowercase<A>}${Uppercase<B>}`
    : K
    : K]: SnakeToCamel<T[K]>;
  }
  : T;

export function snakeToCamel<T>(obj: T): SnakeToCamel<T> {
  if (obj === null || typeof obj !== 'object') {
    return obj as SnakeToCamel<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map((v) => snakeToCamel(v)) as unknown as SnakeToCamel<T>;
  }

  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/([-_][a-z])/gi, ($1) =>
      $1.toUpperCase().replace('-', '').replace('_', '')
    ) as keyof T;
    const value = obj[key as keyof T];

    return {
      ...acc,
      [camelKey]: value !== null && typeof value === 'object' ? snakeToCamel(value) : value,
    };
  }, {} as SnakeToCamel<T>);
}