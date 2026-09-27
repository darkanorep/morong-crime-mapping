import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

type BackToTopProps = {
  showAfter?: number;
  className?: string;
};

export function BackToTop({ showAfter = 300, className = "" }: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`
        fixed bottom-5 right-5 z-[9997]
        flex h-12 w-12
        items-center justify-center
        rounded-full
        border border-[#e7b84b]/70
        bg-[#681923]
        text-[#f3d77d]
        shadow-[0_8px_25px_rgba(59,20,25,0.30)]
        transition-all duration-300

        hover:-translate-y-1
        hover:bg-[#7a1f2b]
        hover:shadow-[0_12px_30px_rgba(59,20,25,0.38)]

        focus:outline-none
        focus:ring-0
        focus-visible:outline-none
        focus-visible:ring-0

        active:outline-none
        active:translate-y-0

        sm:bottom-6
        sm:right-6

        ${
          isVisible
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }

        ${className}
      `}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
