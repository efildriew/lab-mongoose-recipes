const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const data = require('./data.js');

mongoose.connect('mongodb://localhost/recipeApp')
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });

const recipesSchema = new Schema ({
  title: {type: String, required: true, unique: true},
  level: {type: String, enum: ['Easy Peasy', 'Amateur Chef', 'UltraPro Chef']},
  ingredients: {type: Array},
  cuisine: {type: String, required: true},
  dishType: {type: String, enum: ['Breakfast', 'Dish', 'Snack', 'Drink', 'Dessert', 'Other']},
  image: {type: String, default: 'https://images.media-allrecipes.com/images/75131.jpg'},
  duration: {type: Number, min: 0},
  creator: {type: String},
  created: {type: Date, default: Date.now}
});

const Recipe = mongoose.model('Recipe', recipesSchema);

Recipe.create({
  title: 'IronBeer',
  level: 'Easy Peasy',
  ingredients: ['Water', 'Barley', 'Hops', 'Yeast'],
  cuisine: 'Universal',
  dishType: 'Drink',
  duration: 20,
  creator: 'IronMinions'
})
.then(recipe => {
  console.log(recipe.title);
  return Recipe.insertMany(data)
})
.then(recipes => {
  recipes.forEach((recipe) => console.log(recipe.title));
  Recipe.updateOne({
    title: 'Rigatoni alla Genovese',
    duration: 100
  })
})
.then(() => {
  console.log('succesfully updated recipe!');
  Recipe.findByIdAndRemove({
    title: 'Carrot Cake'
  })
})
.then(() => {
  console.log('Deleted Sucessfully!');
  mongoose.connection.close();
})
.catch(err => console.log(err));

module.exports = Recipe;