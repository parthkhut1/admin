// Form is based on Formik
// Data validation is based on Yup
// Please, be familiar with article first:
// https://hackernoon.com/react-form-validation-with-formik-and-yup-8b76bda62e10
import React, { useMemo, useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import * as actions from '../_redux/sessionsActions';
import { Input, DatePickerField, Switch, Textarea } from '../../../../_metronic/_partials/controls';
import { findTeacher } from '../_redux/sessionsCrud';
import { useSessionsUIContext } from '../SessionsUIContext';

import AsyncSelect from 'react-select/async';
import { attachTagToElement, detachTagToElement, findTags } from '../../../tagService';
import { difference } from 'lodash';
import AddMembersTab from '../components/addMembersTab';
import BookingListTab from '../components/BookingListTab';

import ReactQuill, { Quill } from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import './quillStyle.css';

// #1 import quill-image-uploader
import ImageUploader from 'quill-image-uploader';

// #2 register module
Quill.register('modules/imageUploader', ImageUploader);

const modules = {
  // #3 Add "image" to the toolbar
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ direction: 'rtl' }], // text direction

    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ['clean', 'image', 'video', 'link'],
  ],
  // # 4 Add module and upload function
  imageUploader: {
    upload: async (file) => {
      const bodyFormData = new FormData();
      bodyFormData.append('file', file);
      const response = await axios({
        method: 'post',
        url: '/media',
        data: bodyFormData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.payload.url;
    },
  },
};

export function SessionEditForm({ saveSession, session, actionsLoading, onHide }) {
  const dispatch = useDispatch();
  const sessionsUIContext = useSessionsUIContext();
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);
  const [isCancel, setIsCancel] = useState([]);
  const [value, setValue] = useState('');

  const sessionsUIProps = useMemo(() => {
    return {
      ids: sessionsUIContext.ids,
      setIds: sessionsUIContext.setIds,
      queryParams: sessionsUIContext.queryParams,
    };
  }, [sessionsUIContext]);

  const { user } = useSelector(
    (state) => ({
      user: state.auth.user,
    }),
    shallowEqual
  );

  const filterTeachers = async (inputValue) => {
    const {
      data: {
        payload: { data },
      },
    } = await findTeacher(inputValue);
    return data;
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(filterTeachers(inputValue));
    });

  const filterTags = async (inputValue) => {
    const {
      data: {
        payload: { data },
      },
    } = await findTags(inputValue);
    const newData = data.map((i) => ({ value: i.name, label: i.name }));
    return newData;
  };

  const promiseTagsOptions = (inputValue) =>
    new Promise((resolve) => {
      resolve(filterTags(inputValue));
    });

  useEffect(() => {
    const { id, tags, is_cancelable, description } = session;
    setIsCancel(is_cancelable);
    if (tags?.length !== 0) setTags(() => tags?.map((i) => ({ value: i, label: i })));
    else setTags([]);

    if (id) dispatch(actions.fetchSessionBookingList(id, page));

    if (description) setValue(description);
    else setValue('');
  }, [session]);

  useEffect(() => {
    dispatch(actions.fetchSessionBookingList(session?.id, page));
  }, [page]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={session}
        onSubmit={(values) => {
          const newValues = {
            ...values,
            description: value,
            teacher_id:
              user &&
              user?.roles?.length != 0 &&
              user?.roles?.findIndex((i) => i === 'super-admin') != -1
                ? values?.teacher?.id
                : user?.id,
          };
          saveSession(newValues, sessionsUIProps.queryParams);
        }}
      >
        {({ handleSubmit, values, setFieldValue, setFieldTouched }) => (
          <>
            <Modal.Body className="overlay overlay-block cursor-default">
              {actionsLoading && (
                <div className="overlay-layer bg-transparent" style={{ zIndex: 10 }}>
                  <div className="spinner spinner-lg spinner-success" />
                </div>
              )}
              <Form className="form form-label-right">
                <Tabs defaultActiveKey="createSession" onSelect={(e) => {}}>
                  <Tab eventKey="createSession" title="Create Session">
                    <div className="form-group row" style={{ marginTop: 40 }}>
                      <div className="col-lg-12">
                        <Field
                          type="text"
                          name="name"
                          mandatory={true}
                          component={Input}
                          disableValidation={true}
                          placeholder="Name"
                          label="Name"
                        />
                      </div>
                    </div>
                    {/* <div className="form-group row">
                      <div className="col-lg-12">
                        <Field
                          type="text"
                          name="description"
                          mandatory={true}
                          component={Input}
                          disableValidation={true}
                          placeholder="Description"
                          label="Description"
                        />
                      </div>
                    </div> */}

                    <div className="form-group row">
                      <div className="col-lg-12">
                        <label>Enter Post Text</label>
                        <span style={{ color: 'red', marginBottom: 10 }}> *</span>
                        <ReactQuill
                          theme="snow"
                          value={value}
                          modules={modules}
                          onChange={(content) => setValue(content)}
                          className="ql-editor"
                        />
                      </div>
                    </div>

                    {session?.holder_data?.start_url ? (
                      <div className="form-group row">
                        <div className="col-lg-12">
                          <label>Meeting url:</label>
                          <Button
                            variant="link"
                            onClick={() => {
                              window.open(session?.holder_data?.start_url);
                            }}
                          >
                            Go to meeting
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    <div className="form-group row">
                      <div className="col-lg-4">
                        <Field
                          name="is_free"
                          component={Switch}
                          mandatory={false}
                          label="Paid/Free"
                          checked={values.is_free}
                          onChange={(e) => {
                            const { checked } = e.target;
                            setFieldValue('is_free', checked);
                          }}
                        />
                      </div>
                      <div className="col-lg-4">
                        <Field
                          name="is_private"
                          component={Switch}
                          mandatory={false}
                          label="Normal/Private"
                          checked={values.is_private}
                          onChange={(e) => {
                            const { checked } = e.target;
                            setFieldValue('is_private', checked);
                          }}
                        />
                      </div>
                      {/* <div className="col-lg-4">
                        <Field
                          name="is_cancelable"
                          component={Switch}
                          mandatory={false}
                          label="Is cancelable: No/Yes"
                          disabled={values.canceled_at}
                          checked={values.is_cancelable}
                          onChange={(e) => {
                            const { checked } = e.target;
                            setFieldValue("is_cancelable", checked);
                          }}
                        />
                      </div> */}
                    </div>

                    <div className="form-group row">
                      <div className={values.is_free ? 'col-lg-6' : 'col-lg-4'}>
                        <Field
                          type="number"
                          name="capacity"
                          disableValidation={true}
                          mandatory={true}
                          min="0"
                          component={Input}
                          placeholder="Number of attendees"
                          label="Number of attendees"
                        />
                      </div>
                      <div className={values.is_free ? 'col-lg-6' : 'col-lg-4'}>
                        <Field
                          type="number"
                          disableValidation={true}
                          name="duration"
                          component={Input}
                          min="0"
                          mandatory={true}
                          placeholder="Duration (minute)"
                          label="Duration (minute)"
                        />
                      </div>
                      {!values.is_free && (
                        <div className="col-lg-4">
                          <Field
                            type="number"
                            name="price"
                            disableValidation={true}
                            min="1"
                            component={Input}
                            mandatory={true}
                            placeholder="Price($)"
                            label="Price($)"
                          />
                        </div>
                      )}
                    </div>

                    <div className="form-group row">
                      <div className="col-lg-5">
                        <DatePickerField
                          name="registration_from"
                          label="Start registration"
                          value={`${format(
                            new Date(values.registration_from),
                            'yyyy-MM-dd'
                          )}  ,  ${format(new Date(values.registration_from), 'HH:mm')}`}
                          captionHide={true}
                          sendDate={(date) => {
                            // console.log("date", date);
                          }}
                          minDate={new Date()}
                          mandatory={true}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="time"
                          dateFormat="yyyy-MM-dd HH:mm"
                        />
                      </div>
                      <div className="col-lg-5">
                        <DatePickerField
                          name="registration_till"
                          label="End registration"
                          value={`${format(
                            new Date(values.registration_till),
                            'yyyy-MM-dd'
                          )}  ,  ${format(new Date(values.registration_till), 'HH:mm')}`}
                          captionHide={true}
                          sendDate={(date) => {
                            // console.log("date", date);
                          }}
                          // minDate={new Date()}
                          minDate={new Date(values.registration_from)}
                          mandatory={true}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="time"
                          dateFormat="yyyy-MM-dd HH:mm"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-5">
                        <DatePickerField
                          name="started_at"
                          label="Meeting start time"
                          value={`${format(new Date(values.started_at), 'yyyy-MM-dd')}  ,  ${format(
                            new Date(values.started_at),
                            'HH:mm'
                          )}`}
                          captionHide={true}
                          sendDate={(date) => {
                            // console.log("date", date);
                          }}
                          mandatory={true}
                          minDate={new Date(values.registration_till)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          timeCaption="time"
                          dateFormat="yyyy-MM-dd HH:mm"
                        />
                      </div>

                      {user &&
                        user?.roles?.length != 0 &&
                        user?.roles?.findIndex((i) => i === 'super-admin') != -1 && (
                          <div className="col-lg-7">
                            <label>
                              Teacher<span style={{ color: 'red' }}> *</span>
                            </label>
                            <br />
                            <AsyncSelect
                              // isMulti
                              name="teacher"
                              cacheOptions
                              defaultOptions
                              loadOptions={promiseOptions}
                              getOptionLabel={(option) =>
                                `${option?.name ? option?.name : ''}  ${
                                  option?.email ? `(${option?.email})` : ''
                                }`
                              }
                              getOptionValue={(option) => option.id}
                              value={values.teacher}
                              onChange={(value) => {
                                setFieldValue('teacher', value);
                              }}
                              onBlur={() => setFieldTouched('teacher', true)}
                            />
                          </div>
                        )}
                    </div>

                    {!(
                      user &&
                      user?.roles?.length != 0 &&
                      user?.roles?.findIndex((i) => i === 'teacher') != -1
                    ) && values.id ? (
                      <div className="form-group row">
                        <div className="col-lg-12">
                          <label>Tags</label>
                          <br />
                          <AsyncSelect
                            isMulti
                            name="tags"
                            isClearable={false}
                            cacheOptions
                            defaultOptions
                            loadOptions={promiseTagsOptions}
                            getOptionLabel={(option) => `${option?.label ? option?.label : ''}`}
                            getOptionValue={(option) => option.value}
                            value={tags}
                            onChange={(value) => {
                              const deletedTag = difference(tags, value);
                              setTags(value);
                              if (deletedTag.length != 0)
                                detachTagToElement(
                                  deletedTag.pop()?.label,
                                  'sessions',
                                  values.id
                                ).then((res) => {
                                  dispatch(
                                    actions.fetchSessions({
                                      ...sessionsUIProps.queryParams,
                                      isTeacher:
                                        user &&
                                        user?.roles?.length != 0 &&
                                        user?.roles?.findIndex((i) => i === 'teacher') != -1,
                                    })
                                  );
                                });
                              else
                                attachTagToElement(
                                  value[value.length - 1].label,
                                  'sessions',
                                  values.id
                                ).then((res) => {
                                  dispatch(
                                    actions.fetchSessions({
                                      ...sessionsUIProps.queryParams,
                                      isTeacher:
                                        user &&
                                        user?.roles?.length != 0 &&
                                        user?.roles?.findIndex((i) => i === 'teacher') != -1,
                                    })
                                  );
                                });
                            }}
                            onBlur={() => setFieldTouched('tags', true)}
                          />
                        </div>
                      </div>
                    ) : (
                      'For adding tags, please first click on save button'
                    )}
                  </Tab>
                  <Tab
                    eventKey="bookingListTab"
                    title="Booking List"
                    disabled={values.id ? false : true}
                  >
                    <BookingListTab setPage={setPage} />
                  </Tab>
                  {values.is_private ? (
                    <Tab
                      eventKey="addMembers"
                      title="Add Members"
                      disabled={values.id ? false : true}
                    >
                      <AddMembersTab sessionId={values.id} />
                    </Tab>
                  ) : null}
                </Tabs>
              </Form>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'space-between' }}>
              <div>
                {values.id && isCancel ? (
                  <button
                    type="button"
                    onClick={() => dispatch(actions.sessionCancellation(values.id))}
                    className={`btn btn-${
                      !values.canceled_at ? 'danger' : 'secondary'
                    } btn-elevate`}
                    disabled={values.canceled_at}
                  >
                    {!values.canceled_at ? 'Cancel Session' : 'Canceled'}
                  </button>
                ) : null}
              </div>
              <div>
                <button
                  type="button"
                  onClick={onHide}
                  className="btn btn-light btn-elevate"
                  disabled={actionsLoading}
                >
                  Close
                </button>
                <> </>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="btn btn-primary btn-elevate"
                  disabled={actionsLoading}
                >
                  Save
                </button>
              </div>
            </Modal.Footer>
          </>
        )}
      </Formik>
    </>
  );
}
