import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// サインアウトページへの直接アクセスを防ぎ、常にリダイレクトする
export const load: PageServerLoad = async () => {
    throw redirect(303, '/login');
};

export const actions: Actions = {
    default: async ({ cookies }) => {
        // セッションクッキーを削除
        cookies.delete('session_id', { path: '/' });

        // ログインページにリダイレクト
        throw redirect(303, '/login');
    }
};
