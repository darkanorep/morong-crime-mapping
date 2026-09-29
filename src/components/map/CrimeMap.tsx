import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import type { BarangayId } from "@/App"

import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet"

import {
  divIcon,
  geoJSON as createGeoJSON,
} from "leaflet"

import type {
  DivIcon,
  GeoJSON as LeafletGeoJSON,
  Layer,
  Path,
} from "leaflet"

import type {
  Feature,
  FeatureCollection,
  Geometry,
} from "geojson"

import morongBarangays from "@/data/morong-barangays.json"

import "leaflet/dist/leaflet.css"

/* ==================================
   PROPS
================================== */

interface CrimeMapProps {
  selectedBarangay: BarangayId | null

  onSelectBarangay: (
    barangay: BarangayId | null
  ) => void

  getBarangayTotal: (
    barangay: BarangayId
  ) => number

  selectedCrimeId: string
  selectedCrimeName: string

  hoveredBarangay?: BarangayId | null

  onHoverBarangay?: (
    barangay: BarangayId | null
  ) => void
}

/* ==================================
   GEOJSON DATA
================================== */

const morongData =
  morongBarangays as FeatureCollection

/* ==================================
   BARANGAY NAME MAPPING
================================== */

const barangayNameMap: Record<
  string,
  BarangayId
> = {
  poblacion: "poblacion",
  mabayo: "mabayo",
  binaritan: "binaritan",
  sabang: "sabang",
  nagbalayong: "nagbalayong",
}

/* ==================================
   BARANGAY IDs
================================== */

const barangayIds: BarangayId[] = [
  "poblacion",
  "mabayo",
  "binaritan",
  "sabang",
  "nagbalayong",
]

/* ==================================
   PIN ANIMATION ORDER
================================== */

const barangayPinDelay: Record<
  BarangayId,
  number
> = {
  poblacion: 0,
  mabayo: 100,
  binaritan: 200,
  sabang: 300,
  nagbalayong: 400,
}

/* ==================================
   CRIME COLORS
================================== */

const crimeColors: Record<
  string,
  string
> = {
  /* INDEX CRIMES */

  robbery: "#dc2626",

  "robbery-with-homicide":
    "#7f1d1d",

  theft: "#2563eb",

  "qualified-theft":
    "#1d4ed8",

  murder: "#881337",

  homicide: "#be123c",

  rape: "#7c3aed",

  /* NON-INDEX CRIMES */

  "attempted-homicide":
    "#e11d48",

  "frustrated-homicide":
    "#f43f5e",

  "grave-threats":
    "#ea580c",

  "light-threats":
    "#f97316",

  "unjust-vexation":
    "#0891b2",

  cockfighting:
    "#65a30d",

  "acts-of-lasciviousness":
    "#db2777",

  "alarms-and-scandal":
    "#0d9488",

  "anti-gambling-law":
    "#16a34a",

  "malicious-mischief":
    "#0284c7",

  "dangerous-drugs":
    "#9333ea",

  "resistance-disobedience-person-authority":
    "#475569",

  "violence-against-women-and-their-children":
    "#be185d",

  "photo-and-video-voyeurism":
    "#c026d3",

  "comprehensive-law-firearms-ammunition":
    "#334155",

  "qualified-trespass-to-dwelling":
    "#0f766e",

  "anti-electricity-electric-transmission-pilferage":
    "#ca8a04",

  "illegal-possession-bladed-pointed-blunt-weapons":
    "#64748b",

  "direct-assaults":
    "#b45309",

  "land-transportation-and-traffic-code":
    "#0369a1",

  "omnibus-election-code":
    "#4f46e5",

  "other-forms-of-trespass":
    "#059669",

  "qualified-seduction":
    "#a21caf",

  "slight-physical-injuries-and-maltreatment":
    "#e8790b",

  "special-protection-children":
    "#8b5cf6",

  estafa:
    "#0891b2",

  /* VEHICULAR */

  "reckless-imprudence-damage-to-property":
    "#d97706",

  "reckless-imprudence-physical-injury":
    "#f59e0b",

  "reckless-imprudence-multiple-physical-injury":
    "#eab308",

  "reckless-imprudence-homicide":
    "#92400e",
}

/* ==================================
   COLOR HELPERS
================================== */

function hexToRgb(
  hex: string
) {
  const clean =
    hex.replace("#", "")

  const value =
    Number.parseInt(
      clean,
      16
    )

  return {
    r:
      (value >> 16) &
      255,

    g:
      (value >> 8) &
      255,

    b:
      value &
      255,
  }
}

function mixColors(
  first: string,
  second: string,
  amount: number
) {
  const a =
    hexToRgb(first)

  const b =
    hexToRgb(second)

  const mix = (
    start: number,
    end: number
  ) =>
    Math.round(
      start +
        (end - start) *
          amount
    )

  const r =
    mix(
      a.r,
      b.r
    )

  const g =
    mix(
      a.g,
      b.g
    )

  const blue =
    mix(
      a.b,
      b.b
    )

  return `rgb(${r}, ${g}, ${blue})`
}

function getCrimeBaseColor(
  crimeId: string
) {
  return (
    crimeColors[
      crimeId
    ] ??
    "#7a1f2b"
  )
}

/* ==================================
   GET BARANGAY NAME
================================== */

function getBarangayName(
  properties:
    | Record<
        string,
        unknown
      >
    | null
    | undefined
): string {
  if (!properties) {
    return ""
  }

  const possibleNames = [
    properties.name,
    properties.NAME,
    properties.brgy_name,
    properties.BRGY_NAME,
    properties.ADM4_EN,
  ]

  const name =
    possibleNames.find(
      (value) =>
        typeof value ===
        "string"
    )

  return typeof name ===
    "string"
    ? name
    : ""
}

/* ==================================
   GEOJSON NAME -> BARANGAY ID
================================== */

function getBarangayId(
  properties:
    | Record<
        string,
        unknown
      >
    | null
    | undefined
): BarangayId | null {
  const name =
    getBarangayName(
      properties
    )
      .trim()
      .toLowerCase()

  return (
    barangayNameMap[
      name
    ] ??
    null
  )
}

/* ==================================
   MAP RESIZE
================================== */

function MapResizeHandler() {
  const map =
    useMap()

  useEffect(() => {
    const invalidate =
      () => {
        map.invalidateSize()
      }

    const timeout =
      window.setTimeout(
        invalidate,
        100
      )

    window.addEventListener(
      "resize",
      invalidate
    )

    return () => {
      window.clearTimeout(
        timeout
      )

      window.removeEventListener(
        "resize",
        invalidate
      )
    }
  }, [map])

  return null
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
}: CrimeMapProps) {
  const map =
    useMap()

  const geoJsonRef =
    useRef<
      LeafletGeoJSON | null
    >(null)

  const layersRef =
    useRef<
      Partial<
        Record<
          BarangayId,
          Layer
        >
      >
    >({})

  /* ==================================
     BARANGAY TOTALS
  ================================== */

  const totals: Record<
    BarangayId,
    number
  > = {
    poblacion:
      getBarangayTotal(
        "poblacion"
      ),

    mabayo:
      getBarangayTotal(
        "mabayo"
      ),

    binaritan:
      getBarangayTotal(
        "binaritan"
      ),

    sabang:
      getBarangayTotal(
        "sabang"
      ),

    nagbalayong:
      getBarangayTotal(
        "nagbalayong"
      ),
  }

  const maxCases =
    Math.max(
      ...Object.values(
        totals
      ),
      1
    )

  const baseColor =
    getCrimeBaseColor(
      selectedCrimeId
    )

  /* ==================================
     CRIME INTENSITY COLOR
  ================================== */

  function getCrimeColor(
    cases: number
  ) {
    if (
      cases === 0
    ) {
      return "#f1e7e8"
    }

    const ratio =
      cases /
      maxCases

    /*
     * ALL LOADED CRIMES
     */

    if (
      selectedCrimeId ===
      "all"
    ) {
      if (
        ratio <= 0.25
      ) {
        return "#f6d98d"
      }

      if (
        ratio <= 0.5
      ) {
        return "#e7a65b"
      }

      if (
        ratio <= 0.75
      ) {
        return "#b84a58"
      }

      return "#7a1f2b"
    }

    /*
     * SELECTED CRIME
     */

    if (
      ratio <= 0.25
    ) {
      return mixColors(
        baseColor,
        "#ffffff",
        0.72
      )
    }

    if (
      ratio <= 0.5
    ) {
      return mixColors(
        baseColor,
        "#ffffff",
        0.48
      )
    }

    if (
      ratio <= 0.75
    ) {
      return mixColors(
        baseColor,
        "#ffffff",
        0.22
      )
    }

    return baseColor
  }

  /* ==================================
     POLYGON STYLE
  ================================== */

  const getPolygonStyle = (
    id: BarangayId
  ) => {
    const cases =
      totals[id]

    const isSelected =
      id ===
      selectedBarangay

    const isHovered =
      id ===
      hoveredBarangay

    /*
     * ALL LOADED CRIMES:
     * Show normal choropleth.
     */

    if (
      selectedCrimeId ===
      "all"
    ) {
      return {
        color:
          isSelected
            ? "#d3a337"
            : "#ffffff",

        weight:
          isSelected
            ? 5
            : 2,

        fillColor:
          getCrimeColor(
            cases
          ),

        fillOpacity:
          isSelected
            ? 0.95
            : 0.82,
      }
    }

    /*
     * SPECIFIC CRIME:
     *
     * Polygon is mostly hidden
     * until its pin is hovered
     * or the barangay is selected.
     */

    const isActive =
      isSelected ||
      isHovered

    return {
      color:
        isSelected
          ? "#d3a337"
          : isHovered
            ? baseColor
            : "transparent",

      weight:
        isSelected
          ? 5
          : isHovered
            ? 4
            : 0,

      fillColor:
        isActive
          ? getCrimeColor(
              cases
            )
          : "#f1e7e8",

      fillOpacity:
        isSelected
          ? 0.95
          : isHovered
            ? 0.9
            : 0.08,
    }
  }

  /* ==================================
     FIT MAP TO MORONG
  ================================== */

  useEffect(() => {
    if (
      !geoJsonRef.current
    ) {
      return
    }

    if (
      selectedBarangay
    ) {
      return
    }

    const bounds =
      geoJsonRef.current
        .getBounds()

    if (
      bounds.isValid()
    ) {
      map.fitBounds(
        bounds,
        {
          padding: [
            16,
            16,
          ],
        }
      )
    }
  }, [
    map,
    selectedBarangay,
    selectedCrimeId,
  ])

  /* ==================================
     ZOOM SELECTED BARANGAY
  ================================== */

  useEffect(() => {
    if (
      !selectedBarangay
    ) {
      return
    }

    const layer =
      layersRef.current[
        selectedBarangay
      ]

    if (!layer) {
      return
    }

    if (
      "getBounds" in
      layer
    ) {
      const polygon =
        layer as LeafletGeoJSON

      const bounds =
        polygon.getBounds()

      if (
        bounds.isValid()
      ) {
        map.fitBounds(
          bounds,
          {
            padding: [
              32,
              32,
            ],

            maxZoom: 15,
          }
        )
      }
    }
  }, [
    selectedBarangay,
    selectedCrimeId,
    map,
  ])

  /* ==================================
     SYNC POLYGON STYLES
  ================================== */

  useEffect(() => {
    barangayIds.forEach(
      (id) => {
        const layer =
          layersRef.current[
            id
          ]

        if (
          !layer ||
          !(
            "setStyle" in
            layer
          )
        ) {
          return
        }

        const polygon =
          layer as Path

        polygon.setStyle(
          getPolygonStyle(
            id
          )
        )

        if (
          (
            id ===
              selectedBarangay ||
            id ===
              hoveredBarangay
          ) &&
          "bringToFront" in
            polygon
        ) {
          polygon
            .bringToFront()
        }
      }
    )
  }, [
    selectedBarangay,
    hoveredBarangay,
    selectedCrimeId,
  ])

  /* ==================================
     INITIAL GEOJSON STYLE
  ================================== */

  const getStyle = (
    feature?: Feature<
      Geometry
    >
  ) => {
    const id =
      getBarangayId(
        feature?.properties
      )

    if (!id) {
      return {
        color:
          "transparent",

        weight: 0,

        fillColor:
          "#f1e7e8",

        fillOpacity:
          0.08,
      }
    }

    return (
      getPolygonStyle(
        id
      )
    )
  }

  return (
    <GeoJSON
      /*
       * Polygon layer is recreated
       * when the crime changes.
       */

      key={
        selectedCrimeId
      }

      ref={
        geoJsonRef
      }

      data={
        morongData
      }

      style={
        getStyle
      }

      onEachFeature={(
        feature,
        layer
      ) => {
        const id =
          getBarangayId(
            feature.properties
          )

        if (!id) {
          return
        }

        layersRef.current[
          id
        ] = layer

        const name =
          getBarangayName(
            feature.properties
          )

        const cases =
          getBarangayTotal(
            id
          )

        /* ==========================
           POLYGON TOOLTIP
        ========================== */

        layer.bindTooltip(
          `
            <div style="
              min-width: 140px;
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
                  recorded ${
                    cases === 1
                      ? "case"
                      : "cases"
                  }
                </span>
              </div>
            </div>
          `,
          {
            sticky: true,
            direction:
              "auto",
            className:
              "crime-map-tooltip",
          }
        )

        /* ==========================
           POLYGON CLICK
        ========================== */

        if (cases > 0 || selectedCrimeId === "all") {
  layer.on(
    "click",
    () => {
      onSelectBarangay(id)
    }
  )
}
      }}
    />
  )
}

/* ==================================
   BARANGAY CRIME PINS
================================== */

/*
 * IMPORTANT:
 *
 * Pins are barangay reference
 * locations calculated from the
 * GeoJSON boundaries.
 *
 * They are NOT exact incident
 * locations.
 */

function BarangayPins({
  selectedBarangay,
  onSelectBarangay,
  getBarangayTotal,
  selectedCrimeId,
  selectedCrimeName,
  onHoverBarangay,
}: CrimeMapProps) {
  /* ==================================
     CREATE REFERENCE POINTS
  ================================== */

  const markers =
    useMemo(() => {
      return morongData
        .features
        .flatMap(
          (feature) => {
            const id =
              getBarangayId(
                feature
                  .properties
              )

            if (!id) {
              return []
            }

            const name =
              getBarangayName(
                feature
                  .properties
              ) ||
              id
                .charAt(0)
                .toUpperCase() +
                id.slice(1)

            const layer =
              createGeoJSON(
                feature
              )

            const bounds =
              layer.getBounds()

            if (
              !bounds.isValid()
            ) {
              return []
            }

            return [
              {
                id,
                name,

                position:
                  bounds
                    .getCenter(),
              },
            ]
          }
        )
    }, [])

  /* ==================================
     CRIME COLOR
  ================================== */

  const baseColor =
    getCrimeBaseColor(
      selectedCrimeId
    )

  /* ==================================
     MEMOIZED PIN ICONS

     THIS IS THE IMPORTANT FIX.

     Icons are recreated ONLY when
     selectedCrimeId/baseColor changes.

     Hovering a pin changes only
     hoveredBarangay, therefore these
     Leaflet DivIcon objects remain
     exactly the same.

     That means Leaflet does NOT replace
     the marker DOM during hover and the
     CSS drop animation cannot restart.
  ================================== */

  const markerIcons =
    useMemo<
      Record<
        BarangayId,
        DivIcon
      >
    >(() => {
      const icons =
        {} as Record<
          BarangayId,
          DivIcon
        >

      barangayIds.forEach(
        (id) => {
          const delay =
            barangayPinDelay[
              id
            ]

          icons[id] =
            divIcon({
              className:
                "barangay-map-pin-container",

              html: `
                <div
                  class="barangay-pin-drop"
                  style="
                    animation-delay:
                      ${delay}ms;
                  "
                >
                  <div
                    class="barangay-pin-marker"
                    style="
                      background:
                        ${baseColor};
                    "
                  >
                    <div
                      class="barangay-pin-center"
                    ></div>
                  </div>

                  <div
                    class="barangay-pin-shadow"
                    style="
                      animation-delay:
                        ${delay}ms;
                    "
                  ></div>
                </div>
              `,

              iconSize: [
                40,
                46,
              ],

              iconAnchor: [
                20,
                42,
              ],

              tooltipAnchor: [
                0,
                -42,
              ],
            })
        }
      )

      return icons
    }, [
      selectedCrimeId,
      baseColor,
    ])

  /* ==================================
     HIDE PINS FOR ALL CRIMES
  ================================== */

  if (
    selectedCrimeId ===
    "all"
  ) {
    return null
  }

  /* ==================================
     ONLY SHOW PINS WITH CASES
  ================================== */

  const visibleMarkers =
    markers.filter(
      (marker) =>
        getBarangayTotal(
          marker.id
        ) > 0
    )

  return (
    <>
      {visibleMarkers.map(
        (marker) => {
          const cases =
            getBarangayTotal(
              marker.id
            )

          const isSelected =
            marker.id ===
            selectedBarangay

          return (
            <Marker
              /*
               * IMPORTANT:
               *
               * This key changes only
               * when a different crime
               * is selected.
               *
               * Hover does not change it.
               */

              key={`${selectedCrimeId}-${marker.id}`}

              position={
                marker.position
              }

              /*
               * IMPORTANT:
               *
               * We use the already
               * memoized icon.
               *
               * Never call divIcon()
               * directly here.
               */

              icon={
                markerIcons[
                  marker.id
                ]
              }

              zIndexOffset={
                isSelected
                  ? 1000
                  : 500
              }

              eventHandlers={{
                /* ======================
                   PIN HOVER

                   Only show polygon.
                   Do NOT modify icon.
                ====================== */

                mouseover: () => {
                  onHoverBarangay?.(
                    marker.id
                  )
                },

                /* ======================
                   PIN MOUSE OUT

                   Hide temporary
                   polygon only.
                ====================== */

                mouseout: () => {
                  onHoverBarangay?.(
                    null
                  )
                },

                /* ======================
                   PIN CLICK

                   Select barangay.
                   Icon remains unchanged.
                ====================== */

                click: () => {
                  onSelectBarangay(
                    marker.id
                  )

                  onHoverBarangay?.(
                    null
                  )
                },
              }}
            >
              <Tooltip
                direction="top"
                offset={[
                  0,
                  -8,
                ]}
                opacity={1}
                className="crime-map-tooltip"
              >
                <div className="min-w-[150px] leading-5">

                  {/* Barangay */}

                  <div className="flex items-center gap-1.5">

                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          baseColor,
                      }}
                    />

                    <span className="text-[13px] font-bold text-[#3b1419]">
                      {
                        marker.name
                      }
                    </span>

                  </div>

                  {/* Crime */}

                  <div className="mb-1 mt-0.5 text-[11px] font-medium text-[#766064]">
                    {
                      selectedCrimeName
                    }
                  </div>

                  {/* Cases */}

                  <div>
                    <strong
                      className="text-sm"
                      style={{
                        color:
                          baseColor,
                      }}
                    >
                      {cases}
                    </strong>

                    {" "}

                    <span className="text-[11px] text-[#5f5153]">
                      recorded{" "}
                      {
                        cases === 1
                          ? "case"
                          : "cases"
                      }
                    </span>
                  </div>

                  {/* Reference Notice */}

                  <div className="mt-1 border-t border-[#eadadd] pt-1 text-[10px] text-[#8b7377]">
                    Barangay reference
                    location
                  </div>

                </div>
              </Tooltip>
            </Marker>
          )
        }
      )}
    </>
  )
}

/* ==================================
   MAP LEGEND
================================== */

function CrimeLegend({
  selectedCrimeId,
  selectedCrimeName,
}: Pick<
  CrimeMapProps,
  | "selectedCrimeId"
  | "selectedCrimeName"
>) {
  const baseColor =
    getCrimeBaseColor(
      selectedCrimeId
    )

  const isAll =
    selectedCrimeId ===
    "all"

  const legendItems =
    isAll
      ? [
          {
            label:
              "No cases",

            color:
              "#f1e7e8",
          },

          {
            label:
              "Low",

            color:
              "#f6d98d",
          },

          {
            label:
              "Moderate",

            color:
              "#e7a65b",
          },

          {
            label:
              "High",

            color:
              "#b84a58",
          },

          {
            label:
              "Highest",

            color:
              "#7a1f2b",
          },
        ]
      : [
          {
            label:
              "No cases",

            color:
              "#f1e7e8",
          },

          {
            label:
              "Low",

            color:
              mixColors(
                baseColor,
                "#ffffff",
                0.72
              ),
          },

          {
            label:
              "Moderate",

            color:
              mixColors(
                baseColor,
                "#ffffff",
                0.48
              ),
          },

          {
            label:
              "High",

            color:
              mixColors(
                baseColor,
                "#ffffff",
                0.22
              ),
          },

          {
            label:
              "Highest",

            color:
              baseColor,
          },
        ]

  return (
    <div
      className="
        pointer-events-none
        absolute
        bottom-3
        right-3
        z-[1000]
        max-w-[190px]
        overflow-hidden
        rounded-xl
        border
        border-[#eadadd]
        bg-white/95
        shadow-lg
        backdrop-blur-md
        sm:bottom-4
      "
    >
      {/* Legend Header */}

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
          Crime Intensity
        </p>

        {!isAll && (
          <div className="mt-1 flex items-center gap-1.5">

            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{
                backgroundColor:
                  baseColor,
              }}
            />

            <span className="truncate text-[9px] font-medium text-[#766064]">
              {
                selectedCrimeName
              }
            </span>

          </div>
        )}
      </div>

      {/* Legend Items */}

      <div className="space-y-1.5 p-2.5 text-[10px] sm:p-3 sm:text-xs">

        {legendItems.map(
          (item) => (
            <div
              key={
                item.label
              }
              className="flex items-center gap-2"
            >
              <span
                className="h-3 w-3 shrink-0 rounded-sm border border-black/5"
                style={{
                  backgroundColor:
                    item.color,
                }}
              />

              <span className="text-[#5f5153]">
                {
                  item.label
                }
              </span>

            </div>
          )
        )}

        {/* Selected */}

        <div className="mt-2 border-t border-[#eadadd] pt-2">

          <div className="flex items-center gap-2">

            <span
              className="h-3 w-3 shrink-0 rounded-sm bg-white"
              style={{
                border:
                  "2px solid #d3a337",
              }}
            />

            <span className="font-medium text-[#704a00]">
              Selected
            </span>

          </div>

        </div>

      </div>
    </div>
  )
}

/* ==================================
   MAIN CRIME MAP
================================== */

export function CrimeMap(
  props: CrimeMapProps
) {
  /*
   * This state controls ONLY
   * polygon visibility.
   *
   * It has no connection to the
   * marker animation.
   */

  const [
    hoveredBarangay,
    setHoveredBarangay,
  ] = useState<
    BarangayId | null
  >(null)

  /*
   * When another crime is selected,
   * remove any previous hover state.
   */

  useEffect(() => {
    setHoveredBarangay(
      null
    )
  }, [
    props.selectedCrimeId,
  ])

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
        center={[
          14.68,
          120.27,
        ]}
        zoom={12}
        minZoom={10}
        maxZoom={18}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapResizeHandler />

        {/* Barangay Polygons */}

        <MorongPolygons
          {...props}

          hoveredBarangay={
            hoveredBarangay
          }
        />

        {/* Crime Pins */}

        <BarangayPins
          {...props}

          hoveredBarangay={
            hoveredBarangay
          }

          onHoverBarangay={
            setHoveredBarangay
          }
        />

      </MapContainer>

      {/* Map Legend */}

      <CrimeLegend
        selectedCrimeId={
          props.selectedCrimeId
        }

        selectedCrimeName={
          props.selectedCrimeName
        }
      />

    </div>
  )
}