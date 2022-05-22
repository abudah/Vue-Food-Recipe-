<template>
	<div class="recipe" v-if="recipe.length===1">
          <router-link to="/about">&lt; Back</router-link>
          <h1>{{ recipe[0].title }}</h1>
          <p class="desc">{{ recipe[0].description }}</p>
          <hr />
		  <h2>Category</h2><br>
		  <p class="desc">{{ recipe[0].category }}</p>
          <hr />
		  <h2>Duration</h2> <br>
		  <p class="desc">{{ recipe[0].duration }} min</p>
          <hr />
          <div class="ingredients">
            <h2>Ingredients</h2><br>
            <ul>
              <li v-for="ingredient in recipe[0].ingredients" :key="ingredient.ing_number">
                {{ ingredient.ing_name }}
              </li>
            </ul>
          </div>	
          <div class="method">
            <h3>Method</h3>
            <ol>
              <li v-for="(step, i) in recipe[0].steps" :key="i">
                <span >{{step.description}}</span>
              </li>
            </ol>
      </div>
	</div>
	<div v-else>Loading the detail...</div>
</template>

<script>
import gql from "graphql-tag";
import { InMemoryCache } from "apollo-cache-inmemory";


// const GETSingle_Recipe = gql`
// query MyQuery($id:id ){
//   recipe (where: {id: {_eq: 10}}){
// 	id
//     title
//     description
//     category
//   }
// }
// `;
export default {
	
	data(){
		return{
			id: this.$route.params.id,
			recipe:[]
		}
	},
	
  apollo: {
    recipe: {
      query:gql`
				query MyQuery($id:Int!){
				recipe (where: {id: {_eq: $id}}){
					id
					title
					description
					category
					duration
					steps {
						id
						description
						}
						ingredients {
						ing_name
						ing_number
						}
				}
				}
			` ,variables(){
				return{
					id:this.id,
				}
			},
			update(data){
				
				let arr=[]
				arr=this.recipe.concat(data.recipe[0])
				this.recipe=arr;
				console.log(this.recipe)
				return this.recipe
			}
	   }
  },
	methods: {
		
		DataLoaded(){
			if(this.recipe.length){
				return true;
			}
			return false;
		}
	}
};

</script>

<style>
.recipe {
	padding: 1rem;
	max-width: 768px;
	margin: 0 auto;
}

.desc {
	font-size: 1.125rem;
	line-height: 1.4;
	margin-bottom: 1rem;
}

hr {
	margin-bottom: 1rem;
}

h3 {
	margin-bottom: 1rem;
}

.ingredients {
	padding: 1rem;
	background-color: #081c33;
	border-radius: 0.5rem;
	margin-bottom: 2rem;
}

.ingredients ul li {
	list-style-position: inside;
	line-height: 1.4;
	margin-bottom: 1rem;
}

.method ol li {
	margin-bottom: 2rem;
	padding-bottom: 1rem;
	list-style-position: inside;
	border-bottom: 1px solid #EEE;
}
</style>