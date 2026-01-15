import { randomUUID } from "node:crypto";
import type {
  FilterCriteria,
  FilterRange,
  IBaseRepository,
  PaginationOptions,
  WithPagination,
} from "@/shared/core/IBaseRepository.js";

export class InMemoryRepository<T extends { id: string }>
  implements IBaseRepository<T>
{
  protected items: T[] = [];

  async save(entity: T): Promise<T | null> {
    const index = this.items.findIndex((item) => item.id === entity.id);
    if (index !== -1) {
      this.items[index] = entity;
    } else {
      this.items.push(entity);
    }
    return entity;
  }

  async findById(id: string): Promise<T | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async findOne(criteria: FilterCriteria<T>): Promise<T | null> {
    const filtered = this.applyFilters(this.items, criteria);
    return filtered[0] || null;
  }

  async findAll(
    criteria?: FilterCriteria<T>,
    paginationOptions?: PaginationOptions,
  ): Promise<WithPagination<T>> {
    let filtered = this.items;

    if (criteria) {
      filtered = this.applyFilters(filtered, criteria);
    }

    const total = filtered.length;

    if (paginationOptions) {
      const { offset, limit } = paginationOptions;
      filtered = filtered.slice(offset, offset + limit);
    }

    return {
      data: filtered,
      total,
    };
  }

  generateId(): string {
    return randomUUID();
  }

  protected applyFilters(items: T[], criteria: FilterCriteria<T>): T[] {
    return items.filter((item) => {
      return Object.entries(criteria).every(([key, value]) => {
        const itemValue = item[key as keyof T];

        if (value === undefined) return true;

        // Handle Date Range
        if (
          value &&
          typeof value === "object" &&
          ("from" in value || "to" in value) &&
          ((value as FilterRange<Date>).from instanceof Date ||
            (value as FilterRange<Date>).to instanceof Date) &&
          itemValue instanceof Date
        ) {
          const range = value as FilterRange<Date>;
          if (range.from && itemValue < range.from) return false;
          if (range.to && itemValue > range.to) return false;
          return true;
        }

        // Handle Number Range
        if (
          value &&
          typeof value === "object" &&
          (typeof (value as FilterRange<number>).from === "number" ||
            typeof (value as FilterRange<number>).to === "number") &&
          typeof itemValue === "number"
        ) {
          const range = value as FilterRange<number>;
          if (range.from !== undefined && itemValue < range.from) return false;
          if (range.to !== undefined && itemValue > range.to) return false;
          return true;
        }

        // Handle Exact Match
        return itemValue === value;
      });
    });
  }
}
