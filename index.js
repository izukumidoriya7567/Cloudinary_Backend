require("dotenv").config();
const express=require("express");
const app=express();
const cors=require("cors");
app.use(cors());
const cloudinary=require("cloudinary").v2;
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
})
app.get("/",(req,res)=>{
    res.status(200).json({message:"The Cloudinary related backend is working fine."});
})
app.get("/image/:email/:folder",async(req,res)=>{
      const email=req.params.email;
      const folder=req.params.folder;
      try{
        const result=await cloudinary.search
        .expression(`folder:${email}/${folder}`)
        .sort_by('created_at','desc')
        .max_results(10)
        .execute();
        const images=[];
        result.resources.map((img)=>{
            console.log(img.public_id);
            const obj={
                public_id:img.public_id,
                url:img.secure_url,
            }
            images.push(obj);
        })
        res.status(200).json(images);
      }
      catch(e){
        res.status(500).json({message:"The Images from the folder cannot be fetched"});
      }
})
app.delete("/images/:email/:folder/:public_id",async(req,res)=>{
    const email=req.params.email;
    const folder=req.params.folder;
    const publicId=req.params.public_id;
    try {
        const url=email+'/'+folder+'/'+publicId;
        const result = await cloudinary.uploader.destroy(url);
        console.log(result);
        if(result.result === "ok") {
          res.status(200).json({message:"Image deleted successfully"});
        }
        else if(result.result === "not found") {
          res.status(404).json("Image Not found");
        }
        else{
          res.status(400).json({message:result.result});
        }
      } catch (e) {
        res.status(500).json({message:`Error: ${e}`})
        console.error("Error deleting image:", error);
      }
})
module.exports=app;