import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import useSettings from '../../hooks/useSettings';
import {
  Close,
  Error,
  CheckmarkCircle,
  WarningSolid,
  InfoCircle,
} from '@un/icons-react';

import Button from '../Button';

/** Notifications are messages that communicate information to the user. The two main types of notifications are toast notifications and inline notifications. */
export function NotificationActionButton({
  children,
  className: customClassName,
  onClick,
  ...other
}) {
  const { prefix } = useSettings();

  const className = classnames(
    customClassName,
    `${prefix}--inline-notification__action-button`
  );

  return (
    <Button
      className={className}
      kind="ghost"
      onClick={onClick}
      size="small"
      {...other}>
      {children}
    </Button>
  );
}

NotificationActionButton.propTypes = {
  /**
   * Specify the content of the notification action button.
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the notification action button
   */
  className: PropTypes.string,

  /**
   * Optionally specify a click handler for the notification action button.
   */
  onClick: PropTypes.func,
};

export function NotificationButton({
  ariaLabel,
  className,
  iconDescription,
  type,
  renderIcon: IconTag,
  name,
  notificationType,
  ...other
}) {
  const { prefix } = useSettings();

  const buttonClassName = classnames(className, {
    [`${prefix}--${notificationType}-notification__close-button`]:
      notificationType,
  });
  const iconClassName = classnames({
    [`${prefix}--${notificationType}-notification__close-icon`]:
      notificationType,
  });

  // const Icon = renderIcon;

  return (
    // eslint-disable-next-line react/button-has-type
    <button
      {...other}
      type={type}
      aria-label={iconDescription}
      title={iconDescription}
      className={buttonClassName}>
      {IconTag && (
        <IconTag aria-label={ariaLabel} className={iconClassName} name={name} />
      )}
    </button>
  );
}

NotificationButton.propTypes = {
  /**
   * Specify a label to be read by screen readers on the notification button
   */
  ariaLabel: PropTypes.string,

  /**
   * Specify an optional className to be applied to the notification button
   */
  className: PropTypes.string,

  /**
   * Provide a description for "close" icon that can be read by screen readers
   */
  iconDescription: PropTypes.string,

  /**
   * Specify an optional icon for the Button through a string,
   * if something but regular "close" icon is desirable
   */
  name: PropTypes.string,

  /**
   * Specify the notification type
   */
  notificationType: PropTypes.oneOf(['toast', 'inline']),

  /**
   * Optional prop to allow overriding the icon rendering.
   * Can be a React component class
   */
  renderIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  /**
   * Optional prop to specify the type of the Button
   */
  type: PropTypes.string,
};

NotificationButton.defaultProps = {
  ariaLabel: 'close notification', // TODO: deprecate this prop
  notificationType: 'toast',
  type: 'button',
  iconDescription: 'close icon',
  renderIcon: Close,
};

export function NotificationTextDetails({
  title,
  subtitle,
  caption,
  notificationType,
  children,
  ...other
}) {
  const { prefix } = useSettings();

  if (notificationType === 'toast') {
    return (
      <div {...other} className={`${prefix}--toast-notification__details`}>
        {title && (
          <h3 className={`${prefix}--toast-notification__title`}>{title}</h3>
        )}
        <div className={`${prefix}--toast-notification__subtitle`}>
          {subtitle}
        </div>
        <div className={`${prefix}--toast-notification__caption`}>
          {caption}
        </div>
        {children}
      </div>
    );
  }

  if (notificationType === 'inline') {
    return (
      <div
        {...other}
        className={`${prefix}--inline-notification__text-wrapper`}>
        {title && (
          <p className={`${prefix}--inline-notification__title`}>{title}</p>
        )}
        <div className={`${prefix}--inline-notification__subtitle`}>
          {children || subtitle}
        </div>
      </div>
    );
  }
}

NotificationTextDetails.propTypes = {
  /**
   * Specify the caption
   */
  caption: PropTypes.node,
  /**
   * Pass in the children that will be rendered in NotificationTextDetails
   */
  children: PropTypes.node,
  /**
   * Specify the notification type
   */
  notificationType: PropTypes.oneOf(['toast', 'inline']),
  /**
   * Specify the sub-title
   */
  subtitle: PropTypes.node,
  /**
   * Specify the title
   */
  title: PropTypes.string,
};

NotificationTextDetails.defaultProps = {
  //title: 'title',
  notificationType: 'toast',
};

const iconTypes = {
  error: Error,
  success: CheckmarkCircle,
  warning: WarningSolid,
  info: InfoCircle,
};

export function NotificationIcon({ iconDescription, kind, notificationType }) {
  const { prefix } = useSettings();
  const IconForKind = iconTypes[kind];
  if (!IconForKind) {
    return null;
  }
  return (
    <IconForKind
      className={`${prefix}--${notificationType}-notification__icon`}>
      <title>{iconDescription}</title>
    </IconForKind>
  );
}

NotificationIcon.propTypes = {
  iconDescription: PropTypes.string.isRequired,
  kind: PropTypes.oneOf([
    'error',
    'success',
    'warning',
    'warning-alt',
    'info',
    //'info-square',
  ]).isRequired,
  notificationType: PropTypes.oneOf(['inline', 'toast']).isRequired,
};

export function ToastNotification({
  role,
  notificationType,
  onClose,
  onCloseButtonClick,
  iconDescription,
  statusIconDescription,
  className,
  caption,
  subtitle,
  title,
  kind,
  lowContrast,
  hideCloseButton,
  children,
  timeout,
  ...other
}) {
  const { prefix } = useSettings();
  const [isOpen, setIsOpen] = useState(true);
  const containerClassName = classnames(className, {
    [`${prefix}--toast-notification`]: true,
    [`${prefix}--toast-notification--low-contrast`]: lowContrast,
    [`${prefix}--toast-notification--${kind}`]: kind,
  });

  const handleClose = (evt) => {
    if (!onClose || onClose(evt) !== false) {
      setIsOpen(false);
    }
  };

  function handleCloseButtonClick(event) {
    onCloseButtonClick(event);
    handleClose(event);
  }

  const savedOnClose = useRef(onClose);

  useEffect(() => {
    savedOnClose.current = onClose;
  });

  useEffect(() => {
    if (!timeout) {
      return;
    }

    const timeoutId = window.setTimeout((event) => {
      setIsOpen(false);
      if (savedOnClose.current) {
        savedOnClose.current(event);
      }
    }, timeout);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [timeout]);

  if (!isOpen) {
    return null;
  }

  return (
    <div {...other} role={role} kind={kind} className={containerClassName}>
      <NotificationIcon
        notificationType={notificationType}
        kind={kind}
        iconDescription={statusIconDescription || `${kind} icon`}
      />
      <NotificationTextDetails
        title={title}
        subtitle={subtitle}
        caption={caption}
        notificationType={notificationType}>
        {children}
      </NotificationTextDetails>
      {!hideCloseButton && (
        <NotificationButton
          iconDescription={iconDescription}
          notificationType={notificationType}
          onClick={handleCloseButtonClick}
        />
      )}
    </div>
  );
}

ToastNotification.propTypes = {
  /**
   * Specify the caption
   */
  caption: PropTypes.node,

  /**
   * Pass in the children that will be rendered within the ToastNotification
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the notification box
   */
  className: PropTypes.string,

  /**
   * Specify the close button should be disabled, or not
   */
  hideCloseButton: PropTypes.bool,

  /**
   * Provide a description for "close" icon that can be read by screen readers
   */
  iconDescription: PropTypes.string,

  /**
   * Specify what state the notification represents
   */

  kind: PropTypes.oneOf([
    'error',
    'info',
    //'info-square',
    'success',
    'warning',
    'warning-alt',
  ]).isRequired,

  /**
   * Specify whether you are using the low contrast variant of the ToastNotification.
   */
  lowContrast: PropTypes.bool,

  /**
   * By default, this value is "toast". You can also provide an alternate type
   * if it makes sense for the underlying `<NotificationTextDetails>` and `<NotificationButton>`
   */
  notificationType: PropTypes.string,

  /**
   * Provide a function that is called when menu is closed
   */
  onClose: PropTypes.func,

  /**
   * Provide a function that is called when menu is closed
   */
  onCloseButtonClick: PropTypes.func,

  /**
   * By default, this value is "alert". You can also provide an alternate
   * role if it makes sense from the accessibility-side
   */
  role: PropTypes.string.isRequired,

  /**
   * Provide a description for "status" icon that can be read by screen readers
   */
  statusIconDescription: PropTypes.string,

  /**
   * Specify the sub-title
   */
  subtitle: PropTypes.node,

  /**
   * Specify an optional duration the notification should be closed in
   */
  timeout: PropTypes.number,

  /**
   * Specify the title
   */
  title: PropTypes.string.isRequired,
};

ToastNotification.defaultProps = {
  kind: 'error',
  title: 'provide a title',
  caption: 'provide a caption',
  role: 'alert',
  notificationType: 'toast',
  iconDescription: 'closes notification',
  onCloseButtonClick: () => {},
  hideCloseButton: false,
  timeout: 0,
};

export function InlineNotification({
  actions,
  role,
  notificationType,
  onClose,
  onCloseButtonClick,
  icon,
  iconDescription,
  statusIconDescription,
  className,
  subtitle,
  title,
  kind,
  lowContrast,
  hideCloseButton,
  children,
  ...other
}) {
  const { prefix } = useSettings();
  const [isOpen, setIsOpen] = useState(true);
  const containerClassName = classnames(className, {
    [`${prefix}--inline-notification`]: true,
    [`${prefix}--inline-notification--low-contrast`]: lowContrast,
    [`${prefix}--inline-notification--${kind}`]: kind,
    [`${prefix}--inline-notification--hide-close-button`]: hideCloseButton,
  });

  const handleClose = (evt) => {
    if (!onClose || onClose(evt) !== false) {
      setIsOpen(false);
    }
  };

  function handleCloseButtonClick(event) {
    onCloseButtonClick(event);
    handleClose(event);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div {...other} role={role} kind={kind} className={containerClassName}>
      <div className={`${prefix}--inline-notification__details`}>
        {icon === undefined && (
          <NotificationIcon
            notificationType={notificationType}
            kind={kind}
            iconDescription={statusIconDescription || `${kind} icon`}
          />
        )}
        {icon && (
          <div className={`${prefix}--${notificationType}-notification__icon`}>
            {icon}
          </div>
        )}
        <NotificationTextDetails
          title={title}
          subtitle={subtitle}
          notificationType={notificationType}>
          {children}
        </NotificationTextDetails>
      </div>
      {actions}
      {!hideCloseButton && (
        <NotificationButton
          iconDescription={iconDescription}
          notificationType={notificationType}
          onClick={handleCloseButtonClick}
        />
      )}
    </div>
  );
}

InlineNotification.propTypes = {
  /**
   * Pass in the action nodes that will be rendered within the InlineNotification
   */
  actions: PropTypes.node,

  /**
   * Pass in the children that will be rendered within the InlineNotification
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the notification box
   */
  className: PropTypes.string,

  /**
   * Specify the close button should be disabled, or not
   */
  hideCloseButton: PropTypes.bool,

  /**
   * Pass in the icon that will be rendered within the ToastNotification or set icon to false to hide
   */
  icon: PropTypes.oneOf([PropTypes.node, PropTypes.bool]),

  /**
   * Provide a description for "close" icon that can be read by screen readers
   */
  iconDescription: PropTypes.string,

  /**
   * Specify what state the notification represents
   */
  kind: PropTypes.oneOf([
    'error',
    'info',
    //'info-square',
    'success',
    'warning',
    'warning-alt',
  ]).isRequired,

  /**
   * Specify whether you are using the low contrast variant of the InlineNotification.
   */
  lowContrast: PropTypes.bool,

  /**
   * By default, this value is "inline". You can also provide an alternate type
   * if it makes sense for the underlying `<NotificationTextDetails>` and `<NotificationButton>`
   */
  notificationType: PropTypes.string,

  /**
   * Provide a function that is called when menu is closed
   */
  onCloseButtonClick: PropTypes.func,

  /**
   * By default, this value is "alert". You can also provide an alternate
   * role if it makes sense from the accessibility-side
   */
  role: PropTypes.string.isRequired,

  /**
   * Provide a description for "status" icon that can be read by screen readers
   */
  statusIconDescription: PropTypes.string,

  /**
   * Specify the sub-title
   */
  subtitle: PropTypes.node,

  /**
   * Specify the title
   */
  title: PropTypes.string.isRequired,
};

InlineNotification.defaultProps = {
  role: 'alert',
  notificationType: 'inline',
  iconDescription: 'closes notification',
  onCloseButtonClick: () => {},
  hideCloseButton: false,
};
