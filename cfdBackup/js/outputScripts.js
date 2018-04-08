"use strict";

// COLOR is for the country
let chosen_event_name;
let COLOR_MAP = {};
let COLOR = { red: 57, green: 120, blue: 170 };

window.addEventListener("load", main);

function main() {
  createColorMap();
  initializeMapOnDocument();
}

function createColorMap() {
  Object.values(COUNTRY_DATA).forEach(function (key) {
    COLOR_MAP[key] = generateRandomColor();
  });
}

function generateRandomColor() {
  // return { red: 57, green: 120, blue: 170 };
  return {red: createRandomColor(), green: createRandomColor(), blue: createRandomColor()};
}

function createRandomColor() {
  return Math.round(Math.random() * 80) + Math.round(Math.random() * 1) + 10;
}

function initializeMapOnDocument() {
  colorMapCountries();
  addEventSelectionOnBodyThenLoadMap();
  makeItPossibleToCreateEvents();
  makeItPossibleToDeleteEvents();
  makeItPossibleToDownloadData();
}

function colorMapCountries() {
  Object.values(COUNTRY_DATA).forEach(function (country_code) {
    let path = document.getElementById(country_code);
    path.style.fill = "#3978AA";
  });
}

/** this methods allows one to select events to display
 * on the map. first, this method loads all the events,
 * using firebaseHelper.loadAllEventNames, then once the
 * events are loaded, we change the variable chosen_event_name
 * to be the event that's currently on the select element.
 * Then, take a look at "event_selection.addEventListener("change",..."
 * whenever the event changes, we reload the map with displayMapEvent()
 * */
function addEventSelectionOnBodyThenLoadMap() {
  let event_selection = document.getElementById("event-selected");
  let event_deletion_selection =  document.getElementById("event-selected-delete");
  // remove every children
  while (event_selection.children.length > 0) {
    event_selection.removeChild(event_selection.children[0]);
  }
  while (event_deletion_selection.children.length > 0) {
    event_deletion_selection.removeChild(event_deletion_selection.children[0]);
  }
  // load the new event names then append them to
  // the list of options to select events from
  firebaseHelper.loadAllEventNames(function (events, is_error) {
    if (is_error) {
      console.error(events);
      return;
    }
    events.forEach(function (event_name_received) {
      let option_for_selection = document.createElement("option");
      option_for_selection.value = event_name_received;
      option_for_selection.innerText = event_name_received;
      event_selection.appendChild(option_for_selection);

      let option_for_deletion = document.createElement("option");
      option_for_deletion.value = event_name_received;
      option_for_deletion.innerText = event_name_received;
      event_deletion_selection.appendChild(option_for_deletion);
    });

    // whenever we make new selection, re-display the map
    event_selection.addEventListener("change", function () {
      chosen_event_name = event_selection.value;
      displayMapEvent();
    });

    // set the event to be whatever is currently on the value
    chosen_event_name = event_selection.value;
    displayMapEvent();
  });
}

function displayMapEvent() {
  // load event once to COLOR the map
  loadMapDataAndPopulateMap(chosen_event_name);
  // load event with listener so that whenever
  // a change happen, re-COLOR the map
  loadMapDataAndListen(chosen_event_name);
}

function loadMapDataAndPopulateMap(event_name) {
  firebaseHelper.loadEvent(event_name, populateMapFromData);
}

function loadMapDataAndListen(event_name) {
  firebaseHelper.loadEventWithListener(event_name, populateMapFromData);
}

/** the following function is the callback that gets called
 * once firebase has loaded all the data from the chosen event */
function populateMapFromData(map_data, is_error) {
  if (is_error) {
    console.error("AN ERROR OCCURRED:");
    console.error(map_data);
  } else {
    // identify the max count, then set the opacity
    // for each country based on the max count
    setOpacitiesFromMap(map_data, getMaxCount(map_data));
    setOverview(map_data);
  }
}

function getMaxCount(map_data) {
  let max_count = 0;
  Object.keys(map_data.countries).forEach(function (country_code) {
    let country_count = parseFloat(map_data.countries[country_code]);
    max_count = Math.max(max_count, country_count);
  });
  // increase by one in case every country have 0,
  // so that we dont get a divide by 0 error (which
  // turns into a NaN). this addition by 1 should
  // be insignificant as more people add inputs
  return max_count + 1;
}

function setOpacitiesFromMap(map_data, max_count) {
  Object.keys(map_data.countries).forEach(function (country_code) {
    // add a bit of fake count to the country count
    // so that it's not completely unshaded
    let country_count = parseFloat(map_data.countries[country_code]) + 0.3;
    let path = document.getElementById(country_code);
    // make sure that the opacity of a country has a
    // a minimum opacity of 0.05
    let opacity = Math.max(country_count / max_count, 0.05);
    fillPathAndAddHoverEventListener(path, opacity, country_code);
  });
}

function fillPathAndAddHoverEventListener(path, opacity, country_code) {
  let regular_color = buildRGBAColor(
    COLOR_MAP[country_code].red,
    COLOR_MAP[country_code].green,
    COLOR_MAP[country_code].blue, opacity);
  let hover_color = buildRGBAColor(
    COLOR_MAP[country_code].red,
    COLOR_MAP[country_code].green,
    COLOR_MAP[country_code].blue, 2.3 * opacity);
  path.style.fill = regular_color;
  // this is an arrow function, similar to python's "lambda"
  path.addEventListener("mouseenter", () => path.style.fill = hover_color);
  path.addEventListener("mouseleave", () => path.style.fill = regular_color);
}

function buildRGBAColor(r, g, b, opacity) {
  return `rgba(${r},${g},${b},${opacity})`;
}

function makeItPossibleToCreateEvents() {
  let create_button = document.getElementById("create-event");
  let input_event = document.getElementById("input-event");
  create_button.addEventListener("click", function () {
    console.log("init");
    if (isValidEventName(input_event.value)) {
      firebaseHelper.createEvent(input_event.value, addEventSelectionOnBodyThenLoadMap);
      input_event.value = "";
    }
  });
}

/** I made this method simply check if the name of the event
 * is longer than 2 characters. You can make this more complex
 * by making sure it's not a duplicate event or whatever you want. */
function isValidEventName(event) {
  return event.length >= 3;
}

function makeItPossibleToDeleteEvents() {
  let submit_button = document.getElementById("delete-event");
  submit_button.addEventListener("click", function () {
    let event_to_delete = document.getElementById("event-selected-delete").value;
    let response =
      window.confirm(`Are you sure you want to delete the event with title "${event_to_delete}"?
    All data collected will be lost`);
    if (response) {
      firebaseHelper.deleteEvent(event_to_delete, addEventSelectionOnBodyThenLoadMap);
    }
  });
}

function makeItPossibleToDownloadData() {
  let download_button = document.getElementById("download-data");
  download_button.addEventListener("click", firebaseHelper.downloadData);
}

function setOverview(map_data) {
  let count = document.getElementById("count");
  count.innerText = map_data.count;
  let responses = document.getElementById("responses");
  responses.innerText = map_data.responses;
}