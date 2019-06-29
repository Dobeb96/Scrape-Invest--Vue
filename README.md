# Scrape-Invest--Vue
Fron-end for my investment scraping project.

This **Vue.js** application connects to my **Firestore** database, gets all available scraping projects, and presents them in a nice format using **Billboard.js** library.

# How to run locally
`npm run serve`

# How to publish Vue.js to gh-pages
Initial publish:

https://medium.com/@Roli_Dori/deploy-vue-cli-3-project-to-github-pages-ebeda0705fbd

Consecutive builds:
```
git checkout gh-pages
git merge master
npm run build
git add dist && git commit -m "Next build message"
git subtree push --prefix dist origin gh-pages
```
wait a couple of minutes for Github to build the new project
