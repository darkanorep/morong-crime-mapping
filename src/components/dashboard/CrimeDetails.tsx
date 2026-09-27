import {
  BookOpen,
  CalendarDays,
  Gavel,
  Info,
  MapPin,
  ShieldAlert,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import crimesData from "@/data/crimes.json"
import crimeDetails from "@/data/crime-details.json"

import type {
  BarangayId,
} from "@/App"

/* ----------------------------------
   Props
----------------------------------- */

interface CrimeDetailsProps {
  selectedCrimeId: string

  selectedBarangay:
    | BarangayId
    | null

  open: boolean

  onOpenChange: (
    open: boolean
  ) => void
}

/* ----------------------------------
   Legal Details
----------------------------------- */

interface CrimeLegalDetails {
  definition: string
  legalBasis: string
  legalProvision: string
}

/* ----------------------------------
   Category Labels
----------------------------------- */

const categoryLabels: Record<
  string,
  string
> = {
  "index-crime":
    "Index Crime",

  "non-index-crime":
    "Non-Index Crime",

  "vehicular-accident":
    "Vehicular Accident",
}

/* ----------------------------------
   Barangay Labels
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
   Crime Details
----------------------------------- */

export function CrimeDetails({
  selectedCrimeId,
  selectedBarangay,
  open,
  onOpenChange,
}: CrimeDetailsProps) {
  /* --------------------------------
     Do not show modal for
     "All Loaded Crimes"
  --------------------------------- */

  if (
    selectedCrimeId ===
    "all"
  ) {
    return null
  }

  /* --------------------------------
     Find selected crime
  --------------------------------- */

  const crime =
    crimesData.crimes.find(
      (item) =>
        item.id ===
        selectedCrimeId
    )

  if (!crime) {
    return null
  }

  /* --------------------------------
     Legal details
  --------------------------------- */

  const details =
    (
      crimeDetails as Record<
        string,
        CrimeLegalDetails
      >
    )[crime.id]

  /* --------------------------------
     Category
  --------------------------------- */

  const category =
    categoryLabels[
      crime.category
    ] ?? crime.category

  /* --------------------------------
     Selected Barangay
  --------------------------------- */

  const selectedBarangayName =
    selectedBarangay
      ? barangayNames[
          selectedBarangay
        ]
      : null

  const selectedBarangayCases =
    selectedBarangay
      ? crime.barangays[
          selectedBarangay
        ]
      : null

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent
        className="
          max-h-[calc(100dvh-1rem)]
          w-[calc(100%-1rem)]
          max-w-[calc(100%-1rem)]
          overflow-y-auto
          rounded-xl
          border-[#eadadd]
          bg-white
          p-0
          sm:max-h-[90vh]
          sm:w-full
          sm:max-w-3xl
        "
      >
        {/* ================================
            Header
        ================================= */}

        <DialogHeader className="relative overflow-hidden border-b border-[#eadadd] bg-gradient-to-r from-[#fff7f7] via-white to-[#fff8e8] p-4 pr-12 text-left sm:p-6 sm:pr-14">
          {/* Decorative glow */}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#e7b84b]/10 blur-3xl"
          />

          <div className="relative min-w-0">
            {/* Eyebrow */}

            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-maroon-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <ShieldAlert className="h-4 w-4" />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary sm:text-xs">
                Crime Details
              </p>
            </div>

            {/* Crime Name */}

            <DialogTitle className="break-words pr-1 text-xl font-bold leading-7 text-primary sm:text-2xl sm:leading-8">
              {crime.name}
            </DialogTitle>

            <DialogDescription
              asChild
            >
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {/* Category */}

                <span className="inline-flex max-w-full rounded-full border border-primary/15 bg-[#f8edef] px-2.5 py-1 text-[11px] font-semibold text-primary sm:px-3 sm:text-xs">
                  {category}
                </span>

                {/* Selected Barangay */}

                {selectedBarangayName && (
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#e4c76e] bg-[#fff7df] px-2.5 py-1 text-[11px] font-semibold text-[#704a00] sm:px-3 sm:text-xs">
                    <MapPin className="h-3 w-3 shrink-0" />

                    <span className="truncate">
                      {
                        selectedBarangayName
                      }
                    </span>
                  </span>
                )}
              </div>
            </DialogDescription>
          </div>

          {/* Header accent */}

          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#7a1f2b] via-[#d3a337] to-[#7a1f2b]" />
        </DialogHeader>

        {/* ================================
            Modal Body
        ================================= */}

        <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
          {/* ================================
              Selected Barangay
          ================================= */}

          {selectedBarangay &&
            selectedBarangayName &&
            selectedBarangayCases !==
              null && (
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <div className="bhc-maroon-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <MapPin className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-primary">
                      Selected Barangay
                    </h3>

                    <p className="text-[10px] text-muted-foreground sm:text-xs">
                      Barangay-level total
                    </p>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl border border-[#eadadd] bg-gradient-to-r from-[#fff7f7] to-[#fff8e8] p-3 sm:p-4">
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-1 bg-primary"
                  />

                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 pl-1">
                      <p className="break-words text-sm font-semibold text-primary sm:text-base">
                        {
                          selectedBarangayName
                        }
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Morong, Bataan
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                        {
                          selectedBarangayCases
                        }
                      </p>

                      <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                        {selectedBarangayCases ===
                        1
                          ? "recorded case"
                          : "recorded cases"}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-[11px] leading-5 text-muted-foreground sm:text-xs">
                  Total recorded cases
                  for this crime in{" "}
                  {
                    selectedBarangayName
                  }{" "}
                  across the loaded
                  reporting period.
                </p>
              </section>
            )}

          {/* ================================
              Morong-Wide Total
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-gold-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <ShieldAlert className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Morong-Wide Total
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Municipality-level total
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[#eadadd] bg-gradient-to-r from-white to-[#fffaf0] p-3 sm:p-4">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-[#d3a337]"
              />

              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 pl-1">
                  <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                    Total Recorded Cases
                  </p>

                  <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                    Entire municipality
                  </p>
                </div>

                <p className="shrink-0 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                  {crime.total}
                </p>
              </div>
            </div>
          </section>

          {/* ================================
              Morong-Wide Year Statistics
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-maroon-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <CalendarDays className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Morong-Wide Cases by Year
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Municipality-level statistics
                </p>
              </div>
            </div>

            {/* Keep all years visible on normal phone widths */}

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* 2024 */}

              <div className="min-w-0 overflow-hidden rounded-xl border border-[#eadadd] bg-[#fffafa] p-3 sm:p-4">
                <div className="mb-2 h-1 w-8 rounded-full bg-[#d3a337]" />

                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                  2024
                </p>

                <p className="mt-1 text-xl font-bold text-primary sm:text-2xl">
                  {
                    crime.yearly[
                      "2024"
                    ]
                  }
                </p>

                <p className="mt-0.5 hidden text-[10px] text-muted-foreground sm:block">
                  cases
                </p>
              </div>

              {/* 2025 */}

              <div className="min-w-0 overflow-hidden rounded-xl border border-[#eadadd] bg-[#fff8ef] p-3 sm:p-4">
                <div className="mb-2 h-1 w-8 rounded-full bg-[#b84a58]" />

                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                  2025
                </p>

                <p className="mt-1 text-xl font-bold text-primary sm:text-2xl">
                  {
                    crime.yearly[
                      "2025"
                    ]
                  }
                </p>

                <p className="mt-0.5 hidden text-[10px] text-muted-foreground sm:block">
                  cases
                </p>
              </div>

              {/* 2026 */}

              <div className="min-w-0 overflow-hidden rounded-xl border border-[#eadadd] bg-[#fff5f6] p-3 sm:p-4">
                <div className="mb-2 h-1 w-8 rounded-full bg-[#7a1f2b]" />

                <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
                  2026
                </p>

                <p className="mt-1 text-xl font-bold text-primary sm:text-2xl">
                  {
                    crime.yearly[
                      "2026"
                    ]
                  }
                </p>

                <p className="mt-0.5 hidden text-[10px] text-muted-foreground sm:block">
                  cases
                </p>
              </div>
            </div>

            {/* Important Data Note */}

            <div className="mt-3 overflow-hidden rounded-xl border border-[#eadadd] bg-gradient-to-r from-[#fffaf0] to-[#fff7f7]">
              <div className="flex gap-3 p-3 sm:p-4">
                <div className="bhc-gold-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                  <Info className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-[#704a00] sm:text-xs">
                    Important data note
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-xs">
                    Yearly statistics
                    represent Morong
                    municipality-wide
                    totals. The source
                    dataset does not
                    provide a
                    year-by-barangay
                    breakdown, so these
                    values should not be
                    interpreted as yearly
                    totals for{" "}
                    {selectedBarangayName ??
                      "the selected barangay"}
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================
              About This Crime
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-maroon-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <BookOpen className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  About This Crime
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Plain-language description
                </p>
              </div>
            </div>

            {details ? (
              <div className="rounded-xl border border-[#eadadd] bg-[#fffafa] p-3 sm:p-4">
                <p className="break-words text-sm leading-6 text-muted-foreground sm:leading-7">
                  {
                    details.definition
                  }
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#dfc9cd] bg-[#fffafa] p-3 sm:p-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  A verified
                  description for this
                  offense has not yet
                  been added to the
                  legal reference
                  dataset.
                </p>
              </div>
            )}
          </section>

          {/* ================================
              Philippine Legal Basis
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-gold-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Gavel className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Philippine Legal Basis
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Reference information
                </p>
              </div>
            </div>

            {details ? (
              <div className="relative min-w-0 overflow-hidden rounded-xl border border-[#eadadd] bg-gradient-to-r from-[#fffaf0] to-white p-3 sm:p-4">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-[#d3a337]"
                />

                <div className="pl-1">
                  <p className="break-words text-sm font-semibold leading-6 text-primary">
                    {
                      details.legalBasis
                    }
                  </p>

                  <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">
                    {
                      details.legalProvision
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#dfc9cd] bg-[#fffafa] p-3 sm:p-4">
                <p className="text-sm text-muted-foreground">
                  Legal reference
                  pending verification.
                </p>
              </div>
            )}
          </section>

          {/* ================================
              Disclaimer
          ================================= */}

          <section className="border-t border-[#eadadd] pt-4">
            <div className="flex gap-2">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />

              <p className="text-[11px] leading-5 text-muted-foreground sm:text-xs">
                Legal information is
                provided for educational
                and research reference.
                Crime statistics are
                based on the loaded
                Morong dataset.
              </p>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}