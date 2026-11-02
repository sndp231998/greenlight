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

import React, { useEffect } from 'react';
import {
  Col, Row,
} from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRightIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, Cog8ToothIcon, ComputerDesktopIcon,
  DevicePhoneMobileIcon, LinkIcon, MicrophoneIcon, PhoneXMarkIcon, PlayCircleIcon, PlusCircleIcon,
  PresentationChartBarIcon, UserGroupIcon, VideoCameraIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/auth/AuthProvider';
import HomepageFeatureCard from './HomepageFeatureCard';
import AuthButtons from './AuthButtons';
import TMeetLogo from '../../../assets/images/t-meet-logo.png';
import useRoomConfigValue from '../../hooks/queries/rooms/useRoomConfigValue';
import useEnv from '../../hooks/queries/env/useEnv';

export default function HomePage() {
  const { t } = useTranslation();
  const currentUser = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const error = searchParams.get('error');
  const success = searchParams.get('success');
  const { data: recordValue } = useRoomConfigValue('record');
  const { data: env } = useEnv();

  // Redirects the user to the proper page based on signed in status and CreateRoom permission
  useEffect(
    () => {
      // Todo: Use PermissionChecker.
      if (!currentUser.stateChanging && currentUser.signed_in && currentUser.permissions.CreateRoom === 'true') {
        navigate('/rooms');
      } else if (!currentUser.stateChanging && currentUser.signed_in && currentUser.permissions.CreateRoom === 'false') {
        navigate('/home');
      }
    },
    [currentUser.signed_in],
  );

  useEffect(() => {
    switch (success) {
      case 'LogoutSuccessful':
        toast.success(t('toast.success.session.signed_out'));
        break;
      default:
    }
    if (success) { setSearchParams(searchParams.delete('success')); }
  }, [success]);

  useEffect(() => {
    switch (error) {
      case 'InviteInvalid':
        toast.error(t('toast.error.users.invalid_invite'));
        break;
      case 'SignupError':
        toast.error(t('toast.error.users.signup_error'));
        break;
      case 'BannedUser':
        toast.error(t('toast.error.users.banned'));
        break;
      default:
    }
    if (error) { setSearchParams(searchParams.delete('error')); }
  }, [error]);

  // useEffect for inviteToken
  useEffect(
    () => {
      const inviteToken = searchParams.get('inviteToken');

      // Environment settings not loaded
      if (!env) {
        return;
      }

      if (inviteToken && env?.EXTERNAL_AUTH) {
        const signInForm = document.querySelector('form[action="/auth/openid_connect"]');
        signInForm.submit();
      } else if (inviteToken && !env?.EXTERNAL_AUTH) {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach((button) => {
          if (button.textContent === 'Sign Up') {
            button.click();
          }
        });
      }
    },
    [searchParams, env],
  );

  return (
    <>
      <Row id="homepage-hero" className="align-items-center gy-5">
        <Col lg={6}>
          <span className="homepage-eyebrow">{t('homepage.eyebrow', 'Online classes & meetings')}</span>
          <h1 className="homepage-title mt-3 mb-4">
            {t('homepage.hero_title', 'Teach, meet and collaborate right in your browser.')}
          </h1>
          <p className="text-muted fs-5 mb-4">
            {t('homepage.platform_description')}
          </p>
          <AuthButtons />
          <ul className="homepage-checks list-unstyled mt-4 mb-0">
            <li><CheckCircleIcon className="hi-s" />{t('homepage.check_no_install', 'No downloads or installs')}</li>
            <li><CheckCircleIcon className="hi-s" />{t('homepage.check_devices', 'Works on laptop, tablet and phone')}</li>
            <li><CheckCircleIcon className="hi-s" />{t('homepage.check_support', 'Local support when you need it')}</li>
          </ul>
        </Col>
        <Col lg={6}>
          <MeetingPreview />
        </Col>
      </Row>

      <section className="homepage-section">
        <h2 className="homepage-section-title">{t('homepage.explore_features')}</h2>
        <p className="homepage-section-lead text-muted">
          {t('homepage.features_lead', 'Everything a live class needs, in one place.')}
        </p>
        <Row xs={1} md={2} lg={3} className="g-4">
          <Col>
            <HomepageFeatureCard
              title={t('homepage.meeting_title')}
              description={t('homepage.meeting_description')}
              icon={<VideoCameraIcon className="hi-s text-white" />}
            />
          </Col>
          <Col>
            <HomepageFeatureCard
              title={t('homepage.screen_title', 'Screen sharing & slides')}
              description={t('homepage.screen_description', 'Present slides, share your screen and draw on the whiteboard together.')}
              icon={<PresentationChartBarIcon className="hi-s text-white" />}
            />
          </Col>
          <Col>
            <HomepageFeatureCard
              title={t('homepage.engage_title', 'Chat, polls & breakout rooms')}
              description={t('homepage.engage_description', 'Keep every learner involved with chat, quick polls and small-group rooms.')}
              icon={<ChatBubbleLeftRightIcon className="hi-s text-white" />}
            />
          </Col>
          { (recordValue !== 'false') && (
            <Col>
              <HomepageFeatureCard
                title={t('homepage.recording_title')}
                description={t('homepage.recording_description_tmeet')}
                icon={<PlayCircleIcon className="hi-s text-white" />}
              />
            </Col>
          )}
          <Col>
            <HomepageFeatureCard
              title={t('homepage.settings_title')}
              description={t('homepage.settings_description')}
              icon={<Cog8ToothIcon className="hi-s text-white" />}
            />
          </Col>
          <Col>
            <HomepageFeatureCard
              title={t('homepage.devices_title', 'Join from any device')}
              description={t('homepage.devices_description', 'Learners join with one link from Chrome, Firefox, Edge or Safari, on desktop or mobile.')}
              icon={<DevicePhoneMobileIcon className="hi-s text-white" />}
            />
          </Col>
        </Row>
      </section>

      <section className="homepage-section">
        <h2 className="homepage-section-title">{t('homepage.steps_title', 'Start a class in three steps')}</h2>
        <Row xs={1} md={3} className="g-4 mt-1">
          <Col>
            <div className="homepage-step">
              <span className="homepage-step-number">1</span>
              <PlusCircleIcon className="hi-m homepage-step-icon" />
              <h3 className="fs-5">{t('homepage.step1_title', 'Create a room')}</h3>
              <p className="text-muted mb-0">{t('homepage.step1_description', 'Sign up and create a room for each class or team.')}</p>
            </div>
          </Col>
          <Col>
            <div className="homepage-step">
              <span className="homepage-step-number">2</span>
              <LinkIcon className="hi-m homepage-step-icon" />
              <h3 className="fs-5">{t('homepage.step2_title', 'Share the link')}</h3>
              <p className="text-muted mb-0">{t('homepage.step2_description', 'Send the room link to your learners. They join in one click.')}</p>
            </div>
          </Col>
          <Col>
            <div className="homepage-step">
              <span className="homepage-step-number">3</span>
              <UserGroupIcon className="hi-m homepage-step-icon" />
              <h3 className="fs-5">{t('homepage.step3_title', 'Teach live')}</h3>
              <p className="text-muted mb-0">{t('homepage.step3_description', 'Start the session, share your screen and record it for later.')}</p>
            </div>
          </Col>
        </Row>
      </section>

      <section className="homepage-cta">
        <div>
          <h2 className="mb-2">{t('homepage.cta_title', 'Ready to start your first class?')}</h2>
          <p className="mb-0">{t('homepage.cta_description', 'Create a free account in under a minute.')}</p>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-3">
          <AuthButtons />
          <a href="mailto:support@tsaedu.com" className="homepage-cta-link">
            {t('homepage.contact_support')}
            <ArrowRightIcon className="hi-s ms-2" />
          </a>
        </div>
      </section>
    </>
  );
}

// Decorative mock of a live class, built from markup so it stays sharp and light.
function MeetingPreview() {
  const tiles = [
    { initials: 'RS', name: 'Teacher', speaking: true },
    { initials: 'AK', name: 'Learner' },
    { initials: 'SB', name: 'Learner' },
    { initials: 'PT', name: 'Learner' },
  ];

  return (
    <div className="meeting-preview" aria-hidden="true">
      <div className="meeting-preview-bar">
        <span /><span /><span />
        <strong>T-Meet</strong>
        <em>LIVE</em>
      </div>
      <div className="meeting-preview-body">
        <div className="meeting-preview-slide">
          <img src={TMeetLogo} alt="" />
        </div>
        <div className="meeting-preview-tiles">
          { tiles.map((tile) => (
            <div key={tile.initials} className={`meeting-preview-tile${tile.speaking ? ' speaking' : ''}`}>
              <span className="meeting-preview-avatar">{tile.initials}</span>
              <small>{tile.name}</small>
            </div>
          )) }
        </div>
      </div>
      <div className="meeting-preview-controls">
        <span><MicrophoneIcon className="hi-s" /></span>
        <span><VideoCameraIcon className="hi-s" /></span>
        <span className="active"><ComputerDesktopIcon className="hi-s" /></span>
        <span><ChatBubbleLeftRightIcon className="hi-s" /></span>
        <span className="leave"><PhoneXMarkIcon className="hi-s" /></span>
      </div>
    </div>
  );
}
