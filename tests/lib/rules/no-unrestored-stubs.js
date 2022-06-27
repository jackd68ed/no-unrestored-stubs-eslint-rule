/**
 * @fileoverview Disallows Sinon stubs that aren&#39;t restored
 * @author Daniel Jack
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/no-unrestored-stubs"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("no-unrestored-stubs", rule, {
  valid: [
    // give me some code that won't trigger a warning
    {
      code: "const myStub = sinon.stub(myObject, \"method\")\nmyStub.restore()",
      errors: [{ message: "Stubs must be restored", type: "problem" }],
    },
  ],

  invalid: [
    {
      code: "const myStub = sinon.stub(myObject, \"method\")",
      errors: [{ message: "Stubs must be restored", type: "problem" }],
    },
  ],
});
