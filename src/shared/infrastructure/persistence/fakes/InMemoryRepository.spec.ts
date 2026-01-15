import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryRepository } from "./InMemoryRepository.js";

type TestEntity = {
  id: string;
  name: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
};

class TestRepository extends InMemoryRepository<TestEntity> {}

describe("InMemoryRepository (Generic) - Comprehensive Tests", () => {
  let repo: TestRepository;

  beforeEach(() => {
    repo = new TestRepository();
  });

  describe("Persistence Operations", () => {
    it("should save and find an entity by ID", async () => {
      const id = repo.generateId();
      const entity: TestEntity = {
        id,
        name: "Test",
        age: 25,
        isActive: true,
        createdAt: new Date(),
      };

      await repo.save(entity);
      const found = await repo.findById(id);

      expect(found).toEqual(entity);
    });

    it("should update an existing entity with the same ID", async () => {
      const id = repo.generateId();
      const entity: TestEntity = {
        id,
        name: "Old Name",
        age: 25,
        isActive: true,
        createdAt: new Date(),
      };

      await repo.save(entity);

      // Modify and save again
      entity.name = "New Name";
      await repo.save(entity);

      const found = await repo.findById(id);
      expect(found).toBeDefined();
      expect(found?.name).toBe("New Name");

      // Ensure no duplicate records
      const all = await repo.findAll();
      expect(all.total).toBe(1);
    });

    it("should return null if finding by non-existent ID", async () => {
      const found = await repo.findById("non-existent-id");
      expect(found).toBeNull();
    });
  });

  describe("Query Operations", () => {
    it("should find one entity by filter criteria", async () => {
      await repo.save({
        id: "1",
        name: "Unique",
        age: 25,
        isActive: true,
        createdAt: new Date(),
      });
      await repo.save({
        id: "2",
        name: "Other",
        age: 30,
        isActive: false,
        createdAt: new Date(),
      });

      const found = await repo.findOne({ name: "Unique" });
      expect(found).toBeDefined();
      expect(found?.id).toBe("1");
    });

    it("should return null if findOne matches nothing", async () => {
      const found = await repo.findOne({ name: "NonExistent" });
      expect(found).toBeNull();
    });
  });

  describe("Exact Match Filtering", () => {
    it("should filter by string (exact match)", async () => {
      await repo.save({
        id: "1",
        name: "Alice",
        age: 25,
        isActive: true,
        createdAt: new Date(),
      });
      await repo.save({
        id: "2",
        name: "Bob",
        age: 30,
        isActive: false,
        createdAt: new Date(),
      });

      const result = await repo.findAll({ name: "Alice" });
      expect(result.data).toHaveLength(1);
      expect(result.data.at(0)?.name).toBe("Alice");
    });

    it("should filter by number (exact match)", async () => {
      await repo.save({
        id: "1",
        name: "Alice",
        age: 25,
        isActive: true,
        createdAt: new Date(),
      });
      await repo.save({
        id: "2",
        name: "Bob",
        age: 30,
        isActive: false,
        createdAt: new Date(),
      });

      const result = await repo.findAll({ age: 25 });
      expect(result.data).toHaveLength(1);
      expect(result.data.at(0)?.age).toBe(25);
    });

    it("should filter by boolean (true)", async () => {
      await repo.save({
        id: "1",
        name: "Alice",
        age: 25,
        isActive: true,
        createdAt: new Date(),
      });
      await repo.save({
        id: "2",
        name: "Bob",
        age: 30,
        isActive: false,
        createdAt: new Date(),
      });

      const result = await repo.findAll({ isActive: true });
      expect(result.data).toHaveLength(1);
      expect(result.data.at(0)?.isActive).toBe(true);
    });

    it("should filter by boolean (false)", async () => {
      await repo.save({
        id: "1",
        name: "Alice",
        age: 25,
        isActive: true,
        createdAt: new Date(),
      });
      await repo.save({
        id: "2",
        name: "Bob",
        age: 30,
        isActive: false,
        createdAt: new Date(),
      });

      const result = await repo.findAll({ isActive: false });
      expect(result.data).toHaveLength(1);
      expect(result.data.at(0)?.isActive).toBe(false);
    });

    it("should filter by Date (exact match)", async () => {
      const date1 = new Date("2023-01-01T00:00:00Z");
      const date2 = new Date("2023-01-02T00:00:00Z");

      await repo.save({
        id: "1",
        name: "Alice",
        age: 25,
        isActive: true,
        createdAt: date1,
      });
      await repo.save({
        id: "2",
        name: "Bob",
        age: 30,
        isActive: false,
        createdAt: date2,
      });

      const result = await repo.findAll({ createdAt: date1 });
      expect(result.data).toHaveLength(1);
      expect(result.data.at(0)?.createdAt).toEqual(date1);
    });

    it("should ignore undefined filter properties", async () => {
      await repo.save({
        id: "1",
        name: "Alice",
        age: 25,
        isActive: true,
        createdAt: new Date(),
      });
      await repo.save({
        id: "2",
        name: "Bob",
        age: 30,
        isActive: false,
        createdAt: new Date(),
      });

      const result = await repo.findAll({ name: undefined });
      expect(result.data).toHaveLength(2);
    });
  });

  describe("Range Filtering - Number", () => {
    beforeEach(async () => {
      await repo.save({
        id: "1",
        name: "Kid",
        age: 10,
        isActive: true,
        createdAt: new Date(),
      });
      await repo.save({
        id: "2",
        name: "Teen",
        age: 15,
        isActive: true,
        createdAt: new Date(),
      });
      await repo.save({
        id: "3",
        name: "Adult",
        age: 25,
        isActive: true,
        createdAt: new Date(),
      });
    });

    it("should filter by number range (from only - tail case)", async () => {
      // age >= 15
      const result = await repo.findAll({ age: { from: 15 } });
      expect(result.data).toHaveLength(2); // Teen, Adult
      expect(result.data.map((i) => i.age).sort()).toEqual([15, 25]);
    });

    it("should filter by number range (to only - head case)", async () => {
      // age <= 15
      const result = await repo.findAll({ age: { to: 15 } });
      expect(result.data).toHaveLength(2); // Kid, Teen
      expect(result.data.map((i) => i.age).sort()).toEqual([10, 15]);
    });

    it("should filter by number range (from and to - middle case)", async () => {
      // 12 <= age <= 20
      const result = await repo.findAll({ age: { from: 12, to: 20 } });
      expect(result.data).toHaveLength(1); // Teen
      expect(result.data.at(0)?.age).toBe(15);
    });
  });

  describe("Range Filtering - Date", () => {
    const d1 = new Date("2023-01-01T10:00:00Z");
    const d2 = new Date("2023-01-02T10:00:00Z");
    const d3 = new Date("2023-01-03T10:00:00Z");

    beforeEach(async () => {
      await repo.save({
        id: "1",
        name: "First",
        age: 20,
        isActive: true,
        createdAt: d1,
      });
      await repo.save({
        id: "2",
        name: "Second",
        age: 20,
        isActive: true,
        createdAt: d2,
      });
      await repo.save({
        id: "3",
        name: "Third",
        age: 20,
        isActive: true,
        createdAt: d3,
      });
    });

    it("should filter by date range (from only - tail case)", async () => {
      // date >= d2
      const result = await repo.findAll({ createdAt: { from: d2 } });
      expect(result.data).toHaveLength(2); // Second, Third
      expect(result.data.map((i) => i.createdAt.getTime()).sort()).toEqual([
        d2.getTime(),
        d3.getTime(),
      ]);
    });

    it("should filter by date range (to only - head case)", async () => {
      // date <= d2
      const result = await repo.findAll({ createdAt: { to: d2 } });
      expect(result.data).toHaveLength(2); // First, Second
      expect(result.data.map((i) => i.createdAt.getTime()).sort()).toEqual([
        d1.getTime(),
        d2.getTime(),
      ]);
    });

    it("should filter by date range (from and to - middle case)", async () => {
      // d1 <= date <= d2
      const result = await repo.findAll({ createdAt: { from: d1, to: d2 } });
      expect(result.data).toHaveLength(2); // First, Second
    });
  });

  describe("Pagination with Filtering", () => {
    beforeEach(async () => {
      // Create 10 items
      for (let i = 1; i <= 10; i++) {
        await repo.save({
          id: i.toString(),
          name: i % 2 === 0 ? "Even" : "Odd",
          age: i * 10, // 10, 20, ..., 100
          isActive: true,
          createdAt: new Date(`2023-01-${i.toString().padStart(2, "0")}`),
        });
      }
    });

    it("should paginate exact match results", async () => {
      // Filter: name = "Even" (5 items: 2, 4, 6, 8, 10)
      // Page 1: limit 2 -> [2, 4]
      const page1 = await repo.findAll(
        { name: "Even" },
        { offset: 0, limit: 2 },
      );
      expect(page1.total).toBe(5);
      expect(page1.data).toHaveLength(2);
      expect(page1.data.at(0)?.id).toBe("2");
      expect(page1.data.at(1)?.id).toBe("4");

      // Page 2: offset 2, limit 2 -> [6, 8]
      const page2 = await repo.findAll(
        { name: "Even" },
        { offset: 2, limit: 2 },
      );
      expect(page2.data).toHaveLength(2);
      expect(page2.data.at(0)?.id).toBe("6");
      expect(page2.data.at(1)?.id).toBe("8");
    });

    it("should paginate number range results", async () => {
      // Filter: age >= 50 (6 items: 50, 60, 70, 80, 90, 100)
      // Page 1: limit 3 -> [50, 60, 70]
      const result = await repo.findAll(
        { age: { from: 50 } },
        { offset: 0, limit: 3 },
      );
      expect(result.total).toBe(6);
      expect(result.data).toHaveLength(3);
      expect(result.data.map((i) => i.age)).toEqual([50, 60, 70]);
    });

    it("should paginate date range results", async () => {
      // Filter: date <= 2023-01-05 (5 items: 1, 2, 3, 4, 5)
      const targetDate = new Date("2023-01-05");
      // Page 2: offset 2, limit 2 -> [3, 4]
      const result = await repo.findAll(
        { createdAt: { to: targetDate } },
        { offset: 2, limit: 2 },
      );
      expect(result.total).toBe(5);
      expect(result.data).toHaveLength(2);
      expect(result.data.at(0)?.id).toBe("3");
      expect(result.data.at(1)?.id).toBe("4");
    });
  });

  describe("Utility Operations", () => {
    it("should generate unique IDs", () => {
      const ids = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        ids.add(repo.generateId());
      }
      expect(ids.size).toBe(1000);
    });
  });
});
