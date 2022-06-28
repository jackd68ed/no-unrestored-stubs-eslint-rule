/**
 * @fileoverview Disallows Sinon stubs that aren't restored
 * @author Daniel Jack
 */
"use strict";

/**
 * @typedef {{
 *  type: "StubInstance",
 *  node: import("eslint").AST.Token
 *  isRestored: boolean
 * }} StubInstance
 *
 * @typedef {{
 *  type: "Sandbox",
 *  node: import("eslint").AST.Token,
 *  stubs: Array<StubInstance>
 * }} Sandbox
 */

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Disallows Sinon stubs that aren't restored",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    // TODO: Improve this helper.
    const initIsPropertyOfSandbox = (node) => {
      try {
        return (
          node.init.callee.object && node.init.callee.object.name === "sandbox"
        );
      } catch (e) {
        return false;
      }
    };

    // TODO: Improve this helper.
    const initIsPropertyOfSinon = (node) => {
      try {
        return node.init.callee.object.name === "sinon";
      } catch (e) {
        return false;
      }
    };

    const initIsStubFunction = (node) => {
      try {
        return node.init.callee.property.name === "stub";
      } catch (e) {
        return false;
      }
    };

    const isRestore = (node) => {
      try {
        return node.expression.callee.property.name === "restore";
      } catch (e) {
        return false;
      }
    };

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    /** @type {Array<StubInstance | Sandbox>} */
    const unrestoredStubs = [];

    return {
      VariableDeclarator(node) {
        if (
          (initIsPropertyOfSandbox(node) || initIsPropertyOfSinon(node)) &&
          initIsStubFunction(node)
        ) {
          unrestoredStubs.push({
            type: "StubInstance",
            node,
            isRestored: false,
          });

          // TODO: Handle sandboxes
        }
      },

      ExpressionStatement(node) {
        if (isRestore(node)) {
          let stubId;
          try {
            stubId = node.expression.callee.object;

            unrestoredStubs.find(
              (stub) => stub.node.id === stubId
            ).isRestored = true;

            // TODO: If we see a sandbox being restored, mark all of its stubs as restored

            // TODO: If we're calling sandbox.stub but not storing as a variable, add the stub to the sandbox
          } catch (e) {
            // Continue
          }
        }
      },

      onCodePathEnd(codePath, node) {
        if (node.type === "Program") {
          // Report on unrestored stubs
          unrestoredStubs.forEach((stub) => {
            context.report({
              node: stub,
              message: "Stubs must be restored",
            });
          });
        }
      },
    };
  },
};
