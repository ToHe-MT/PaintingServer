const mongoose = require("mongoose")

const Schema = mongoose.Schema

const PaperSchema = new Schema({
    gsm: {type:Number, required: true},
    type: {type:String, required:true},
    isFullCotton: {type:Boolean}
})
const MediumSchema = new Schema({
    paper: {type: PaperSchema, required: true},
    tools: {type: String, required: true, enum:['Gouache','Watercolor', 'Acrylic', 'Oil']},
    brand: {type: String, required: true, maxLength:50},
    info: {type:String, required:false}
})

MediumSchema.virtual("display").get(function () {
    if (this.paper.isFullCotton===true){
        return `${this.tools} on 100% cotton, ${this.paper.gsm} gsm ${this.paper.type} paper`;
    } else {
        return `${this.tools} on ${this.paper.gsm} gsm ${this.paper.type} paper` 
    }
});

MediumSchema.virtual("url").get(function () {
    return `/dimension/${this._id}`;
});

//Export
module.exports = mongoose.model("Medium", MediumSchema);