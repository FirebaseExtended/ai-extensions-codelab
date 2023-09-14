/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
		  config.resolve.fallback.fs = false
		  config.resolve.fallback.child_process = false
		  config.resolve.fallback.request = false
		  config.resolve.fallback.net = false
		  config.resolve.fallback.worker_threads = false
		  config.resolve.fallback.tls = false
		}
		return config
	  }
};

module.exports = nextConfig;
