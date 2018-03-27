# Casechek Techincal Interview Example App
***A small Angular/Express application to view and filter Chicago data***.

### Getting Started
This is a simple node application built using gulp and can be run easily.
1. clone the application (use the feature branch) `git clone https://github.com/tdmoneybanks/case-chek.git -b feature/search-tools`
2. install the Deps `npm install`
3. build the code base and run the server `gulp`
4. visit the running application at `http://localhost:8080`
### Features
* gulp build featuring: nodemon, sourcemaps, concat and minify JS/CSS, SASS, ES6, file watcher
* Real-time Fuzzy search with advanced search capabilities
    - http://fusejs.io/
* Node middle/api layer allowing transformation of data, data sharding (pagination)
* caching of data on server side for performance
* front end pagination
* google streetview api
* modal-based detail view

### Enhancements
* stengthen caching strategy by aligning it with front-end generated session-id
* encoroprate loading states to improve the ui of application
* refactor list-card into separate angular component
* use google api angular service and determine what is a "good image" and handling of "bad" images.
* some results appear to be duplicates, filter these out on the server side
* implement front end router and assign a query param of the item's id when a detailed view is open (allowing users to navigate back to specific detail view)
* sorting functionality
* ui/display changes based on pass/fail of inspection (green/red indicators)
* Use a bundler like webpack or rollup to ease handling of dependencies and use es6 import/export
