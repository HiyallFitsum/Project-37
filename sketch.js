//Create variables here
var dog, happyDog, database, foodStock;

var foodStock = 5;

var database = firebase.database();

var buttonFeed;
var buttonAdd;

var fedTime;
var lastFed;

var foodObj;

var bedroom, garden, washroom;

var gameState;
var changingState;
var readState;

var dogImage, happyDogImage, bedroom, garden, washroom, lazyDog;

function preload()
{
  //load images here
  dogImage = loadImage('images/Dog.png');
  happyDogImage = loadImage('images/Happy.png');
  bedroom = loadImage('images/BedRoom.png');
  garden = loadImage('images/Garden.png');
  washroom = loadImage('images/WashRoom.png');
  //sadDog = loadImage("images/")
  lazyDog = loadImage('images/Lazy.png');
}

function setup() {
  createCanvas(displayWidth, displayHeight);

  dog = createSprite(displayWidth - 200,250,25,25);
  dog.addImage(dogImage);
  dog.scale = 0.25;

  console.log(dog.x);
  console.log(dog.y);
  console.log(canvas.width);

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  feed=createButton(" Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedTheDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

    foodObj = new Food();

}

function draw() {  
  background(46,139,87);

  //add styles here
  fill("black");
  textSize(15);
  text("FoodStock:" + foodStock, 25, 25);

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + "PM", 350,30);
  }else if(lastFed==0){
    text("Last Feed : 12 AM",350,30);
    }else{
      text("Last Feed : "+ lastFed + "AM", 350,30);
    }

    if(gameState!="Hungry" || gameState!="Playing" || gameState!="Sleeping" || gameState!="Bathing"){
      feed.hide();
      addFood.hide();
      //dog.remove();
      dog.addImage(lazyDog);
    }else if(gameState == "Hungry"){
      feed.show();
      addFood.show();
      dog.addImage(dogImage);
    }

  currentTime=hour();
    if(currentTime == (lastFed+1)){
      update('Playing')
      foodObj.garden();
    }else if(currentTime == (lastFed+2)){
        update("Sleeping");
        foodObj.bedroom();
    }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
         update("Bathing");
          foodObj.washroom();
    }else{
      update("Hungry");
      foodObj.display();
    }

    drawSprites();
}


function addFoods(){
foodStock = foodStock + 1;
//writeStock(foodStock);

database.ref('/').update({
  Food:foodStock
  })
}

function feedTheDog(){
  foodStock = foodStock -1;
  //writeStock(foodStock);
  dog.addImage(happyDogImage);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

//food.deductFood();

}

function update(state){
  database.ref('/').update({
    gameState: state
  });
}

function readStock(data){
  foodStock=data.val();
  foodObj.updateFoodStock(foodStock);

}

function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x = x-1;
  }

  database.ref("/").update({
    Food:x
  })
}

//<link rel="stylesheet" type="text/css" href="style.css"/>

