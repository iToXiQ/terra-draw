import mapboxgl from "mapbox-gl";
import * as L from "leaflet";
import { Loader } from "@googlemaps/js-api-loader";

import {
  TerraDraw,
  TerraDrawPointMode,
  TerraDrawCircleMode,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode,
  TerraDrawFreehandMode,
  TerraDrawMapboxGLAdapter,
  TerraDrawLeafletAdapter,
  TerraDrawGoogleMapsAdapter,
} from "../../src/terra-draw";
import { addModeChangeHandler } from "../../common/addModeChangeHandler";
import { TerraDrawRenderMode } from "../../src/modes/render.mode";
import { uk } from "../../docs/src/sample";

const getModes = () => {
  return {
    select: new TerraDrawSelectMode({
      flags: {
        arbitary: {
          feature: {},
        },
        polygon: {
          feature: {
            draggable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
            },
          },
        },
        linestring: {
          feature: {
            draggable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true,
            },
          },
        },
        circle: {
          feature: {
            draggable: true,
          },
        },
        point: {
          feature: {
            draggable: true,
          },
        },
      },
    }),
    point: new TerraDrawPointMode(),
    linestring: new TerraDrawLineStringMode({
      allowSelfIntersections: false,
    }),
    polygon: new TerraDrawPolygonMode({
      allowSelfIntersections: false,
    }),
    circle: new TerraDrawCircleMode(),
    freehand: new TerraDrawFreehandMode(),
    arbitary: new TerraDrawRenderMode({
      styling: {
        polygonFillColor: "#4357AD",
        polygonOutlineColor: "#48A9A6",
        polygonOutlineWidth: 2,
      },
    }),
  };
};

let currentSelected: { button: undefined | HTMLButtonElement; mode: string } = {
  button: undefined,
  mode: "static",
};

const example = {
  lng: -0.118092,
  lat: 51.509865,
  zoom: 12,
  initialised: [] as string[],
  initLeaflet(id: string) {
    if (this.initialised.includes("leaflet")) {
      return;
    }

    const { lng, lat, zoom } = this;

    const map = L.map(id, {
      center: [lat, lng],
      zoom: zoom + 1, // starting zoom
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // const dataString = localStorage.getItem("snapshot");

    // console.log(dataString, Boolean(dataString));
    // const data = Boolean(dataString) ? JSON.parse(dataString) : undefined;

    const draw = new TerraDraw({
      adapter: new TerraDrawLeafletAdapter({
        lib: L,
        map,
        coordinatePrecision: 9,
      }),
      modes: getModes(),
      // data,
    });

    draw.start();

    addModeChangeHandler(draw, currentSelected);

    this.initialised.push("leaflet");
  },
  initMapbox(id: string, accessToken: string | undefined) {
    if (this.initialised.includes("mapbox")) {
      return;
    }

    if (!accessToken) {
      return;
    }

    const { lng, lat, zoom } = this;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: id, // container ID
      style: "mapbox://styles/mapbox/streets-v11", // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: zoom, // starting zoom
    });

    map.on("style.load", () => {
      const draw = new TerraDraw({
        adapter: new TerraDrawMapboxGLAdapter({
          map,
          coordinatePrecision: 9,
        }),
        modes: getModes(),
        data: uk.features as any,
      });

      draw.start();

      addModeChangeHandler(draw, currentSelected);
    });
    this.initialised.push("mapbox");
  },
  initGoogleMaps(id: string, apiKey: string | undefined) {
    if (this.initialised.includes("google")) {
      return;
    }

    if (!apiKey) {
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
    });

    loader.load().then((google) => {
      const map = new google.maps.Map(
        document.getElementById(id) as HTMLElement,
        {
          center: { lat: this.lat, lng: this.lng },
          zoom: this.zoom,
          clickableIcons: false,
        }
      );

      map.addListener("projection_changed", () => {
        const draw = new TerraDraw({
          adapter: new TerraDrawGoogleMapsAdapter({
            lib: google.maps,
            map,
            coordinatePrecision: 9,
          }),
          modes: getModes(),
        });
        draw.start();

        addModeChangeHandler(draw, currentSelected);

        this.initialised.push("google");
      });
    });
  },
};

console.log(process.env);

example.initLeaflet("leaflet-map");
example.initMapbox("mapbox-map", process.env.MAPBOX_ACCESS_TOKEN);
example.initGoogleMaps("google-map", process.env.GOOGLE_API_KEY);
document.addEventListener("keyup", (event) => {
  (document.getElementById("keybind") as HTMLButtonElement).innerHTML =
    event.key;
});
