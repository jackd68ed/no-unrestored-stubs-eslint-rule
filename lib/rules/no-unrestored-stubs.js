/**
 * @fileoverview Disallows Sinon stubs that aren't restored
 * @author Daniel Jack
 */
"use strict";

/**
 * @typedef {{
 *  type: "StubInstance",
 *  node: import("eslint").AST.Token
 *  hash: string
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

    // const isRestore = (node) => {
    //   try {
    //     return node.expression.callee.property.name === "restore";
    //   } catch (e) {
    //     return false;
    //   }
    // };

    const restoreIsCalled = (variable) =>
      variable.references.some((ref) => {
        try {
          // TODO: This just checks that we access the restore property, not that we call it
          return ref.identifier.parent.property.name === "restore";
        } catch (e) {
          return false;
        }
      });

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------
    return {
      VariableDeclarator(node) {
        if (initIsPropertyOfSinon(node) && initIsStubFunction(node)) {
          const declaredVariables = context.getDeclaredVariables(node);

          declaredVariables.forEach((variable) => {
            if (!restoreIsCalled(variable)) {
              context.report({
                node: variable.identifiers[0],
                message: "Stubs must be restored",
              });
            }
          });

          // TODO: Handle sandboxes
        }

        if (initIsPropertyOfSandbox(node) && initIsStubFunction(node)) {
          const declaredSandboxVariables = context.getDeclaredVariables(
            node.init.callee
          );
          console.log({ node, declaredSandboxVariables });
        }
      },

      ExpressionStatement() {
        // Do we need this?
      },

      onCodePathEnd() {
        // Do we need this?
      },
    };
  },
};
