"use strict";

const fireLevelState = require("./estados/fireLevel/fireLevelState");
const landLevelState = require("./estados/landLevel/landLevelState");

function initializeStates() {
  return {
    fireLevelState,
    landLevelState
  };
}

module.exports = { initializeStates };
