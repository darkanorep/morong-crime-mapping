import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Database,
  Map,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";
import { Reveal } from "@/components/common/Reveal";
import { BackToTop } from "@/components/common/BackToTop";
import morongHeader from "@/assets/morong.png";
import morongCrimeLogo from "@/assets/morong-crime-logo.png";
import poblacionLogo from "../assets/barangays/poblacion.png";
import mabayoLogo from "../assets/barangays/maboyo.png";
import binaritanLogo from "../assets/barangays/binaritan.png";
import sabangLogo from "../assets/barangays/sabang.png";
import nagbalayongLogo from "../assets/barangays/nagbalayong.png";

/* ==================================
   Barangays
================================== */

const barangays = [
  {
    id: "poblacion",
    name: "Poblacion",
    logo: poblacionLogo,
  },
  {
    id: "mabayo",
    name: "Mabayo",
    logo: mabayoLogo,
  },
  {
    id: "binaritan",
    name: "Binaritan",
    logo: binaritanLogo,
  },
  {
    id: "sabang",
    name: "Sabang",
    logo: sabangLogo,
  },
  {
    id: "nagbalayong",
    name: "Nagbalayong",
    logo: nagbalayongLogo,
  },
];

/* ==================================
   Landing Page Features
================================== */

const features = [
  {
    icon: Map,
    title: "Interactive Crime Map",
    description:
      "Explore recorded crime totals across the five barangays of Morong using an interactive geographic view.",
  },
  {
    icon: BarChart3,
    title: "Crime Analytics",
    description:
      "Compare municipality-wide yearly statistics and review the crime breakdown for each selected barangay.",
  },
  {
    icon: Database,
    title: "Transparent Data",
    description:
      "Review the reporting scope, source limitations, interpretation rules, and known data-quality notes.",
  },
];

const researchers = [
  {
    name: "TALASTAS, PRINCESS PAULYN A.",
    initials: "PT",
  },
  {
    name: "BARRAMEDA, DAISY KAYLE D.",
    initials: "DB",
  },
  {
    name: "PERONA, MAVERICK H.",
    initials: "MP",
  },
];

/* ==================================
   Landing Page
================================== */

export default function LandingPage() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf7f5] text-[#3b1419]">
      {/* ==================================
          Hero
      ================================== */}

      <section
        className="relative min-h-[100svh] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: `url(${morongHeader})`,
        }}
      >
        {/* Background overlays */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#26070d]/95 via-[#4d111a]/82 to-[#3b0d14]/58" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#26070d]/85 via-transparent to-black/20" />

        <div className="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#e7b84b]/15 blur-3xl" />

        {/* ==================================
            Navigation
        ================================== */}

        <nav className="relative z-10 mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          {/* Logo */}

          <div className="flex min-w-0 items-center gap-3">
            <img
              src={morongCrimeLogo}
              alt="Morong Crime Mapping logo"
              className="h-12 w-12 shrink-0 object-contain drop-shadow-lg sm:h-14 sm:w-14"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white sm:text-base">
                Morong Crime Mapping
              </p>

              <p className="hidden text-xs text-white/70 sm:block">
                Morong, Bataan
              </p>
            </div>
          </div>

          {/* Dashboard Button */}

          <Link
            to="/dashboard"
            className="
              inline-flex min-h-10
              items-center justify-center
              gap-2 rounded-lg
              border border-white/25
              bg-white/10
              px-3
              text-xs font-semibold
              text-white
              backdrop-blur-md
              transition
              hover:border-[#f3d77d]/70
              hover:bg-white/15
              focus:outline-none
              focus:ring-2
              focus:ring-[#f3d77d]
              sm:px-4
              sm:text-sm
            "
          >
            <span className="hidden sm:inline">Open Dashboard</span>

            <span className="sm:hidden">Dashboard</span>

            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </nav>

        {/* ==================================
            Hero Content
        ================================== */}

        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-96px)] w-full max-w-[1400px] items-center px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Location */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f3d77d]/35 bg-black/20 px-3 py-1.5 text-xs font-semibold text-[#f8e8ba] backdrop-blur-md sm:text-sm">
              <MapPin className="h-4 w-4 shrink-0" />
              Morong, Bataan, Philippines
            </div>

            {/* Main Title */}
            <Reveal delay={80} direction="up">
              <h1
                className="
      text-4xl font-bold tracking-tight
      text-white drop-shadow-lg
      sm:text-5xl
      lg:text-6xl
    "
              >
                Understand crime data
                <br />
                <span className="text-[#f3d77d]">through the map.</span>
              </h1>
            </Reveal>

            {/* Description */}

            <Reveal delay={120}>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8 lg:text-lg">
                An interactive crime statistics and geographic visualization
                system for the five barangays of Morong, Bataan, covering the
                loaded reporting period from 2024 to 2026.
              </p>
            </Reveal>

            {/* Hero Actions */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/dashboard"
                className="
                  inline-flex min-h-12
                  items-center justify-center
                  gap-2 rounded-xl
                  bg-[#e7b84b]
                  px-6
                  text-sm font-bold
                  text-[#4b111a]
                  shadow-lg
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#f3c95f]
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white
                "
              >
                Explore Crime Map
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>

              <button
                type="button"
                onClick={scrollToAbout}
                className="
                  inline-flex min-h-12
                  items-center justify-center
                  gap-2 rounded-xl
                  border border-white/30
                  bg-white/10
                  px-6
                  text-sm font-semibold
                  text-white
                  backdrop-blur-md
                  transition
                  hover:bg-white/15
                  focus:outline-none
                  focus:ring-2
                  focus:ring-white
                "
              >
                About the System
                <ChevronDown className="h-4 w-4 shrink-0" />
              </button>
            </div>

            {/* ==================================
                Hero Statistics
            ================================== */}

            <div className="mt-10 grid max-w-2xl grid-cols-3 overflow-hidden rounded-2xl border border-white/15 bg-black/20 backdrop-blur-md">
              {/* Loaded Cases */}

              <div className="min-w-0 p-3 sm:p-4">
                <p className="text-2xl font-bold text-white sm:text-3xl">248</p>

                <p className="mt-1 text-[10px] text-white/65 sm:text-xs">
                  Loaded Cases
                </p>
              </div>

              {/* Barangays */}

              <div className="min-w-0 border-x border-white/15 p-3 sm:p-4">
                <p className="text-2xl font-bold text-white sm:text-3xl">5</p>

                <p className="mt-1 text-[10px] text-white/65 sm:text-xs">
                  Barangays
                </p>
              </div>

              {/* Reporting Period */}

              <div className="min-w-0 p-3 sm:p-4">
                <p className="whitespace-nowrap text-xl font-bold text-white sm:text-3xl">
                  2024–26
                </p>

                <p className="mt-1 text-[10px] text-white/65 sm:text-xs">
                  Reporting Period
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gold bottom line */}

        <div className="absolute inset-x-0 bottom-0 z-10 h-1 bg-gradient-to-r from-[#9a6a13] via-[#f3d77d] to-[#9a6a13]" />
      </section>

      {/* ==================================
          About
      ================================== */}

      <section
        id="about"
        className="scroll-mt-8 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            {/* About Text */}

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b5b08]">
                About the System
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#681923] sm:text-4xl">
                A clearer way to explore local crime statistics.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#766064] sm:text-base">
                Morong Crime Mapping brings the loaded crime dataset together
                with barangay boundaries, searchable crime categories, yearly
                municipality statistics, and barangay-level totals in one
                responsive interface.
              </p>

              {/* Notice */}

              <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#e5c56b] bg-[#fff8df] p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8b5b08]" />

                <p className="text-sm leading-6 text-[#704a00]">
                  The map visualizes recorded case counts. It is a reference and
                  research tool, not a prediction of individual risk or the
                  probability that a crime will occur.
                </p>
              </div>
            </div>

            {/* ==================================
                Feature Cards
            ================================== */}

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="
                      rounded-2xl
                      border border-[#eadadd]
                      bg-white
                      p-5
                      shadow-[0_12px_30px_rgba(90,25,35,0.06)]
                      transition
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-[#d8b65d]
                      hover:shadow-[0_16px_35px_rgba(90,25,35,0.10)]
                    "
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edef] text-[#7a1f2b]">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="font-bold text-[#681923]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#766064]">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================
          Geographic Coverage
      ================================== */}

      <section className="border-y border-[#eadadd] bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Section Heading */}

          <Reveal>
            <div className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff3d4] text-[#8b5b08]">
                <Map className="h-5 w-5" />
              </div>

              <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#8b5b08]">
                Geographic Coverage
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#681923] sm:text-3xl">
                Five barangays of Morong
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#766064]">
                Select a barangay in the dashboard to highlight its boundary,
                inspect recorded totals, and explore available crime details.
              </p>
            </div>
          </Reveal>

          {/* Barangays */}

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {barangays.map((barangay, index) => (
              <Reveal key={barangay.id} delay={index * 90} className="h-full">
                <Link
                  to={`/dashboard?barangay=${barangay.id}`}
                  className="
          group
          flex h-full min-h-[210px]
          flex-col
          items-center justify-center
          rounded-2xl
          border border-[#eadadd]
          bg-[#fffafa]
          px-4 py-6
          text-center
          shadow-[0_8px_24px_rgba(90,25,35,0.04)]
          transition-all duration-300

          hover:-translate-y-1
          hover:border-[#d3a337]
          hover:shadow-[0_16px_35px_rgba(90,25,35,0.12)]
          transition-transform duration-500
group-hover:scale-110
        "
                >
                  <img
                    src={barangay.logo}
                    alt={`${barangay.name} barangay logo`}
                    className="
            h-28 w-28
            object-contain
            transition-transform
            duration-500
            group-hover:scale-110
            sm:h-32 sm:w-32
          "
                  />

                  <div className="mt-5 h-[2px] w-8 rounded-full bg-[#d3a337] transition-all duration-300 group-hover:w-12" />

                  <p className="mt-3 font-bold text-[#681923]">
                    {barangay.name}
                  </p>

                  <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9a777c]">
                    Morong, Bataan
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================
          Reporting Scope
      ================================== */}

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Heading */}

          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b5b08]">
              Data Interpretation
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#681923] sm:text-3xl">
              Understand the reporting scope
            </h2>
          </div>

          {/* Cards */}

          <div className="grid gap-4 md:grid-cols-3">
            {/* Yearly Statistics */}

            <div className="rounded-2xl border border-[#eadadd] bg-white p-6 shadow-[0_8px_25px_rgba(90,25,35,0.04)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edef] text-[#7a1f2b]">
                <CalendarDays className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-semibold text-[#681923]">
                2024–2026
              </p>

              <p className="mt-2 text-sm leading-6 text-[#766064]">
                Yearly figures in the dashboard represent Morong-wide totals.
              </p>
            </div>

            {/* Barangay Totals */}

            <div className="rounded-2xl border border-[#eadadd] bg-white p-6 shadow-[0_8px_25px_rgba(90,25,35,0.04)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff3d4] text-[#8b5b08]">
                <MapPin className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-semibold text-[#681923]">
                Barangay Totals
              </p>

              <p className="mt-2 text-sm leading-6 text-[#766064]">
                Barangay values are displayed separately from municipality-wide
                yearly totals.
              </p>
            </div>

            {/* Source Aware */}

            <div className="rounded-2xl border border-[#eadadd] bg-white p-6 shadow-[0_8px_25px_rgba(90,25,35,0.04)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8edef] text-[#7a1f2b]">
                <Database className="h-5 w-5" />
              </div>

              <p className="mt-4 text-sm font-semibold text-[#681923]">
                Source-Aware
              </p>

              <p className="mt-2 text-sm leading-6 text-[#766064]">
                The dashboard does not infer year-by-barangay values that are
                not supplied by the loaded source data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================
          Final CTA
      ================================== */}

      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl bg-gradient-to-r from-[#4a1018] via-[#681923] to-[#7a1f2b] px-6 py-10 text-center shadow-xl sm:px-10 sm:py-14">
          {/* Decorative glow */}

          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#e7b84b]/15 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

          {/* Content */}

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e7b84b] text-[#4b111a]">
              <Map className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
              Explore the interactive crime map
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/75">
              View crime distributions, barangay totals, yearly trends, and
              supporting information in the full dashboard.
            </p>

            <Link
              to="/dashboard"
              className="
                mt-6 inline-flex min-h-12
                items-center justify-center
                gap-2 rounded-xl
                bg-[#e7b84b]
                px-6
                text-sm font-bold
                text-[#4b111a]
                shadow-lg
                transition
                hover:-translate-y-0.5
                hover:bg-[#f3c95f]
                focus:outline-none
                focus:ring-2
                focus:ring-white
              "
            >
              Open Crime Dashboard
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================
    Research Team
================================== */}

      <section className="border-t border-[#eadadd] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          {/* Heading */}
          <Reveal>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b5b08]">
                Research Team
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#681923] sm:text-3xl">
                Meet the Researchers
              </h2>

              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#766064] sm:text-base">
                The researchers behind the development of the Morong Crime
                Mapping system.
              </p>
            </div>
          </Reveal>

          {/* Researchers */}
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
            {researchers.map((researcher, index) => (
              <Reveal
                key={researcher.name}
                delay={index * 100}
                className="h-full"
              >
                <div
                  className="
              group flex h-full flex-col items-center
              rounded-2xl
              border border-[#eadadd]
              bg-[#fffafa]
              px-5 py-8
              text-center
              shadow-[0_8px_24px_rgba(90,25,35,0.04)]
              transition-all duration-300
              hover:-translate-y-1
              hover:border-[#d3a337]
              hover:bg-[#fffaf0]
              hover:shadow-[0_16px_35px_rgba(90,25,35,0.10)]
            "
                >
                  {/* Initials */}
                  <div
                    className="
                flex h-20 w-20
                items-center justify-center
                rounded-full
                border-4 border-[#f8e8ba]
                bg-[#681923]
                text-xl font-bold
                text-[#f3d77d]
                shadow-md
                transition-transform duration-300
                group-hover:scale-105
              "
                  >
                    {researcher.initials}
                  </div>

                  {/* Gold accent */}
                  <div className="mt-5 h-[2px] w-8 rounded-full bg-[#d3a337] transition-all duration-300 group-hover:w-12" />

                  {/* Name */}
                  <h3 className="mt-4 text-sm font-bold leading-6 text-[#681923] sm:text-base">
                    {researcher.name}
                  </h3>

                  {/* Role */}
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-[#9a777c]">
                    Researcher
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================
          Footer
      ================================== */}

      <footer className="border-t border-[#eadadd] bg-white">
        <div className="h-1 bg-gradient-to-r from-[#9a6a13] via-[#f3d77d] to-[#9a6a13]" />

        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-6 text-xs text-[#766064] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="font-semibold text-[#681923]">Morong Crime Mapping</p>

          <p>Crime Statistics 2024–2026 • Morong, Bataan</p>
        </div>
      </footer>
      <BackToTop />
    </div>
  );
}
