// Copyright 2021 manufosela
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import {
  terser,
} from 'rollup-plugin-terser';

export default {
  preserveSymlinks: true,
	input: ['board-cell.js'],
	output: {
		file: 'dist/board-cell.js',
    format: 'es',
		sourcemap: true
	},
	plugins: [
    resolve(),
    babel(),
    terser({
      output: {
        comments: false,
      },
    }),
  ]
};