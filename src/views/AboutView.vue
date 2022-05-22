<template>
  <div class="about">
    <h1>My Recipes</h1>
    <button @click="popupOpen=!popupOpen" >Add new Recipe</button>

      // Search bar
<div class="flex justify-center">
  <h1>Filter  :   </h1>
  <div class="mb-3 xl:w-96">
    <select
      v-model="selectedFilter"
     class="form-select form-select-lg mb-3
      appearance-none
      block
      w-full
      px-4
      py-2
      text-xl
      font-normal
      text-gray-700
      bg-white bg-clip-padding bg-no-repeat
      border border-solid border-gray-300
      rounded
      transition
      ease-in-out
      m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label=".form-select-lg example">
        <option value="title">title</option>
        <option value="category">Category</option>
        <option value="ingredients">Ingredients</option>
        <option value="duration">Recipe Duration</option>
    </select>

  </div>
</div>
    <div class="flex justify-center">
      <div class="mb-3 xl:w-96">
        <div class="input-group relative flex flex-wrap items-stretch w-full mb-4">
          <input type="search"  v-model="searchQuery" placeholder="Search" >
          <button class="form-control" >Search</button>
        </div>
      </div>
</div>

    <div class="recipes" v-if="resultQuery.length">
      <div class="card" v-for="recip in resultQuery" :key="recip.title">
        <h2>{{ recip.title }}</h2>
        <p>{{ recip.description }}</p>
        <router-link :to="`/recipe/${recip.id}`">
          <button>View Recipe</button>
        </router-link>
      </div>

    </div>
    <div class="loading" v-else>
      <h1>Please Wait while loading...</h1>
    </div>

    <div class="add-recipe-popup" v-if="popupOpen">
      <div class="popup-content">
        <h2>Add new recipe</h2>

        <form @submit.prevent="addNewRecipe">
          <div class="group">
            <label>Title</label>
            <input type="text" v-model="title" required/>
          </div>
          <div class="group">
            <label>Category</label>
            <input type="text" v-model="category" required/>
          </div>

          <div class="group">
            <label>Description</label>
            <textarea v-model="description" required></textarea>
          </div>
         
          <ValidationProvider rules="positive" v-slot="{ errors }" class="group">
            <label>duration it Takes</label>
            <input v-model="duration" type="text">
            <span class="text-red-700">{{ errors[0] }}</span>
          </ValidationProvider>

          <div class="group">
            <label>Ingredients</label>
            <div class="ingredient" v-for="i in ingredientRows" :key="i">
              <input type="text" v-model="ingredients[i - 1]" />
            </div>
            <button type="button" @click="addNewIngredient">Add Ingredient</button>
          </div>

          <div class="group">
            <label>step</label>
            <div class="step" v-for="i in stepRows" :key="i">
              <textarea v-model="step[i - 1]" required></textarea>
            </div>
            <input type="file">
            <button type="button" @click="addNewStep">Add step</button>
          </div>

          <button type="submit" @click="addNewRecipe">Add Recipe</button>
          <button type="button" @click="togglePopup">Close</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ValidationProvider } from 'vee-validate';
import { extend } from 'vee-validate';
// Validation Rules from Vee-validate

extend('positive', value => {
  return value >= 0;
});
extend('positive', value => {
  return value >= 0;
});
extend('positive', value => {
  return value >= 0;
});
extend('positive', value => {
  return value >= 0;
});


const ADD_RECIPE=gql`
  mutation addRecipe(
    $title:String!,
    $description: String!,
    $category:String!,
    $duration: Int,
    $ingredients:[ingredient_insert_input!]!,
    $steps:[step_insert_input!]!
  ) {
    insert_recipe(
      objects: [
        {
          title:$title,
          description:$description,
          category:$category,
          duration: $duration,
         ingredients: {data:$ingredients},
         steps:{data:$steps},
        }
      ]
    ) {
      returning {
        id
      }
    }
  }

`

const GET_Recipes = gql`
query MyQuery {
  recipe {
    id
    title
    description
    category
    title
    ingredients{
      ing_name
    }
  }
}
`;


export default {
  name: 'Home',
  components: {
   		 ValidationProvider
 	 },
  data(){
    return{
        title: '',
        description: '',
        category: '',
        duration: '',
        ingredients: [],
        step: [],
        img:'',
        ingredientRows: 1,
        stepRows: 1
    ,
    popupOpen : false,
    recipe:[],
    selectedFilter:'',
    searchQuery:null
  
    }
  },
  apollo: {
    recipe: {
      query:GET_Recipes
    }
  },
  methods:{

    togglePopup(){
      this.popupOpen=!this.popupOpen;
    },
    addNewIngredient  (){
      this.ingredientRows++;
    },
    
    addNewStep () {
     this.stepRows++;
    },
    
    addNewRecipe() {
      const IngredientList =  this.ingredients;
      const StepsList=this.step;
      var ingredients = Object.keys(IngredientList).map(e => ({ing_number: ++e, ing_name: IngredientList[e-1]}))
      var steps=Object.keys(StepsList).map(e => ({step_number: ++e, description: StepsList[e-1]}))
      const { title, description, category, duration} = this.$data;
      this.$apollo.mutate({
        mutation: ADD_RECIPE,
        variables: {
          title,
          description,
          category,
          duration,
          ingredients,
          steps
        },
        refetchQueries: ["GET_Recipes"]
      });
      this.togglePopup();
    },
 
    },
      
      computed:{
     resultQuery() {
  
      if (this.searchQuery) {
        return this.recipe.filter((item) => {
          if(this.selectedFilter==="category"){
            return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => item.category.toLowerCase().includes(v));
          }else if(this.selectedFilter==="title"){
              return this.searchQuery
            .toLowerCase()
            .split(" ")
            .every((v) => item.title.toLowerCase().includes(v));
          }else if(this.selectedFilter==="duration"){
            console.log("Here I am selected now")
            console.log(this.searchQuery)
             return this.recipe=this.recipe.filter(item=>item.duration > this.searchQuery)
          }else if(this.selectedFilter==="ingredients"){
              return this.searchQuery

            .split(" ")
            .every((v) => item.ingredients.ing_name.prototype().includes(v));
          }
        });
      } else {
        console.log(this.recipe);
        return this.recipe;
      }
    },
   }
  }

</script>
<style>
.home {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 32px;
}
.loading{
  text-align: center;
  padding:200px;
}
.recipes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  
}

.recipes .card {
  padding: 1rem;
  border-radius: 5px;
  margin: 1rem;
  background-color: #081c33;
}

.recipes .card h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.recipes .card p {
  font-size: 1.125rem;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.add-recipe-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: scroll;
}

.add-recipe-popup .popup-content {
  background-color: #081c33;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 768px;
}

.popup-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.popup-content .group {
  margin-bottom: 1rem;
}

.popup-content .group label {
  display: block;
  margin-bottom: 0.5rem;
}

.popup-content .group input,
.popup-content .group textarea {
  display: block;
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.popup-content .group textarea {
  height: 100px;
  resize: none;
}

.popup-content button[type="submit"] {
  margin-right: 1rem;
}
</style>