## Why

What problem this change closes for a reader or maintainer.

## Scope

Files or catalog records that changed.

## Salesforce sources

Official docs URLs that back any new or changed platform claim. Write "none" if the PR does not change platform facts.

## Blast radius

Who reads a different page, or which CI job now runs.

## Verification

Commands you ran and what they proved.

## Checklist

- [ ] `npm run quality` passes locally, or this PR is docs or CI only and CI is green
- [ ] No invented Salesforce facts, SKUs, lifecycle, or docs URLs
- [ ] New topics have a map `SHORT_LABEL`, `updatedOn`, and at least one `salesforce.com` resource
- [ ] Versus matrix `pick` values match option labels, or are `null` with a note
