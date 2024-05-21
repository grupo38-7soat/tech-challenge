import {
  IMakeCheckoutUseCase,
  MakeCheckoutInput,
  MakeCheckoutOutput,
} from '../types/order'

export class MakeCheckoutUseCase implements IMakeCheckoutUseCase {
  execute(input: MakeCheckoutInput): Promise<MakeCheckoutOutput> {
    console.log(input)
    throw new Error('Method not implemented.')
  }
}
