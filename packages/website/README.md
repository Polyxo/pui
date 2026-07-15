# README

This is the documentation website for the WFP Design System.

The website runs on a Vercel instance and can be deployed using the [Vercel CLI](https://vercel.com/docs/cli) or [AWS Amplify](https://aws.amazon.com/amplify/).

## Search index administration

The browser search client is read-only and uses
`NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY`. Updating the `ui-docs` index is a separate
administrative operation; the website does not expose an API route that can
write to Algolia.

Run the update only in a trusted deployment job that supplies the Algolia
application ID and admin key:

```sh
ALGOLIA_INDEX_WRITE=update-ui-docs yarn workspace @progressiveui/core-website search:index:update
```

The job must provide `NEXT_PUBLIC_ALGOLIA_APP_ID` and
`ALGOLIA_SEARCH_ADMIN_KEY` through its secret store. Never put the admin key in
a `NEXT_PUBLIC_*` variable, source control, logs, preview builds, or browser
code. Normal installation, validation, and website builds do not update the
remote index. Set `ALGOLIA_SEARCH_INDEX_NAME` only when intentionally targeting
an index other than `ui-docs`.

To validate the local content and generated record IDs without credentials or
network access, run:

```sh
yarn workspace @progressiveui/core-website search:index:check
```

## Run on Amplify

Make sure your branch has the correct framework settings

```
aws amplify update-branch --app-id <value> --branch-name <value> --framework 'Next.js - SSR --profile <value>'
```
