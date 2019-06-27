import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

var database = firebase.firestore();
database.collection("projects").get().then(function(snapshot) {
  snapshot.forEach(function(doc) {
    console.log(doc.id, " => ", doc.data());
    console.log(doc.data()["category"])
  })
})
console.log(database)
