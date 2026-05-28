export function __awaiter(
  thisArg: unknown,
  _arguments: unknown,
  P: PromiseConstructor,
  generator: (...args: unknown[]) => Generator,
) {
  function adopt(value: unknown) {
    return value instanceof P ? value : new P((resolve) => resolve(value));
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value: unknown) {
      try {
        step(generator.next(value));
      } catch (error) {
        reject(error);
      }
    }

    function rejected(value: unknown) {
      try {
        step(generator["throw"](value));
      } catch (error) {
        reject(error);
      }
    }

    function step(result: IteratorResult<unknown>) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

export function __rest(source: Record<string, unknown>, excluded: string[]) {
  const target: Record<string, unknown> = {};

  for (const property in source) {
    if (Object.prototype.hasOwnProperty.call(source, property) && excluded.indexOf(property) < 0) {
      target[property] = source[property];
    }
  }

  if (source != null && typeof Object.getOwnPropertySymbols === "function") {
    for (const symbol of Object.getOwnPropertySymbols(source)) {
      if (excluded.indexOf(symbol as unknown as string) >= 0) continue;
      if (Object.prototype.propertyIsEnumerable.call(source, symbol)) {
        target[symbol as unknown as string] = source[symbol];
      }
    }
  }

  return target;
}