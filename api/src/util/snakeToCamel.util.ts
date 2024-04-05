type SnakeToCamel<T> = T extends object
  ? {
    [K in keyof T as K extends string
    ? K extends `${infer A}_${infer B}`
    ? `${Lowercase<A>}${Uppercase<B>}`
    : K
    : K]: SnakeToCamel<T[K]>;
  }
  : T;

// JSDoc style comments in typescript provide quite a bit of value. Typescript will provide types, the JSDoc comments will provide additional context when the function name is moused over(in VSCode/Intellij Etc). Give it a try
/**
 * A function to map snake case to camel case
 * @param obj any object type
 * @returns will return the generic type passed in, this is primarily used as part of the database to ensure that the database return types conform to JS standard camelcase
 */
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