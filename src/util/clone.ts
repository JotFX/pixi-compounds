export function clone(item: object) {
  return JSON.parse(JSON.stringify(item));
}
