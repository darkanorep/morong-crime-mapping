import {
  Check,
  ChevronsUpDown,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CrimeOption {
  id: string
  name: string
}

interface CrimeComboboxProps {
  crimes: CrimeOption[]
  selectedCrimeId: string
  selectedCrimeName?: string
  onSelectCrime: (
    crimeId: string
  ) => void
}

export function CrimeCombobox({
  crimes,
  selectedCrimeId,
  selectedCrimeName,
  onSelectCrime,
}: CrimeComboboxProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          className={cn(
            "flex h-11 w-full",
            "items-center justify-between",
            "rounded-md border",
            "bg-background px-3",
            "text-sm",
            "transition-colors",
            "hover:bg-muted/50",
            "focus:outline-none",
            "focus:ring-2",
            "focus:ring-ring",
            "focus:ring-offset-2"
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

            <span
              className={cn(
                "truncate",
                selectedCrimeId ===
                  "all" &&
                  "text-muted-foreground"
              )}
            >
              {selectedCrimeId ===
              "all"
                ? "Search or select a crime..."
                : selectedCrimeName ??
                  "Search or select a crime..."}
            </span>
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search crime..." />

          <CommandList>
            <CommandEmpty>
              No crime found.
            </CommandEmpty>

            <CommandGroup>
              {/* All Loaded Crimes */}

              <CommandItem
                value="All Loaded Crimes"
                onSelect={() =>
                  onSelectCrime("all")
                }
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCrimeId ===
                      "all"
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />

                All Loaded Crimes
              </CommandItem>

              {/* Crimes */}

              {crimes.map(
                (crime) => (
                  <CommandItem
                    key={crime.id}
                    value={
                      crime.name
                    }
                    onSelect={() =>
                      onSelectCrime(
                        crime.id
                      )
                    }
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCrimeId ===
                          crime.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />

                    <span className="truncate">
                      {
                        crime.name
                      }
                    </span>
                  </CommandItem>
                )
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}