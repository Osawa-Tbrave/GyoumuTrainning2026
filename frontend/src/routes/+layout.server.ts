import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  console.log('+layout.server.ts: locals.user is', locals.user);
  // hooks.server.ts から渡された user 情報を返す
  return {
    user: locals.user
  };
};
