import { DomainException, ExceptionCause } from '../base'

export enum Category {
  LANCHE = 'LANCHE',
  ACOMPANHAMENTO = 'ACOMPANHAMENTO',
  BEBIDA = 'BEBIDA',
  SOBREMESA = 'SOBREMESA',
}

type SerializedProduct = {
  id: number
  name: string
  description: string
  category: Category
  price: number
  imageLinks: string[]
  createdAt: string
  updatedAt: string
}

export class Product {
  private id: number
  private name: string
  private description: string
  private price: number
  private category: Category
  private imageLinks: string[]
  private createdAt: string
  private updatedAt: string

  constructor(
    name: string,
    description: string,
    price: number,
    category: Category,
    imageLinks: string[],
    id?: number,
    createdAt?: string,
    updatedAt?: string,
  ) {
    this.setId(id)
    this.setName(name)
    this.setDescription(description)
    this.setPrice(price)
    this.setCategory(category)
    this.setImageLinks(imageLinks)
    this.setCreatedAt(createdAt)
    this.setUpdatedAt(updatedAt)
  }

  private setId(id: number): void {
    if (id) {
      this.id = id
    }
  }

  public getId(): number {
    return this.id
  }

  private setName(value: string): void {
    const min = 3
    if (value.length < min) {
      throw new DomainException(
        `O nome deve ter no mínimo ${min} caracteres`,
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    this.name = value
  }

  public getName(): string {
    return this.name
  }

  private setDescription(value: string): void {
    const min = 20
    const max = 255
    if (value.length < min && value.length > max) {
      throw new DomainException(
        `A descrição deve ter entre ${min} e ${max} caracteres`,
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    this.description = value
  }

  public getDescription(): string {
    return this.description
  }

  private setPrice(value: number): void {
    if (value < 0) {
      throw new DomainException(
        'O valor deve ser maior que 0',
        ExceptionCause.BUSINESS_EXCEPTION,
      )
    }
    this.price = value
  }

  public getPrice(): number {
    return this.price
  }

  private setCategory(value: Category) {
    this.category = value
  }

  public getCategory(): Category {
    return this.category
  }

  private setImageLinks(values: string[]): void {
    this.imageLinks = values
  }

  public getImageLinks(): string[] {
    return this.imageLinks
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

  public toJson(): SerializedProduct {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      category: this.category,
      price: this.price,
      imageLinks: this.imageLinks,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
