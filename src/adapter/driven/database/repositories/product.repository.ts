import { Product, Category } from '@core/domain/entities'
import { IProductRepository } from '@core/domain/repositories'
import { DomainException, ExceptionCause } from '@core/domain/base'
import { PostgresConnectionAdapter } from '../postgres-connection.adapter'

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

  async findProductByCategory(category: Category): Promise<Product> {
    console.log(category)
    throw new Error('Method not implemented.')
  }

  async removeProduct(id: number): Promise<void> {
    console.log(id)
    throw new Error('Method not implemented.')
  }
}
