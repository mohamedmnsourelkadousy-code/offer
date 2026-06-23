/**
 * Safe Location Utilities
 * Wraps direct window.location and window.history calls in try-catch blocks
 * to prevent SecurityError and Script Error exceptions when running inside
 * sandboxed, restricted, or cross-origin iframes.
 */

export function getSafeLocationSearch(): string {
  try {
    return window.location.search || '';
  } catch (e) {
    console.warn("Failed to read window.location.search safely:", e);
    return '';
  }
}

export function getSafeLocationPathname(): string {
  try {
    return window.location.pathname || '/';
  } catch (e) {
    console.warn("Failed to read window.location.pathname safely:", e);
    return '/';
  }
}

export function getSafeLocationOrigin(): string {
  try {
    let origin = window.location.origin;
    if (origin && origin !== 'null') {
      if (origin.includes('google.com') || origin.includes('aistudio')) {
        // If embedded in AI Studio editor, use the dev container URL where the current development version runs
        return 'https://ais-dev-chaoxcw555v5jydqucbbqc-335533394889.europe-west3.run.app';
      }
      return origin;
    }
    const protocol = window.location.protocol || 'https:';
    let host = window.location.host || '';
    if (host) {
      if (host.includes('google.com') || host.includes('aistudio')) {
        return 'https://ais-dev-chaoxcw555v5jydqucbbqc-335533394889.europe-west3.run.app';
      }
      return `${protocol}//${host}`;
    }
    // Default fallback to the dev container where they are building/testing the app
    return 'https://ais-dev-chaoxcw555v5jydqucbbqc-335533394889.europe-west3.run.app';
  } catch (e) {
    console.warn("Failed to read window.location.origin safely:", e);
    return 'https://ais-dev-chaoxcw555v5jydqucbbqc-335533394889.europe-west3.run.app';
  }
}

export function safeNavigateTo(url: string, filename?: string) {
  try {
    // Attempt standard location navigation
    window.location.href = url;
  } catch (e) {
    console.warn("Direct window.location.href assignment failed. Trying anchor tag fallback:", e);
    try {
      const link = document.createElement('a');
      link.href = url;
      if (filename) {
        link.setAttribute('download', filename);
      }
      // Use target="_blank" if _self/location is blocked by sandbox top-level navigation
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("All navigation methods failed in sandbox iframe:", err);
    }
  }
}
