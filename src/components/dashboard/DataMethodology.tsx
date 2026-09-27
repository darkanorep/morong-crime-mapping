import {
  AlertTriangle,
  BookOpen,
  Database,
  FileText,
  Info,
  Map,
  Scale,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DataMethodologyProps {
  open: boolean;

  onOpenChange: (open: boolean) => void;
}

export function DataMethodology({ open, onOpenChange }: DataMethodologyProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-[#e7b84b]/10 blur-3xl"
          />

          <div className="relative min-w-0">
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-maroon-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Database className="h-4 w-4" />
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary sm:text-xs">
                About the Dataset
              </p>
            </div>

            <DialogTitle className="break-words text-xl font-bold leading-7 text-primary sm:text-2xl sm:leading-8">
              Data Sources &amp; Methodology
            </DialogTitle>

            <DialogDescription className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Information about the crime statistics, geographic boundaries,
              interpretation, limitations, and legal references used by the
              Morong Crime Mapping system.
            </DialogDescription>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#7a1f2b] via-[#d3a337] to-[#7a1f2b]" />
        </DialogHeader>

        {/* ================================
            Body
        ================================= */}

        <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
          {/* ================================
              Crime Statistics
          ================================= */}

          <section>
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-maroon-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Database className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Crime Statistics
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Dataset coverage
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[#eadadd] bg-gradient-to-r from-[#fffafa] to-[#fffaf0] p-3 sm:p-4">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-primary"
              />

              <p className="pl-1 text-sm leading-6 text-muted-foreground sm:leading-7">
                The dashboard contains crime statistics for Morong, Bataan
                covering the reporting period 2024–2026. Crime records are
                organized by offense, year, crime category, and barangay totals
                according to the loaded source tables.
              </p>
            </div>
          </section>

          {/* ================================
              Geographic Coverage
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-gold-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Map className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Geographic Coverage
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Morong, Bataan
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#eadadd] bg-white p-3 sm:p-4">
              <p className="text-sm leading-6 text-muted-foreground sm:leading-7">
                The geographic scope is limited to the municipality of Morong,
                Bataan and its five barangays: Poblacion, Mabayo, Binaritan,
                Sabang, and Nagbalayong.
              </p>

              <div className="my-3 h-px bg-[#eadadd]" />

              <p className="text-sm leading-6 text-muted-foreground sm:leading-7">
                Barangay polygons are used as administrative reference
                boundaries for visualization. They should not be interpreted as
                cadastral or property boundaries.
              </p>
            </div>
          </section>

          {/* ================================
              Interpretation
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-maroon-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <BookOpen className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  How to Read the Data
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Statistical interpretation
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#eadadd] bg-[#fffafa]">
              <div className="space-y-3 p-3 text-sm leading-6 text-muted-foreground sm:p-4 sm:leading-7">
                <p>
                  The source provides yearly totals and barangay totals as
                  separate statistical dimensions.
                </p>

                <p>
                  Therefore, the dashboard does not infer or generate
                  year-by-barangay statistics. For example, a crime may have a
                  known total for Poblacion and known Morong-wide totals for
                  2024, 2025, and 2026, but the source does not identify how the
                  Poblacion cases are distributed across those individual years.
                </p>
              </div>

              <div className="border-t border-[#eadadd] bg-gradient-to-r from-[#fffaf0] to-[#fff7f7] p-3 sm:p-4">
                <div className="flex gap-3">
                  <div className="bhc-gold-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <Info className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-[#704a00] sm:text-xs">
                      Important interpretation rule
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground sm:text-xs">
                      Barangay totals and yearly totals should be read
                      independently. They are not a year-by-barangay
                      cross-tabulation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================
              Data Quality
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fff0d2] text-[#8b5b08] shadow-sm">
                <AlertTriangle className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Data Quality Notice
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Source discrepancy
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[#e5c56b] bg-gradient-to-r from-[#fff8df] to-[#fffaf0] p-3 sm:p-4">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-[#d3a337]"
              />

              <div className="flex items-start gap-3 pl-1">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#8b5b08]" />

                <div className="rounded-2xl border border-[#eadadd] bg-[#fffafa] p-5">
                  <h4 className="font-semibold text-[#681923]">
                    Data Consistency
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-[#766064]">
                    The loaded dataset contains 248 recorded cases. The
                    barangay-level values also sum to 248 cases across
                    Poblacion, Mabayo, Binaritan, Sabang, and Nagbalayong.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================
              Why Totals Differ
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            {/* ==================================
    Dataset Consistency
================================== */}

            <div className="border-t border-[#eadadd] pt-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f8edef] text-[#7a1f2b]">
                  <Database className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-bold text-[#681923]">
                    Dataset Consistency
                  </h3>

                  <p className="mt-1 text-sm text-[#766064]">
                    248 recorded cases
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#eadadd] bg-[#fffafa] p-5 sm:p-6">
                <p className="text-sm leading-7 text-[#766064]">
                  The loaded dataset contains{" "}
                  <span className="font-semibold text-[#681923]">
                    248 recorded cases
                  </span>
                  . The barangay-level values also sum to{" "}
                  <span className="font-semibold text-[#681923]">
                    248 cases
                  </span>{" "}
                  across Poblacion, Mabayo, Binaritan, Sabang, and Nagbalayong.
                </p>
              </div>
            </div>
          </section>

          {/* ================================
              Legal References
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-gold-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Scale className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Legal References
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Educational context
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[#eadadd] bg-gradient-to-r from-[#fffaf0] to-white p-3 sm:p-4">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1 bg-[#d3a337]"
              />

              <div className="space-y-3 pl-1 text-sm leading-6 text-muted-foreground sm:leading-7">
                <p>
                  Crime descriptions and Philippine legal references are
                  included to provide educational and research context for the
                  offenses represented in the dataset.
                </p>

                <p>
                  These descriptions are summaries and should not be treated as
                  legal advice or as a substitute for the complete text of
                  applicable Philippine laws, amendments, regulations, and
                  jurisprudence.
                </p>
              </div>
            </div>
          </section>

          {/* ================================
              Map Interpretation
          ================================= */}

          <section className="border-t border-[#eadadd] pt-5">
            <div className="mb-3 flex items-center gap-2">
              <div className="bhc-maroon-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Map className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-primary">
                  Map Interpretation
                </h3>

                <p className="text-[10px] text-muted-foreground sm:text-xs">
                  Reading the choropleth
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#eadadd] bg-[#fffafa] p-3 sm:p-4">
              <p className="text-sm leading-6 text-muted-foreground sm:leading-7">
                Choropleth colors represent relative case counts among the five
                barangays for the currently selected crime or for all loaded
                crimes. A darker area represents a higher case count relative to
                the other barangays currently displayed.
              </p>

              <div className="my-3 h-px bg-[#eadadd]" />

              <p className="text-sm leading-6 text-muted-foreground sm:leading-7">
                The visualization shows recorded case counts. It should not by
                itself be interpreted as a measurement of individual risk, crime
                rate, population-adjusted rate, or the probability that a crime
                will occur in a particular location.
              </p>
            </div>
          </section>

          {/* ================================
              Footer
          ================================= */}

          <div className="border-t border-[#eadadd] pt-4">
            <div className="rounded-lg bg-[#faf7f5] px-3 py-2.5">
              <p className="break-words text-center text-[11px] leading-5 text-muted-foreground sm:text-left sm:text-xs">
                <span className="font-semibold text-primary">
                  Morong Crime Mapping
                </span>
                {" • "}
                Reporting Period 2024–2026
                {" • "}
                Morong, Bataan, Philippines
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
