import { Category, Product } from '@core/domain/entities'
import { IProductRepository } from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { PostgresConnectionAdapter } from '../postgres-connection.adapter'

type ProductData = {
  id: number
  name: string
  description: string
  category: string
  price: number
  image_links: string[]
  created_at: string
  updated_at: string
}

export class ProductRepository implements IProductRepository {
  table: string

  constructor(
    private readonly postgresConnectionAdapter: PostgresConnectionAdapter,
  ) {
    this.table = 'fast_food.product'
  }

  async saveProduct(product: Product): Promise<number> {
    try {
      const [query, params] = !product.getId()
        ? [
            `
              INSERT INTO ${this.table} (name, description, price, category, image_links)
              VALUES ($1::text, $2::text, $3::numeric, $4::category_enum, $5::text[])
              RETURNING id
            `,
            [
              product.getName(),
              product.getDescription(),
              product.getPrice(),
              product.getCategory(),
              product.getImageLinks(),
            ],
          ]
        : [
            `
              UPDATE ${this.table} SET name = $1::text, description = $2::text, price = $3::numeric,
              category = $4::category_enum, image_links = $5::text[] WHERE id = $6::int
              RETURNING id
            `,
            [
              product.getName(),
              product.getDescription(),
              product.getPrice(),
              product.getCategory(),
              product.getImageLinks(),
              product.getId(),
            ],
          ]
      const result = await this.postgresConnectionAdapter.query<{ id: number }>(
        query,
        params,
      )
      return result.rows[0]?.id
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao salvar produto',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async findProductByParam(param: string, value: unknown): Promise<Product> {
    try {
      const { rows } = await this.postgresConnectionAdapter.query<ProductData>(
        `SELECT * FROM ${this.table} WHERE ${param} = $1 LIMIT 1`,
        [value],
      )
      if (!rows || !rows.length) return null
      return new Product(
        rows[0].name,
        rows[0].description,
        Number(rows[0].price),
        Category[rows[0].category],
        rows[0].image_links,
        Number(rows[0].id),
        rows[0].created_at,
        rows[0].updated_at,
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao consultar produto',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }

  async removeProduct(id: number): Promise<void> {
    try {
      await this.postgresConnectionAdapter.query(
        `DELETE FROM ${this.table} WHERE id = $1::int`,
        [id],
      )
    } catch (error) {
      console.error(error)
      throw new DomainException(
        'Erro ao remover produto',
        ExceptionCause.PERSISTANCE_EXCEPTION,
      )
    }
  }
}
