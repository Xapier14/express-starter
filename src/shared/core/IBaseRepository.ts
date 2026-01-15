export type FilterRange<T> = {
  from?: T;
  to?: T;
};

// Helper type to determine the filter value based on the property type
type FilterValue<T> = T extends string
  ? string
  : T extends number
    ? number | FilterRange<number>
    : T extends Date
      ? Date | FilterRange<Date>
      : T extends boolean
        ? boolean
        : never; // Exclude types that are not string, number, Date, or boolean

export type FilterCriteria<T> = {
  [K in keyof T]?: FilterValue<T[K]> | undefined;
};

export type PaginationOptions = {
  offset: number;
  limit: number;
};

export type WithPagination<T> = {
  data: T[];
  total: number;
};

export interface IBaseRepository<T> {
  findOne(criteria: FilterCriteria<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  findAll(
    criteria?: FilterCriteria<T>,
    paginationOptions?: PaginationOptions,
  ): Promise<WithPagination<T>>;
  save(entity: T): Promise<T | null>;
  generateId(): string;
}
