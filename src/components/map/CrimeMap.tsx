import { useEffect, useMemo, useRef, useState } from "react";

import type { BarangayId } from "@/App";

import {
  GeoJSON,
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import { divIcon, geoJSON as createGeoJSON } from "leaflet";

import type { DivIcon, GeoJSON as LeafletGeoJSON, Layer, Path } from "leaflet";

import type { Feature, FeatureCollection, Geometry } from "geojson";

import morongBarangays from "@/data/morong-barangays.json";

import "leaflet/dist/leaflet.css";

/* ==================================
   PROPS
================================== */

interface CrimeMapProps {
  selectedBarangay: BarangayId | null;

  onSelectBarangay: (barangay: BarangayId | null) => void;

  getBarangayTotal: (barangay: BarangayId) => number;

  selectedCrimeId: string;

  selectedCrimeName: string;

  hoveredBarangay?: BarangayId | null;

  onHoverBarangay?: (barangay: BarangayId | null) => void;
}

/* ==================================
   CRIME INTENSITY TYPE
================================== */

type CrimeIntensity = "none" | "low" | "moderate" | "high" | "highest";

/* ==================================
   GEOJSON
================================== */

const morongData = morongBarangays as FeatureCollection;

/* ==================================
   BARANGAY NAME MAPPING
================================== */

const barangayNameMap: Record<string, BarangayId> = {
  poblacion: "poblacion",
  mabayo: "mabayo",
  binaritan: "binaritan",
  sabang: "sabang",
  nagbalayong: "nagbalayong",
};

/* ==================================
   BARANGAY IDS
================================== */

const barangayIds: BarangayId[] = [
  "poblacion",
  "mabayo",
  "binaritan",
  "sabang",
  "nagbalayong",
];

/* ==================================
   PIN ANIMATION DELAY
================================== */

const barangayPinDelay: Record<BarangayId, number> = {
  poblacion: 0,
  mabayo: 100,
  binaritan: 200,
  sabang: 300,
  nagbalayong: 400,
};

/* ==================================
   CRIME COLORS
================================== */

const crimeColors: Record<string, string> = {
  /* INDEX CRIMES */

  robbery: "#dc2626",

  "robbery-with-homicide": "#7f1d1d",

  theft: "#2563eb",

  "qualified-theft": "#1d4ed8",

  murder: "#881337",

  homicide: "#be123c",

  rape: "#7c3aed",

  /* NON-INDEX CRIMES */

  "attempted-homicide": "#e11d48",

  "frustrated-homicide": "#f43f5e",

  "grave-threats": "#ea580c",

  "light-threats": "#f97316",

  "unjust-vexation": "#0891b2",

  cockfighting: "#65a30d",

  "acts-of-lasciviousness": "#db2777",

  "alarms-and-scandal": "#0d9488",

  "anti-gambling-law": "#16a34a",

  "malicious-mischief": "#0284c7",

  "dangerous-drugs": "#9333ea",

  "resistance-disobedience-person-authority": "#475569",

  "violence-against-women-and-their-children": "#be185d",

  "photo-and-video-voyeurism": "#c026d3",

  "comprehensive-law-firearms-ammunition": "#334155",

  "qualified-trespass-to-dwelling": "#0f766e",

  "anti-electricity-electric-transmission-pilferage": "#ca8a04",

  "illegal-possession-bladed-pointed-blunt-weapons": "#64748b",

  "direct-assaults": "#b45309",

  "land-transportation-and-traffic-code": "#0369a1",

  "omnibus-election-code": "#4f46e5",

  "other-forms-of-trespass": "#059669",

  "qualified-seduction": "#a21caf",

  "slight-physical-injuries-and-maltreatment": "#e8790b",

  "special-protection-children": "#8b5cf6",

  estafa: "#0891b2",

  /* VEHICULAR */

  "reckless-imprudence-damage-to-property": "#d97706",

  "reckless-imprudence-physical-injury": "#f59e0b",

  "reckless-imprudence-multiple-physical-injury": "#eab308",

  "reckless-imprudence-homicide": "#92400e",
};

/* ==================================
   COLOR HELPERS
================================== */

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");

  const value = Number.parseInt(clean, 16);

  return {
    r: (value >> 16) & 255,

    g: (value >> 8) & 255,

    b: value & 255,
  };
}

function mixColors(first: string, second: string, amount: number) {
  const a = hexToRgb(first);

  const b = hexToRgb(second);

  const mix = (start: number, end: number) =>
    Math.round(start + (end - start) * amount);

  const r = mix(a.r, b.r);

  const g = mix(a.g, b.g);

  const blue = mix(a.b, b.b);

  return `rgb(${r}, ${g}, ${blue})`;
}

function getCrimeBaseColor(crimeId: string) {
  return crimeColors[crimeId] ?? "#7a1f2b";
}

/* ==================================
   GET BARANGAY NAME
================================== */

function getBarangayName(
  properties: Record<string, unknown> | null | undefined,
): string {
  if (!properties) {
    return "";
  }

  const possibleNames = [
    properties.name,
    properties.NAME,
    properties.brgy_name,
    properties.BRGY_NAME,
    properties.ADM4_EN,
  ];

  const name = possibleNames.find((value) => typeof value === "string");

  return typeof name === "string" ? name : "";
}

/* ==================================
   GEOJSON -> BARANGAY ID
================================== */

function getBarangayId(
  properties: Record<string, unknown> | null | undefined,
): BarangayId | null {
  const name = getBarangayName(properties).trim().toLowerCase();

  return barangayNameMap[name] ?? null;
}

/* ==================================
   MAP RESIZE
================================== */

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize();
    };

    const timeout = window.setTimeout(invalidate, 100);

    window.addEventListener("resize", invalidate);

    return () => {
      window.clearTimeout(timeout);

      window.removeEventListener("resize", invalidate);
    };
  }, [map]);

  return null;
}

/* ==================================
   MORONG POLYGONS
================================== */

function MorongPolygons({
  selectedBarangay,
  onSelectBarangay,
  getBarangayTotal,
  selectedCrimeId,
  selectedCrimeName,
  hoveredBarangay,
  polygonColorsEnabled,
}: CrimeMapProps & {
  polygonColorsEnabled: boolean;
}) {
  const map = useMap();

  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);

  const layersRef = useRef<Partial<Record<BarangayId, Layer>>>({});

  /* ==================================
     CURRENT BARANGAY TOTALS
  ================================== */

  const totals: Record<BarangayId, number> = {
    poblacion: getBarangayTotal("poblacion"),

    mabayo: getBarangayTotal("mabayo"),

    binaritan: getBarangayTotal("binaritan"),

    sabang: getBarangayTotal("sabang"),

    nagbalayong: getBarangayTotal("nagbalayong"),
  };

  /* ==================================
     SELECTED CRIME COLOR
  ================================== */

  const baseColor = getCrimeBaseColor(selectedCrimeId);

  /* ==================================
     SORT TOTALS
     HIGHEST -> LOWEST
  ================================== */

  const sortedBarangayTotals = [...barangayIds].sort(
    (a, b) => totals[b] - totals[a],
  );

  /* ==================================
     UNIQUE POSITIVE TOTALS

     Ties share the same intensity.
  ================================== */

  const uniquePositiveTotals = [
    ...new Set(
      sortedBarangayTotals.map((id) => totals[id]).filter((cases) => cases > 0),
    ),
  ];

  /* ==================================
     GET INTENSITY
  ================================== */

  function getCrimeIntensity(cases: number): CrimeIntensity {
    if (cases <= 0) {
      return "none";
    }

    const rank = uniquePositiveTotals.indexOf(cases);

    if (rank === 0) {
      return "highest";
    }

    if (rank === 1) {
      return "high";
    }

    if (rank === 2) {
      return "moderate";
    }

    return "low";
  }

  /* ==================================
     INTENSITY LABEL
  ================================== */

  function getCrimeIntensityLabel(cases: number) {
    switch (getCrimeIntensity(cases)) {
      case "highest":
        return "Highest";

      case "high":
        return "High";

      case "moderate":
        return "Moderate";

      case "low":
        return "Low";

      default:
        return "No cases";
    }
  }

  /* ==================================
     POLYGON COLOR

     All Loaded Crimes:
     maroon/gold palette.

     Specific crime:
     shades of selected crime color.
  ================================== */

  function getCrimeColor(cases: number) {
    const intensity = getCrimeIntensity(cases);

    if (intensity === "none") {
      return "#f1e7e8";
    }

    /* ALL LOADED CRIMES */

    if (selectedCrimeId === "all") {
      switch (intensity) {
        case "highest":
          return "#7a1f2b";

        case "high":
          return "#b84a58";

        case "moderate":
          return "#e7a65b";

        case "low":
          return "#f6d98d";

        default:
          return "#f1e7e8";
      }
    }

    /* SPECIFIC CRIME */

    switch (intensity) {
      case "highest":
        return baseColor;

      case "high":
        return mixColors(baseColor, "#ffffff", 0.22);

      case "moderate":
        return mixColors(baseColor, "#ffffff", 0.48);

      case "low":
        return mixColors(baseColor, "#ffffff", 0.72);

      default:
        return "#f1e7e8";
    }
  }

  /* ==================================
     POLYGON STYLE
  ================================== */

  const getPolygonStyle = (id: BarangayId) => {
    const cases = totals[id];

    const isSelected = id === selectedBarangay;

    const isHovered = id === hoveredBarangay;

    /* ==============================
   ALL LOADED CRIMES

   Darker / stronger choropleth.
============================== */

    if (selectedCrimeId === "all") {
      return {
        color: isSelected ? "#d3a337" : "#ffffff",

        weight: isSelected ? 5 : 2,

        fillColor: getCrimeColor(cases),

        fillOpacity: isSelected
  ? 0.98
  : 0.88,
      };
    }

    /* ==============================
         NO CASES

         Keep almost invisible.
      ============================== */

    if (cases <= 0) {
      return {
        color: "transparent",

        weight: 0,

        fillColor: "#f1e7e8",

        fillOpacity: 0.04,
      };
    }

    /* ==============================
         POLYGON COLORS = ON

         Show every polygon that has
         cases using the selected
         crime's intensity shades.
      ============================== */

    /* ==============================
   POLYGON COLORS = ON

   Darker crime-colored polygons.
============================== */

if (polygonColorsEnabled) {
  return {
    color:
      isSelected
        ? "#d3a337"
        : isHovered
          ? baseColor
          : "#ffffff",

    weight:
      isSelected
        ? 5
        : isHovered
          ? 4
          : 1.5,

    fillColor:
      getCrimeColor(cases),

    fillOpacity:
      isSelected
        ? 0.95
        : isHovered
          ? 0.9
          : 0.82,
  };
}

    /* ==============================
         POLYGON COLORS = OFF

         Hide polygons.

         Hover pin:
         temporarily reveal polygon.

         Selected pin:
         keep selected polygon visible.
      ============================== */

    const shouldShow = isSelected || isHovered;

    return {
      color: isSelected ? "#d3a337" : isHovered ? baseColor : "transparent",

      weight: isSelected ? 5 : isHovered ? 4 : 0,

      fillColor: shouldShow ? getCrimeColor(cases) : "#f1e7e8",

      fillOpacity: isSelected ? 0.65 : isHovered ? 0.52 : 0.04,
    };
  };

  /* ==================================
     FIT MAP TO MORONG
  ================================== */

  useEffect(() => {
    if (!geoJsonRef.current) {
      return;
    }

    if (selectedBarangay) {
      return;
    }

    const bounds = geoJsonRef.current.getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [16, 16],
      });
    }
  }, [map, selectedBarangay, selectedCrimeId]);

  /* ==================================
     ZOOM SELECTED BARANGAY
  ================================== */

  useEffect(() => {
    if (!selectedBarangay) {
      return;
    }

    const layer = layersRef.current[selectedBarangay];

    if (!layer) {
      return;
    }

    if ("getBounds" in layer) {
      const polygon = layer as LeafletGeoJSON;

      const bounds = polygon.getBounds();

      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [32, 32],

          maxZoom: 15,
        });
      }
    }
  }, [selectedBarangay, selectedCrimeId, map]);

  /* ==================================
     SYNC POLYGON STYLE
  ================================== */

  useEffect(() => {
    barangayIds.forEach((id) => {
      const layer = layersRef.current[id];

      if (!layer || !("setStyle" in layer)) {
        return;
      }

      const polygon = layer as Path;

      polygon.setStyle(getPolygonStyle(id));

      if (
        (id === selectedBarangay || id === hoveredBarangay) &&
        "bringToFront" in polygon
      ) {
        polygon.bringToFront();
      }
    });
  }, [
    selectedBarangay,
    hoveredBarangay,
    selectedCrimeId,
    polygonColorsEnabled,
  ]);

  /* ==================================
     INITIAL STYLE
  ================================== */

  const getStyle = (feature?: Feature<Geometry>) => {
    const id = getBarangayId(feature?.properties);

    if (!id) {
      return {
        color: "transparent",

        weight: 0,

        fillColor: "#f1e7e8",

        fillOpacity: 0.04,
      };
    }

    return getPolygonStyle(id);
  };

  return (
    <GeoJSON
      key={`${selectedCrimeId}-${polygonColorsEnabled}`}
      ref={geoJsonRef}
      data={morongData}
      style={getStyle}
      onEachFeature={(feature, layer) => {
        const id = getBarangayId(feature.properties);

        if (!id) {
          return;
        }

        layersRef.current[id] = layer;

        const name = getBarangayName(feature.properties);

        const cases = getBarangayTotal(id);

        const intensity = getCrimeIntensityLabel(cases);

        /* ==========================
           TOOLTIP
        ========================== */

        layer.bindTooltip(
          `
            <div style="
              min-width: 150px;
              max-width: 230px;
              line-height: 1.5;
            ">

              <div style="
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 3px;
              ">

                <span style="
                  width: 8px;
                  height: 8px;
                  border-radius: 9999px;
                  background: ${baseColor};
                  display: inline-block;
                "></span>

                <strong style="
                  font-size: 13px;
                  color: #3b1419;
                ">
                  ${name}
                </strong>

              </div>

              <div style="
                font-size: 11px;
                color: #766064;
                margin-bottom: 4px;
              ">
                ${selectedCrimeName}
              </div>

              <div>

                <strong style="
                  color: ${baseColor};
                  font-size: 14px;
                ">
                  ${cases}
                </strong>

                <span style="
                  color: #5f5153;
                  font-size: 11px;
                ">
                  recorded ${cases === 1 ? "case" : "cases"}
                </span>

              </div>

              <div style="
                margin-top: 5px;
                padding-top: 5px;
                border-top: 1px solid #eadadd;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
              ">

                <span style="
                  color: #766064;
                  font-size: 10px;
                ">
                  Relative intensity
                </span>

                <strong style="
                  color: ${getCrimeColor(cases)};
                  font-size: 10px;
                ">
                  ${intensity}
                </strong>

              </div>

            </div>
          `,
          {
            sticky: true,

            direction: "auto",

            className: "crime-map-tooltip",
          },
        );

        /* ==========================
           POLYGON CLICK
        ========================== */

        if (cases > 0 || selectedCrimeId === "all") {
          layer.on("click", () => {
            onSelectBarangay(id);
          });
        }
      }}
    />
  );
}

/* ==================================
   CRIME PINS
================================== */

function BarangayPins({
  selectedBarangay,
  onSelectBarangay,
  getBarangayTotal,
  selectedCrimeId,
  selectedCrimeName,
  onHoverBarangay,
}: CrimeMapProps) {
  /* ==================================
     CREATE BARANGAY REFERENCE POINTS
  ================================== */

  const markers = useMemo(() => {
    return morongData.features.flatMap((feature) => {
      const id = getBarangayId(feature.properties);

      if (!id) {
        return [];
      }

      const name =
        getBarangayName(feature.properties) ||
        id.charAt(0).toUpperCase() + id.slice(1);

      const layer = createGeoJSON(feature);

      const bounds = layer.getBounds();

      if (!bounds.isValid()) {
        return [];
      }

      return [
        {
          id,
          name,

          position: bounds.getCenter(),
        },
      ];
    });
  }, []);

  /* ==================================
     CRIME COLOR
  ================================== */

  const baseColor = getCrimeBaseColor(selectedCrimeId);

  /* ==================================
     MEMOIZED PIN ICONS
  ================================== */

  const markerIcons = useMemo<Record<BarangayId, DivIcon>>(() => {
    const icons = {} as Record<BarangayId, DivIcon>;

    barangayIds.forEach((id) => {
      const delay = barangayPinDelay[id];

      icons[id] = divIcon({
        className: "barangay-map-pin-container",

        html: `
                <div
                  class="barangay-pin-drop"
                  style="
                    animation-delay: ${delay}ms;
                  "
                >

                  <div
                    class="barangay-pin-marker"
                    style="
                      background: ${baseColor};
                    "
                  >

                    <div
                      class="barangay-pin-center"
                    ></div>

                  </div>

                  <div
                    class="barangay-pin-shadow"
                    style="
                      animation-delay: ${delay}ms;
                    "
                  ></div>

                </div>
              `,

        iconSize: [40, 46],

        iconAnchor: [20, 42],

        tooltipAnchor: [0, -42],
      });
    });

    return icons;
  }, [selectedCrimeId, baseColor]);

  /* ==================================
     ALL CRIMES = NO PINS
  ================================== */

  if (selectedCrimeId === "all") {
    return null;
  }

  /* ==================================
     ONLY SHOW PINS WITH CASES
  ================================== */

  const visibleMarkers = markers.filter(
    (marker) => getBarangayTotal(marker.id) > 0,
  );

  return (
    <>
      {visibleMarkers.map((marker) => {
        const cases = getBarangayTotal(marker.id);

        const isSelected = marker.id === selectedBarangay;

        return (
          <Marker
            key={`${selectedCrimeId}-${marker.id}`}
            position={marker.position}
            icon={markerIcons[marker.id]}
            zIndexOffset={isSelected ? 1000 : 500}
            eventHandlers={{
              /* ==================
                   HOVER PIN

                   Reveal polygon.
                ================== */

              mouseover: () => {
                onHoverBarangay?.(marker.id);
              },

              /* ==================
                   LEAVE PIN

                   Hide temporary
                   polygon again.
                ================== */

              mouseout: () => {
                onHoverBarangay?.(null);
              },

              /* ==================
                   CLICK PIN

                   Select barangay.
                ================== */

              click: () => {
                onSelectBarangay(marker.id);

                onHoverBarangay?.(null);
              },
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -8]}
              opacity={1}
              className="crime-map-tooltip"
            >
              <div className="min-w-[150px] leading-5">
                {/* Barangay */}

                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: baseColor,
                    }}
                  />

                  <span className="text-[13px] font-bold text-[#3b1419]">
                    {marker.name}
                  </span>
                </div>

                {/* Crime */}

                <div className="mb-1 mt-0.5 text-[11px] font-medium text-[#766064]">
                  {selectedCrimeName}
                </div>

                {/* Cases */}

                <div>
                  <strong
                    className="text-sm"
                    style={{
                      color: baseColor,
                    }}
                  >
                    {cases}
                  </strong>{" "}
                  <span className="text-[11px] text-[#5f5153]">
                    recorded {cases === 1 ? "case" : "cases"}
                  </span>
                </div>

                {/* Reference notice */}

                <div className="mt-1 border-t border-[#eadadd] pt-1 text-[10px] text-[#8b7377]">
                  Barangay reference location
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}

/* ==================================
   MAP LEGEND + POLYGON TOGGLE
================================== */

function CrimeLegend({
  selectedCrimeId,
  selectedCrimeName,
  polygonColorsEnabled,
  onTogglePolygonColors,
}: Pick<CrimeMapProps, "selectedCrimeId" | "selectedCrimeName"> & {
  polygonColorsEnabled: boolean;
  onTogglePolygonColors: () => void;
}) {
  const baseColor = getCrimeBaseColor(selectedCrimeId);

  const isAll = selectedCrimeId === "all";

  const legendItems = isAll
    ? [
        {
          label: "No cases",
          color: "#f1e7e8",
        },
        {
          label: "Low",
          color: "#f6d98d",
        },
        {
          label: "Moderate",
          color: "#e7a65b",
        },
        {
          label: "High",
          color: "#b84a58",
        },
        {
          label: "Highest",
          color: "#7a1f2b",
        },
      ]
    : [
        {
          label: "No cases",
          color: "#f1e7e8",
        },
        {
          label: "Low",
          color: mixColors(baseColor, "#ffffff", 0.72),
        },
        {
          label: "Moderate",
          color: mixColors(baseColor, "#ffffff", 0.48),
        },
        {
          label: "High",
          color: mixColors(baseColor, "#ffffff", 0.22),
        },
        {
          label: "Highest",
          color: baseColor,
        },
      ];

  return (
    <div
      className="
        absolute
        bottom-3
        right-3
        z-[1000]
        w-[190px]
        overflow-hidden
        rounded-xl
        border
        border-[#eadadd]
        bg-white/95
        shadow-lg
        backdrop-blur-md
        sm:bottom-4
        sm:right-4
      "
    >
      {/* ==================================
          HEADER
      ================================== */}

      <div
        className="
          border-b
          border-[#eadadd]
          bg-gradient-to-r
          from-[#fff7f7]
          to-[#fff7e3]
          px-3
          py-2
        "
      >
        <p className="text-[11px] font-bold text-[#7a1f2b] sm:text-xs">
          Relative Crime Intensity
        </p>

        {!isAll && (
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                backgroundColor: baseColor,
              }}
            />

            <span className="truncate text-[9px] font-medium text-[#766064]">
              {selectedCrimeName}
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        {/* ==================================
            POLYGON COLOR TOGGLE
            Only show for specific crime
        ================================== */}

        {!isAll && (
          <div className="mb-3 border-b border-[#eadadd] pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wide text-[#7a1f2b]">
                  Polygon Color
                </p>

                <p className="mt-0.5 text-[8px] leading-3 text-[#8b7377]">
                  Show crime intensity
                </p>
              </div>

              {/* Toggle */}

              <button
                type="button"
                role="switch"
                aria-checked={polygonColorsEnabled}
                aria-label="Toggle polygon colors"
                onClick={onTogglePolygonColors}
                className={`
                  relative
                  h-6
                  w-11
                  shrink-0
                  rounded-full
                  border
                  transition-all
                  duration-200

                  ${
                    polygonColorsEnabled
                      ? "border-transparent"
                      : "border-[#d9c7ca] bg-[#eee5e7]"
                  }
                `}
                style={
                  polygonColorsEnabled
                    ? {
                        backgroundColor: baseColor,
                      }
                    : undefined
                }
              >
                <span
                  className={`
                    absolute
                    top-[2px]
                    h-[18px]
                    w-[18px]
                    rounded-full
                    bg-white
                    shadow-sm
                    transition-all
                    duration-200

                    ${polygonColorsEnabled ? "left-[21px]" : "left-[2px]"}
                  `}
                />
              </button>
            </div>

            {/* Status */}

            <div className="mt-2 flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: polygonColorsEnabled ? baseColor : "#b8a7aa",
                }}
              />

              <span className="text-[8px] font-medium text-[#766064]">
                {polygonColorsEnabled
                  ? "Polygons visible"
                  : "Pins + hover only"}
              </span>
            </div>
          </div>
        )}

        {/* ==================================
            INTENSITY COLORS
        ================================== */}

        <div className="space-y-1.5 text-[10px] sm:text-xs">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="
                    h-3
                    w-3
                    shrink-0
                    rounded-full
                    border
                    border-black/5
                  "
                style={{
                  backgroundColor: item.color,
                }}
              />

              <span className="text-[#5f5153]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* ==================================
            EXPLANATION
        ================================== */}

        <div className="mt-3 border-t border-[#eadadd] pt-2">
          <p className="text-[9px] leading-4 text-[#8b7377]">
            Ranked from highest to lowest using the current barangay case
            totals.
          </p>
        </div>

        {/* ==================================
            SELECTED
        ================================== */}

        <div className="mt-2 border-t border-[#eadadd] pt-2">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full bg-white"
              style={{
                border: "2px solid #d3a337",
              }}
            />

            <span className="text-[10px] font-semibold text-[#704a00] sm:text-xs">
              Selected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================================
   MAIN CRIME MAP
================================== */

export function CrimeMap(props: CrimeMapProps) {
  /* ==================================
     HOVERED BARANGAY
  ================================== */

  const [hoveredBarangay, setHoveredBarangay] = useState<BarangayId | null>(
    null,
  );

  /* ==================================
     POLYGON COLORS

     FALSE:
     Pins + hover only.

     TRUE:
     Show all non-zero crime polygons.
  ================================== */

  const [polygonColorsEnabled, setPolygonColorsEnabled] = useState(false);

  /* ==================================
     RESET WHEN CRIME CHANGES
  ================================== */

  useEffect(() => {
    /*
     * Clear temporary hover.
     */

    setHoveredBarangay(null);

    /*
     * New crime starts with
     * Polygon Color OFF.
     *
     * This gives the default:
     *
     * Pins + hover only.
     */

    setPolygonColorsEnabled(false);
  }, [props.selectedCrimeId]);

  /* ==================================
     TOGGLE POLYGON COLORS
  ================================== */

  const handlePolygonToggle = () => {
    /*
     * Remove temporary hover
     * before changing mode.
     */

    setHoveredBarangay(null);

    setPolygonColorsEnabled((current) => !current);
  };

  return (
    <div
      className="
        relative
        h-[420px]
        w-full
        min-w-0
        overflow-hidden
        rounded-xl
        border
        border-[#eadadd]
        bg-[#f8f3f1]
        shadow-inner
        sm:h-[500px]
        lg:h-[600px]
      "
    >
      <MapContainer
        center={[14.68, 120.27]}
        zoom={12}
        minZoom={10}
        maxZoom={18}
        scrollWheelZoom
        className="h-full w-full"
      >
        {/* ==================================
            BASE MAPS
        ================================== */}

        <LayersControl position="topright">
          {/* Street */}

          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* Satellite */}

          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution="Tiles &copy; Esri"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <MapResizeHandler />

        {/* ==================================
            POLYGONS
        ================================== */}

        <MorongPolygons
          {...props}
          hoveredBarangay={hoveredBarangay}
          polygonColorsEnabled={polygonColorsEnabled}
        />

        {/* ==================================
            PINS
        ================================== */}

        <BarangayPins
          {...props}
          hoveredBarangay={hoveredBarangay}
          onHoverBarangay={setHoveredBarangay}
        />
      </MapContainer>

      {/* ==================================
          POLYGON COLOR SWITCH

          Hide this for All Loaded Crimes
          because its choropleth is always
          visible.
      ================================== */}

      {/* ==================================
          LEGEND
      ================================== */}

      <CrimeLegend
        selectedCrimeId={props.selectedCrimeId}
        selectedCrimeName={props.selectedCrimeName}
        polygonColorsEnabled={polygonColorsEnabled}
        onTogglePolygonColors={handlePolygonToggle}
      />
    </div>
  );
}
