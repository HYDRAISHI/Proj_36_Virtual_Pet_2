var dog,dogImg, happyDog, database, foodS, foodStock;
var button1, button2;
var fedTime;
var foodObj;
var lastFed;
function preload()
{
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
	createCanvas(1000, 800);
  dog = createSprite(600, 350);
  dog.addImage(dogImg);
  dog.scale = 0.2;

 
  
  database = firebase.database();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food(foodStock,lastFed);

  button1 = createButton("Feed The Dog");
  button1.position(500,95);
  button1.mousePressed(feedDog);

  button2 = createButton("Add Food");
  button2.position(600,95);
  button2.mousePressed(addFoods);

}


function draw() {  
  background("yellow");

  text("Press Up Arrow Key To Feed Your Dog Drago Milk", 125, 100);
  text("Food Left : " + foodS, 125, 130);
  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  if(lastFed>=12){
    text("Last Feed " + lastFed%12 + " PM", 350,30);
  }
  else if(lastFed === 0){
    text("Last Feed : 12 AM", 350,30);
  }
  else{
    text("Last Feed : " + lastFed + " AM", 350,30);
  }

  drawSprites();
 
  
  foodObj.display();
  if(foodS == 0){
    
    dog.addImage(dogImg);
    foodS = 20;
  
  }  
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }
  database.ref('/').update({
    
    'Food':x
  
  });

}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS ++;
  database.ref('/').update({
    Food:foodS
  })
}


