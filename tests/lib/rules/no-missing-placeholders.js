/**
 * @fileoverview Disallow missing placeholders in rule report messages
 * @author Teddy Katz
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-missing-placeholders');
const RuleTester = require('eslint').RuleTester;

/**
* Create an error for the given key
* @param {string} missingKey The placeholder that is missing
* @returns {object} An expected error
*/
function error (missingKey) {
  return { type: 'Literal', message: `The placeholder {{${missingKey}}} does not exist.` };
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });
ruleTester.run('no-missing-placeholders', rule, {

  valid: [
    `
      module.exports = {
        create(context) {
          context.report({
            node,
            message: 'foo bar'
          });
        }
      };
    `,
    `
      module.exports = {
        create(context) {
          context.report({
            node,
            message: 'foo {{bar}}',
            data: { bar: 'baz' }
          });
        }
      };
    `,
    `
      module.exports = {
        create(context) {
          context.report({
            node,
            message: 'foo {{bar}}',
            data: { 'bar': 'baz' }
          });
        }
      };
    `,
    `
      module.exports = {
        create(context) {
          context.report({
            node,
            message: 'foo {{bar}}',
            data: { bar }
          });
        }
      };
    `,
    `
      module.exports = {
        create(context) {
          context.report({
            node,
            message: 'foo{{bar}}' + baz
          });
        }
      };
    `,
    `
      module.exports = context => {
        context.report(node, 'foo {{bar}}', { bar: 'baz' });
      };
    `,
    `
      module.exports = context => {
        context.report(node, { line: 1, column: 3 }, 'foo {{bar}}', { bar: 'baz' });
      };
    `,
    `
      module.exports = {
        create(context) {
          context.report({
            node,
            message: 'foo{{ bar }}',
            data: { bar: 'baz' }
          });
        }
      };
    `,
    `
      module.exports = {
        create(context) {
          context.report({
            node,
            message: 'foo{{ bar }}',
            data: baz
          });
        }
      };
    `,
  ],

  invalid: [
    {
      code: `
        module.exports = {
          create(context) {
            context.report({
              node,
              message: 'foo {{bar}}'
            });
          }
        };
      `,
      errors: [error('bar')],
    },
    {
      code: `
        module.exports = {
          create(context) {
            context.report({
              node,
              message: 'foo {{bar}}',
              data: { baz: 'qux' }
            });
          }
        };
      `,
      errors: [error('bar')],
    },
    {
      code: `
        module.exports = {
          create(context) {
            context.report({
              node,
              message: 'foo {{hasOwnProperty}}',
              data: {}
            });
          }
        };
      `,
      errors: [error('hasOwnProperty')],
    },
    {
      code: `
        module.exports = context => {
          context.report(node, 'foo {{bar}}', { baz: 'qux' });
        };
      `,
      errors: [error('bar')],
    },
    {
      code: `
        module.exports = context => {
          context.report(node, { line: 1, column: 3 }, 'foo {{bar}}', { baz: 'baz' });
        };
      `,
      errors: [error('bar')],
    },
    {
      code: `
        module.exports = {
          create(context) {
            context.report({
              node,
              message: 'foo{{ bar }}',
              data: { ' bar ': 'baz' }
            });
          }
        };
      `,
      errors: [error('bar')],
    },
  ],
});
