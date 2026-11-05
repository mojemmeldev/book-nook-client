/**
 * Applies the saved light/dark theme before the page paints, so there is no
 * flash of the wrong theme on load. Rendered once in the root layout.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("booknook-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}

export default ThemeScript;
