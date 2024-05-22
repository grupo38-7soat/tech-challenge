import { DomainException } from '../base/domain-exception'

export class Document {
  constructor(private readonly document: string) {}

  getDocument(): string {
    return this.document
  }

  validateDocument(): void {
    throw new DomainException('Método não implementado')
  }
}
