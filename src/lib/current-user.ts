export type CurrentUser = {
  name: string;
  email: string;
};

/**
 * DUMMY logged-in user — the project has no login system yet.
 *
 * TODO: replace the return value with the real session once authentication
 * exists (e.g. decode the JWT / call `auth()` from your provider). Everything
 * else in the app already reads through this helper, so only this file changes.
 */
export function getCurrentUser(): CurrentUser {
  return {
    name: "BookNook Reader",
    email: "reader@booknook.com",
  };
}
