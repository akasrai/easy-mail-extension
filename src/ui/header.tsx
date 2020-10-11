import React, { useEffect, useState, useContext, useReducer } from 'react';

import { Flex } from './flex';

import * as app from 'app/app.state';
import { LS_KEY } from 'app/app.constant';
import { ROUTE } from 'app/app.route-path';
import { AuthContext } from 'app/app.context';

import { LS } from 'helper/local-storage-helper';
import history from 'app/app.history';
import { ApiResponse } from 'api/api.type';

const isPage = (page: string) => {
  const currentPage = window.location.pathname;

  return currentPage === page;
};

const SavedEmailList = () => {
  const [deleted, setDeleted] = useState<Boolean>(false);
  const [emails, setEmails] = useState<Array<string>>([]);
  const { email, setCurrentAuth } = useContext(AuthContext);
  const [authState, dispatch] = useReducer(app.reducer, app.initialState);

  const getEmails = () => {
    const { data, error } = LS.get(LS_KEY.EMAILS);

    if (error) return console.log('Error in accessing LS emails', error);

    setEmails(data);
  };

  const switchAuth = (email: string) => {
    dispatch({
      type: app.SIGN_IN_SUCCESS,
      payload: { email },
    });

    history.push(ROUTE.INBOX);
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
    <div className="user-tool">
      <i className="icon ion-md-contact m-0 pt-1 text-muted" />
      <button className="bold p user-tool-btn">
        <span className="d-inline d-md-none text-muted">
          {email.split('@')[0]}
        </span>
        <span className="d-none d-md-inline text-muted">{email}</span>
        <i className="icon ion-ios-arrow-down ml-2 text-primary" />
        <div className="dropdown text-muted">
          <div className="list">
            {isPage(ROUTE.INBOX) && (
              <div className="w-100 btn btn-md btn-outline-danger p-1">
                <span className="small">Create New</span>
              </div>
            )}

            {isPage(ROUTE.HOME) && (
              <div className="w-100 btn btn-md btn-outline-danger p-1">
                <span className="small">Inbox</span>
              </div>
            )}
          </div>

          {emails.map((emailId, key) => (
            <div
              key={key}
              className="d-flex align-items-baseline justify-content-between"
            >
              <div className="list shake" onClick={() => switchAuth(emailId)}>
                <i className="icon ion-md-mail mr-2 m-0 d-inline-block" />
                {emailId}
              </div>
              {emailId !== email && (
                <i
                  title="Delete"
                  onClick={() => removeEmail(emailId)}
                  className="icon ion-md-trash m-0 d-inline-block pr-3 pl-2 delete-email"
                />
              )}
            </div>
          ))}
        </div>
      </button>
    </div>
  );
};

const Header = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <header className="col-md-12 p-1 pl-3 pr-3">
      <Flex className="justify-content-between text-white">
        <div className="col-md-3 p-0 pt-1">
          <div className="d-flex text-primary">
            <i className="icon ion-md-mail-open mr-2 m-0" />
            <span className="">
              Easy<span className="bold">Mail</span>
            </span>
          </div>
        </div>
        <div className="col-md-6 p-0 d-none d-md-block"></div>
        <div className="col-md-3 p-0 text-primary">
          {isAuthenticated && <SavedEmailList />}
        </div>
      </Flex>
    </header>
  );
};

export default Header;
