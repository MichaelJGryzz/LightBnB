# LightBnB Project

A simple multi-page Airbnb clone that uses server-side Javascript to display the information from queries to web pages via SQL queries.

## Screenshots

!["Screenshot of LighthouseBnB - login form"](https://github.com/MichaelJGryzz/LightBnB/blob/main/docs/LighthouseBnB-login-form.png?raw=true)
!["Screenshot of LighthouseBnB - main page after login"](https://github.com/MichaelJGryzz/LightBnB/blob/main/docs/LighthouseBnB-main-page%20after-login.png?raw=true)
!["Screenshot of LighthouseBnB - search filters form"](https://github.com/MichaelJGryzz/LightBnB/blob/main/docs/LighthouseBnB-search-filters-form.png?raw=true)
!["Screenshot of LighthouseBnB - create listing form"](https://github.com/MichaelJGryzz/LightBnB/blob/main/docs/LighthouseBnB-create-listing-form.png?raw=true)

## ERD

!["LightBnB Database ERD - "](https://github.com/MichaelJGryzz/LightBnB/blob/main/docs/LighthouseBnB%20ERD.png?raw=true)

## Getting Started

1. [Create](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) a new repository using this repository as a template.
2. Clone your repository onto your local device.
3. Install dependencies using the `npm install` command.
4. Set Up Database: Ensure PostgreSQL is installed and create a database `lightbnb`.
5. Seed Database: Run any scripts needed to seed the database with test data.
6. Start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>
7. Go to <http://localhost:3000/> in your browser.

## Dependencies

- bcrypt
- cookie-session
- Express
- Nodemon
- pg
- Node 5.10.x or above