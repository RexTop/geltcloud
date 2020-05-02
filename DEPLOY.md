# Deployment Guide

Just run

```shell script
amplify env checkout prod

# If there are API changes
amplify push

npm run build

firebase deploy -m ""
```

That's it. Enjoy!

---

Wanna test before deploying? Just run:

```shell script
firebase serve --only hosting
```
