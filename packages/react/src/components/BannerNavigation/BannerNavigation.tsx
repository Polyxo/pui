import * as React from 'react';
import type { PropsWithChildren } from 'react';
import classNames from 'classnames';
import Wrapper from '../Wrapper';
import useSettings from '../../hooks/useSettings';

type BannerNavigationItemProps = PropsWithChildren<{
  className?: string;
}>;

const BannerNavigationItem: React.FC<BannerNavigationItemProps> = ({
  className,
  children,
}) => {
  const { prefix } = useSettings();
  const wrapperClasses = classNames(
    `${prefix}--banner-navigation__item`,
    className
  );
  return <li className={wrapperClasses}>{children}</li>;
};

type BannerNavigationProps = PropsWithChildren<{
  className?: string;
  pageWidth?: 'sm' | 'md' | 'lg' | 'full';
}>;

const BannerNavigation: React.FC<BannerNavigationProps> = ({
  children,
  className,
  ...props
}) => {
  const { prefix } = useSettings();
  const wrapperClasses = classNames(`${prefix}--banner-navigation`, className);

  return (
    <div className={wrapperClasses}>
      <Wrapper {...props}>
        <ul className={`${prefix}--banner-navigation__list`}>{children}</ul>
      </Wrapper>
    </div>
  );
};

export { BannerNavigationItem, BannerNavigation };
