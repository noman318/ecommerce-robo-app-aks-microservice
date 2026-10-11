// Instana EUM is injected by nginx SSI (see entrypoint.sh) and may be absent.
type Ineum = (...args: unknown[]) => void;

declare global {
  interface Window {
    ineum?: Ineum;
  }
}

export function ineum(...args: unknown[]): void {
  window.ineum?.(...args);
}

// Keep the page names the AngularJS app reported so existing EUM dashboards still line up.
export function pageName(pathname: string): string {
  const seg = pathname.split('/')[1];
  return seg ? `${seg}.html` : 'splash.html';
}
