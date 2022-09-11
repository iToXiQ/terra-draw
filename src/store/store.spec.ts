import { GeoJSONStore } from "./store";

describe("GeoJSONStore", () => {
  describe("constructor", () => {
    it("can take data", () => {
      const store = new GeoJSONStore({
        data: [
          {
            id: "e3ccd3b9-afb1-4f0b-91d8-22a768d5f284",
            type: "Feature",
            geometry: { type: "Point", coordinates: [0, 0] },
            properties: {
              mode: "test",
              createdAt: +new Date(),
              updatedAt: +new Date(),
            },
          },
        ],
      });

      expect(store.copyAll().length).toBe(1);
    });

    it("throws if tracked properties are not provided", () => {
      expect(() => {
        new GeoJSONStore({
          data: [
            {
              id: "e3ccd3b9-afb1-4f0b-91d8-22a768d5f284",
              type: "Feature",
              geometry: { type: "Point", coordinates: [0, 0] },
              properties: {},
            },
          ],
        });
      }).toThrowError();
    });

    it("does not throw if tracked is false and tracked properties are not provided", () => {
      expect(() => {
        new GeoJSONStore({
          tracked: false,
          data: [
            {
              id: "e3ccd3b9-afb1-4f0b-91d8-22a768d5f284",
              type: "Feature",
              geometry: { type: "Point", coordinates: [0, 0] },
              properties: {
                mode: "test",
              },
            },
          ],
        });
      }).not.toThrowError();
    });

    it("throws on data with non object feature", () => {
      expect(() => {
        new GeoJSONStore({
          data: [undefined],
        } as any);
      }).toThrowError();
    });

    it("throws on data with no id", () => {
      expect(() => {
        new GeoJSONStore({
          data: [
            {
              id: undefined,
            } as any,
          ],
        });
      }).toThrowError();
    });

    it("throws on data with non string id", () => {
      expect(() => {
        new GeoJSONStore({
          data: [
            {
              id: 1,
            } as any,
          ],
        });
      }).toThrowError();
    });

    it("throws on data with non uuid4 id", () => {
      expect(() => {
        new GeoJSONStore({
          data: [
            {
              id: "1",
            } as any,
          ],
        });
      }).toThrowError();
    });

    it("throws on data with non uuid4 id", () => {
      expect(() => {
        new GeoJSONStore({
          data: [
            {
              id: "1",
            } as any,
          ],
        });
      }).toThrowError();
    });

    it("throws on data with no geometry", () => {
      expect(() => {
        new GeoJSONStore({
          data: [
            {
              id: "e3ccd3b9-afb1-4f0b-91d8-22a768d5f284",
            } as any,
          ],
        });
      }).toThrowError();
    });

    it("throws on data with no properties", () => {
      expect(() => {
        new GeoJSONStore({
          data: [
            {
              id: "e3ccd3b9-afb1-4f0b-91d8-22a768d5f284",
              geometry: {},
            } as any,
          ],
        });
      }).toThrowError();
    });

    it("throws on data with non Point, LineString, Polygon geometry type", () => {
      expect(() => {
        new GeoJSONStore({
          data: [
            {
              id: "e3ccd3b9-afb1-4f0b-91d8-22a768d5f284",
              geometry: {
                type: "MultiLineString",
              },
              properties: {},
            } as any,
          ],
        });
      }).toThrowError();
    });

    it("throws on data with non Point, LineString, Polygon geometry type", () => {
      expect(() => {
        new GeoJSONStore({
          data: [
            {
              id: "e3ccd3b9-afb1-4f0b-91d8-22a768d5f284",
              geometry: {
                type: "Point",
                coordinates: "[]",
              },
              properties: {},
            } as any,
          ],
        });
      }).toThrowError();
    });
  });

  describe("creates", () => {
    it("Point", () => {
      const store = new GeoJSONStore();

      const [id] = store.create([
        { geometry: { type: "Point", coordinates: [0, 0] } },
      ]);

      expect(typeof id).toBe("string");

      expect(id.length).toBe(36);
    });

    it("LineString", () => {
      const store = new GeoJSONStore();

      const [id] = store.create([
        {
          geometry: {
            type: "LineString",
            coordinates: [
              [0, 0],
              [1, 1],
            ],
          },
        },
      ]);

      expect(typeof id).toBe("string");
      expect(id.length).toBe(36);
    });

    it("Polygon", () => {
      const store = new GeoJSONStore();

      const [id] = store.create([
        {
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [0, 0],
                [1, 1],
                [2, 2],
                [0, 0],
              ],
            ],
          },
        },
      ]);

      expect(typeof id).toBe("string");
      expect(id.length).toBe(36);
    });
  });

  describe("delete", () => {
    it("removes geometry from the store", () => {
      const store = new GeoJSONStore();

      const ids = store.create([
        { geometry: { type: "Point", coordinates: [0, 0] } },
      ]);

      store.delete(ids);

      expect(() => {
        store.getGeometryCopy(ids[0]);
      }).toThrowError();
    });

    it("throws error if feature does not exist", () => {
      const store = new GeoJSONStore();

      expect(() => {
        store.delete(["non-existant-id"]);
      }).toThrowError();
    });
  });

  describe("getGeometryCopy", () => {
    it("copy existing geometry", () => {
      const store = new GeoJSONStore();

      const ids = store.create([
        { geometry: { type: "Point", coordinates: [0, 0] } },
      ]);

      expect(store.getGeometryCopy(ids[0])).toStrictEqual({
        type: "Point",
        coordinates: [0, 0],
      });
    });

    it("throws error on missing feature", () => {
      const store = new GeoJSONStore();

      expect(() => {
        store.getGeometryCopy("non-existant-id");
      }).toThrowError();
    });
  });

  describe("getPropertiesCopy", () => {
    it("copy existing properties", () => {
      const store = new GeoJSONStore();

      const ids = store.create([
        {
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: { mode: "test" },
        },
      ]);

      expect(store.getPropertiesCopy(ids[0])).toStrictEqual({
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
        mode: "test",
      });
    });

    it("do not expect createdAt and updatedAt in returned properties if flag is disabled", () => {
      const store = new GeoJSONStore({ tracked: false });

      const ids = store.create([
        {
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: { mode: "test" },
        },
      ]);

      expect(store.getPropertiesCopy(ids[0])).toStrictEqual({
        mode: "test",
      });
    });

    it("return original createdAt and updatedAt properties if originally created with them", () => {
      const store = new GeoJSONStore();

      const createdAt = +new Date();
      const ids = store.create([
        {
          geometry: { type: "Point", coordinates: [0, 0] },
          properties: {
            mode: "test",
            createdAt: createdAt,
            updatedAt: createdAt,
          },
        },
      ]);

      expect(store.getPropertiesCopy(ids[0])).toStrictEqual({
        mode: "test",
        createdAt: createdAt,
        updatedAt: createdAt,
      });
    });

    it("throws error on missing feature", () => {
      const store = new GeoJSONStore();

      expect(() => {
        store.getPropertiesCopy("non-existant-id");
      }).toThrowError();
    });
  });

  describe("updateGeometry", () => {
    it("updates geometry", () => {
      const store = new GeoJSONStore();

      const [id] = store.create([
        { geometry: { type: "Point", coordinates: [0, 0] } },
      ]);

      store.updateGeometry([
        { id, geometry: { type: "Point", coordinates: [1, 1] } },
      ]);

      expect(store.getGeometryCopy(id)).toStrictEqual({
        type: "Point",
        coordinates: [1, 1],
      });
    });

    it("throws error on missing feature", () => {
      const store = new GeoJSONStore();

      expect(() => {
        store.updateGeometry([
          {
            id: "non-existant-id",
            geometry: {
              type: "Point",
              coordinates: [1, 1],
            },
          },
        ]);
      }).toThrowError();
    });
  });

  describe("updateProperty", () => {
    it("updates geometry", () => {
      const store = new GeoJSONStore();

      const [id] = store.create([
        { geometry: { type: "Point", coordinates: [0, 0] } },
      ]);

      store.updateProperty([{ id, property: "test", value: 1 }]);

      expect(store.copyAll()[0].properties).toStrictEqual({
        test: 1,
        createdAt: expect.any(Number),
        updatedAt: expect.any(Number),
      });
    });

    it("throws error on missing feature", () => {
      const store = new GeoJSONStore();

      expect(() => {
        store.updateProperty([
          { id: "non-existant-id", property: "test", value: 1 },
        ]);
      }).toThrowError();
    });
  });

  describe("registerOnChange", () => {
    it("registerOnChange", () => {
      const store = new GeoJSONStore();

      const mockCallback = jest.fn();
      store.registerOnChange(mockCallback);

      const [id] = store.create([
        { geometry: { type: "Point", coordinates: [0, 0] } },
      ]);

      store.updateGeometry([
        { id, geometry: { type: "Point", coordinates: [1, 1] } },
      ]);
      store.delete([id]);

      expect(mockCallback).toBeCalledTimes(3);
      expect(mockCallback).toHaveBeenNthCalledWith(1, [id], "create");
      expect(mockCallback).toHaveBeenNthCalledWith(2, [id], "update");
      expect(mockCallback).toHaveBeenNthCalledWith(3, [id], "delete");
    });
  });

  describe("delete", () => {
    it("deletes feature", () => {
      const store = new GeoJSONStore();

      const [id] = store.create([
        { geometry: { type: "Point", coordinates: [0, 0] } },
      ]);
      store.delete([id]);

      // No longer exists so should throw errors
      expect(() => store.getGeometryCopy(id)).toThrowError();
      expect(() =>
        store.updateGeometry([
          {
            id,
            geometry: { type: "Point", coordinates: [1, 1] },
          },
        ])
      ).toThrowError();
    });
  });

  describe("copyAll", () => {
    it("creates a copy of the stores features", () => {
      const store = new GeoJSONStore();

      const mockCallback = jest.fn();
      store.registerOnChange(mockCallback);

      const [one] = store.create([
        { geometry: { type: "Point", coordinates: [0, 0] } },
      ]);
      const [two] = store.create([
        { geometry: { type: "Point", coordinates: [1, 1] } },
      ]);

      const copies = store.copyAll();

      const ids = copies.map((f) => f.id);

      expect(ids.includes(one)).toBe(true);
      expect(ids.includes(two)).toBe(true);
    });
  });
});
