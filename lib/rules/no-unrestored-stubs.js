/**
 * @fileoverview Disallows Sinon stubs that aren't restored
 * @author Daniel Jack
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

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

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    const unrestoredStubs = [];

    return {
      VariableDeclarator(node) {
        if (!node.declarations || node.declarations.length === 0) return;

        if (
          node.declarations[0].init.callee.object.name === "sinon" &&
          node.declarations[0].init.callee.property.name === "stub"
        ) {
          unrestoredStubs.push(node.id);
        }
      },

      ExpressionStatement(node) {
        if (
          unrestoredStubs.includes(node.expression.callee.object) &&
          node.expression.callee.property.name === "restore"
        ) {
          context.report({
            node,
            message: "Stubs must be restored",
          });
        }
      },

      onCodePathEnd(codePath, node) {
        if (node.type === "Program") {
          // Report on unrestored stubs
          context.report({
            node,
            message: node.type,
          });
        }
      },
    };
  },
};
