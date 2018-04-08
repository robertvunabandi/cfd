"use strict";
window.addEventListener("load", main);

let user_selection = [];
let event_name;
function main() {
  createSelectionBox();
  addEventSelection();
}

function createSelectionBox() {
  // selection box
  const selection_box = document.createElement("select");
  Object.keys(COUNTRY_DATA).forEach(function (country_name) {
    let option = document.createElement("option");
    option.value = COUNTRY_DATA[country_name];
    option.innerText = country_name;
    selection_box.appendChild(option);
  });

  // chosen countries
  const chosen_ul_box = document.createElement("div");
  chosen_ul_box.setAttribute("id", "chosen-list");

  // add button
  let add_button = document.createElement("button");
  add_button.innerHTML = "add country";
  add_button.addEventListener("click", function () {
    if (canBeAdded(selection_box.value)) {
      user_selection.push(selection_box.value);
      populateUlListFromSelection();
    }
  });
  add_button.setAttribute("class", "button");

  // submit button
  let submit_button = document.createElement("button");
  submit_button.innerHTML = "submit selection";
  submit_button.addEventListener("click", function () {
    saveCountries();
    user_selection = [];
    populateUlListFromSelection();
  });
  submit_button.setAttribute("id", "submit-button");
  submit_button.setAttribute("class", "button");

  document.body.appendChild(selection_box);
  document.body.appendChild(add_button);
  document.body.appendChild(submit_button);
  document.body.appendChild(chosen_ul_box);
}

function canBeAdded(item) {
  let valid = true;
  user_selection.forEach(function (selected) {
    if (selected === item) {
      valid = false;
    }
  });
  return valid;
}

function saveCountries() {
  firebaseHelper.saveIntoEvent(event_name, user_selection);
}

function populateUlListFromSelection() {
  const chosen_ul_box = document.getElementById("chosen-list");
  const chosen_ul = document.createElement("ul");

  user_selection.forEach(function (country_code, index) {
    let li = document.createElement("li");
    let text_space = document.createElement("span");
    text_space.innerText = CODE_TO_COUNTRY[country_code];
    let delete_button = document.createElement("button");
    delete_button.innerHTML = "remove";

    delete_button.addEventListener("click", function () {
      console.log("hello");
      user_selection.splice(index, 1);
      populateUlListFromSelection();
    }, false);
    delete_button.setAttribute("class", "button remove");

    li.appendChild(text_space);
    li.appendChild(delete_button);
    chosen_ul.appendChild(li);
  });

  if (chosen_ul_box.children.length > 0) {
    chosen_ul_box.removeChild(chosen_ul_box.children[0]);
  }
  chosen_ul_box.appendChild(chosen_ul);
}

let event_list = [];
function addEventSelection() {
  let prev_selection_box = document.getElementById("event-selection-box");
  if (prev_selection_box) {
    document.body.removeChild(prev_selection_box);
  }

  const event_selection_box = document.createElement("div");

  const text_admin_only_span = document.createElement("span");
  const text_admin_only = document.createTextNode("Admin Only");
  text_admin_only_span.appendChild(text_admin_only);
  text_admin_only_span.setAttribute("id", "admin-only-text");
  event_selection_box.appendChild(text_admin_only_span);

  const text_choose_event_span = document.createElement("span");
  const text_choose_event = document.createTextNode("Choose event:");
  text_choose_event_span.appendChild(text_choose_event);
  event_selection_box.appendChild(text_choose_event_span);

  // create the HTML select box, from this select box, we can choose events
  const event_selection = document.createElement("select");
  firebaseHelper.loadAllEventNames(function (events, is_error) {
    if (is_error) {
      console.error(events);
      return;
    }
    event_list = events;
    // for each event, we append an "option" item to the "select" element
    events.forEach(function (event_name_received) {
      let option = document.createElement("option");
      option.value = event_name_received;
      option.innerText = event_name_received;
      event_selection.appendChild(option);
    });

    // whenever the user selects a different event, this method changes
    // the value of the event name. there is no need to reload anything
    // in this case. Note that event_name is used when adding country
    // to the event
    event_selection.addEventListener("change", function () {
      event_name = event_selection.value;
    });

    // set the event name to be the event displayed on the event select
    // box with event_selection.value;
    event_name = event_selection.value;

    event_selection_box.appendChild(event_selection);
    event_selection_box.setAttribute("id", "event-selection-box");
    document.body.appendChild(event_selection_box);
  });
}