"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { ButtonLink } from "@/components/ui/button";
import { MaterialIcon } from "@/components/ui/material-icon";

type NavbarProps = {
  activeItem?: "home" | "explore" | "my-trips" | "preferences";
};

const navigationItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "explore", label: "Explore", href: "/explore" },
  { id: "my-trips", label: "My Trips", href: "#" },
] as const;

const aiCreditBalance = 0;

type NavigationItem = (typeof navigationItems)[number];

export function Navbar({ activeItem = "home" }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

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

      if (event.key === "Tab") {
        const focusableElements = document.querySelectorAll<HTMLElement>(
          "#mobile-navigation a[href], #mobile-navigation button:not([disabled])",
        );
        const firstElement = focusableElements.item(0);
        const lastElement = focusableElements.item(focusableElements.length - 1);

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, lenis]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function renderNavigationItems(
    onNavigate?: () => void,
    items: readonly NavigationItem[] = navigationItems,
  ) {
    return items.map((item) => (
      <Link
        aria-current={activeItem === item.id ? "page" : undefined}
        className={
          activeItem === item.id
            ? "font-semibold text-on-surface transition-colors"
            : "font-label-lg text-label-lg text-secondary transition-colors hover:text-on-surface"
        }
        href={item.href}
        key={item.id}
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    ));
  }

  const desktopNavigationItems = navigationItems.filter(
    (item) => item.id !== "home",
  );

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-surface-container-highest bg-surface-container-lowest">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-gutter-mobile sm:px-gutter">
          <div className="flex items-center gap-space-lg">
            <Link className="flex shrink-0 items-center gap-space-sm" href="/">
              <Image
                alt="Roamly Wordmark Logo"
                className="h-8 w-auto object-contain"
                height={32}
                priority
                src="/images/roamly-wordmark.png"
                width={128}
              />
            </Link>
            <Link
              aria-current={activeItem === "home" ? "page" : undefined}
              className={
                activeItem === "home"
                  ? "hidden font-semibold text-on-surface transition-colors sm:inline"
                  : "hidden font-label-lg text-label-lg text-secondary transition-colors hover:text-on-surface sm:inline"
              }
              href="/"
            >
              Home
            </Link>
            <nav
              aria-label="Main navigation"
              className="ml-space-sm hidden items-center gap-space-lg md:flex"
            >
              {renderNavigationItems(undefined, desktopNavigationItems)}
            </nav>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden items-center gap-space-md md:flex">
              <span
                aria-label={`${aiCreditBalance} AI credits remaining`}
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-3 font-label-md text-label-md font-semibold text-on-surface"
              >
                <MaterialIcon
                  className="text-[16px] text-primary-container"
                  name="auto_awesome"
                />
                <span>AI Credits</span>
                <span className="rounded-full bg-surface-container-lowest px-2 py-0.5 text-primary-container">
                  {aiCreditBalance}
                </span>
              </span>
              <ButtonLink
                aria-current={
                  activeItem === "preferences" ? "page" : undefined
                }
                className="whitespace-nowrap"
                href="/preferences"
                size="small"
              >
                <span>Plan a trip</span>
                <MaterialIcon className="text-[18px]" name="arrow_forward" />
              </ButtonLink>
              <div
                aria-label="Profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-pressed"
                role="img"
              >
                <MaterialIcon
                  className="text-[18px] text-on-primary"
                  name="person"
                />
              </div>
            </div>
            <div className="flex items-center gap-space-sm md:hidden">
              <ButtonLink
                aria-current={
                  activeItem === "preferences" ? "page" : undefined
                }
                className="whitespace-nowrap"
                href="/preferences"
                size="small"
              >
                <span>Plan a trip</span>
                <MaterialIcon className="text-[18px]" name="arrow_forward" />
              </ButtonLink>
              <button
                aria-controls="mobile-navigation"
                aria-expanded={isMenuOpen}
                aria-label={
                  isMenuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container-low"
                onClick={() => setIsMenuOpen((open) => !open)}
                ref={menuButtonRef}
                type="button"
              >
                <MaterialIcon
                  className="text-2xl"
                  name={isMenuOpen ? "close" : "menu"}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!isMenuOpen}
        aria-label="Mobile navigation menu"
        aria-modal="true"
        className={`fixed inset-0 z-[60] flex min-h-screen flex-col bg-surface-container-lowest transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        id="mobile-navigation"
        inert={!isMenuOpen}
        role="dialog"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-surface-container-highest px-gutter-mobile">
          <Link
            aria-label="Roamly home"
            className="flex items-center"
            href="/"
            onClick={closeMenu}
          >
            <Image
              alt="Roamly Wordmark Logo"
              className="h-8 w-auto object-contain"
              height={32}
              src="/images/roamly-wordmark.png"
              width={128}
            />
          </Link>
          <button
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface transition-colors hover:bg-surface-container-low"
            onClick={() => {
              closeMenu();
              menuButtonRef.current?.focus();
            }}
            ref={closeButtonRef}
            type="button"
          >
            <MaterialIcon className="text-2xl" name="close" />
          </button>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="flex flex-1 flex-col gap-8 overflow-y-auto px-gutter-mobile py-10"
          data-lenis-prevent
        >
          {renderNavigationItems(closeMenu)}
          <div className="mt-auto border-t border-surface-container-highest pt-8">
            <div
              aria-label={`${aiCreditBalance} AI credits remaining`}
              className="mb-6 flex items-center justify-between rounded-xl border border-outline-variant/60 bg-surface-container-low px-4 py-3 font-label-md text-label-md font-semibold text-on-surface"
            >
              <span className="flex items-center gap-2">
                <MaterialIcon
                  className="text-[18px] text-primary-container"
                  name="auto_awesome"
                />
                AI Credits
              </span>
              <span className="rounded-full bg-surface-container-lowest px-3 py-1 text-primary-container">
                {aiCreditBalance}
              </span>
            </div>
            <ButtonLink
              className="w-full"
              href="/preferences"
              onClick={closeMenu}
            >
              <span>Plan a trip</span>
              <MaterialIcon className="text-[18px]" name="arrow_forward" />
            </ButtonLink>
            <div
              aria-label="Profile"
              className="mt-8 flex items-center gap-3 text-on-surface"
              role="img"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-pressed text-on-primary">
                <MaterialIcon className="text-xl" name="person" />
              </span>
              <span className="font-label-lg text-label-lg">Profile</span>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
