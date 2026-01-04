import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // hooks.server.ts でセッションが検証され、locals.user に格納される
    if (!locals.user) {
        // 未認証のユーザーはログインページにリダイレクト
        throw redirect(307, '/login');
    }
};
