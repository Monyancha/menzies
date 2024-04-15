# Menzies Aviation

![loginmenzies](https://github.com/charlesnyakumbo/menziesFront/assets/34887895/d3c00bd5-6bee-41b1-a365-cb518d797763)

Welcome to Menzies Aviation System! This project is built using Next.js, a React framework for production. Below, you'll find instructions on how to set up the project, run it locally, and deploy it to production.

![loginmenzies2](https://github.com/charlesnyakumbo/menziesFront/assets/34887895/3b94df3d-89cd-4afb-92e1-d7ce33330f70)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v20.0 or higher)
- npm (v10.0 or higher) or yarn (v1.22 or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/charlesnyakumbo/menziesFront.git
   ```

2. Navigate to the project directory:

   ```bash
   cd menziesFront
   ```

3. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

## Development

To start the development server, run:

```bash
npm run dev
# or
yarn dev
```

The development server will start at `http://localhost:3000` by default. Open this URL in your web browser to view the application.

## Building for Production

To build the project for production, run:

```bash
npm run build
# or
yarn build
```

This command will generate an optimized production build of the application.

## Running in Production Mode

To run the application in production mode, after building it, run:

```bash
npm start
# or
yarn start
```

This command starts the Next.js server in production mode.

## Deploying to Production

To deploy the application to production, follow the deployment instructions for your chosen hosting provider. You can also use the following command to export the application as a static site:

```bash
npm run export
# or
yarn export
```

The static site will be generated in the `out` directory. You can then deploy this directory to any static hosting provider.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs) - Official documentation for Next.js.
- [React Documentation](https://reactjs.org/docs/getting-started.html) - Official documentation for React.
- [npm Documentation](https://docs.npmjs.com/) - Official documentation for npm.
- [Yarn Documentation](https://yarnpkg.com/getting-started) - Official documentation for Yarn.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please open an issue or submit a pull request. Make sure to follow the project's coding conventions and style guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
