import {
  useEffect,
  useState,
} from "react"

import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Info,
  MapPin,
  ShieldAlert,
} from "lucide-react"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import crimesData from "@/data/crimes.json"

import type {
  BarangayId,
} from "@/App"

/* ----------------------------------
   Props
----------------------------------- */

interface CrimeAnalyticsProps {
  selectedBarangay:
    | BarangayId
    | null

  selectedCrimeId: string

  onSelectCrime: (
    crimeId: string
  ) => void
}

/* ----------------------------------
   Barangay Names
----------------------------------- */

const barangayNames: Record<
  BarangayId,
  string
> = {
  poblacion: "Poblacion",
  mabayo: "Mabayo",
  binaritan: "Binaritan",
  sabang: "Sabang",
  nagbalayong: "Nagbalayong",
}

/* ----------------------------------
   Pagination
----------------------------------- */

const ITEMS_PER_PAGE = 6

/* ----------------------------------
   Component
----------------------------------- */

export function CrimeAnalytics({
  selectedBarangay,
  selectedCrimeId,
  onSelectCrime,
}: CrimeAnalyticsProps) {
  /* --------------------------------
     Pagination State
  --------------------------------- */

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1)

  /* --------------------------------
     Selected Crime
  --------------------------------- */

  const selectedCrime =
    selectedCrimeId === "all"
      ? null
      : crimesData.crimes.find(
          (crime) =>
            crime.id ===
            selectedCrimeId
        ) ?? null

  /*
   * IMPORTANT:
   *
   * Yearly data and barangay data
   * are separate dimensions in
   * the source.
   *
   * We do NOT calculate yearly
   * totals for individual
   * barangays.
   */

  const yearlyData = [
    "2024",
    "2025",
    "2026",
  ].map((year) => ({
    year,

    cases: selectedCrime
      ? selectedCrime.yearly[
          year as keyof typeof selectedCrime.yearly
        ]
      : crimesData.crimes.reduce(
          (total, crime) =>
            total +
            crime.yearly[
              year as keyof typeof crime.yearly
            ],
          0
        ),
  }))

  /* --------------------------------
     Barangay Crime Breakdown
  --------------------------------- */

  const barangayBreakdown =
    selectedBarangay
      ? crimesData.crimes
          .map((crime) => ({
            id: crime.id,
            name: crime.name,

            cases:
              crime.barangays[
                selectedBarangay
              ],
          }))
          .filter(
            (crime) =>
              crime.cases > 0
          )
          .sort(
            (a, b) =>
              b.cases -
              a.cases
          )
      : []

  /* --------------------------------
     Barangay Total

     IMPORTANT:
     Uses ALL crime records,
     not only the current page.
  --------------------------------- */

  const barangayTotal =
    barangayBreakdown.reduce(
      (total, crime) =>
        total + crime.cases,
      0
    )

  /* --------------------------------
     Pagination Calculations
  --------------------------------- */

  const totalPages = Math.max(
    1,
    Math.ceil(
      barangayBreakdown.length /
        ITEMS_PER_PAGE
    )
  )

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    )

  const startIndex =
    (safeCurrentPage - 1) *
    ITEMS_PER_PAGE

  const endIndex = Math.min(
    startIndex +
      ITEMS_PER_PAGE,
    barangayBreakdown.length
  )

  const paginatedBarangayBreakdown =
    barangayBreakdown.slice(
      startIndex,
      endIndex
    )

  /*
   * Whenever another barangay is
   * selected, return to page 1.
   */

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedBarangay])

  /* --------------------------------
     Previous Page
  --------------------------------- */

  const goToPreviousPage =
    () => {
      setCurrentPage(
        (page) =>
          Math.max(
            1,
            page - 1
          )
      )
    }

  /* --------------------------------
     Next Page
  --------------------------------- */

  const goToNextPage =
    () => {
      setCurrentPage(
        (page) =>
          Math.min(
            totalPages,
            page + 1
          )
      )
    }

  return (
    <section className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-2">
      {/* ================================
          Yearly Trend
      ================================= */}

      <Card className="bhc-card-shadow min-w-0 overflow-hidden">
        {/* Header */}

        <CardHeader className="border-b bg-gradient-to-r from-[#fff7f7] via-white to-[#fff8e8] p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="bhc-maroon-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <BarChart3 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <CardTitle className="text-base text-primary sm:text-lg">
                2024–2026 Trend
              </CardTitle>

              <p className="mt-1 break-words text-xs text-muted-foreground sm:text-sm">
                {selectedCrime
                  ? selectedCrime.name
                  : "All Loaded Crimes"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-3 pb-4 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          {/* Chart Heading */}

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-primary sm:text-sm">
                Municipality-wide cases
              </p>

              <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                Morong, Bataan
              </p>
            </div>

            <div className="rounded-full border border-[#eadadd] bg-[#fff7f7] px-3 py-1 text-[10px] font-semibold text-primary sm:text-xs">
              2024–2026
            </div>
          </div>

          {/* Chart */}

          <div className="h-[240px] w-full min-w-0 sm:h-[280px] lg:h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={yearlyData}
                margin={{
                  top: 10,
                  right: 8,
                  left: -18,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke="#eadadd"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  tick={{
                    fill: "#766064",
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={40}
                  tick={{
                    fill: "#766064",
                  }}
                />

                <Tooltip
                  cursor={{
                    fill:
                      "rgba(122, 31, 43, 0.05)",
                  }}
                  contentStyle={{
                    background:
                      "rgba(255, 255, 255, 0.98)",
                    border:
                      "1px solid #eadadd",
                    borderRadius:
                      "10px",
                    boxShadow:
                      "0 8px 24px rgba(122, 31, 43, 0.10)",
                    fontSize:
                      "12px",
                  }}
                  labelStyle={{
                    color:
                      "#7a1f2b",
                    fontWeight:
                      700,
                    marginBottom:
                      "4px",
                  }}
                  itemStyle={{
                    color:
                      "#3b1419",
                  }}
                  formatter={(
                    value
                  ) => [
                    value,
                    "Cases",
                  ]}
                  labelFormatter={(
                    label
                  ) =>
                    `Year ${label}`
                  }
                />

                <Bar
                  dataKey="cases"
                  fill="#7a1f2b"
                  radius={[
                    7,
                    7,
                    0,
                    0,
                  ]}
                  maxBarSize={90}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Explanation */}

          <div className="mt-4 overflow-hidden rounded-xl border border-[#eadadd] bg-gradient-to-r from-[#fffaf0] to-[#fff7f7]">
            <div className="flex gap-3 p-3 sm:p-4">
              <div className="bhc-gold-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Info className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-[#704a00] sm:text-xs">
                  About this chart
                </p>

                <p className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-xs">
                  Yearly statistics represent
                  municipality-level totals
                  for Morong from the source
                  dataset.
                </p>

                {selectedBarangay && (
                  <p className="mt-2 text-[11px] leading-5 text-muted-foreground sm:text-xs">
                    Selecting a barangay does
                    not change this chart into
                    barangay-level yearly
                    statistics because the
                    source does not provide
                    year-by-barangay data.
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ================================
          Barangay Information
      ================================= */}

      <Card className="bhc-card-shadow min-w-0 overflow-hidden">
        {/* Header */}

        <CardHeader className="border-b bg-gradient-to-r from-[#fff7f7] via-white to-[#fff8e8] p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="bhc-gold-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <MapPin className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <CardTitle className="break-words text-base text-primary sm:text-lg">
                {selectedBarangay
                  ? barangayNames[
                      selectedBarangay
                    ]
                  : "Barangay Breakdown"}
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                Morong, Bataan
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {!selectedBarangay ? (
            /* ----------------------------
               Nothing Selected
            ----------------------------- */

            <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed border-[#dfc9cd] bg-gradient-to-br from-[#fffafa] to-[#fffaf0] p-6 sm:min-h-[300px]">
              <div className="max-w-xs text-center">
                <div className="bhc-maroon-icon mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <MapPin className="h-6 w-6" />
                </div>

                <p className="font-semibold text-primary">
                  Select a barangay
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Tap a barangay on the
                  map or use the barangay
                  list to view its crime
                  breakdown.
                </p>
              </div>
            </div>
          ) : (
            /* ----------------------------
               Barangay Selected
            ----------------------------- */

            <div>
              {/* Loaded Cases */}

              <div className="relative mb-5 overflow-hidden rounded-xl border border-[#eadadd] bg-gradient-to-r from-[#fff7f7] to-[#fff8e8] p-4">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-primary"
                />

                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 pl-1">
                    <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                      Loaded Cases
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                      {barangayTotal}
                    </p>

                    <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                      {
                        barangayNames[
                          selectedBarangay
                        ]
                      }
                    </p>
                  </div>

                  <div className="bhc-maroon-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Helpful Label */}

              {barangayBreakdown.length >
                0 && (
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div>
                    <p className="text-xs font-semibold text-primary">
                      Crime Breakdown
                    </p>

                    <p className="mt-0.5 text-[10px] text-muted-foreground sm:text-xs">
                      Sorted by recorded cases
                    </p>
                  </div>

                  <p className="text-[11px] text-muted-foreground sm:text-xs">
                    Select a crime for details
                  </p>
                </div>
              )}

              {/* Crime List */}

              {barangayBreakdown.length >
              0 ? (
                <>
                  <div className="space-y-2">
                    {paginatedBarangayBreakdown.map(
                      (crime) => {
                        const isSelected =
                          selectedCrimeId ===
                          crime.id

                        return (
                          <button
                            key={
                              crime.id
                            }
                            type="button"
                            onClick={() =>
                              onSelectCrime(
                                crime.id
                              )
                            }
                            aria-pressed={
                              isSelected
                            }
                            className={`
                              group relative flex min-h-[60px] w-full
                              items-center justify-between gap-2
                              overflow-hidden rounded-xl border
                              px-3 py-3 text-left
                              transition-all duration-200
                              focus:outline-none focus:ring-2
                              focus:ring-ring focus:ring-offset-2
                              sm:gap-3
                              ${
                                isSelected
                                  ? "border-primary bg-[#fff3f4] shadow-sm"
                                  : "border-border bg-white hover:border-primary/30 hover:bg-[#fffafa] hover:shadow-sm"
                              }
                            `}
                          >
                            {/* Selected Accent */}

                            {isSelected && (
                              <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
                            )}

                            {/* Crime Name */}

                            <div className="min-w-0 flex-1 pr-1">
                              <p
                                className={`break-words text-sm leading-5 ${
                                  isSelected
                                    ? "font-semibold text-primary"
                                    : "font-medium text-foreground"
                                }`}
                              >
                                {
                                  crime.name
                                }
                              </p>

                              {isSelected && (
                                <p className="mt-1 text-[11px] font-medium text-[#8b5b08] sm:text-xs">
                                  Currently selected
                                </p>
                              )}
                            </div>

                            {/* Count + Arrow */}

                            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                              <span
                                className={`min-w-8 rounded-md px-2 py-1 text-center text-xs font-bold sm:px-2.5 sm:text-sm ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-[#f8edef] text-primary"
                                }`}
                              >
                                {
                                  crime.cases
                                }
                              </span>

                              <ChevronRight
                                className={`h-4 w-4 shrink-0 transition-transform ${
                                  isSelected
                                    ? "text-[#d3a337]"
                                    : "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary"
                                }`}
                              />
                            </div>
                          </button>
                        )
                      }
                    )}
                  </div>

                  {/* ======================
                      Pagination
                  ======================= */}

                  {totalPages >
                    1 && (
                    <div className="mt-5 border-t border-[#eadadd] pt-4">
                      {/* Result Counter */}

                      <p className="mb-3 text-center text-xs text-muted-foreground sm:text-left">
                        Showing{" "}
                        {startIndex +
                          1}
                        –
                        {endIndex} of{" "}
                        {
                          barangayBreakdown.length
                        }{" "}
                        crimes
                      </p>

                      {/* Controls */}

                      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                        <button
                          type="button"
                          onClick={
                            goToPreviousPage
                          }
                          disabled={
                            safeCurrentPage ===
                            1
                          }
                          aria-label="Previous page"
                          className="inline-flex h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-[#eadadd] bg-white px-2 text-sm font-medium text-primary transition-all hover:border-primary/30 hover:bg-[#fff7f7] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 sm:h-10 sm:px-3"
                        >
                          <ChevronLeft className="h-4 w-4 shrink-0" />

                          <span className="hidden sm:inline">
                            Previous
                          </span>
                        </button>

                        {/* Page Indicator */}

                        <div className="flex h-11 min-w-[68px] items-center justify-center rounded-lg bg-[#f8edef] px-3 text-sm font-semibold text-primary sm:h-10">
                          {
                            safeCurrentPage
                          }

                          <span className="mx-1 text-muted-foreground">
                            /
                          </span>

                          {
                            totalPages
                          }
                        </div>

                        <button
                          type="button"
                          onClick={
                            goToNextPage
                          }
                          disabled={
                            safeCurrentPage ===
                            totalPages
                          }
                          aria-label="Next page"
                          className="inline-flex h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-[#eadadd] bg-white px-2 text-sm font-medium text-primary transition-all hover:border-primary/30 hover:bg-[#fff7f7] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 sm:h-10 sm:px-3"
                        >
                          <span className="hidden sm:inline">
                            Next
                          </span>

                          <ChevronRight className="h-4 w-4 shrink-0" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* ----------------------------
                   No Crimes
                ----------------------------- */

                <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-[#dfc9cd] bg-gradient-to-br from-[#fffafa] to-[#fffaf0] p-6">
                  <div className="max-w-xs text-center">
                    <div className="bhc-gold-icon mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl">
                      <ShieldAlert className="h-5 w-5" />
                    </div>

                    <p className="text-sm font-semibold text-primary">
                      No recorded cases
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      No crimes are
                      recorded for this
                      barangay in the
                      loaded dataset.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}