import { Feature, LineString, Polygon } from "geojson";
import { transformScale } from "./scale";

describe("scale", () => {
	it("returns a polygon as is if scale is set to 1", () => {
		const polygon = {
			type: "Feature",
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[0, 0],
						[0, 1],
						[1, 1],
						[1, 0],
						[0, 0],
					],
				],
			},
			properties: {},
		} as Feature<Polygon>;
		const result = transformScale(polygon, 1);
		expect(result).toStrictEqual(polygon);
	});

	it("scales a given Polygon correctly", () => {
		const polygon = {
			type: "Feature",
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[0, 0],
						[0, 1],
						[1, 1],
						[1, 0],
						[0, 0],
					],
				],
			},
			properties: {},
		} as Feature<Polygon>;
		const result = transformScale(polygon, 2);
		expect(result).toStrictEqual({
			type: "Feature",
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[-0.5, -0.4999999999999963],
						[-0.5000761693402183, 1.5],
						[1.5000761693402183, 1.5],
						[1.5, -0.4999999999999963],
						[-0.5, -0.4999999999999963],
					],
				],
			},
			properties: {},
		});
	});

	it("scales a given LineString correctly", () => {
		const linestring = {
			type: "Feature",
			geometry: {
				type: "LineString",
				coordinates: [
					[0, 0],
					[0, 1],
					[1, 1],
					[1, 0],
				],
			},
			properties: {},
		} as Feature<LineString>;
		const result = transformScale(linestring, 2);
		expect(result).toStrictEqual({
			type: "Feature",
			geometry: {
				type: "LineString",
				coordinates: [
					[-0.5, -0.4999999999999963],
					[-0.5000761693402183, 1.5],
					[1.5000761693402183, 1.5],
					[1.5, -0.4999999999999963],
				],
			},
			properties: {},
		});
	});
});
