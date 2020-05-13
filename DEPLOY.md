# Deployment Guide

Just run

```shell script
amplify env checkout prod

# If there are API changes
amplify push

npm run build

firebase deploy -m "v0.0.3 Date filters with tabs and new cards design with crypto icons"
```

That's it. Enjoy!

---

Wanna test before deploying? Just run:

```shell script
firebase serve --only hosting
```
