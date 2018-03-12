#
# Copyright 2017 FileThis, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

SHELL := /bin/bash


# Targets common to both application and element projects
include project-common.make


# Project -----------------------------------------------------------------------------------


# Validate

.PHONY: project-validate-polymerlint
project-validate-polymerlint:  ## Run Polymer linter over project source files
	@polymer lint --input ./src/${NAME}.html;

.PHONY: project-validate-eslint
project-validate-eslint:  ## Run ESLint tool over project source files
	@eslint --ext .html,.js ./src;


# Serve

.PHONY: project-serve-python
project-serve-python:  ## Serve application using Python 2.7
	@echo http:localhost:${LOCAL_PORT}; \
	python -m SimpleHTTPServer ${LOCAL_PORT};

.PHONY: project-serve-ruby
project-serve-ruby:  ## Serve application using Ruby
	@echo http:localhost:${LOCAL_PORT}; \
	@ruby -run -ehttpd . -p${LOCAL_PORT};

.PHONY: project-serve-node
project-serve-node:  ## Serve application using Node "static-server" tool
	@echo http:localhost:${LOCAL_PORT}; \
	@static-server --port ${LOCAL_PORT};

.PHONY: project-serve-php
	@echo http:localhost:${LOCAL_PORT}; \
	@php -S 127.0.0.1:${LOCAL_PORT};

.PHONY: project-serve-browsersync
project-serve-browsersync:  ## Serve application using BrowserSync
	@browser-sync start \
		--config "bs-config.js" \
		--server \
		--port ${LOCAL_PORT};

.PHONY: serve
serve: project-serve-browsersync  ## Shortcut for project-serve-browsersync
	@echo Done;

.PHONY: project-browse-browsersync
project-browse-browsersync:  ## Run BrowserSync, proxied against an already-running local server
	@if lsof -i tcp:${LOCAL_PORT} > /dev/null; then \
		echo Found running Polymer server; \
	else \
		echo No Polymer server running for element demo. Use \"make serve\"; \
		exit 1; \
	fi; \
	browser-sync start \
		--config "bs-config.js" \
		--proxy "http://localhost:${LOCAL_PORT}/${QUERY_STRING}" \
		--port ${LOCAL_PORT} \
		--startPath "/";

.PHONY: project-test-browsersync
project-test-browsersync:  ## Run BrowserSync for tests
	@if lsof -i tcp:${LOCAL_PORT} > /dev/null; then \
		echo Found running Polymer server; \
	else \
		echo No Polymer server running for element demo. Use \"make serve\"; \
		exit 1; \
	fi; \
	browser-sync start \
		--config "bs-config.js" \
		--proxy "http://localhost:${LOCAL_PORT}" \
		--port ${LOCAL_PORT} \
		--startPath "/components/${NAME}/test/" \
		--index "${NAME}_test.html";


# Browse

.PHONY: project-browse
project-browse:  ## Open locally-served app in browser
	@open http:localhost:${LOCAL_PORT};


# Artifacts -----------------------------------------------------------------------------------


# Test before release

.PHONY: artifact-serve-app-locally
artifact-serve-app-locally:  ## Serve application in local build directory using Python 2.7. Useful to check before releasing.
	@echo http:localhost:${LOCAL_PORT}; \
	cd ./build/app && python -m SimpleHTTPServer ${LOCAL_PORT};


# Publish application

.PHONY: artifact-publish-app
artifact-publish-app: artifact-publish-app-versioned artifact-publish-app-latest  ## Release both the versioned and latest application
	@echo Pubished both versioned and latest application

.PHONY: artifact-publish-app-versioned
artifact-publish-app-versioned:  ## Release versioned application
	@aws s3 sync ./build/app s3://connect.filethis.com/${NAME}/${VERSION}/app/; \
	echo https://connect.filethis.com/${NAME}/${VERSION}/app/index.html;

.PHONY: artifact-publish-app-latest
artifact-publish-app-latest:  ## Release latest application
	@aws s3 sync ./build/app s3://connect.filethis.com/${NAME}/latest/app/; \
	echo https://connect.filethis.com/${NAME}/latest/app/index.html;

.PHONY: artifact-invalidate-app-latest
artifact-invalidate-app-latest:  ## Invalidate CDN distribution of latest application
	@if [ -z "${CDN_DISTRIBUTION_ID}" ]; then echo "Cannot invalidate distribution. Define CDN_DISTRIBUTION_ID"; else aws cloudfront create-invalidation --distribution-id ${CDN_DISTRIBUTION_ID} --paths "/${NAME}/latest/app/*"; fi

.PHONY: artifact-publish-app-github-pages
artifact-publish-app-github-pages: build-dist
	@bin_dir="$$(dirname `which gh-pages`)"; \
	parent_dir="$$(dirname $$bin_dir)"; \
	lib_dir=$$parent_dir/lib; \
	rm -rf $$lib_dir/node_modules/gh-pages/.cache; \
	gh-pages \
		--repo https://github.com/${GITHUB_USER}/${NAME}.git \
		--branch gh-pages \
		--silent \
		--dist ./build/es5-bundled; \
	echo Published version ${VERSION} of application \"${NAME}\" to GitHub Pages at https://${GITHUB_USER}.github.io/${NAME};

.PHONY: publish
publish: artifact-publish-app  ## Shortcut for artifact-publish-app
	@echo Published;

.PHONY: invalidate
invalidate: artifact-invalidate-app-latest  ## Shortcut for artifact-invalidate-app-latest
	@echo Invalidated;


# Publications -----------------------------------------------------------------------------------


# Browse published application

.PHONY: publication-browse-app-versioned
publication-browse-app-versioned:  ## Open the published, versioned application in browser
	@open https://connect.filethis.com/${NAME}/${VERSION}/app/index.html;

.PHONY: publication-browse-app-latest
publication-browse-app-latest:  ## Open the published, latest application in browser
	@open https://connect.filethis.com/${NAME}/latest/app/index.html;

.PHONY: publication-browse-app-github-pages
publication-browse-app-github-pages:  ## Open URL of application published on GitHub Pages
	@open https://${GITHUB_USER}.github.io/${NAME}/;


# Print URL of published application

.PHONY: publication-url-app-versioned
publication-url-app-versioned:  ## Print the published, versioned application url
	@echo https://connect.filethis.com/${NAME}/${VERSION}/app/index.html;

.PHONY: publication-url-app-latest
publication-url-app-latest:  ## Print the published, latest application url
	@echo https://connect.filethis.com/${NAME}/latest/app/index.html;

.PHONY: publication-url-app-github-pages
publication-url-app-github-pages:  ## Print URL of application published on GitHub Pages
	@echo https://${GITHUB_USER}.github.io/${NAME}/;


# Browse published docs

.PHONY: publication-browse-docs-github-pages
publication-browse-docs-github-pages:  ## Open URL of application documentation published on GitHub Pages
	@open https://${GITHUB_USER}.github.io/${NAME}/;


# Print URL of published docs

.PHONY: publication-url-docs-github-pages
publication-url-docs-github-pages:  ## Print URL of docs published on GitHub Pages
	@echo https://${GITHUB_USER}.github.io/${NAME}/;


# Bower -----------------------------------------------------------------------------------

.PHONY: bower-register
bower-register:  # Internal target: Register element in public Bower registry. Usually invoked as part of a release via 'release' target.
	@echo TODO: Should Polymer applications be registered in Bower?;


