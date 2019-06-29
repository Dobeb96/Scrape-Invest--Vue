<template>
  <div class="content">
    <div id="projects">
      <h1 id="site_title">Scrape Invest</h1>
      <!-- Dynamically generated projects from firestore go here -->
    </div>
    <section>
      <h1 id="project_name"><span style="color:transparent">-</span></h1>
      <div id="stats_billboard" class="billboard"></div>
      <div id="billboard" class="billboard"></div>
    </section>
  </div>
</template>

<script>
var database = firebase.firestore();

var getProjectItems = async function(project_name) {
  document.getElementById("project_name").innerHTML = project_name;

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

    var load_columns = [column_dates]
    load_columns.push(item_min_price)
    load_columns.push(item_max_price)
    load_columns.push(average_price)
    stats_chart.load({columns: load_columns, unload: true})
    chart.load({rows: load_rows, unload: true})
  })
}

var first_project = null
// Iterate through projects and create an HTML element for each of them
// Each element has an onclick listener
database.collection("projects").get().then(function(snapshot) {
  snapshot.forEach(function(doc) {
    var project = document.createElement("h2")
    project.id = doc.id
    project.className = "project"
    project.innerHTML = doc.id
    document.getElementById("projects").appendChild(project)
    document.getElementById(doc.id).addEventListener("click", function() {getProjectItems(doc.id)}, false)
    if (!first_project) {
      document.getElementById('project_name').innerHTML = doc.id
      first_project = project
    }
  })
})

setTimeout(function() {
  first_project.click();
}, 800);

export default {
  name: 'Projects',
  props: {
    msg: String
  }
}

var stats_chart = null
var chart = null
document.addEventListener("DOMContentLoaded", function(event) {
  stats_chart = bb.generate({
    bindto: "#stats_billboard",
    data: { x: "x", types: {minimum: "spline", maximum: "spline", average: "line"}, columns: [], rows: []},
    axis: {
      x: { type: "timeseries", tick: { format: "%d-%m-%Y"}},
      y: { min: 0, label: "PLN", tick: { format: function(x) { return (x) + " PLN" }}}},
    color: { pattern: ["#bbb", "#ddd", "#fab95b"]},
    grid: { x: { show: false}, y: { show: true}}
  });

  chart = bb.generate({
    bindto: "#billboard",
    data: { x: "x", type: "scatter", columns: [], rows: []},
    legend: { show: false},
    axis: {
      x: { type: "timeseries", tick: { format: "%d-%m-%Y"}},
      y: { min: 0, label: "PLN", tick: { format: function(x) { return (x) + " PLN" }}}},
    color: { pattern: ["navy"]},
    grid: { x: { show: false}, y: { show: true}}
  });
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1#site_title, h1#project_name {
  font-size: 3vw;
  margin: 0;
} h1#project_name {
  font-size: 8vw;
} h1#site_title {
  margin-bottom: 1em;
  z-index: -1;
  border: 10px dotted #f76262;
  color: #f76262;
  transform: rotate(-10deg);
  text-align: center;
} .content {
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  overflow: hidden;
  height: 100vh;
} #projects {
  box-shadow: 3px 0px 5px 0px rgba(0,0,0,0.35);
  background-image: url('../assets/email-pattern.png');
  align-self: center;
  flex-grow: 3;
  box-sizing: border-box;
  padding: 1em 2em;
  width: 10vw;
  height: 100%;
  overflow-y: scroll;
  position: relative;
} #projects::-webkit-scrollbar, section::-webkit-scrollbar {
  display: none;
} section {
  overflow-y: scroll;
  height: 100%;
  align-self: center;
  padding: 0.5em;
  flex-grow: 3;
  width: 70vw;
} .bb {
  width: 100%;
}
</style>
