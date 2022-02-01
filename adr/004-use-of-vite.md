# ADR 004: use of Vite

[Vite](https://vitejs.dev/) is used as build and development tool for the web
application, because it offers significantly faster startup times over the
popular
[Create React App (CRA)](https://reactjs.org/docs/create-a-new-react-app.html).
The first page renders after less than a second using Vite, with CRA it takes
around 60 seconds to start the development server.
