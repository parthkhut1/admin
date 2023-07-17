import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import SnackbarUtils from "../../../notistack";
import { Formik, Form, Field } from "formik";
import Alert from "@material-ui/lab/Alert";
import produce from "immer";

import AsyncSelect from "react-select/async";
import {
  attachTagToElement,
  detachTagToElement,
  findTags,
} from "../../../tagService";
import { difference } from "lodash";
import Collapse from "@material-ui/core/Collapse";

import {
  Input,
  Select,
  Switch,
  DatePickerField,
} from "../../../../_metronic/_partials/controls";
import CoursesTable from "./CoursesTable";
import * as actions from "../_redux/packagesActions";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

export default function AddAssistantsTab({
  packageId,
  sendRules,
  commigAssis,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [rules, setRules] = useState([]);

  // packages Redux state
  const dispatch = useDispatch();
  const { assistantsScopes } = useSelector(
    (state) => ({
      assistantsScopes: state.packages.assistantsScopes,
    }),
    shallowEqual
  );
  useEffect(() => {
    sendRules(rules);
  }, [rules]);

  // useEffect(() => {
  //   console.log("commigAssis", commigAssis);
  // }, [commigAssis]);

  return (
    <>
      <div className="form-group row" style={{ marginTop: 40 }}>
        <div className="col-lg-12">
          <label style={{ fontWeight: 600 }}>Select Assistants</label>
          <br />

          <Alert severity="warning">
            Attention! Please consider that you are able to set this configs
            only during the package creation and it could not be changed in the
            updating process.
          </Alert>

          <br />

          <div style={{ marginBottom: 40 }}></div>

          <SimpleAssistant
            packageId={packageId}
            commigAssis={commigAssis}
            sendRules={(rule) =>
              setRules((prev) => {
                if (prev) return [...rule, ...prev];
                else return [...rule];
              })
            }
          />

          {/* {assistantsScopes?.map((i) => (
            <Assistant
              commigAssis={commigAssis}
              packageId={packageId}
              assis={i}
              sendRule={(rule, selectAssis) => {
                if (!rule.scope_id) return;
                else
                  setRules((prev) => {
                    const existRuleIndex = prev.findIndex(
                      (i) => i.scope_id == rule.scope_id
                    );

                    if (selectAssis) {
                      if (existRuleIndex == -1) return [rule, ...prev];
                      else {
                        const newPrev = [...prev];
                        newPrev[existRuleIndex] = rule;
                        return newPrev;
                      }
                    } else {
                      if (existRuleIndex == -1) return [...prev];
                      else {
                        const newPrev = [...prev];
                        newPrev.splice(existRuleIndex, 1); // remove item.
                        return newPrev;
                      }
                    }
                  });
              }}
            />
          ))} */}
        </div>
      </div>
    </>
  );
}

const Assistant = ({ assis, sendRule, packageId, commigAssis }) => {
  const [selectAssis, setSelectAssis] = useState(false);
  const [id, setId] = useState();

  const [isUnlimited, setIsUnlimited] = useState(false);
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    const rule = {
      scope_id: id,
      logic: "pay",
      is_unlimited: isUnlimited,
      limit: +limit,
    };
    sendRule(rule, selectAssis);
  }, [id, isUnlimited, limit, selectAssis]);

  return (
    <div className="form-group row">
      <div className="col-lg-12">
        <Field
          name="assistant"
          component={Switch}
          label={`${assis.name}: No/Yes`}
          disabled={packageId}
          checked={
            !packageId
              ? selectAssis
              : commigAssis.find((i) => i.scope.id == assis.id)
          }
          onChange={(e) => {
            const { checked } = e.target;
            setSelectAssis(checked);
            setId(assis.id);
          }}
        />
      </div>
      <div className="col-lg-12" style={{ paddingLeft: "25%" }}>
        <Collapse
          in={
            !packageId
              ? selectAssis && id == assis.id
              : commigAssis.find((i) => i.scope.id == assis.id)
          }
          timeout="auto"
          unmountOnExit
        >
          <div className="form-group row">
            <div className="col-lg-4">
              <Field
                name="isUnlimited"
                component={Switch}
                label="Is Unlimited: No/Yes"
                disabled={packageId}
                checked={
                  !packageId
                    ? isUnlimited
                    : commigAssis.find((i) => i.scope.id == assis.id)
                        ?.is_unlimited
                }
                onChange={(e) => {
                  const { checked } = e.target;
                  setIsUnlimited(checked);
                }}
              />
            </div>
            {(!packageId ? (
              isUnlimited
            ) : (
              commigAssis.find((i) => i.scope.id == assis.id)?.is_unlimited
            )) ? null : (
              <div className="col-lg-4">
                <Field
                  type="number"
                  name="limit"
                  disableValidation={true}
                  min="1"
                  disabled={packageId}
                  component={Input}
                  placeholder="Limit count"
                  label="Limit count"
                  onChange={(e) => {
                    const { value } = e.target;
                    setLimit(value);
                  }}
                  value={
                    !packageId
                      ? limit
                      : commigAssis.find((i) => i.scope.id == assis.id)?.limit
                  }
                />
              </div>
            )}
          </div>
        </Collapse>
      </div>
    </div>
  );
};

const SimpleAssistant = ({ sendRules, packageId, commigAssis }) => {
  const [limit1, setLimit1] = useState({
    scope_id: 2,
    logic: "pay",
    limit: 0,
    is_unlimited: false,
  });
  const [limit2, setLimit2] = useState({
    scope_id: 5,
    logic: "pay",
    limit: 0,
    is_unlimited: false,
  });
  const [limit3, setLimit3] = useState({
    scope_id: 6,
    logic: "pay",
    limit: 0,
    is_unlimited: false,
  });
  useEffect(() => {
    sendRules([limit1, limit2, limit3]);
  }, [limit1, limit2, limit3]);

  return (
    <>
      <div className="form-group row">
        <div className="col-lg-8">
          <Field
            type="number"
            name="limitation"
            disableValidation={true}
            min="-1"
            component={Input}
            disabled={packageId}
            placeholder="Writing Corrections - SST, SWT, WE Limitation"
            label="Writing Corrections - SST, SWT, WE Limitation. (-1 means unlimited)"
            onChange={(e) => {
              const { value } = e.target;
              setLimit1({
                scope_id: 2,
                logic: "pay",
                limit: +value,
                is_unlimited: value == -1,
              });
            }}
            value={
              !packageId
                ? limit1.limit
                : commigAssis.find((i) => i.scope.id == 2)?.limit
            }
          />
        </div>
      </div>

      <div className="form-group row">
        <div className="col-lg-8">
          <Field
            type="number"
            name="limitation"
            disableValidation={true}
            min="-1"
            component={Input}
            disabled={packageId}
            placeholder="One-on-One Tutorial Limitation"
            label="One-on-One Tutorial Limitation. (-1 means unlimited)"
            onChange={(e) => {
              const { value } = e.target;
              setLimit2({
                scope_id: 5,
                logic: "pay",
                limit: +value,
                is_unlimited: value == -1,
              });
            }}
            value={
              !packageId
                ? limit2.limit
                : commigAssis.find((i) => i.scope.id == 5)?.limit
            }
          />
        </div>
      </div>

      <div className="form-group row">
        <div className="col-lg-8">
          <Field
            type="number"
            name="limitation"
            disableValidation={true}
            min="-1"
            component={Input}
            disabled={packageId}
            placeholder="Speaking Feedback Limitation"
            label="Speaking Feedback Limitation. (-1 means unlimited)"
            onChange={(e) => {
              const { value } = e.target;
              setLimit3({
                scope_id: 6,
                logic: "pay",
                limit: +value,
                is_unlimited: value == -1,
              });
            }}
            value={
              !packageId
                ? limit3.limit
                : commigAssis.find((i) => i.scope.id == 6)?.limit
            }
          />
        </div>
      </div>
    </>
  );
};
