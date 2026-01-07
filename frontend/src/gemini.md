## 内容
テストを修正して。
frontend\vite.config.ts　の設定はいじらないで。テストファイルのみ。すでに通過しているテストはそのままにして。触らないで。
## エラー内容

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Suites 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL   client  src/routes/(auth)/layout.svelte.spec.ts [ src/routes/(auth)/layout.svelte.spec.ts ]
Error: vitest/browser can be imported only inside the Browser Mode. Your test is running in forks pool. Make sure your regular tests are excluded from the "test.include" glob pattern.
 ❯ ../../../../../KENTO%20OSAWA/OneDrive/Desktop/SvelteFullStack2/frontend/node_modules/vitest/browser/context.js:14:7
 ❯ node_modules/vitest-browser-svelte/src/index.js:1:1
      1| import { page } from 'vitest/browser'
       | ^
      2| import { beforeEach } from 'vitest'
      3| import { cleanup, render } from './pure.js'

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/4]⎯

 FAIL   client  src/routes/(auth)/signup/page.svelte.spec.ts [ src/routes/(auth)/signup/page.svelte.spec.ts ]
Error: vitest/browser can be imported only inside the Browser Mode. Your test is running in forks pool. Make sure your regular tests are excluded from the "test.include" glob pattern.
 ❯ ../../../../../KENTO%20OSAWA/OneDrive/Desktop/SvelteFullStack2/frontend/node_modules/vitest/browser/context.js:14:7
 ❯ src/routes/(auth)/signup/page.svelte.spec.ts:2:31
      1| import { page } from 'vitest/browser';
      2| import { describe, expect, it } from 'vitest';
       |                               ^
      3| import { render } from 'vitest-browser-svelte';
      4| import Page from './+page.svelte';

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/4]⎯


⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL   server  src/routes/(auth)/signup/page.server.spec.ts > /signup actions >
 should create a user and redirect to / on successful signup
TypeError: Cannot read properties of undefined (reading 'value')
 ❯ src/routes/(auth)/signup/page.server.spec.ts:56:41
     54|     vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password');       
     55|     // Mock the .returning() value
     56|     vi.mocked(db.insert.mock.results[0].value.values).mockReturnValue({
       |                                         ^
     57|         returning: vi.fn().mockResolvedValue([{ id: 'newUser123' }])   
     58|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/4]⎯

 FAIL   server  src/routes/(auth)/signup/page.server.spec.ts > /signup actions >
 should fail if the user already exists
TypeError: Cannot read properties of undefined (reading 'value')
 ❯ src/routes/(auth)/signup/page.server.spec.ts:102:41
    100|     vi.mocked(bcrypt.hash).mockResolvedValue('hashed_password');       
    101|     // Simulate a database error (like a unique constraint violation)  
    102|     vi.mocked(db.insert.mock.results[0].value.values).mockReturnValue({
       |                                         ^
    103|         returning: vi.fn().mockRejectedValue(new Error('UNIQUE constra…
    104|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/4]⎯


 Test Files  3 failed | 3 passed (6)
      Tests  2 failed | 13 passed (15)
   Start at  14:04:42
   Duration  2.86s (transform 3.13s, setup 0ms, import 1.63s, tests 224ms, environment 4ms)

PS C:\Users\KENTO OSAWA\OneDrive\Desktop\SvelteFullStack2\frontend\src> 