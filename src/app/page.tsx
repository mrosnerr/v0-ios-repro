export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          v0 iOS App Reproduction
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          If you can see this, the preview loaded successfully.
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Minimal Next.js app — no auth, no middleware, no redirects.
        </p>
      </div>
    </div>
  );
}
