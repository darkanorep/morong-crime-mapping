import { useEffect, useRef } from "react"
import type { BarangayId } from "@/App"

import {
  GeoJSON,
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet"

import type {
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

/* ----------------------------------
   Props received from App.tsx
----------------------------------- */

interface CrimeMapProps {
  selectedBarangay: BarangayId | null

  onSelectBarangay: (
    barangay: BarangayId | null
  ) => void

  getBarangayTotal: (
    barangay: BarangayId
  ) => number

  selectedCrimeName: string
}

/* ----------------------------------
   GeoJSON data
----------------------------------- */

const morongData =
  morongBarangays as FeatureCollection

/* ----------------------------------
   Barangay name mapping
----------------------------------- */

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

/* ----------------------------------
   Get barangay name from GeoJSON
----------------------------------- */

function getBarangayName(
  properties:
    | Record<string, unknown>
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
        typeof value === "string"
    )

  return typeof name === "string"
    ? name
    : ""
}

/* ----------------------------------
   Convert GeoJSON name → app ID
----------------------------------- */

function getBarangayId(
  properties:
    | Record<string, unknown>
    | null
    | undefined
): BarangayId | null {
  const name =
    getBarangayName(properties)
      .trim()
      .toLowerCase()

  return (
    barangayNameMap[name] ??
    null
  )
}

/* ----------------------------------
   Responsive map resize helper
----------------------------------- */

function MapResizeHandler() {
  const map = useMap()

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize()
    }

    /*
     * Run once after initial layout.
     */

    const timeout =
      window.setTimeout(
        invalidate,
        100
      )

    /*
     * Recalculate whenever the
     * browser viewport changes.
     */

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

/* ----------------------------------
   Polygon layer
----------------------------------- */

function MorongPolygons({
  selectedBarangay,
  onSelectBarangay,
  getBarangayTotal,
  selectedCrimeName,
}: CrimeMapProps) {
  const map = useMap()

  const geoJsonRef =
    useRef<LeafletGeoJSON | null>(
      null
    )

  const layersRef = useRef<
    Partial<
      Record<
        BarangayId,
        Layer
      >
    >
  >({})

  /* --------------------------------
     Calculate current map values
  --------------------------------- */

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

  const maxCases = Math.max(
    ...Object.values(totals),
    1
  )

  /* --------------------------------
     Crime intensity color

     BHC-inspired scale:

     No cases  -> soft neutral rose
     Low       -> light gold
     Moderate  -> amber
     High      -> muted red
     Highest   -> deep maroon
  --------------------------------- */

  function getCrimeColor(
    cases: number
  ) {
    if (cases === 0) {
      return "#f1e7e8"
    }

    const ratio =
      cases / maxCases

    if (ratio <= 0.25) {
      return "#f6d98d"
    }

    if (ratio <= 0.5) {
      return "#e7a65b"
    }

    if (ratio <= 0.75) {
      return "#b84a58"
    }

    return "#7a1f2b"
  }

  /* --------------------------------
     Shared polygon style
  --------------------------------- */

  const getPolygonStyle = (
    id: BarangayId
  ) => {
    const cases =
      totals[id]

    const isSelected =
      id === selectedBarangay

    return {
      /*
       * Gold outline identifies the
       * currently selected barangay.
       */

      color: isSelected
        ? "#d3a337"
        : "#ffffff",

      weight: isSelected
        ? 5
        : 2,

      fillColor:
        getCrimeColor(cases),

      fillOpacity: isSelected
        ? 0.95
        : 0.82,
    }
  }

  /* --------------------------------
     Fit map to entire Morong
  --------------------------------- */

  useEffect(() => {
    if (!geoJsonRef.current) {
      return
    }

    if (selectedBarangay) {
      return
    }

    const bounds =
      geoJsonRef.current.getBounds()

    if (bounds.isValid()) {
      map.fitBounds(
        bounds,
        {
          padding: [16, 16],
        }
      )
    }
  }, [
    map,
    selectedBarangay,
    selectedCrimeName,
  ])

  /* --------------------------------
     Zoom to selected barangay
  --------------------------------- */

  useEffect(() => {
    if (!selectedBarangay) {
      return
    }

    const layer =
      layersRef.current[
        selectedBarangay
      ]

    if (!layer) {
      return
    }

    if ("getBounds" in layer) {
      const polygon =
        layer as LeafletGeoJSON

      const bounds =
        polygon.getBounds()

      if (bounds.isValid()) {
        map.fitBounds(
          bounds,
          {
            padding: [32, 32],
            maxZoom: 15,
          }
        )
      }
    }
  }, [
    selectedBarangay,
    selectedCrimeName,
    map,
  ])

  /* --------------------------------
     Keep polygon selection styling
     synchronized.
  --------------------------------- */

  useEffect(() => {
    const barangayIds:
      BarangayId[] = [
        "poblacion",
        "mabayo",
        "binaritan",
        "sabang",
        "nagbalayong",
      ]

    barangayIds.forEach(
      (id) => {
        const layer =
          layersRef.current[id]

        if (
          !layer ||
          !("setStyle" in layer)
        ) {
          return
        }

        const polygon =
          layer as Path

        polygon.setStyle(
          getPolygonStyle(id)
        )
      }
    )
  }, [
    selectedBarangay,
    selectedCrimeName,
  ])

  /* --------------------------------
     GeoJSON initial style
  --------------------------------- */

  const getStyle = (
    feature?: Feature<Geometry>
  ) => {
    const id =
      getBarangayId(
        feature?.properties
      )

    /*
     * Fallback style if a feature
     * cannot be matched.
     */

    if (!id) {
      return {
        color: "#ffffff",
        weight: 1,
        fillColor: "#f1e7e8",
        fillOpacity: 0.6,
      }
    }

    return getPolygonStyle(id)
  }

  return (
    <GeoJSON
      /*
       * Recreate the GeoJSON layer
       * whenever the selected crime
       * changes so tooltips receive
       * fresh values.
       */

      key={selectedCrimeName}
      ref={geoJsonRef}
      data={morongData}
      style={getStyle}
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

        /*
         * Store polygon layer so
         * sidebar selection can zoom
         * to it.
         */

        layersRef.current[id] =
          layer

        const name =
          getBarangayName(
            feature.properties
          )

        const cases =
          getBarangayTotal(id)

        /* --------------------------
           Tooltip
        --------------------------- */

        layer.bindTooltip(
          `
            <div style="
              min-width: 140px;
              max-width: 230px;
              line-height: 1.5;
            ">
              <div style="
                font-size: 13px;
                font-weight: 700;
                color: #7a1f2b;
                margin-bottom: 2px;
              ">
                ${name}
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
                  color: #7a1f2b;
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
            direction: "auto",
            className:
              "crime-map-tooltip",
          }
        )

        /* --------------------------
           Click polygon
        --------------------------- */

        layer.on(
          "click",
          () => {
            onSelectBarangay(id)
          }
        )

        /* --------------------------
           Hover polygon
        --------------------------- */

        layer.on(
          "mouseover",
          () => {
            if (
              "setStyle" in layer &&
              id !==
                selectedBarangay
            ) {
              const polygon =
                layer as Path

              polygon.setStyle({
                weight: 3,
                color: "#d3a337",
                fillOpacity: 0.95,
              })

              /*
               * Bring hovered polygon
               * above neighboring
               * polygon borders.
               */

              if (
                "bringToFront" in
                polygon
              ) {
                polygon.bringToFront()
              }
            }
          }
        )

        /* --------------------------
           Stop hover
        --------------------------- */

        layer.on(
          "mouseout",
          () => {
            if (
              "setStyle" in layer
            ) {
              const polygon =
                layer as Path

              polygon.setStyle(
                getPolygonStyle(
                  id
                )
              )
            }
          }
        )
      }}
    />
  )
}

/* ----------------------------------
   Map legend
----------------------------------- */

function CrimeLegend() {
  const legendItems = [
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

  return (
    <div
      className="
        pointer-events-none
        absolute
        bottom-3
        right-3
        z-[1000]
        max-w-[calc(100%-1.5rem)]
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

      <div className="border-b border-[#eadadd] bg-gradient-to-r from-[#fff7f7] to-[#fff7e3] px-3 py-2">
        <p className="text-[11px] font-bold text-[#7a1f2b] sm:text-xs">
          Crime Intensity
        </p>
      </div>

      {/* Legend Items */}

      <div className="space-y-1.5 p-2.5 text-[10px] sm:p-3 sm:text-xs">
        {legendItems.map(
          (item) => (
            <div
              key={item.label}
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
                {item.label}
              </span>
            </div>
          )
        )}

        {/* Selected indicator */}

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

/* ----------------------------------
   Main Crime Map
----------------------------------- */

export function CrimeMap(
  props: CrimeMapProps
) {
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

        <MorongPolygons
          {...props}
        />
      </MapContainer>

      <CrimeLegend />
    </div>
  )
}