# magic-fifths
####Description: 
It is a mobile app for exploring musical fifth sheets very easy, fast an intuitive, 
useful for learning or simply review them while you are composing or performing music.

####Source code:
Application code is under source/app/ folder.
source/www folder is auto-generated and the only reason to not be added on the .gitignore is to be accessible from the Adobe Phonegap cloud build.

####INSTALLATION:
- Install NodeJS (https://nodejs.org/en/)
- npm install -g phonegap gulp bower

####DOWNLOAD DEPENDENCIES:
- cd source/
- npm install
- bower install

####RUN APP ON LOCAL ENVIRONMENT:
- cd source/
- gulp serve

####RUN DISTRIBUTION PACKAGE FOR WEB:
- cd source/
- gulp serve:dist

####COPY DISTRIBUTION PACKAGE FOR MOBILE PHONEGAP:
- cd source/
- gulp mobile (after previously doing a "gulp serve:dist").

####TESTS
Tests (both unit and e2e) are still work in progress.

####Contributing
This project uses:
- Web Starter Kit
- Gulp
- Angular
- Bower
- Foundation
- Phonegap
- requireJS
- hammerJS
- ngCordova
- jshint
- karma
- protractor
- jasmine
- sass
