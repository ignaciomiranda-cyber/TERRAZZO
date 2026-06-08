export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <header className="flex items-center justify-between px-8 py-6 border-b border-zinc-100 dark:border-zinc-800">
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          instone
        </span>
        <nav className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
          <a href="#about" className="hover:text-zinc-900 dark:hover:text-white transition-colors">About</a>
          <a href="#contact" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Contact</a>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
          Building the future,<br />stone by stone.
        </h1>
        <p className="max-w-xl text-lg text-zinc-500 dark:text-zinc-400 mb-10">
          Instone is where ideas take shape. We craft thoughtful products and
          experiences that last.
        </p>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Get in touch
        </a>
      </main>

      <footer className="px-8 py-6 border-t border-zinc-100 dark:border-zinc-800 text-center text-sm text-zinc-400">
        © {new Date().getFullYear()} Instone. All rights reserved.
      </footer>
    </div>
  );
}
