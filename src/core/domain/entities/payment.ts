import { PaymentStatus, PaymentStatusFactory } from '../value-objects'

export enum PaymentType {
  DINHEIRO = 'DINHEIRO',
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  CARTAO_DEBITO = 'CARTAO_DEBITO',
  PIX = 'PIX',
  VALE_REFEICAO = 'VALE_REFEICAO',
}

export enum PaymentCurrentStatus {
  PENDENTE = 'PENDENTE',
  AUTORIZADO = 'AUTORIZADO',
  REJEITADO = 'REJEITADO',
  REEMBOLSADO = 'REEMBOLSADO',
}

export type SerializedPayment = {
  id: string
  type: PaymentType
  paymentStatus: PaymentCurrentStatus
  effectiveDate: string
  updatedAt: string
  externalId: string
}

export class Payment {
  private id: string
  private type: PaymentType
  private paymentStatus: PaymentStatus
  private effectiveDate: string
  private createdAt: string
  private updatedAt: string
  private externalId: string

  constructor(
    type: PaymentType,
    currentStatus: PaymentCurrentStatus,
    effectiveDate: string,
    id?: string,
    externalId?: string,
    createdAt?: string,
    updatedAt?: string,
  ) {
    this.setId(id)
    this.setExternalId(externalId)
    this.setType(type)
    this.setEffectiveDate(effectiveDate)
    this.setCreatedAt(createdAt)
    this.setUpdatedAt(updatedAt)
    this.paymentStatus = PaymentStatusFactory.create(this, currentStatus)
  }

  private setId(id: string): void {
    if (id) {
      this.id = id
    }
  }

  public getId(): string {
    return this.id
  }

  public setExternalId(externalId: string): void {
    if (externalId) {
      this.externalId = externalId
    }
  }

  public getExternalId(): string {
    return this.externalId
  }

  private setType(type: PaymentType): void {
    this.type = type
  }

  public getType(): PaymentType {
    return this.type
  }

  public setPaymentStatus(currentStatus: PaymentStatus): void {
    this.paymentStatus = currentStatus
  }

  public getPaymentStatus(): PaymentCurrentStatus {
    return this.paymentStatus.value
  }

  private setEffectiveDate(value: string): void {
    // TODO: validar data e hora
    this.effectiveDate = value
  }

  public getEffectiveDate(): string {
    return this.effectiveDate
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

  public authorizePayment(): void {
    this.paymentStatus.authorize()
  }

  public rejectPayment(): void {
    this.paymentStatus.reject()
  }

  public refundPayment(): void {
    this.paymentStatus.refund()
  }

  public toJson(): SerializedPayment {
    return {
      id: this.id,
      externalId: this.externalId,
      type: this.type,
      paymentStatus: this.getPaymentStatus(),
      effectiveDate: this.effectiveDate,
      updatedAt: this.updatedAt,
    }
  }
}
