const express=require("express");
const app=express();
const cors=require("cors");
app.use(cors());
const cloudinary=require("cloudinary").v2;
const PORT=process.env.PORT||8000;
cloudinary.config({
    cloud_name:"dfwyxz77d",
    api_key:"893751572926164",
    api_secret:"UjXkhTGjP6SHb9xvoIgXucoH5PU",
})
app.get("/",(req,res)=>{
    res.send("The Cloudinary related backend is working fine.");
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
        res.json(images);
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
        console.log(url);
        const result = await cloudinary.uploader.destroy(url);
        console.log(result);
        if (result.result === "ok") {
          console.log("Image deleted successfully.");
        } else if (result.result === "not found") {
          console.log("Image not found.");
        } else {
          console.log("Unexpected result:", result);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      }
})
app.listen(8000,()=>{
    console.log("Server is up and running at PORT:8000");
})