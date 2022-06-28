/**
 * @fileoverview Disallows Sinon stubs that aren&#39;t restored
 * @author Daniel Jack
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const fs = require("fs");
const path = require("path");

const rule = require("../../../lib/rules/no-unrestored-stubs");
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const example1 = fs.readFileSync(
  path.join(__dirname, "fixtures/example1.ts"),
  "utf8"
);

const ruleTester = new RuleTester({
  // eslint-disable-next-line node/no-unpublished-require
  parser: require.resolve("@typescript-eslint/parser"),
});

ruleTester.run("no-unrestored-stubs", rule, {
  valid: [
    // Restoring the stub directly
    {
      code: /* typescript */ `
        const myStub = sinon.stub(myObject, "method");
        myStub.restore();
      `.trim(),
    },
    {
      code: /* typescript */ `
        const myStub = sinon.stub(myObject, "method");

        after(() => {
          myStub.restore();
        })
      `.trim(),
    },
    {
      code: /* typescript */ `
        const myStub = sinon.stub(myObject, "method");

        afterEach(() => {
          myStub.restore();
        })
      `.trim(),
    },
    {
      code: /* typescript */ `
        const myStub = sinon.stub(myObject, "method");

        beforeEach(() => {
          myStub.reset();
          myStub.resolves({});
        });

        afterEach(() => {
          myStub.restore();
        })
      `.trim(),
    },
    {
      code: /* typescript */ `
        const myStub = sinon.stub(myObject, "method");
        myStub.reset();
        myStub.callsFake(() => {});

        myStub.restore();
      `.trim(),
    },

    // Using a sandbox
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
      `.trim(),
    },
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
        const myStub = sandbox.stub(myObject, "method");

        sandbox.restore();
      `.trim(),
    },
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
        const myStub = sandbox.stub(myObject, "method");

        after(() => {
          sandbox.restore();
        })
      `.trim(),
    },
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
        const myStub = sandbox.stub(myObject, "method");

        afterEach(() => {
          sandbox.restore();
        })
      `.trim(),
    },

    // Fixture files
    {
      code: example1,
      name: "Fixture: example1",
    },
  ],

  invalid: [
    {
      code: /* typescript */ `const myStub = sinon.stub(myObject, "method");`,
      errors: [
        {
          message: "Stubs must be restored",
          type: "Identifier",
          line: 1,
          column: 7,
        },
      ],
    },
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
        const myStub = sandbox.stub(myObject, "method");
      `.trim(),
      errors: [
        {
          message: "Stubs must be restored",
          type: "Identifier",
          line: 2,
          column: 32,
        },
      ],
    },
  ],
});
