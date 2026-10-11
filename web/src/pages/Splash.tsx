const STACK = ['React', 'Vite', 'Nginx', 'NodeJS', 'Java', 'Python', 'Golang', 'PHP (Apache)', 'MongoDB', 'Redis', 'MySQL'];

export default function Splash() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-brand-950 to-brand-800 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14">
        <div className="relative z-10 max-w-xl">
          <p className="mb-3 text-sm font-semibold tracking-widest text-brand-300 uppercase">Welcome</p>
          <h1 className="font-display text-3xl leading-tight font-extrabold sm:text-4xl">Stan's Robot Shop</h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Here you will find all of Stan's friends. Pick a category on the left, or search for a robot by name, and
            have a look around.
          </p>
        </div>
        <img
          src="/media/stan.png"
          alt=""
          className="pointer-events-none absolute -right-6 -bottom-6 h-48 w-48 opacity-30 sm:right-6 sm:bottom-auto sm:top-1/2 sm:h-56 sm:w-56 sm:-translate-y-1/2 sm:opacity-90"
        />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">A microservices demo</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            This is a simple example e-commerce application, split into independent services that each use a different
            technology. When deployed into an environment monitored by Instana, these stacks are detected and monitored
            automatically, and every request is traced end to end.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
            <a className="text-brand-600 hover:text-brand-700" href="https://instana.com/" target="_blank" rel="noreferrer">
              Instana →
            </a>
            <a
              className="text-brand-600 hover:text-brand-700"
              href="https://github.com/instana/robot-shop"
              target="_blank"
              rel="noreferrer"
            >
              Source on GitHub →
            </a>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Built with</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <li key={tech} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
