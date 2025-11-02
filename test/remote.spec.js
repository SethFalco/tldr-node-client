'use strict';

const assert = require('node:assert/strict')
const { describe, it, afterEach } = require('node:test');
const Cache = require('../lib/cache');
const config = require('../lib/config');
const path = require('path');
const fs = require('fs-extra');
const index = require('../lib/index');
const utils = require('../lib/utils');

describe('Remote', () => {
  describe('update()', () => {
    const TIMEOUT_INTERVAL = 120000; // 2 min timeout for each test case.

    const testCases = [
      {
        description: 'No language specified',
        LANG: ['en'],
        expectedFolders: ['pages'],
      },
      {
        description: '1 Language Specified that doesn\'t exist',
        LANG: ['pt_BB'],
        expectedFolders: ['pages'],
      },
      {
        description: '1 Language Specified that does exist',
        LANG: ['ca'],
        expectedFolders: ['pages', 'pages.ca'],
      },
      {
        description: 'Languages Specified that exist',
        LANG: ['pt', 'pt_BR'],
        expectedFolders: ['pages', 'pages.pt_BR'],
      },
      {
        description: 'Multiple Languages Specified that exist',
        LANG: ['pt_BR', 'pt', 'en', 'hi', 'mo'],
        expectedFolders: ['pages', 'pages.hi', 'pages.pt_BR'],
      },
    ];

    testCases.forEach((testCase) => {
      describe(`${testCase.description}`, () => {
        /** @param {import('node:test').TestContext} t */
        function mockFns(t) {
          t.mock.method(fs, 'ensureDir');
          t.mock.method(fs, 'remove', () => Promise.resolve());
          t.mock.method(fs, 'copy', () => Promise.resolve());
          t.mock.method(utils, 'localeToLang', () => testCase.LANG);
          t.mock.method(index, 'rebuildPagesIndex', () => Promise.resolve());
        }

        let tempFolder;

        it('passes', (t) => {
          mockFns(t);

          const cache = new Cache(config.get());
          return cache.update().then(() => {
            let call = fs.ensureDir.mock.calls[0];
            tempFolder = call.arguments[0];

            // Get the actual cache folders created
            const items = fs.readdirSync(tempFolder);

            // Filter the items to get only the directories
            const presentFolders = items.filter((item) => {
              try {
                return fs.statSync(path.join(tempFolder, item)).isDirectory();
              } catch (err) {
                return false;
              }
            });
            assert.deepEqual(presentFolders, testCase.expectedFolders);
          }).catch((err) => {
            throw err;
          });
        });

        afterEach(async () => {
          await fs.remove(tempFolder);
        });

      });
    });
  });
});
