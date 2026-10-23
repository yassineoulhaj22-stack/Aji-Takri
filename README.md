# AJI TKRI 🏠

![AJI TKRI](www/assets/logo/logo.svg)

Plateforme de location 100 % marocaine et flexible, en **français, arabe et anglais**.

## Structure
```
www/            → l'application (HTML, CSS, JS)
  index.html
  css/style.css
  js/ (data.js, i18n.js, store.js, app.js)
  assets/logo/
assets/icon.png → icône de l'app Android (1024×1024)
capacitor.config.json, package.json → configuration Android
.github/workflows/build-apk.yml → compile l'APK automatiquement
```

## Obtenir l'APK
1. Poussez le projet sur GitHub (branche `main`).
2. Onglet **Actions** → workflow **Build Android APK** (≈ 5 à 8 min).
3. Ouvrez l'exécution terminée → **Artifacts** → téléchargez **AJI-TKRI-apk** (zip contenant `AJI-TKRI.apk`).
4. Sur le téléphone : installez l'APK (autorisez « sources inconnues »).

### Publier une version téléchargeable
```
git tag v1.0.0
git push origin v1.0.0
```
L'APK apparaît dans **Releases**.

## Version web (optionnel)
Le dossier `www/` est un site statique : vous pouvez aussi le publier avec GitHub Pages (action de déploiement sur le dossier `www`).

## Notes
- L'APK généré est un APK **debug** (signé avec la clé de debug) : parfait pour tester.
- Pour le Play Store : créer un keystore (ne jamais le mettre sur GitHub, utiliser les *Secrets*) et compiler `assembleRelease`.
- Les données sont stockées localement (localStorage). Pour une vraie version multi-utilisateurs : Firebase.
