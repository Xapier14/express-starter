export interface IUseCase<TInput = object, TOutput = void> {
  execute(inputDto?: TInput): Promise<TOutput>;
}
