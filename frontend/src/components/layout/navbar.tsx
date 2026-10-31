"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { ButtonLink } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";
import { getCurrentUser, setStoredToken, type AuthUser } from "@/lib/api";
import { AuthModal } from "@/components/shared/auth-modal";

type NavbarProps = {
  activeItem?:
    | "home"
    | "explore"
    | "about"
    | "contact"
    | "my-trips"
    | "preferences";
};

const navigationItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "explore", label: "Explore", href: "/explore" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
  { id: "my-trips", label: "My Trips", href: "/trips" },
] as const;

type NavigationItem = (typeof navigationItems)[number];

export function Navbar({ activeItem = "home" }: NavbarProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  function handleLogout() {
    setIsAccountMenuOpen(false);
    setStoredToken(null);
    setCurrentUser(null);
    router.replace("/");
  }

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !accountMenuRef.current?.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      lenis?.start();
    };
  }, [isMenuOpen, lenis]);

  const visibleNavigationItems = navigationItems.filter(
    (item) => item.id !== "my-trips" || currentUser !== null,
  );
  const desktopNavigationItems = visibleNavigationItems.filter(
    (item) => item.id !== "home",
  );

  return (
    <>
      <header className="fixed top-0 z-40 w-full border-b border-surface-container-highest/60 bg-surface-container-lowest/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-gutter-mobile sm:px-gutter">
          <div className="flex items-center gap-space-lg">
            <Link
              className="flex items-center gap-2 font-headline-md text-xl font-bold tracking-tight text-on-surface"
              href="/"
            >
              <MaterialIcon className="text-2xl text-primary-container" name="explore" />
              <span>Roamly</span>
            </Link>

            <nav
              aria-label="Main navigation"
              className="ml-space-md hidden items-center gap-space-lg md:flex"
            >
              {desktopNavigationItems.map((item) => {
                const isActive = activeItem === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`font-label-lg text-label-lg transition-colors ${
                      isActive
                        ? "font-bold text-primary-container"
                        : "text-secondary hover:text-on-surface"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-space-md">
            <div className="hidden items-center gap-space-md md:flex">
              {currentUser ? (
                <>
                  <span
                    aria-label={`${currentUser.ai_credits} AI credits remaining`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-3 font-label-md text-label-md font-semibold text-on-surface"
                  >
                    <MaterialIcon
                      className="text-[16px] text-primary-container"
                      name="auto_awesome"
                    />
                    <span>AI Credits</span>
                    <span className="rounded-full bg-surface-container-lowest px-2 py-0.5 text-primary-container">
                      {currentUser.ai_credits}
                    </span>
                  </span>

                  <div className="relative" ref={accountMenuRef}>
                    <button
                      aria-expanded={isAccountMenuOpen}
                      aria-haspopup="menu"
                      aria-label="Account menu"
                      className="flex h-10 items-center gap-2 rounded-full border border-transparent py-0.5 pl-0.5 pr-2 transition-colors hover:border-surface-container-highest hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                      onClick={() =>
                        setIsAccountMenuOpen((isOpen) => !isOpen)
                      }
                      type="button"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary shadow-xs">
                        {currentUser.full_name
                          ? currentUser.full_name[0].toUpperCase()
                          : currentUser.email[0].toUpperCase()}
                      </span>
                      <MaterialIcon
                        className={`text-[18px] text-secondary transition-transform ${
                          isAccountMenuOpen ? "rotate-180" : ""
                        }`}
                        name="expand_more"
                      />
                    </button>
                    {isAccountMenuOpen ? (
                      <div
                        className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-surface-container-highest bg-surface-container-lowest p-2 shadow-lg"
                        role="menu"
                      >
                        <div className="border-b border-surface-container-highest px-3 py-2">
                          <p className="font-label-sm text-label-sm text-secondary">
                            Signed in as
                          </p>
                          <p className="truncate font-label-md text-label-md font-semibold text-on-surface">
                            {currentUser.email}
                          </p>
                        </div>
                        <button
                          className="mt-1 flex w-full items-center rounded-lg px-3 py-2.5 text-left font-label-md text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                          onClick={handleLogout}
                          role="menuitem"
                          type="button"
                        >
                          Log out
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-surface-container-highest bg-surface-container-lowest px-3.5 font-label-md text-label-md font-semibold text-on-surface hover:bg-surface-container"
                >
                  <MaterialIcon className="text-[16px]" name="person" />
                  Log In
                </button>
              )}

              <ButtonLink
                className="whitespace-nowrap"
                href="/preferences"
                size="small"
              >
                <span>Plan a trip</span>
                <MaterialIcon className="text-[18px]" name="arrow_forward" />
              </ButtonLink>
            </div>

            <button
              aria-expanded={isMenuOpen}
              aria-label="Toggle mobile menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-container-highest text-secondary md:hidden hover:bg-surface-container"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              ref={menuButtonRef}
              type="button"
            >
              <MaterialIcon className="text-xl" name={isMenuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-16 z-30 flex flex-col gap-4 border-b border-surface-container-highest bg-surface-container-lowest p-6 shadow-xl md:hidden"
        >
          {visibleNavigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="font-label-lg text-lg text-on-surface py-1 font-semibold"
            >
              {item.label}
            </Link>
          ))}
          <div className="border-t border-surface-container-highest/60 pt-4 flex flex-col gap-3">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-primary-container font-semibold font-label-md"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="flex h-11 w-full items-center justify-center rounded-xl bg-surface-container-low font-label-md font-semibold text-on-surface"
              >
                Log In / Sign Up
              </button>
            )}
            <Link
              href="/preferences"
              onClick={() => setIsMenuOpen(false)}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-primary-container font-label-md font-semibold text-on-primary"
            >
              Plan a trip
            </Link>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </>
  );
}
