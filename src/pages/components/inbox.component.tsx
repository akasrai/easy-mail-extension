import React, { useState, useEffect, useContext, Fragment } from 'react';

import { AuthContext } from 'app/app.context';

import { MailResponse, Email } from 'api/api.type';
import { getMails, listenIncomingMails } from 'api/request.api';

import EmailList from './email-list.component';
import SingleView from './view-email.component';

const getUserName = (email: string) => {
  const nameSpace = process.env.REACT_APP_TEST_MAIL_NAMESPACE || '';

  return email.split('@')[0].replace(`${nameSpace}.`, '');
};

const Inbox = ({ createEmail }: { createEmail: (param: boolean) => void }) => {
  const userEmailId = useContext(AuthContext).email;
  const [synced, setSynced] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEmail, selectEmail] = useState<Email>();
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentUser, setCurrentUser] = useState<string>(userEmailId);

  const viewEmailById = (messageId: string) => {
    const email = emails.find((email) => email.messageId === messageId);
    selectEmail(email);
  };

  useEffect(() => {
    const subscribeLiveMails = async () => {
      const mails: MailResponse = (await listenIncomingMails(
        getUserName(userEmailId)
      )) as MailResponse;

      setEmails([...mails.inbox.emails, ...emails]);
    };

    const fetchOldMails = async () => {
      setLoading(true);
      const mails: MailResponse = (await getMails(
        getUserName(userEmailId)
      )) as MailResponse;

      setSynced(true);
      setLoading(false);
      selectEmail(undefined);
      setCurrentUser(userEmailId);
      setEmails([...mails.inbox.emails]);
    };

    if (!synced) fetchOldMails();
    if (synced && currentUser === userEmailId) subscribeLiveMails();
    if (synced && currentUser !== userEmailId) fetchOldMails();
  }, [emails, userEmailId, synced, currentUser]);

  return (
    <Fragment>
      {selectedEmail ? (
        <SingleView selectEmail={selectEmail} email={selectedEmail} />
      ) : (
        <EmailList
          emails={emails}
          loading={loading}
          createEmail={createEmail}
          viewEmailById={viewEmailById}
        />
      )}
    </Fragment>
  );
};

export default Inbox;
