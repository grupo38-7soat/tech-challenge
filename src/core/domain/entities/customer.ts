import { randomUUID } from 'crypto'
import { DomainException, ExceptionCause } from '../base'
import { Document, Email } from '../value-objects'

type SerializedCustomer = {
  id: string
  name: string
  email: string
  document: string
  createdAt: string
  updatedAt: string
}

export class Customer {
  private id: string
  private name: string
  private email: Email
  private document: Document
  private createdAt: string
  private updatedAt: string

  constructor(
    document: string,
    name: string,
    email: string,
    id?: string,
    createdAt?: string,
    updatedAt?: string,
  ) {
    this.setId(id)
    this.setDocument(document)
    this.setName(name)
    this.setEmail(email)
    this.setCreatedAt(createdAt)
    this.setUpdatedAt(updatedAt)
  }

  private setId(id: string): void {
    this.id = id ?? randomUUID()
  }

  public getId(): string {
    return this.id
  }

  private setName(value: string): void {
    if (value.length < 5) {
      throw new DomainException(
        'O nome deve ter no mínimo 5 caracteres',
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    this.name = value
  }

  public getName(): string {
    return this.name
  }

  private setEmail(value: string): void {
    const email = new Email(value)
    email.validateEmail()
    this.email = email
  }

  public getEmail(): string {
    return this.email.getEmail()
  }

  private setDocument(value: string): void {
    const document = new Document(value)
    document.validateDocument()
    this.document = document
  }

  public getDocument(): string {
    return this.document.getDocument()
  }

  private setCreatedAt(value: string): void {
    if (value) {
      this.createdAt = value
    }
  }

  public getCreatedAt(): string {
    return this.createdAt
  }

  private setUpdatedAt(value: string): void {
    if (value) {
      this.updatedAt = value
    }
  }

  public getUpdatedAt(): string {
    return this.updatedAt
  }

  public toJson(): SerializedCustomer {
    return {
      id: this.id,
      document: this.document.getDocument(),
      name: this.name,
      email: this.email.getEmail(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
