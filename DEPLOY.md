# Deployment Guide

## Prepare to deploy

- From `master` create `relese` branch.
- Checkout `release` branch.
- Update `README.md` and `package.json` to the new version.
- Commit changes.
- Create tag and release targeting `release` branch.
- Merge `release` to `master`.
- Delete `release` branch.


## (Manual) Deploy

- Checkout version just tagged in the previous steps
- Update cloud resources with:

```shell script
amplify env checkout prod

# If there are API changes
amplify push
```

- Test locally 

```shell script
npm run build
firebase serve --only hosting
```

- Deploy code

```shell script
npm run build
firebase deploy -m "v0.0.5 Account picker in tree view"
```
