# Security policy

## Supported versions

Security fixes are applied to the latest published stable versions of the
Progressive UI packages. Older releases may require consumers to upgrade.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use GitHub's private
vulnerability-reporting flow in the repository's **Security** tab. Include the
affected package and version, reproduction steps, impact, and any suggested
mitigation.

Do not include registry tokens, `.npmrc` contents, environment values, or other
credentials in reports, logs, screenshots, or reproduction repositories.

## Maintainer handling

Maintainers should reproduce reports without production credentials, prepare a
coordinated fix, validate packed artifacts, and publish only through the
protected release pipeline. Public disclosure should follow remediation or a
coordinated disclosure decision.
