/**
 * @fileoverview Disallows Sinon stubs that aren't restored
 * @author Daniel Jack
 */
"use strict";

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
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------
    // TODO: Improve this helper - don't rely on the variable name
    const isSandbox = (node) => {
      try {
        return node.id.name === "sandbox";
      } catch (e) {
        return false;
      }
    };

    // TODO: Improve this helper - don't rely on sinon being imported as "sinon"
    const initIsPropertyOfSinon = (node) => {
      try {
        return node.init.callee.object.name.toLowerCase() === "sinon";
      } catch (e) {
        return false;
      }
    };

    // TODO: Support the stub being destructured from the sinon import
    // e.g. import { stub } from "sinon";
    const initIsStubFunction = (node) => {
      try {
        const isStub = node.init.callee.property.name === "stub";
        const isCalledWithArgs = node.init.arguments.length > 0;

        // If .stub is called without args, we're just creating a new stub
        // instance, not replacing a real method.
        return isStub && isCalledWithArgs;
      } catch (e) {
        return false;
      }
    };

    // TODO: Support the stub being destructured from the sinon import
    // e.g. import { stub } from "sinon";
    const initIsMockFunction = (node) => {
      try {
        const isMock = node.init.callee.property.name === "mock";
        const isCalledWithArgs = node.init.arguments.length > 0;

        // If .mock is called without args, we're just creating a new mock
        // instance, not replacing a real object.
        return isMock && isCalledWithArgs;
      } catch (e) {
        return false;
      }
    };

    const isCallToStubOnVariableReference = (ref) => {
      try {
        const isStub = ref.identifier.parent.property.name === "stub";
        const isCalledWithArgs =
          ref.identifier.parent.parent.arguments.length > 0;

        return isStub && isCalledWithArgs;
      } catch (e) {
        return false;
      }
    };

    const isCallToMockOnVariableReference = (ref) => {
      try {
        const isMock = ref.identifier.parent.property.name === "mock";
        const isCalledWithArgs =
          ref.identifier.parent.parent.arguments.length > 0;

        return isMock && isCalledWithArgs;
      } catch (e) {
        return false;
      }
    };

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
        }

        if (initIsPropertyOfSinon(node) && initIsMockFunction(node)) {
          const declaredVariables = context.getDeclaredVariables(node);

          declaredVariables.forEach((variable) => {
            if (!restoreIsCalled(variable)) {
              context.report({
                node: variable.identifiers[0],
                message: "Mocks must be restored",
              });
            }
          });
        }

        // Report on each call to sandbox.stub where sandbox.restore is never
        // called.
        if (isSandbox(node)) {
          const declaredVariables = context.getDeclaredVariables(node);

          declaredVariables.forEach((variable) => {
            if (restoreIsCalled(variable)) return;

            variable.references.forEach((ref) => {
              if (isCallToStubOnVariableReference(ref)) {
                context.report({
                  node: ref.identifier.parent.property,
                  message: "Stubs must be restored",
                });
              }

              if (isCallToMockOnVariableReference(ref)) {
                context.report({
                  node: ref.identifier.parent.property,
                  message: "Mocks must be restored",
                });
              }
            });
          });
        }
      },
    };
  },
};
