# Painting Database Admin Dashboard

Websites that have CRUD Applications and  that is designed to hold a paintings data. 

This is my first full-stack Non-Tutorial Projects. 

Aims to Train my DB Architecture. Design the schema, relations, and validations in both Server and Client 
First Time Developing API from scratch and connect it to the client-side 

Client Side Repo - [Repository](https://github.com/ToHe-MT/PaintingClient)

## Express App Setup

This repository contains an Express.js application.

### Installation

1. Clone the repository: `git clone https://github.com/ToHe-MT/PaintingServer.git`


2. Install dependencies: `npm install`


### Environment Setup

Create a `.env` file in the root directory of the project and add the following environment variables:

- `MONGODB_URI` - MongoDB Atlas URL (Do not forget to setting up on your mongoDb atlas)
- `CLIENT` - Where the Client or FrontEnd Hosted, To allow CORS policy
- `PORT` - The port number on which the server will run. or by default 9000

### PopulateDB

There is function that I made to populate the DB Instead of adding it one by one
`node populatedb.js`

### To run the server use 

`npm start` for Node
`npm run dev` for Nodemon

