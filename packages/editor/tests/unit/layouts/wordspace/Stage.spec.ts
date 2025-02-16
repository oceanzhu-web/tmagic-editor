/*
 * Tencent is pleased to support the open source community by making TMagicEditor available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { mount } from '@vue/test-utils';

import Stage from '@editor/layouts/workspace/Stage.vue';

describe('Stage.vue', () => {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({
      text: () => `<!DOCTYPE html>
          <html lang="en" style="font-size: 100px">
            <head></head>
            <body></body>
          </html>`,
    }),
  );

  const page = {
    type: 'page',
    id: '2',
    items: [
      {
        type: 'text',
        id: '3',
      },
    ],
  };

  const wrapper = mount(Stage as any, {
    props: {
      runtimeUrl: '',
      root: {
        id: '1',
        type: 'app',
        items: [page],
      },

      page,
      node: page,
      uiSelectMode: false,
    },
  });

  it('基础', () => {
    const stage = wrapper.findComponent(Stage);
    expect(stage.exists()).toBe(true);
  });
});
