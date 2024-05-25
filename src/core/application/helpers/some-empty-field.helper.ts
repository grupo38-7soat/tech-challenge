export function someEmptyField(fields: unknown[]): boolean {
  return fields.some(field => !field)
}
