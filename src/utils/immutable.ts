export function _splice<T, K>(arr: T[], start: number, deleteCount: number, ...items: K[]) {
  return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)];
}

export function _pop<T>(arr: T[]) {
  return arr.slice(0, -1);
}

export function _push<T>(arr: T[], newEntry: T) {
  return [...arr, newEntry];
}

export function _unshift<T>(arr: T[], newEntry: T) {
  return [newEntry, ...arr];
}

//

export function _replaceAt<T, K>(arr: T[], index: number, value: K) {
  return _splice(arr, index, 1, value);
}
