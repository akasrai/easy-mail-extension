import React, { useState, useReducer, useContext, useEffect } from 'react';

import { Input } from 'ui/form/input';
import { Button } from 'ui/form/button';
import { ErrorAlert } from 'ui/alert/inline-alert';

import * as app from 'app/app.state';
import { LS_KEY } from 'app/app.constant';
import { AuthContext } from 'app/app.context';

import { ApiResponse } from 'api/api.type';

import { LS } from 'helper/local-storage-helper';

interface CreateEmailProps {
  className?: string;
  createEmail: (param: boolean) => void;
}

const addEmailToLS = (newEmail: string) => {
  const { data }: ApiResponse = LS.get(LS_KEY.EMAILS);
  const emails = Array.isArray(data) ? [...data, newEmail] : [newEmail];

  LS.set(LS_KEY.EMAILS, emails);
};

const emailExists = (newEmail: string) => {
  const { data }: ApiResponse = LS.get(LS_KEY.EMAILS);

  if (Array.isArray(data))
    return data.find((email: string) => email === newEmail);

  return false;
};

const CreateEmail = ({ className, createEmail }: CreateEmailProps) => {
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const { isHandlingAuth, setCurrentAuth } = useContext(AuthContext);
  const [isEmailCreated, setIsEmailCreated] = useState<boolean>(false);
  const [authState, dispatch] = useReducer(app.reducer, app.initialState);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isEmailValid(email)) handleAuth();
  };

  const isEmailValid = (email: string) => {
    if (!email) {
      setError('Email is not yet generated.');
      return false;
    }

    if (emailExists(email)) {
      setError('Email already exists.');
      return false;
    }

    return true;
  };

  const isUsernameValid = (username: string) => {
    if (!/^$|^[^*!#|":<>[\]{}`\\()';@&$%^]+$/.test(username)) {
      setError('Invalid characters.');
      return false;
    }

    return true;
  };

  const handleAuth = () => {
    dispatch({ type: app.AUTH_ACTION_PENDING });
    setError('');
    addEmailToLS(email);
    setIsEmailCreated(true);

    dispatch({
      type: app.SIGN_IN_SUCCESS,
      payload: { email },
    });
  };

  const generateEmail = (e: any) => {
    const username = e.target.value;
    const nameSpace = process.env.REACT_APP_TEST_MAIL_NAMESPACE;
    const generatedEmail = `${nameSpace}.${username}@inbox.testmail.app`;

    if (isUsernameValid(username) && isEmailValid(generatedEmail)) {
      setError('');
      setEmail(generatedEmail);
    }
  };

  useEffect(() => {
    if (isEmailCreated) {
      setCurrentAuth(authState);
      createEmail(false);
    }
  }, [authState, setCurrentAuth, createEmail, isEmailCreated]);

  return (
    <form className={className} onSubmit={handleSubmit}>
      <ErrorAlert message={error} />
      <Input
        min={1}
        max={15}
        type='text'
        required={true}
        name='username'
        placeholder='username'
        onChange={generateEmail}
        className={`mail-username-input f-larger ${error && 'is-invalid'}`}
      />

      {email && (
        <div className='position-relative'>
          <Input
            type='text'
            name='email'
            value={email}
            readonly={true}
            placeholder='email'
            className={`mail-username-input f-larger ${error && 'is-invalid'}`}
          />
          <span
            title='copy'
            role='button'
            className='copy-mail'
            onClick={() => navigator.clipboard.writeText(email)}
          >
            <i className='icon ion-md-copy f-larger' />
          </span>
        </div>
      )}

      <Button
        name='Create'
        className='md btn-danger'
        disabled={isHandlingAuth}
      />
    </form>
  );
};

export default CreateEmail;
