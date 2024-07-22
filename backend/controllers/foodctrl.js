import foodmodel from "../models/foodmodel.js";
import fs from 'fs';

//adding food model

const addFood = async(req,res)=>{

    let image_filename = `${req.file.filename}`;

    const food = new foodmodel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try{
        await food.save();
        res.json({success:true,message:"Food Added"})
    } catch(error) {
        console.log(error)
        res.json({success:false,message:"Error - food not added"})
    }
}

//food list
const listFood = async(req,res)=>{
    try{
        const foods = await foodmodel.find({});
        res.json({success:true,data:foods})
    } catch(error){
        console.log(error)
        res.json({success:false,message:error})
    }
}

//remove food from list
const removeFood = async(req,res)=>{
    try {
        const food = await foodmodel.findById(req.body.id);
        fs.unlink(`upload/${food.image}`,()=>{})

        await foodmodel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Item removed succesfully"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error - Item not deleted"})
        
    }
}

export{addFood,listFood,removeFood}