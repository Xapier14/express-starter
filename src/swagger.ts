import swaggerJSDoc from "swagger-jsdoc";

const config = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express-Starter",
      version: "1.0.0",
    },
  },
  apis: ["./src/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(config);
