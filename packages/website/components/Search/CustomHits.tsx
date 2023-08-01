import Link from "next/link";

import { Highlight, Snippet, useHits } from "react-instantsearch-hooks-web";
import slugifyWithSlashes from "../../lib/slugifyWithSlashes";
import styles from "./customHits.module.scss";
import { useCallback, useEffect, useRef, useState } from "react";

function Hit({ hit, setOpen, count, index }: any) {
  const ref = useRef<any>(null);

  useEffect(() => {
    if (count === index) {
      ref.current.focus();
      ref.current.scrollIntoViewIfNeeded({
        behavior: "smooth",
      });
    }
  }, [count, index]);

  return (
    <Link
      onClick={() => setOpen(false)}
      href={`/${slugifyWithSlashes(hit.slug)}`}
      className={styles.hit}
      ref={ref}
    >
      <h4>
        <Highlight attribute="title" hit={hit} />
      </h4>
      <p>
        <Snippet attribute="content" hit={hit} />
      </p>
    </Link>
  );
}

function Hits(props: any) {
  const { results } = useHits();
  const validQuery = results && results.query?.length >= 3; // 3 is the minimum query length

  const [count, setCount] = useState(-1);

  const handleUpdateCount = useCallback(
    (value) => {
      setCount((prevCount) => {
        if (
          results &&
          prevCount + value >= 0 &&
          prevCount + value < results.hits?.length
        ) {
          return prevCount + value;
        }

        return value;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setCount]
  );

  useEffect(() => {
    const keyDownCallback = (e) => {
      if (e.keyCode === 27 || e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
      }
      switch (e.keyCode) {
        case 27:
          props.setOpen(false);
          break;
        case 38:
          handleUpdateCount(-1);
          break;
        case 40:
          handleUpdateCount(1);
          break;
      }
    };

    document.addEventListener("keydown", keyDownCallback);

    return () => document.removeEventListener("keydown", keyDownCallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUpdateCount]);

  return (
    <div className={styles.hits}>
      <div className={styles.results}>
        {results?.hits.length === 0 && validQuery /*  && focus */ && (
          <p className={styles.noResults}>No results found</p>
        )}

        {!validQuery /*&& focus*/ && (
          <p className={styles.noResults}>Type to show results...</p>
        )}

        {results && results.hits.length > 0 && validQuery && (
          <>
            {results.hits.map((hit, index) => (
              <Hit
                key={index}
                index={index}
                count={count}
                hit={hit}
                setOpen={props.setOpen}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Hits;
