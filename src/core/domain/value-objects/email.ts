import { DomainException } from '../base/domain-exception'

export class Email {
  constructor(private readonly email: string) {}

  getEmail(): string {
    return this.email
  }

  validateEmail(): void {
    throw new DomainException('Método não implementado')
  }
}
