import moment from 'moment';
import React, {
  useContext,
  Fragment,
  useState,
  useEffect,
  useReducer,
} from 'react';

import { FlexRow } from 'ui/flex';
import { ListeningSignal, BlinkTextLoader } from 'ui/icons/loading-icon';

import * as app from 'app/app.state';
import { LS_KEY } from 'app/app.constant';
import { AuthContext } from 'app/app.context';

import { Empty } from './view-email.component';
import { LS } from 'helper/local-storage-helper';
import { ApiResponse, Email } from 'api/api.type';

interface EmailListProps {
  loading: boolean;
  emails: Email[];
  createEmail: (param: boolean) => void;
  viewEmailById: (param: string) => void;
}

const SavedEmailList = () => {
  const [deleted, setDeleted] = useState<boolean>(false);
  const [emails, setEmails] = useState<string[]>([]);
  const { email, setCurrentAuth } = useContext(AuthContext);
  const [authState, dispatch] = useReducer(app.reducer, app.initialState);

  const getEmails = () => {
    const { data, error } = LS.get(LS_KEY.EMAILS);

    if (error) throw error;

    setEmails(data);
  };

  const switchAuth = (email: string) => {
    dispatch({
      type: app.SIGN_IN_SUCCESS,
      payload: { email },
    });
  };

  const removeEmail = (email: string) => {
    const { data }: ApiResponse = LS.get(LS_KEY.EMAILS);
    const emails = data.filter((e: string) => e !== email);

    LS.set(LS_KEY.EMAILS, emails);
    setDeleted(!deleted);
  };

  useEffect(() => {
    getEmails();
    if (authState.isAuthenticated) setCurrentAuth(authState);
  }, [authState, setCurrentAuth, email, deleted]);

  return (
    <div className='user-tool'>
      <i className='dot bg-success' />
      <button className='bold p user-tool-btn'>
        <span className='d-inline text-primary'>{email}</span>

        <i className='icon ion-ios-arrow-down ml-2 text-primary' />
        <div className='dropdown text-muted'>
          {emails.map((emailId, key) => (
            <div
              key={key}
              className='d-flex align-items-baseline justify-content-between'
            >
              <div
                role='button'
                className='list shake'
                onClick={() => switchAuth(emailId)}
              >
                <i className='icon ion-md-mail mr-2 m-0 d-inline-block' />
                {emailId}
              </div>
              {emailId !== email && (
                <i
                  role='button'
                  title='Delete'
                  onClick={() => removeEmail(emailId)}
                  className='icon ion-md-trash m-0 d-inline-block pr-3 pl-2 delete-email'
                />
              )}
            </div>
          ))}
        </div>
      </button>
      <span
        title='copy'
        role='button'
        className='copy-mail-inbox'
        onClick={() => navigator.clipboard.writeText(email)}
      >
        <i className='icon ion-md-copy f-larger' />
      </span>
    </div>
  );
};

const EmailListHeader = ({
  createEmail,
}: {
  createEmail: (param: boolean) => void;
}) => {
  return (
    <FlexRow className='justify-content-between text-primary border-bottom pb-1'>
      <div className='pr-3 pl-md-0 pr-md-0'>
        <span className='title w-100'>
          <span className='mr-1'>Inbox</span>
          <ListeningSignal className='listening-signal' />
        </span>
        <span className='small user-email w-100'>
          <SavedEmailList />
        </span>
      </div>
      <div className='new-email'>
        <div
          role='button'
          onClick={() => createEmail(true)}
          className='btn btn-md btn-outline-danger p-0 pl-3 pr-3'
        >
          <small>
            <i className='icon ion-md-add-circle-outline mr-1' />
            New
          </small>
        </div>
      </div>
    </FlexRow>
  );
};

const EmailList = ({
  emails,
  loading,
  viewEmailById,
  createEmail,
}: EmailListProps) => (
  <div className='col-md-12 p-0 inbox-sidebar'>
    <EmailListHeader createEmail={createEmail} />
    <div className='inbox'>
      {loading && (
        <BlinkTextLoader className='pt-4' message='Loading emails...' />
      )}

      {!loading && (
        <Fragment>
          {emails.length > 0 ? (
            emails.map((email, key) => (
              <div
                key={key}
                role='button'
                onClick={() => viewEmailById(email.messageId)}
              >
                <FlexRow className='inbox-row'>
                  <div className='col-md-9 p-0 email-meta'>
                    <span className='d-block'>
                      {email.from_parsed[0].name ||
                        email.from_parsed[0].address.split('@')[0]}
                    </span>
                    <span className='d-block small subject'>
                      {email.subject}
                    </span>
                  </div>
                  <div className='col-md-3 p-0 pl-3 email-date-time'>
                    <span className='d-block'>
                      {moment.utc(email.date).local().format('MMM DD, YYYY')}
                    </span>
                    <span className='d-block'>
                      {moment.utc(email.date).local().format('h:mm A')}
                    </span>
                  </div>
                </FlexRow>
              </div>
            ))
          ) : (
            <Empty message='Your inbox is empty' />
          )}
        </Fragment>
      )}
    </div>
  </div>
);

export default EmailList;
