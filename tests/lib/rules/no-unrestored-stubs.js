/**
 * @fileoverview Disallows Sinon stubs that aren&#39;t restored
 * @author Daniel Jack
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unrestored-stubs");
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-unrestored-stubs", rule, {
  valid: [
    // Restoring the stub directly
    {
      code: /* js */ `
        var myStub = sinon.stub(myObject, "method");
        myStub.restore();
      `.trim(),
    },
    {
      code: /* js */ `
        var myStub = sinon.stub(myObject, "method");

        after(function() {
          myStub.restore();
        })
      `.trim(),
    },
    {
      code: /* js */ `
        var myStub = sinon.stub(myObject, "method");

        afterEach(function() {
          myStub.restore();
        })
      `.trim(),
    },

    // Using a sandbox
    {
      code: /* js */ `
        var sandbox = createSandbox();
        var myStub = sandbox.stub(myObject, "method");

        sandbox.restore();
      `.trim(),
    },
    {
      code: /* js */ `
        var sandbox = createSandbox();
        var myStub = sandbox.stub(myObject, "method");

        after(function() {
          sandbox.restore();
        })
      `.trim(),
    },
    {
      code: /* js */ `
        var sandbox = createSandbox();
        var myStub = sandbox.stub(myObject, "method");

        afterEach(function() {
          sandbox.restore();
        })
      `.trim(),
    },
  ],

  invalid: [
    {
      code: /* js */ `var myStub = sinon.stub(myObject, "method");`,
      errors: [{ message: "Stubs must be restored", type: "Identifier" }],
    },
    {
      code: /* js */ `
        var sandbox = createSandbox();
        var myStub = sandbox.stub(myObject, "method");
      `.trim(),
      errors: [{ message: "Stubs must be restored", type: "Identifier" }],
    },
  ],
});
