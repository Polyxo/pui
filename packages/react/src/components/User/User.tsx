import * as React from 'react';
import classNames from 'classnames';
import { User as UserIcon } from '@un/icons-react';
import useSettings from '../../hooks/useSettings';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  alt?: string;
  ellipsis?: boolean;
  description?: React.ReactNode;
  extendedDescription?: React.ReactNode;
  missingImage?: 'avatar' | 'letter';
  image?: string;
  showName?: boolean;
  small?: boolean;
  name?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  alt,
  image,
  missingImage,
  name,
  ...other
}) => {
  const { prefix } = useSettings();

  if (!image && missingImage === 'avatar') {
    return (
      <UserIcon
        fill="#ffffff"
        width="14"
        height="14"
        description={alt}
        className={`${prefix}--user__icon ${prefix}--user__icon--empty`}
        {...other}
      />
    );
  } else if (image === undefined && missingImage === 'letter') {
    return (
      <svg
        id="Layer_1"
        className={`${prefix}--user__icon ${prefix}--user__icon--empty ${prefix}--user__icon--letter`}
        x="0px"
        y="0px"
        viewBox="0 0 25 25"
        height="25px"
        width="25px">
        <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle">
          {name && name.toUpperCase()[0]}
        </text>
      </svg>
    );
  } else {
    return (
      <div className={`${prefix}--user__icon`} {...other}>
        <img alt={alt} src={image} />
      </div>
    );
  }
  return null;
};

export interface UserProps extends React.HTMLAttributes<HTMLSpanElement> {
  alt?: string;
  ellipsis?: boolean;
  description?: React.ReactNode;
  components?: { Icon: React.ReactNode };
  extendedDescription?: React.ReactNode;
  missingImage?: 'avatar' | 'letter';
  image?: string;
  showName?: boolean;
  className?: string;
  small?: boolean;
  name?: string;
}
/** The User is used inside the MainNavigation and form, and can display an avatar and username. */
const User: React.FC<UserProps> = (props) => {
  const {
    className,
    children,
    components = {},
    description,
    ellipsis,
    extendedDescription,
    showName,
    small,
    name,
    ...other
  } = props;
  const { prefix } = useSettings();

  const defaultComponents = { Avatar };

  const allComponents = {
    ...defaultComponents,
    ...components,
  };

  const classes = classNames(`${prefix}--user`, className, {
    [`${prefix}--user--has-description`]: description,
    [`${prefix}--user--has-extended-description`]: extendedDescription,
  });

  const titleClasses = classNames({
    [`${prefix}--user__title`]: true,
    [`${prefix}--user__title--ellipsis`]: ellipsis,
    [`${prefix}--user__title--small`]: small,
  });

  return (
    <div className={classes} {...other}>
      <allComponents.Avatar {...props} />
      {showName && (
        <span className={titleClasses}>
          <span>{name}</span>
          {description && (
            <div className={`${prefix}--user__description`}>{description}</div>
          )}
        </span>
      )}
      {children}
      {extendedDescription && (
        <div className={`${prefix}--user__extended-description`}>
          {extendedDescription}
        </div>
      )}
    </div>
  );
};

export default User;
