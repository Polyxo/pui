import React, { useEffect, useRef } from "react";
import { Search } from "@wfp/react";
import styles from "./search.module.scss";
import { useSearchBox } from "react-instantsearch-hooks-web";

interface SearchBoxProps {
  open: boolean;
  search: string;
  kind?: "main";
}

const SearchBox: React.FC<SearchBoxProps> = ({
  open,
  search,
  kind = "main",
}: SearchBoxProps) => {
  const { refine } = useSearchBox(/*{ search }*/);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (search !== "true") refine(search);
  }, [search, refine]);

  if (search !== "true") return <h3>{search}</h3>;

  return (
    <Search
      id="algolia_search"
      className={styles.search}
      placeholder="Search..."
      ref={searchRef}
      autoComplete="off"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        refine(e.target.value)
      }
    />
  );
};

export default SearchBox;
