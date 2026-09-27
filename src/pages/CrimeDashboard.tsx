import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  Info,
  Map,
  MapPin,
  ShieldAlert,
} from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackToTop } from "@/components/common/BackToTop";

import { CrimeMap } from "@/components/map/CrimeMap";
import { CrimeAnalytics } from "@/components/dashboard/CrimeAnalytics";
import { CrimeDetails } from "@/components/dashboard/CrimeDetails";
import { CrimeCombobox } from "@/components/dashboard/CrimeCombobox";
import { DataMethodology } from "@/components/dashboard/DataMethodology";

import crimesData from "@/data/crimes.json";
import barangays from "@/data/barangays.json";
import morongHeader from "@/assets/morong.png";
import morongCrimeLogo from "@/assets/morong-crime-logo.png";
import poblacionLogo from "../assets/barangays/poblacion.png";
import mabayoLogo from "../assets/barangays/maboyo.png";
import binaritanLogo from "../assets/barangays/binaritan.png";
import sabangLogo from "../assets/barangays/sabang.png";
import nagbalayongLogo from "../assets/barangays/nagbalayong.png";
/* ----------------------------------
   Barangay IDs
----------------------------------- */

export type BarangayId =
  | "poblacion"
  | "mabayo"
  | "binaritan"
  | "sabang"
  | "nagbalayong";

/* ----------------------------------
   Crime Categories
----------------------------------- */

type CrimeCategory =
  | "all"
  | "index-crime"
  | "non-index-crime"
  | "vehicular-accident";

const categoryFilters: {
  id: CrimeCategory;
  label: string;
}[] = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "index-crime",
    label: "Index",
  },
  {
    id: "non-index-crime",
    label: "Non-Index",
  },
  {
    id: "vehicular-accident",
    label: "Vehicular",
  },
];

const barangayLogos: Record<string, string> = {
  poblacion: poblacionLogo,
  mabayo: mabayoLogo,
  binaritan: binaritanLogo,
  sabang: sabangLogo,
  nagbalayong: nagbalayongLogo,
};

/* ----------------------------------
   App
----------------------------------- */

function App() {
  /* --------------------------------
     Selected Barangay
  --------------------------------- */

  const [selectedBarangay, setSelectedBarangay] = useState<BarangayId | null>(
    null,
  );

  /* --------------------------------
     Selected Crime
  --------------------------------- */

  const [selectedCrimeId, setSelectedCrimeId] = useState("all");

  /* --------------------------------
     Category Filter
  --------------------------------- */

  const [selectedCategory, setSelectedCategory] =
    useState<CrimeCategory>("all");

  /* --------------------------------
     Crime Details Modal
  --------------------------------- */

  const [crimeDetailsOpen, setCrimeDetailsOpen] = useState(false);

  /* --------------------------------
     Data Methodology Modal
  --------------------------------- */

  const [methodologyOpen, setMethodologyOpen] = useState(false);

  /* --------------------------------
     Total Loaded Cases
  --------------------------------- */

  const totalCases = crimesData.crimes.reduce(
    (sum, crime) => sum + crime.total,
    0,
  );

  /* --------------------------------
     All-Crime Barangay Total
  --------------------------------- */

  const getBarangayTotal = (barangayId: BarangayId) => {
    return crimesData.crimes.reduce(
      (sum, crime) => sum + crime.barangays[barangayId],
      0,
    );
  };

  /* --------------------------------
     Currently Selected Crime
  --------------------------------- */

  const selectedCrime =
    selectedCrimeId === "all"
      ? null
      : (crimesData.crimes.find((crime) => crime.id === selectedCrimeId) ??
        null);

  /* --------------------------------
     Category Filtered Crime List

     Text searching itself is handled
     inside CrimeCombobox.
  --------------------------------- */

  const filteredCrimes = useMemo(() => {
    if (selectedCategory === "all") {
      return crimesData.crimes;
    }

    return crimesData.crimes.filter(
      (crime) => crime.category === selectedCategory,
    );
  }, [selectedCategory]);

  /* --------------------------------
     Displayed Barangay Total

     No selected crime:
       -> all loaded crime totals

     Selected crime:
       -> selected crime's barangay
          distribution
  --------------------------------- */

  const getMapBarangayTotal = (barangayId: BarangayId) => {
    if (!selectedCrime) {
      return getBarangayTotal(barangayId);
    }

    return selectedCrime.barangays[barangayId] ?? 0;
  };

  /* --------------------------------
     Sidebar Barangay Selection
  --------------------------------- */

  const handleSidebarBarangaySelect = (barangayId: BarangayId) => {
    const isAlreadySelected = selectedBarangay === barangayId;

    /*
     * Clicking the currently selected
     * barangay clears the selection.
     */

    if (isAlreadySelected) {
      setSelectedBarangay(null);
      setCrimeDetailsOpen(false);
      return;
    }

    setSelectedBarangay(barangayId);

    /*
     * All Loaded Crimes does not have
     * one specific crime detail to
     * display.
     */

    if (!selectedCrime) {
      setCrimeDetailsOpen(false);
      return;
    }

    const cases = selectedCrime.barangays[barangayId] ?? 0;

    /*
     * Only open Crime Details when
     * at least one case exists.
     */

    setCrimeDetailsOpen(cases > 0);
  };

  /* --------------------------------
     Map Polygon Selection

     Uses the same Crime Details
     behavior as the sidebar.
  --------------------------------- */

  const handleMapBarangaySelect = (barangay: BarangayId | null) => {
    setSelectedBarangay(barangay);

    if (!barangay) {
      setCrimeDetailsOpen(false);
      return;
    }

    if (!selectedCrime) {
      setCrimeDetailsOpen(false);
      return;
    }

    const cases = selectedCrime.barangays[barangay] ?? 0;

    setCrimeDetailsOpen(cases > 0);
  };

  /* --------------------------------
     Crime Selection
  --------------------------------- */

  const handleCrimeChange = (crimeId: string) => {
    setSelectedCrimeId(crimeId);

    /*
     * Close an existing modal when
     * changing crime.
     */

    setCrimeDetailsOpen(false);
  };

  /* --------------------------------
     Category Selection
  --------------------------------- */

  const handleCategoryChange = (category: CrimeCategory) => {
    setSelectedCategory(category);
  };

  /* --------------------------------
     Barangay Breakdown Crime Click

     Selecting a crime from the
     breakdown:
       -> selects the crime
       -> resets category to All
       -> updates map/chart
       -> opens Crime Details
  --------------------------------- */

  const handleBreakdownCrimeSelect = (crimeId: string) => {
    setSelectedCrimeId(crimeId);

    /*
     * Make sure the selected crime
     * appears in the main combobox.
     */

    setSelectedCategory("all");

    /*
     * Barangay is already selected
     * when this handler is called.
     */

    setCrimeDetailsOpen(true);
  };

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-background">
      {/* ================================
    Header
================================= */}

      <header
        className="relative overflow-hidden bg-cover bg-[center_44%]"
        style={{
          backgroundImage: `url(${morongHeader})`,
        }}
      >
        {/* ================================
      Photo Overlays
  ================================= */}

        {/* Main readability overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#30080f]/90 via-[#4f1119]/72 to-[#3b0d14]/55"
        />

        {/* Bottom depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent"
        />

        {/* Subtle gold glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#e7b84b]/10 blur-3xl"
        />

        {/* ================================
      Header Content
  ================================= */}

        <div className="relative z-10 mx-auto flex min-h-[100px] w-full max-w-[1600px] items-center justify-between gap-3 px-4 py-4 sm:min-h-[112px] sm:gap-4 sm:px-6 lg:px-8">
          {/* Branding */}

          <Link
            to="/"
            aria-label="Return to Morong Crime Mapping home page"
            className="
                group flex min-w-0 flex-1
                items-center gap-3
                border-0
                outline-none
                ring-0
                focus:border-0
                focus:outline-none
                focus:ring-0
                focus-visible:outline-none
                focus-visible:ring-0
                active:outline-none
                active:ring-0
                sm:gap-4
            "
          >
            <div
              className="
      flex h-14 w-14 shrink-0
      items-center justify-center
      transition-transform duration-200
      group-hover:scale-105
      sm:h-16 sm:w-16
    "
            >
              <img
                src={morongCrimeLogo}
                alt=""
                className="h-full w-full object-contain drop-shadow-lg"
              />
            </div>

            <div className="min-w-0">
              <h1
                className="
        truncate text-base font-bold
        tracking-tight text-white
        drop-shadow-md
        transition-colors
        group-hover:text-[#f3d77d]
        sm:text-xl
      "
              >
                Morong Crime Mapping
              </h1>

              <p className="mt-1 truncate text-[11px] font-medium text-white/85 drop-shadow-sm sm:text-sm">
                Morong, Bataan • Crime Statistics 2024–2026
              </p>
            </div>
          </Link>

          {/* Header Actions */}

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Location */}

            <div className="hidden items-center gap-2 rounded-lg bg-black/15 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur-[2px] lg:flex">
              <MapPin className="h-4 w-4 shrink-0 text-[#f3d77d]" />

              <span>Morong, Bataan</span>
            </div>

            {/* Data Information */}

            <button
              type="button"
              onClick={() => setMethodologyOpen(true)}
              className="
          inline-flex h-10 shrink-0
          items-center justify-center gap-2
          rounded-lg
          border border-white/30
          bg-black/20
          px-3
          text-sm font-semibold text-white
          shadow-sm
          backdrop-blur-md
          transition-all
          hover:border-[#f3d77d]/80
          hover:bg-black/30
          focus:outline-none
          focus:ring-2
          focus:ring-[#e7b84b]
          focus:ring-offset-2
          focus:ring-offset-[#681923]
          sm:h-10
        "
              aria-label="Open data sources and methodology"
            >
              <Info className="h-4 w-4 shrink-0 text-[#f3d77d]" />

              <span className="hidden sm:inline">Data Information</span>
            </button>
          </div>
          <Link
            to="/"
            className="
    inline-flex h-10 shrink-0
    items-center justify-center gap-2
    rounded-lg
    border border-white/30
    bg-black/20
    px-3
    text-sm font-semibold text-white
    shadow-sm
    backdrop-blur-md
    transition-all
    hover:border-[#f3d77d]/80
    hover:bg-black/30
    focus:outline-none
    focus:ring-2
    focus:ring-[#e7b84b]
    focus:ring-offset-2
    focus:ring-offset-[#681923]
  "
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-[#f3d77d]" />

            <span className="hidden xl:inline">Back to Home</span>
          </Link>
        </div>

        {/* Gold Accent Line */}

        <div className="bhc-gold-line relative z-10 h-1 w-full" />
      </header>

      {/* ================================
          Main Content
      ================================= */}

      <main className="mx-auto w-full max-w-[1600px] space-y-4 p-4 sm:space-y-6 sm:p-6 lg:px-8">
        {/* ================================
            Summary Statistics
        ================================= */}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {/* Loaded Cases */}

          <Reveal delay={0}>
            <Card
              className="bhc-blue-surface bhc-card-shadow min-w-0 overflow-hidden border-[#eadadd] transition-all duration-200
hover:-translate-y-0.5
hover:shadow-lg"
            >
              <CardContent className="relative flex items-center justify-between gap-4 p-4 sm:p-5 lg:p-6">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-primary"
                />

                <div className="min-w-0 pl-1">
                  <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                    Loaded Cases
                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-tight text-primary sm:mt-2 sm:text-3xl">
                    {totalCases}
                  </p>

                  <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                    Reported crime totals
                  </p>
                </div>

                <div className="bhc-maroon-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12">
                  <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Barangays */}

          <Reveal delay={80}>
            <Card
              className="bhc-neutral-surface bhc-card-shadow min-w-0 overflow-hidden border-[#eadadd] transition-all duration-200
hover:-translate-y-0.5
hover:shadow-lg"
            >
              <CardContent className="relative flex items-center justify-between gap-4 p-4 sm:p-5 lg:p-6">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-[#d3a337]"
                />

                <div className="min-w-0 pl-1">
                  <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                    Barangays
                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:mt-2 sm:text-3xl">
                    {barangays.length}
                  </p>

                  <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                    Geographic coverage
                  </p>
                </div>

                <div className="bhc-gold-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12">
                  <Map className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Reporting Period */}

          <Reveal delay={160}>
            <Card
              className="bhc-gold-surface bhc-card-shadow min-w-0 overflow-hidden border-[#eadadd] transition-all duration-200
hover:-translate-y-0.5
hover:shadow-lg"
            >
              <CardContent className="relative flex items-center justify-between gap-4 p-4 sm:p-5 lg:p-6">
                <div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1 bg-[#e7b84b]"
                />

                <div className="min-w-0 pl-1">
                  <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                    Reporting Period
                  </p>

                  <p className="mt-1 whitespace-nowrap text-2xl font-bold tracking-tight text-primary sm:mt-2 sm:text-3xl">
                    2024–2026
                  </p>

                  <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
                    Loaded dataset
                  </p>
                </div>

                <div className="bhc-gold-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-12 sm:w-12">
                  <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </section>

        {/* ================================
            Main Dashboard
        ================================= */}

        <section className="grid min-w-0 gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          {/* ==============================
              Barangay Sidebar
          =============================== */}

          <Card className="bhc-card-shadow min-w-0 overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-[#fff7f7] to-[#fffaf0] p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="bhc-maroon-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-base text-primary sm:text-lg">
                    Barangays
                  </CardTitle>

                  <p className="mt-1 break-words text-xs leading-5 text-muted-foreground sm:text-sm">
                    {selectedCrime ? selectedCrime.name : "All Loaded Crimes"}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-2 p-4 sm:p-5">
              {barangays.map((barangay) => {
                const id = barangay.id as BarangayId;

                /*
                 * Sidebar and map use
                 * the same values.
                 */

                const cases = getMapBarangayTotal(id);

                const isSelected = selectedBarangay === id;

                /*
                 * Zero-case styling only
                 * applies when a specific
                 * crime is selected.
                 */

                const hasNoCases = selectedCrime !== null && cases === 0;

                return (
  <button
    key={barangay.id}
    type="button"
    onClick={() => handleSidebarBarangaySelect(id)}
    aria-pressed={isSelected}
    className={`
      group relative w-full overflow-hidden
      rounded-xl border px-3 py-3 text-left
      transition-all duration-200
      focus:outline-none focus:ring-2
      focus:ring-ring focus:ring-offset-2
      sm:px-4

      ${
        isSelected
          ? "border-primary bg-primary text-primary-foreground shadow-md"
          : hasNoCases
            ? "border-border/70 bg-muted/30 hover:bg-muted/50"
            : "border-border bg-white hover:border-primary/30 hover:bg-[#fff8f8] hover:shadow-sm"
      }
    `}
  >
    {/* Gold selected accent */}
    {isSelected && (
      <div className="absolute inset-y-0 left-0 w-1 bg-[#e7b84b]" />
    )}

    <div className="flex items-center justify-between gap-3">
      {/* Logo + Barangay Information */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Barangay Logo */}
        <div
          className={`
            flex h-12 w-12 shrink-0
            items-center justify-center
            overflow-hidden rounded-full
            border bg-white p-1
            shadow-sm
            transition-all duration-200
            sm:h-14 sm:w-14

            ${
              isSelected
                ? "border-[#f3d77d]/70"
                : hasNoCases
                  ? "border-border/60 opacity-70"
                  : "border-[#eadadd]"
            }
          `}
        >
          <img
            src={barangayLogos[id]}
            alt={`${barangay.name} barangay logo`}
            className="
              h-full w-full object-contain
              transition-transform duration-300
              group-hover:scale-110
            "
            loading="lazy"
          />
        </div>

        {/* Name + Case Description */}
        <div className="min-w-0">
          <p
            className={`
              break-words text-sm font-semibold
              sm:text-base

              ${
                isSelected
                  ? "text-white"
                  : hasNoCases
                    ? "text-muted-foreground"
                    : "text-foreground"
              }
            `}
          >
            {barangay.name}
          </p>

          <p
            className={`
              mt-1 text-[11px]
              sm:text-xs

              ${
                isSelected
                  ? "text-white/70"
                  : "text-muted-foreground"
              }
            `}
          >
            {cases === 0
              ? "No recorded cases"
              : cases === 1
                ? "1 recorded case"
                : `${cases} recorded cases`}
          </p>
        </div>
      </div>

      {/* Case Count */}
      <span
        className={`
          shrink-0 rounded-full
          px-2.5 py-1
          text-sm font-bold

          ${
            isSelected
              ? "bg-white/15 text-white"
              : hasNoCases
                ? "bg-muted text-muted-foreground"
                : "bg-[#f8edef] text-primary"
          }
        `}
      >
        {cases}
      </span>
    </div>
  </button>
);
              })}
            </CardContent>
          </Card>

          {/* ==============================
              Crime Map
          =============================== */}

          <Card className="bhc-card-shadow min-w-0 overflow-hidden">
            <CardHeader className="border-b bg-gradient-to-r from-white via-white to-[#fff8e8] p-4 sm:p-6">
              {/* Heading */}

              <div className="flex min-w-0 items-start gap-3">
                <div className="bhc-gold-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <Map className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-base text-primary sm:text-lg">
                    Crime Map
                  </CardTitle>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                    Select a crime type to visualize its distribution across
                    Morong.
                  </p>
                </div>
              </div>

              {/* Crime Controls */}

              <div className="mt-5 min-w-0 space-y-4">
                {/* Category Filters */}

                <div className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                  {categoryFilters.map((category) => {
                    const isActive = selectedCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryChange(category.id)}
                        className={`
                            min-h-10 shrink-0 whitespace-nowrap rounded-full
                            border px-3.5 py-1.5 text-xs font-semibold
                            transition-all
                            focus:outline-none focus:ring-2 focus:ring-ring
                            focus:ring-offset-2 sm:min-h-0
                            ${
                              isActive
                                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                                : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:bg-[#fff8f8] hover:text-primary"
                            }
                          `}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>

                {/* Searchable Crime Selector */}

                <div className="min-w-0 rounded-xl border bg-white/80 p-3 sm:p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-xs font-semibold text-primary">
                      Crime Type
                    </label>

                    {selectedCategory !== "all" && (
                      <span className="rounded-full bg-[#fff3d4] px-2 py-1 text-[10px] font-medium text-[#704a00] sm:text-xs">
                        {filteredCrimes.length}{" "}
                        {filteredCrimes.length === 1 ? "crime" : "crimes"}
                      </span>
                    )}
                  </div>

                  <CrimeCombobox
                    crimes={filteredCrimes}
                    selectedCrimeId={selectedCrimeId}
                    selectedCrimeName={selectedCrime?.name}
                    onSelectCrime={handleCrimeChange}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="min-w-0 bg-white p-3 pt-4 sm:p-5 sm:pt-5">
              <Reveal delay={100}>
                <CrimeMap
                  selectedBarangay={selectedBarangay}
                  onSelectBarangay={handleMapBarangaySelect}
                  getBarangayTotal={getMapBarangayTotal}
                  selectedCrimeName={selectedCrime?.name ?? "All Loaded Crimes"}
                />
              </Reveal>
            </CardContent>
          </Card>
        </section>

        {/* ================================
            Analytics
        ================================= */}
        <Reveal>
          <CrimeAnalytics
            selectedBarangay={selectedBarangay}
            selectedCrimeId={selectedCrimeId}
            onSelectCrime={handleBreakdownCrimeSelect}
          />
        </Reveal>

        {/* ================================
            Crime Details Modal
        ================================= */}

        <CrimeDetails
          selectedCrimeId={selectedCrimeId}
          selectedBarangay={selectedBarangay}
          open={crimeDetailsOpen}
          onOpenChange={setCrimeDetailsOpen}
        />

        {/* ================================
            Data Sources & Methodology
        ================================= */}

        <DataMethodology
          open={methodologyOpen}
          onOpenChange={setMethodologyOpen}
        />
      </main>

      {/* ================================
          Footer
      ================================= */}

      <footer className="mt-4 border-t bg-white sm:mt-6">
        <div className="bhc-gold-line h-1" />

        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-1 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-medium text-primary">Morong Crime Mapping</p>

          <p>Reporting Period 2024–2026 • Morong, Bataan</p>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
}

export default App;
