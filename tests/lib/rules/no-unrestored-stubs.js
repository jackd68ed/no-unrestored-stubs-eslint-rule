/**
 * @fileoverview Disallows Sinon stubs that aren&#39;t restored
 * @author Daniel Jack
 */
"use strict";

const rule = require("../../../lib/rules/no-unrestored-stubs");
const RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  // eslint-disable-next-line node/no-unpublished-require
  parser: require.resolve("@typescript-eslint/parser"),
});

ruleTester.run("no-unrestored-stubs", rule, {
  valid: [
    // Restoring the stub/mock directly
    {
      code: /* typescript */ `
        const myStub = sinon.stub(myObject, "method");
        myStub.restore();
      `.trim(),
    },
    {
      code: /* typescript */ `
        const myStub = Sinon.stub(myObject, "method");
        myStub.restore();
      `.trim(),
    },
    {
      code: /* typescript */ `
        const myMock = sinon.mock(myObject);
        myMock.restore();
      `.trim(),
    },
    {
      code: /* typescript */ `
        const myMock = Sinon.mock(myObject);
        myMock.restore();
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
        const myMock = sinon.mock(myObject);

        after(() => {
          myMock.restore();
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
        const myMock = sinon.mock(myObject);

        afterEach(() => {
          myMock.restore();
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
        const myMock = sinon.mock(myObject);

        beforeEach(() => {
          myMock.reset();
          myMock.resolves({});
        });

        afterEach(() => {
          myMock.restore();
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
    {
      code: /* typescript */ `
        const myMock = sinon.mock(myObject);
        myMock.reset();
        myMock.callsFake(() => {});

        myMock.restore();
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
        const myMock = sandbox.mock(myObject);

        sandbox.restore();
      `.trim(),
    },
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
        const myMock = sandbox.mock(myObject);

        sandbox.verifyAndRestore();
      `.trim(),
    },
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
        sandbox.mock(myObject);

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
        const myMock = sandbox.mock(myObject);

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
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
        const myMock = sandbox.mock(myObject);

        afterEach(() => {
          sandbox.restore();
        })
      `.trim(),
    },

    // Calling stub/mock with no args
    {
      code: /* typescript */ `const myStub = sinon.stub()`,
    },
    {
      code: /* typescript */ `const myMock = sinon.mock()`,
    },
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
        const myStub = sandbox.stub();
      `.trim(),
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
      code: /* typescript */ `const myStub = Sinon.stub(myObject, "method");`,
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
      code: /* typescript */ `const myMock = sinon.mock(myObject);`,
      errors: [
        {
          message: "Mocks must be restored",
          type: "Identifier",
          line: 1,
          column: 7,
        },
      ],
    },
    {
      code: /* typescript */ `const myMock = Sinon.mock(myObject);`,
      errors: [
        {
          message: "Mocks must be restored",
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
    {
      code: /* typescript */ `
        const sandbox = createSandbox();
        const myMock = sandbox.mock(myObject);
      `.trim(),
      errors: [
        {
          message: "Mocks must be restored",
          type: "Identifier",
          line: 2,
          column: 32,
        },
      ],
    },
  ],
});
