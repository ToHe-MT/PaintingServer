console.log(
    'This script populates some test Paintings, Mediums, Dimensions, and Buyer to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

require('dotenv').config();

const Painting = require("./models/painting")
const Medium = require("./models/medium")
const Dimension = require("./models/dimension")
const Buyer = require("./models/buyer")

const paintings = [];
const mediums = [];
const dimensions = [];
const buyers = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

main().catch((err) => console.log(err));

async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Debug: Should be connected?");
    await createMedium();
    await createDimension();
    await createPainting();
    await createBuyer();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

async function mediumCreate(index,gsm,type,isFullCotton, tools, brand, info) {
    const paper = {gsm:gsm,type:type, isFullCotton:isFullCotton  }
    const medium = new Medium({ paper: paper, tools:tools, brand:brand,info:info});
    await medium.save();
    mediums[index] = medium;
    console.log(`Added medium: ${medium.title}`);
}

async function dimensionCreate(index,name,height,width) {
    const dimension = new Dimension({name:name,height:height,width:width});
    await dimension.save();
    dimensions[index] = dimension;
    console.log(`Added dimension: ${dimension.name}`);
}

async function paintingCreate(index,No,title,medium,dimension,price) {
    const painting = new Painting({No:No,title:title,medium:medium,dimension:dimension,price:price});
    await painting.save();
    paintings[index] = painting;
    console.log(`Added painting: ${painting.No}`);
}

async function buyerCreate(index,name,country,city,street,postalCode,email,phoneNumber) {
    const address = {country:country,city:city,street:street,postalCode:postalCode}
    const buyer = new Buyer({name:name,address:address,email:email,phoneNumber:phoneNumber});
    await buyer.save();
    buyers[index] = buyer;
    console.log(`Added buyer: ${buyer.Name}`);
}

async function createMedium(){
    console.log("Adding Medium");
    await Promise.all([
        mediumCreate(0,300,"watercolor",true,"Gouache","Miya"),
        mediumCreate(1,300,"watercolor",false,"Gouache","Miya"),
        mediumCreate(0,300,"watercolor",true,"Gouache","Holbein"),
        mediumCreate(1,300,"watercolor",false,"Gouache","Holbein"),
    ])   
}
async function createDimension(){
    console.log("Adding Dimension");
    await Promise.all([
        dimensionCreate(0,'A4',210,297),
        dimensionCreate(1,'A3',297, 420),
        dimensionCreate(2,'Original',200,200),
        dimensionCreate(3,'A5',148, 420),
        dimensionCreate(4,"A2", 148, 420)
    ])   
}
async function createPainting(){
    console.log("Adding Painting");
    await Promise.all([
        paintingCreate(0,100,"falling",mediums[0],dimensions[0],111),
        paintingCreate(1,101,"falling",mediums[1],dimensions[1],222),
        paintingCreate(2,102,"falling",mediums[1],dimensions[2],333),
    ])   
}
async function createBuyer(){
    console.log("Adding Buyer");
    await Promise.all([
        buyerCreate(0,"John", "United States", "Boston","Orchard Street", '13213',"john@gmail.com", "081244443333"),
        buyerCreate(1,"Casey", "United States", "Las Vegas","Mongan Street", '14036',"Casey@gmail.com", "081122223333")
    ])   
}