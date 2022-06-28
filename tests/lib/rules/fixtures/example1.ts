// @ts-nocheck
// tslint:disable: no-unused-expression
import { expect } from "chai";
import { injectable } from "inversify";
import _ from "lodash";
import { LoanStakeholderFactory } from "../../../factories/loan_stakeholder_factories";
import { cleanUpFactoryObjects } from "../../../factories/utils";
import { ILumiTest } from "../../../test";
import LoanStakeholder from "../../../model/loan_stakeholder";
import { LoanStakeholderAccessRole } from "../../../model/interfaces/loan_stakeholder";
import * as sinon from "sinon";
import { promisifyMigrationFunction } from "../../helpers/promisifyMigrationFunction";
import { shouldSkipMigrationTest } from "../../helpers/skip_old_migration_tests";
const {
  up,
  down,
} = require("../1633659320942-add-access-role-to-loan-stakeholders-collection");

/** Runs the migration's `up` function as a Promise */
const promisifiedUp = promisifyMigrationFunction(up);

@injectable()
export default class Test implements ILumiTest {
  isPure = () => false;
  shouldSeedDb = () => false;

  run = () => {
    if (shouldSkipMigrationTest(__filename)) return;

    describe("Add access_role to loan_stakeholders collection schema migration", () => {
      afterEach(async () => {
        await cleanUpFactoryObjects();
      });

      describe("up", () => {
        it("updates key applicant with ADMIN role", async () => {
          const { id: stakeholderId } = await LoanStakeholderFactory.create({
            is_key_applicant: true,
          });

          await promisifiedUp();

          const { access_role } = await LoanStakeholder.findById(stakeholderId);
          expect(access_role).to.eql(LoanStakeholderAccessRole.ADMIN);
        });

        it("updates key applicant who is also the main applicant with ADMIN role", async () => {
          const { id: stakeholderId } = await LoanStakeholderFactory.create({
            is_key_applicant: true,
            is_applicant: true,
          });

          await promisifiedUp();

          const { access_role } = await LoanStakeholder.findById(stakeholderId);
          expect(access_role).to.eql(LoanStakeholderAccessRole.ADMIN);
        });

        it("updates main applicant with VIEWER role", async () => {
          const { id: stakeholderId } = await LoanStakeholderFactory.create({
            is_applicant: true,
          });

          await promisifiedUp();

          const { access_role } = await LoanStakeholder.findById(stakeholderId);
          expect(access_role).to.eql(LoanStakeholderAccessRole.VIEWER);
        });

        it("updates special case main applicant with ADMIN role", async () => {
          const loanStakeholder = {
            is_applicant: true,
            is_key_applicant: false,
            id: "60bf2642c5a0160038e9998c",
          };
          const modelFindStub = sinon
            .stub<any, any>(LoanStakeholder, "find")
            .returns({
              exec: sinon.stub().resolves([]),
            })
            .onSecondCall()
            .returns({
              exec: sinon.stub().resolves([loanStakeholder]),
            });
          const modelBulkwriteStub = sinon
            .stub(LoanStakeholder, "bulkWrite")
            .resolves({ modifiedCount: 1 });

          await promisifiedUp();

          expect(modelBulkwriteStub).to.have.been.calledWithExactly([
            {
              updateOne: {
                filter: { _id: "60bf2642c5a0160038e9998c" },
                update: { $set: { access_role: "ADMIN" } },
              },
            },
          ]);

          modelFindStub.restore();
          modelBulkwriteStub.restore();
        });

        it("with no relevant stakeholders", async () => {
          const modelBulkwriteStub = sinon.stub(LoanStakeholder, "bulkWrite");

          await promisifiedUp();

          expect(modelBulkwriteStub).to.have.callCount(0);
          modelBulkwriteStub.restore();
        });
      });
    });
  };
}
