import { DomainException, ExceptionCause } from '../base'

export class Document {
  constructor(private readonly document: string) {}

  getDocument(): string {
    return this.document
  }

  validateDocument(value: string): void {
    const document = value.replace(/[^\d]/g, '')
    if (document.length !== 11 || /^(\d)\1+$/.test(document)) {
      throw new DomainException(
        'Documento inválido',
        ExceptionCause.INVALID_DATA,
      )
    }
    for (let j = 9; j < 11; j++) {
      let sum = 0
      const weight = j + 1
      for (let i = 0; i < j; i++) {
        sum += parseInt(document.charAt(i)) * (weight - i)
      }
      const remainder = sum % 11
      const checkDigit = remainder < 2 ? 0 : 11 - remainder
      if (checkDigit !== parseInt(document.charAt(j))) {
        throw new DomainException(
          'Documento inválido',
          ExceptionCause.INVALID_DATA,
        )
      }
    }
  }
}
