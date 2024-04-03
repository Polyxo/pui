import algoliasearch from "algoliasearch/lite";
import CustomSearchBox from "./SearchBox";
import CustomHits from "./Hits";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./styles.module.scss";
import { InstantSearch } from "react-instantsearch-hooks";
import { usePathname, useRouter /* useSearchParams*/ } from "next/navigation";
import { useURLSearchParams } from "./useUrlSearchParams";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY as string
);

export const useOutsideAlerter = ({ ref, setOpen, open, pathname }) => {
  useEffect(() => {
    if (open) {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, setOpen, open, pathname]);
};

export const Portal = (props: any) => {
  const [mounted, setMounted] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    ref.current = document.body; //document.querySelector('#portal');
    setMounted(true);
  }, []);

  if (!mounted || !ref.current) return null;

  return createPortal(
    (
      <div
        className={`${styles.overlay} ${
          props.open ? styles.open : styles.closed
        }`}
      >
        <div className={styles.overlayBackground} />
        <div className={styles.overlayContent}>{props.children}</div>
      </div>
    ) as any,
    ref.current
  );
};

export default function SearchModal({ className }: any) {
  const [focus] = useState(false);
  const ref = useRef<any>(null);

  /* Open handler */
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useURLSearchParams();
  const search = searchParams?.get("search");
  const open = search ? true : false;
  //const searchParams = useSearchParams();
  const setOpen = (open) => {
    if (open) router.push(`${pathname}?search=true`, { scroll: false });
    else router.push(`${pathname}`, { scroll: false });
  };

  useOutsideAlerter({ ref, open, setOpen, pathname });

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      // event.metaKey - pressed Command key on Macs
      // event.ctrlKey - pressed Control key on Linux or Windows
      if ((event.metaKey || event.ctrlKey) && event.code === "KeyK") {
        console.log("Pressed Command/Control + C");
        setOpen(true);
      }
    };
    document.addEventListener("keydown", callback);
    return () => {
      document.removeEventListener("keydown", callback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!open) return null;
  return (
    <Portal open={search}>
      <div ref={ref} className={className}>
        <InstantSearch indexName="ui-docs" searchClient={searchClient}>
          {search && (
            <>
              <CustomSearchBox open={open} search={search} />
              <CustomHits focus={focus} setOpen={setOpen} open={open} />
            </>
          )}
        </InstantSearch>
      </div>
    </Portal>
  );
}
