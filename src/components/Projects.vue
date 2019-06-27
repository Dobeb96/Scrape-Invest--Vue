<template>
  <div id="projects">
    <!-- Dynamically generated projects from firestore go here -->
  </div>
</template>

<script>
var database = firebase.firestore();

var getProjectItems = function(project_name) {
  var project_items = []
  database.collection("project_items").where("project", "==", project_name).get()
  .then(function(snapshot) {
    snapshot.forEach(function(doc) {
      project_items.push({"prices": doc.data()["prices"], "date": doc.data()["date_scraped"]})
    })
  })
  console.log('OK')
  console.log(project_name)
  console.log(project_items)
}

// Iterate through projects and create an HTML element for each of them
// Each element has an onclick listener
database.collection("projects").get().then(function(snapshot) {
  snapshot.forEach(function(doc) {
    var project = document.createElement("h2")
    project.id = doc.id
    project.class = "project"
    project.innerHTML = doc.id
    document.getElementById("projects").appendChild(project)
    document.getElementById(doc.id).addEventListener("click", function() {getProjectItems(doc.id)}, false)
  })
})

export default {
  name: 'Projects',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
