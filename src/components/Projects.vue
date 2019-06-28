<template>
  <div class="content">
    <div id="projects">
      <!-- Dynamically generated projects from firestore go here -->
    </div>
    <div id="stats_billboard"></div>
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

    var max_item_count = Math.max(...project_items.map(function(x) { return x["prices"].length}))
    var item_min_price = project_items.map(function(x) { return Math.min(...x["prices"])})
    var item_max_price = project_items.map(function(x) { return Math.max(...x["prices"])})
    var average_price  = project_items.map(function(x) {
      return Math.round(x["prices"].reduce(function(curr, sum) {
        return curr + sum}) / x["prices"].length)
      })
    console.log(item_min_price)
    console.log(item_max_price)
    console.log(average_price)

    var first_x_row = Array.from(Array(max_item_count).keys())
    first_x_row.unshift('x')
    item_min_price.unshift('minimum')
    item_max_price.unshift('maximum')
    average_price.unshift('average')
    var load_rows = [first_x_row]

    var column_dates = ['x']
    project_items.forEach(function(item) {
      var records = item["prices"]
      var date = new Date(item["date"]["seconds"]*1000)
      column_dates.push(date)
      records.unshift(date)
      load_rows.push(records)
    })
    // item_min_price.unshift(date)
    // item_max_price.unshift(date)
    // average_price.unshift(date)
    var load_columns = [column_dates]
    load_columns.push(item_min_price)
    load_columns.push(item_max_price)
    load_columns.push(average_price)
    stats_chart.load({columns: load_columns, unload: true})
    chart.load({rows: load_rows, unload: true})
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

var stats_chart = bb.generate({
  bindto: "#stats_billboardjs",
  data: { x: "x", types: {minimum: "spline", maximum: "area-spline", average: "area-spline"}, columns: [], rows: []},
  axis: {
    x: { type: "timeseries", tick: { format: "%d-%m-%Y"}},
    y: { min: 0, label: "PLN", tick: { format: function(x) { return (x) + " PLN" }}}},
  color: { pattern: ["#ccc", "#aaa", "navy"]},
  grid: { x: { show: true}, y: { show: true}}
});

var chart = bb.generate({
  bindto: "#billboardjs",
  data: { x: "x", type: "scatter", columns: [], rows: []},
  legend: { show: false},
  axis: {
    x: { type: "timeseries", tick: { format: "%d-%m-%Y"}},
    y: { min: 0, label: "PLN", tick: { format: function(x) { return (x) + " PLN" }}}},
  color: { pattern: ["navy"]},
  grid: { x: { show: true}, y: { show: true}}
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
