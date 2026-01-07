import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  // hooks.server.ts から渡された user 情報と token を返す
  return {
    user: locals.user,
    token: locals.token
  };
};
