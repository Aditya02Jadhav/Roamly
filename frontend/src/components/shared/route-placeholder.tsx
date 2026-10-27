type RoutePlaceholderProps = {
  screenName: string;
};

export function RoutePlaceholder({ screenName }: RoutePlaceholderProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
      <section
        aria-labelledby="screen-title"
        className="w-full max-w-3xl rounded-2xl border border-border bg-surface px-6 py-12 text-center sm:px-12"
      >
        <p className="text-sm font-semibold tracking-wide text-primary">ROAMLY</p>
        <h1
          id="screen-title"
          className="mt-3 text-2xl font-semibold tracking-tight text-text-heading sm:text-3xl"
        >
          {screenName}
        </h1>
        <p className="mt-3 text-sm text-text-secondary sm:text-base">
          This screen is a placeholder for the approved design.
        </p>
      </section>
    </main>
  );
}

