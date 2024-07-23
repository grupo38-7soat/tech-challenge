import {
  Customer,
  Order,
  OrderCurrentStatus,
  Payment,
  PaymentCurrentStatus,
  PaymentType,
} from '@core/domain/entities'
import {
  IOrderRepository,
  OrderParams,
  OrderProduct,
} from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { PostgresConnectionAdapter } from '../postgres-connection.adapter'

type OrderData = {
  id: number
  total_amount: number
  status: OrderCurrentStatus
  payment_id: string
  customer_id: string
  effective_date: string
  updated_at: string
  payment_type: PaymentType
  payment_status: PaymentCurrentStatus
  payment_effective_date: string
  customer_name: string
  customer_document: string
  customer_email: string
}

export class OrderRepository implements IOrderRepository {
  table: string

  constructor(
    private readonly postgresConnectionAdapter: PostgresConnectionAdapter,
  ) {
    this.table = 'fast_food.order'
  }

  async saveOrder(order: Order): Promise<number> {
    try {
      const customerId = order.getCustomer()
        ? order.getCustomer().getId()
        : null
      const result = await this.postgresConnectionAdapter.query<{ id: number }>(
        `
          INSERT INTO ${this.table}(total_amount, status, payment_id, customer_id)
          VALUES($1::numeric, $2::fast_food.order_status_enum, $3::uuid, $4::uuid)
          RETURNING id
        `,
        [
          order.getTotalAmount(),
          order.getStatus(),
          order.getPayment().getId(),
          customerId,
        ],
      )
      return Number(result.rows[0]?.id)
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao criar pedido',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async saveOrderProduct({
    orderId,
    productId,
    quantity,
    price,
    observation,
  }: OrderProduct): Promise<void> {
    try {
      await this.postgresConnectionAdapter.query<{ id: number }>(
        `
          INSERT INTO fast_food.product_order(order_id, product_id, quantity, unit_price, observation)
          VALUES($1::integer, $2::integer, $3::integer, $4::numeric, $5::text)
        `,
        [orderId, productId, quantity, price, observation],
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao salvar produto do pedido',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async updateOrderStatus(
    orderId: number,
    status: OrderCurrentStatus,
  ): Promise<Order> {
    try {
      const { rows } = await this.postgresConnectionAdapter.query<{
        status: OrderCurrentStatus
        updated_at: string
      }>(
        `
          UPDATE ${this.table} SET status = $1::fast_food.order_status_enum, updated_at = current_timestamp
          WHERE id = $2::integer
          RETURNING status, updated_at
        `,
        [status, orderId],
      )
      if (!rows || !rows.length) return null
      return new Order(
        0,
        rows[0].status,
        [],
        null,
        null,
        null,
        null,
        rows[0].updated_at,
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao atualizar o status do pedido',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async findAllOrders(params?: OrderParams): Promise<Order[]> {
    try {
      const haveParams = params && Object.keys(params).length
      const baseQuery = `
        SELECT
          o.id,
          o.total_amount,
          o.status,
          o.customer_id,
          o.payment_id,
          o.created_at AS effective_date,
          o.updated_at,
          p.type AS payment_type,
          p.status AS payment_status,
          p.effective_date AS payment_effective_date,
          c.name AS customer_name,
          c.document AS customer_document,
          c.email AS customer_email
        FROM
          ${this.table} o
        LEFT JOIN
          fast_food.customer c ON o.customer_id = c.id
        JOIN
          fast_food.payment p ON o.payment_id = p.id
        WHERE o.status != 'FINALIZADO' AND o.status != 'CANCELADO'
        ORDER BY o.created_at ASC
      `
      const [query, paramsList] = !haveParams
        ? [baseQuery, []]
        : [
            `${baseQuery} WHERE ${Object.keys(params)
              .map(
                (field, index) =>
                  `o.${field} ${params[field].exactMatch ? '=' : 'ILIKE'} $${index + 1}`,
              )
              .join(' AND ')}`,
            Object.values(params).map(param =>
              param.exactMatch ? param.value : `%${param.value}%`,
            ),
          ]
      const { rows } = await this.postgresConnectionAdapter.query<OrderData>(
        query,
        [...paramsList],
      )
      if (!rows || !rows.length) return []
      return rows.map(row => {
        const payment = new Payment(
          row.payment_type,
          row.payment_status,
          row.payment_effective_date,
          row.payment_id,
        )
        let customer = null
        if (row.customer_id) {
          customer = new Customer(
            row.customer_document,
            row.customer_name,
            row.customer_email,
            row.customer_id,
          )
        }
        return new Order(
          Number(row.total_amount),
          row.status,
          [],
          payment,
          customer,
          Number(row.id),
          row.effective_date,
          row.updated_at,
        )
      })
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao consultar pedidos',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async findOrderById(orderId: number): Promise<Order> {
    try {
      const { rows } = await this.postgresConnectionAdapter.query<OrderData>(
        `
          SELECT
          o.id,
          o.total_amount,
          o.status,
          o.customer_id,
          o.payment_id,
          o.created_at AS effective_date,
          o.updated_at,
          p.type AS payment_type,
          p.status AS payment_status,
          p.effective_date AS payment_effective_date,
          c.name AS customer_name,
          c.document AS customer_document,
          c.email AS customer_email
        FROM
          ${this.table} o
        LEFT JOIN
          fast_food.customer c ON o.customer_id = c.id
        JOIN
          fast_food.payment p ON o.payment_id = p.id
        WHERE o.id = $1::integer LIMIT 1
        `,
        [orderId],
      )
      if (!rows || !rows.length) return null
      const payment = new Payment(
        rows[0].payment_type,
        rows[0].payment_status,
        rows[0].payment_effective_date,
        rows[0].payment_id,
      )
      let customer = null
      if (rows[0].customer_id) {
        customer = new Customer(
          rows[0].customer_document,
          rows[0].customer_name,
          rows[0].customer_email,
          rows[0].customer_id,
        )
      }
      return new Order(
        Number(rows[0].total_amount),
        rows[0].status,
        [],
        payment,
        customer,
        Number(rows[0].id),
        rows[0].effective_date,
        rows[0].updated_at,
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao atualizar o status do pedido',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }
}
