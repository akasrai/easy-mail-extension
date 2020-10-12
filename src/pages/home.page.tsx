import React, {
  Fragment,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';

import MainLayout from 'ui/main.layout';

import * as app from 'app/app.state';
import { AuthContext } from 'app/app.context';
import Inbox from './components/inbox.component';
import CreateEmail from './components/create-email.component';
import { LS_KEY } from 'app/app.constant';
import { LS } from 'helper/local-storage-helper';
import { ApiResponse } from 'api/api.type';

const HomePage = () => {
  const [checkAuth, setCheckAuth] = useState<boolean>(true);
  const [newEmail, setCreateNewEmail] = useState<boolean>(false);
  const [authState, dispatch] = useReducer(app.reducer, app.initialState);
  const { email, isAuthenticated, setCurrentAuth } = useContext(AuthContext);

  const restoreAuthentication = () => {
    dispatch({ type: app.AUTH_ACTION_PENDING });
    const { data }: ApiResponse = LS.get(LS_KEY.CURRENT_USER);

    if (data) {
      return dispatch({
        type: app.SIGN_IN_SUCCESS,
        payload: { email: data.email },
      });
    }

    dispatch({ type: app.SIGN_IN_ERROR });
  };

  useEffect(() => {
    setCurrentAuth(authState);

    if (checkAuth) {
      setCheckAuth(false);
      restoreAuthentication();
    }
  }, [authState, setCurrentAuth, checkAuth, setCheckAuth]);

  return (
    <MainLayout>
      <div className='col-md-12 p-md-0 m-auto'>
        {newEmail || !isAuthenticated ? (
          <Fragment>
            <h5 className='text-primary mb-0 mt-5 mb-1'>Email Generator</h5>
            <span className='small mb-4 d-block text-muted'>
              All you need is enter a username and start receiving the emails
              right away. Cheers{' '}
              <span role='img' aria-label='star'>
                ✨
              </span>
              <span role='img' aria-label='celebrate'>
                🎉
              </span>
            </span>

            {isAuthenticated && (
              <Fragment>
                <div className='alert alert-info p-2 mt-3 small'>
                  Welcome! <strong>{email}</strong>.<br />
                  <div
                    role='button'
                    className='btn btn-info btn-sm mt-3'
                    onClick={() => setCreateNewEmail(false)}
                  >
                    Goto Inbox
                  </div>
                </div>
                or, create new
              </Fragment>
            )}

            <CreateEmail
              createEmail={setCreateNewEmail}
              className='col-md-12 p-0 mb-3'
            />
          </Fragment>
        ) : (
          <Inbox createEmail={setCreateNewEmail} />
        )}
      </div>
    </MainLayout>
  );
};

export default HomePage;
