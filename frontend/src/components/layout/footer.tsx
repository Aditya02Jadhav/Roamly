export function Footer() {
  return (
    <footer className="w-full border-t border-surface-container-highest bg-surface-container-lowest py-space-xl">
      <div className="mx-auto max-w-[1200px] px-gutter">
        <div className="flex flex-col items-center justify-between gap-space-md md:flex-row">
          <div className="flex flex-col items-center gap-space-sm sm:flex-row">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Roamly
            </span>
            <span className="hidden text-secondary sm:inline">•</span>
            <span className="font-body-sm text-body-sm text-secondary">
              Thoughtful travel planning, simplified.
            </span>
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center justify-center gap-space-lg"
          >
            <a
              className="font-body-sm text-body-sm text-secondary transition-colors hover:text-on-surface"
              href="#about"
            >
              About
            </a>
            <a
              className="font-body-sm text-body-sm text-secondary transition-colors hover:text-on-surface"
              href="#contact"
            >
              Contact
            </a>
            <a
              className="font-body-sm text-body-sm text-secondary transition-colors hover:text-on-surface"
              href="#privacy"
            >
              Privacy
            </a>
            <a
              className="font-body-sm text-body-sm text-secondary transition-colors hover:text-on-surface"
              href="#terms"
            >
              Terms
            </a>
          </nav>
        </div>
        <div className="mt-space-lg border-t border-surface-container pt-space-md text-center font-body-sm text-body-sm text-secondary md:text-left">
          © 2026 Roamly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

