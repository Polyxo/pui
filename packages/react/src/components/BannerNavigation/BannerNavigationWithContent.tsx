import * as React from 'react';
import { BannerNavigation, BannerNavigationItem } from './BannerNavigation';
import Search from '../Search';
import Link from '../Link';

type BannerNavigationWithContentProps = {
  /**
   * A onChange Function for the search
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  searchOnChange?: () => {};
  /**
   * Allows to disable the search input
   */
  search?: boolean;
};

const BannerNavigationWithContent: React.FC<
  BannerNavigationWithContentProps
> = ({ searchOnChange, search, ...other }) => (
  <BannerNavigation {...other}>
    <BannerNavigationItem>
      <Link href="http://communities.wfp.org" target="_blank">
        Communities
      </Link>
    </BannerNavigationItem>
    <BannerNavigationItem>
      <Link href="http://manuals.wfp.org" target="_blank">
        Manuals
      </Link>
    </BannerNavigationItem>
    <BannerNavigationItem>
      <Link href="https://newgo.docs.wfp.org" target="_blank">
        GoDocs
      </Link>
    </BannerNavigationItem>
    <BannerNavigationItem>
      <Link href="https://welearn.wfp.org" target="_blank">
        WeLearn
      </Link>
    </BannerNavigationItem>
    <BannerNavigationItem>
      <Link href="https://dashboard.wfp.org" target="_blank">
        Dashboard
      </Link>
    </BannerNavigationItem>
    <BannerNavigationItem>
      <Link href="http://opweb.wfp.org" target="_blank">
        OPweb
      </Link>
    </BannerNavigationItem>
    <BannerNavigationItem>
      <Link href="https://selfservice.go.wfp.org" target="_blank">
        Self-Service
      </Link>
    </BannerNavigationItem>
    <BannerNavigationItem>
      <Link href="https://erpapps.wfp.org/fiori" target="_blank">
        WeTravel
      </Link>
    </BannerNavigationItem>
    <BannerNavigationItem>
      <Link href="https://unbooking.org/" target="_blank">
        UN Booking Hub
      </Link>
    </BannerNavigationItem>
    <BannerNavigationItem>
      <Link href="https://wfp.org" target="_blank">
        WFP.org
      </Link>
    </BannerNavigationItem>
    {search && (
      <BannerNavigationItem>
        <form
          action="http://gtd.wfp.org"
          method="GET"
          acceptCharset="UTF-8"
          target="_blank">
          <Search
            kind="banner"
            id="search-2"
            labelText="Find People"
            name="q"
            placeholder="Find People"
            onChange={searchOnChange}
          />
        </form>
      </BannerNavigationItem>
    )}
  </BannerNavigation>
);

export { BannerNavigationWithContent };
