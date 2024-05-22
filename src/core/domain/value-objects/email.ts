export class Email {
  constructor(private readonly email: string) {}

  getEmail(): string {
    return this.email
  }

  validateEmail(): void {}
}
