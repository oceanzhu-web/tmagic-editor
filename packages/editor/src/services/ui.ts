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

import { reactive, toRaw } from 'vue';

import type StageCore from '@tmagic/stage';

import editorService from '@editor/services/editor';
import { GetColumnWidth, SetColumnWidth, UiState } from '@editor/type';

import BaseService from './BaseService';

const state = reactive<UiState>({
  uiSelectMode: false,
  showSrc: false,
  zoom: 1,
  stageStyle: {},
  columnWidth: {
    left: 310,
    center: globalThis.document.body.clientWidth - 310 - 400,
    right: 400,
  },
  showGuides: true,
  showRule: true,
});

class Ui extends BaseService {
  constructor() {
    super([]);
    globalThis.addEventListener('resize', () => {
      this.setColumnWidth({
        center: 'auto',
      });
    });
  }

  public set<T = any>(name: keyof UiState, value: T) {
    const mask = editorService.get<StageCore>('stage')?.mask;

    if (name === 'columnWidth') {
      this.setColumnWidth(value as unknown as SetColumnWidth);
      return;
    }

    if (name === 'showGuides') {
      mask?.showGuides(value as unknown as boolean);
    }

    if (name === 'showRule') {
      mask?.showRule(value as unknown as boolean);
    }

    (state as any)[name] = value;
  }

  public get<T>(name: keyof typeof state): T {
    return (state as any)[name];
  }

  private setColumnWidth({ left, center, right }: SetColumnWidth) {
    const columnWidth = {
      ...toRaw(this.get<GetColumnWidth>('columnWidth')),
    };

    if (left) {
      columnWidth.left = left;
    }

    if (right) {
      columnWidth.right = right;
    }

    if (!center || center === 'auto') {
      const bodyWidth = globalThis.document.body.clientWidth;
      columnWidth.center = bodyWidth - (columnWidth?.left || 0) - (columnWidth?.right || 0);
    } else {
      columnWidth.center = center;
    }

    state.columnWidth = columnWidth;
  }
}

export type UiService = Ui;

export default new Ui();
