import { DomainException, ExceptionCause } from '../base'

export class Email {
  constructor(private readonly email: string) {}

  getEmail(): string {
    return this.email
  }

  validateEmail(value: string): void {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = regex.test(value)
    if (!isEmailValid) {
      throw new DomainException('E-mail inválido', ExceptionCause.INVALID_DATA)
    }
  }
}
