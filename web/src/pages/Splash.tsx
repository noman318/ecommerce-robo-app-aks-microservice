import { Link } from 'react-router';
import { ArrowRightIcon, CartIcon, ShieldIcon, SparkIcon } from '../components/icons';

const STACK = ['React', 'Vite', 'Nginx', 'NodeJS', 'Java', 'Python', 'Golang', 'PHP (Apache)', 'MongoDB', 'Redis', 'MySQL'];

const FEATURES = [
  {
    icon: SparkIcon,
    title: 'Polyglot services',
    text: 'Catalogue, cart, users, shipping, ratings and payment each run on their own stack.',
  },
  {
    icon: ShieldIcon,
    title: 'Traced end to end',
    text: 'Under Instana, every request is followed across each service it touches.',
  },
  {
    icon: CartIcon,
    title: 'A real checkout flow',
    text: 'Browse, rate, add to cart, calculate shipping and pay, all through the API.',
  },
];

export default function Splash() {
  return (
    <div className="space-y-10">
      <section className="relative isolate overflow-hidden rounded-3xl bg-ink px-6 py-12 text-white shadow-pop sm:px-12 sm:py-16">
        {/* glow */}
        <div className="absolute -top-24 -left-24 -z-10 h-80 w-80 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -right-16 -bottom-32 -z-10 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />
        <div
          className="absolute inset-0 -z-10 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-200 ring-1 ring-white/15 backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Open for business
            </span>
            <h1 className="mt-5 font-display text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Meet Stan's
              <span className="block bg-gradient-to-r from-brand-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
                robot friends.
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-zinc-300 sm:text-lg">
              Pick a category, or search for a robot by name, and have a look around.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => document.getElementById('search')?.focus()}
                className="btn btn-lg bg-white text-ink hover:bg-zinc-100"
              >
                Start shopping <ArrowRightIcon className="h-4 w-4" />
              </button>
              <Link to="/login" className="btn btn-lg text-white ring-1 ring-white/25 hover:bg-white/10">
                Sign in
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden aspect-square w-full max-w-xs md:block">
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-brand-500/40 to-fuchsia-500/20 blur-2xl" />
            <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
            <div className="absolute inset-10 rounded-full ring-1 ring-white/10" />
            <img src="/media/stan.png" alt="" className="relative h-full w-full object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-semibold text-ink">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{text}</p>
          </div>
        ))}
      </section>

      <section className="card grid gap-8 p-6 sm:p-8 md:grid-cols-2">
        <div>
          <p className="eyebrow">About this store</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">A microservices demo</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            This is a simple example e-commerce application, split into independent services that each use a different
            technology. When deployed into an environment monitored by Instana, these stacks are detected and monitored
            automatically, and every request is traced end to end.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <a className="btn-secondary" href="https://instana.com/" target="_blank" rel="noreferrer">
              Instana <ArrowRightIcon className="h-4 w-4" />
            </a>
            <a className="btn-ghost" href="https://github.com/instana/robot-shop" target="_blank" rel="noreferrer">
              Source on GitHub <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="rounded-2xl bg-zinc-50 p-6 ring-1 ring-zinc-950/5">
          <h3 className="text-sm font-semibold text-ink">Built with</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <li key={tech} className="chip bg-white ring-1 ring-zinc-200">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
