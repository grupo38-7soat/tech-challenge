export class Document {
  constructor(private readonly document: string) {}

  getDocument(): string {
    return this.document
  }

  validateDocument(): void {}
}
