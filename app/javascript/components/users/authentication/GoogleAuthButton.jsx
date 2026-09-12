// BigBlueButton open source conferencing system - http://www.bigbluebutton.org/.
//
// Copyright (c) 2022 BigBlueButton Inc. and by respective authors (see below).
//
// This program is free software; you can redistribute it and/or modify it under the
// terms of the GNU Lesser General Public License as published by the Free Software
// Foundation; either version 3.0 of the License, or (at your option) any later
// version.
//
// Greenlight is distributed in the hope that it will be useful, but WITHOUT ANY
// WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
// PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public License along
// with Greenlight; if not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useEnv from '../../../hooks/queries/env/useEnv';

// "Continue with Google" button. Renders nothing until GOOGLE_CLIENT_ID/SECRET
// are configured on the backend (see sample.env), so it's safe to ship ahead of credentials.
export default function GoogleAuthButton() {
  const { t } = useTranslation();
  const { data: env } = useEnv();

  if (!env?.GOOGLE_AUTH_ENABLED) return null;

  return (
    <>
      <div className="d-flex align-items-center my-3">
        <hr className="flex-grow-1" />
        <span className="px-2 text-muted small">{t('or')}</span>
        <hr className="flex-grow-1" />
      </div>
      <Form action={`${process.env.RELATIVE_URL_ROOT}/auth/google_oauth2`} method="POST" data-turbo="false">
        <input type="hidden" name="authenticity_token" value={document.querySelector('meta[name="csrf-token"]').content} />
        <button
          type="submit"
          className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.616z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.583-5.036-3.71H.957v2.332A8.997 8.997 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" />
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961l3.007 2.332C4.672 5.163 6.656 3.58 9 3.58z" />
          </svg>
          {t('authentication.continue_with_google', 'Continue with Google')}
        </button>
      </Form>
    </>
  );
}
