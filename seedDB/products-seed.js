const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const Product = require("../models/product");
const Category = require("../models/category");
const mongoose = require("mongoose");
const faker = require("faker");
const connectDB = require("./../config/db");
connectDB();

async function seedDB() {
  faker.seed(0);

  //----------------------Backpacks
  const women_titles = [
    "White Floral Dress",
    "Femmo T-shirt",
    "Pieces Metallic Printed",
    "Shirt in stretch cotton`",
    "Front Pocket Jumper",
    "Classic Trench coat",
    "Herschel Supply",
    "Esprit Ruffle Shirt"
  ];
  const women_imgs = [
    "https://www.lulus.com/images/product/xlarge/2593602_465132.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmhqlzULFNXfz2x64eIulYvWKvMad-6BttlA&usqp=CAU",
    "https://estylecdn.com/usersimgefcsite/485/zoom/alev_83211540_front5.jpg",
    "https://assets.burberry.com/is/image/Burberryltd/1E04AD8D-0943-45BB-B2C9-94B033445E0C.jpg?$BBY_V2_ML_1x1$&wid=2800&hei=2800",
    "https://editorialist.com/thumbnails/600/2020/9/012/777/944/12777944~yellow_1.jpg",
    "https://editorialist.com/wp-content/uploads/2021/04/Trench-Coats_Hero.jpg",
    "https://herschel.com/content/dam/herschel/products/40027/40027-00256-ALLSIZES_07.jpg",
    "https://i.pinimg.com/originals/62/1c/f4/621cf4961a9b0742e4cc1e094d7eebb7.jpg"
  ];

  //--------------------Travel Bags
  const men_titles = [
    "Brown Jacket",
    "Long sleeves shirt",
    "Formal Shirt",
    "Long sleeve Hoodie",
    "Mens Jogger Pant",
    "Mid weight Quilted Jacket",
    "Flat Front Pant",
    "Rugged Jeans Pant",
    "Office Formal Pants",
    "Pajama Pants",
    "Robes",
  ];

  const men_imgs = [
    "https://www.footeria.com/wp-content/uploads/2021/02/men-tan-brown-suede-jacket-tan-suede-leather-jacket-for-mens-rebelsmarket.jpg",
    "https://ae01.alicdn.com/kf/H7da3c60ffc2f43708cf293cd13c5ba50n/Legible-Casual-Social-Formal-shirt-Men-long-Sleeve-Shirt-Business-Slim-Office-Shirt-male-Cotton-Mens.jpg",
    "https://img2.exportersindia.com/product_images/bc-full/dir_182/5457925/mens-formal-shirts-1519877388-3689278.jpeg",
    "https://storage.googleapis.com/lulu-fanatics/product/37186/1280/lululemon-switch-up-long-sleeve-hoodie-heathered-black-1966-223813.jpg",
    "https://oldnavy.gap.com/webcontent/0020/687/514/cn20687514.jpg",
    "https://cdn.shopify.com/s/files/1/0264/0409/4049/products/Campione-Black-Avalanche-Midweight-Quilted-Jacket-7_740x.jpg?v=1624871457",
    "https://target.scene7.com/is/image/Target/GUEST_4e308afd-5493-48d1-94be-4146bc66729e?wid=488&hei=488&fmt=pjpeg",
    "https://m.media-amazon.com/images/I/71MZ9cTdZvL._AC_UX342_.jpg",
    "https://ae01.alicdn.com/kf/H7f4dfd8004d942bf9cbb1b605275ba8fL/Business-Slim-Fit-Formal-Pants-Mens-Suit-Trousers-Pantalon-Fashion-Office-Dress-Pant-Mens-Formal-Pants.jpg",
    "https://www.thepajamacompany.com/images/product/boxer%20maroonnaturalbuffmodel.png",
    "https://d1wwyfhxuarwk4.cloudfront.net/images/products/common/inspiration/xl/4606-77-i_cotton-kimono-mens-robe-grey27bead869f4259faa96e209e5d063b4a.jpg",
  ];


  async function seedProducts(titlesArr, imgsArr, categStr) {
    try {
      const categ = await Category.findOne({ title: categStr });
      for (let i = 0; i < titlesArr.length; i++) {
        let prod = new Product({
          productCode: faker.helpers.replaceSymbolWithNumber("####-##########"),
          title: titlesArr[i],
          imagePath: imgsArr[i],
          description: faker.lorem.paragraph(),
          price: faker.random.number({ min: 10, max: 50 }),
          manufacturer: faker.company.companyName(0),
          available: true,
          category: categ._id,
        });
        await prod.save();
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function closeDB() {
    console.log("CLOSING CONNECTION");
    await mongoose.disconnect();
  }

  await seedProducts(men_titles, men_imgs, "Men");
  await seedProducts(women_titles, women_imgs, "Women");


  await closeDB();
}

seedDB();
