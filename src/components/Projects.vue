<template>
  <div class="content">
    <div id="projects">
      <!-- Dynamically generated projects from firestore go here -->
    </div>
    <div id="billboard"></div>
  </div>
</template>

<script>
var database = firebase.firestore();

var getProjectItems = async function(project_name) {
  var project_items = []
  await database.collection("project_items").where("project", "==", project_name).get().then(function(snapshot) {
    snapshot.forEach(function(doc) {
      project_items.push({"prices": doc.data()["prices"], "date": doc.data()["date_scraped"]})
    })

    var max_item_count = Math.max(...project_items.map(function(x) {return x["prices"].length}))
    var first_x_row = Array.from(Array(max_item_count).keys())
    first_x_row.unshift('x')
    var load_rows = [first_x_row]

    project_items.forEach(function(item) {
      var records = item["prices"]
      var date = new Date(item["date"]["seconds"]*1000)
      records.unshift(date)
      load_rows.push(records)
    })
    chart.load({rows: load_rows, unload: true});
  })
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

var chart = bb.generate({
  bindto: "#billboardjs",
  data: { x: "x", type: "scatter", rows: []},
  legend: { show: false},
  axis: { x: { type: "timeseries", tick: { format: "%d-%m-%Y"}}, y: { label: "PLN"}},
  color: { pattern: ["#A9A9A9"]}
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
} ul {
  list-style-type: none;
  padding: 0;
} li {
  display: inline-block;
  margin: 0 10px;
} a {
  color: #42b983;
}
</style>
