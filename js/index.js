"use strict";

// Проверка на подключение файла dom_builder.js
try {
    ccheck;
} catch (e) {
    if(e instanceof ReferenceError) {
        console.error("Module dom_builder has not successfuly loaded\n#Check script connection")
    } else {
        throw e
    }
}

const CURRENT_DATE = new Date();
const MONTHS = ["ЯНВАРЬ", "ФЕВРАЛЬ", "МАРТ", "АПРЕЛЬ", "МАЙ", "ИЮНЬ", "ИЮЛЬ", "АВГУСТ", "СЕНТЯБРЬ", "ОКТЯБРЬ", "НОЯБРЬ", "ДЕКАБРЬ"];
const DAYHEADERS = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

// month controller
let monthControllerDisplay;
let monthState = CURRENT_DATE.getMonth();
let monthStateUTC = () => (monthState + 1) <= 9 ? `0${monthState + 1}` : monthState + 1;

// date controller
let dayDateController, monthDateController, yearDateController;

let dayState = CURRENT_DATE.getDate();
const TODAY = dayState;
let dayStateUTC = dayState <= 9 ? `0${dayState}` : dayState;

let yearStateUTC = CURRENT_DATE.getFullYear();

// calendar element

let calendarBody, calendarDays;

let todayDiv;

const calendarActiveElement = buildTree({
  el: "div",
  style: "calendar-inner-wrapper",
  inner: [
    {
      el: "div",
      style: "active-days-header",
      inner: DAYHEADERS.map(day => {
        return {
          el: "div",
          style: "day-header",
          inner: day
        }
      })
    },
    calendarBody = buildTree({
      el: "div",
      style: "calendar-body-wrapper",
      inner: calendarDays = (() => {
        let elements = [];
        for(let i = 0; i < 42; i++) {
          elements.push(buildTree({
            el: "div",
            style: "calendar-day"
          }))
        }
        return elements;
      })()
    })
  ]
})

// events preview section

let eventStageSwitcher;
let stage = ["КОНФЕРЕНЦ ЗАЛ" , "ЗАЛ СОВЕЩАНИЙ"];
let activeStage = stage[0];

// months menu
const monthMenu = buildTree({
  el: "div",
  style: "months-menu hidden",
  inner: MONTHS.map((elem, index) => {
    return buildTree({
        el: "div",
        style: "months-menu-element",
        events: {"click":() => handleMenuMonthChange(index)},
        inner: MONTHS[index]
      })
  })
})

const eventsPreview = buildTree({
  el: "div",
  style: "event-preview-wrapper",
  inner: [
    {
      el: "div",
      style: "event-stage-switcher",
      events: {
        "click": handleStageSwap
      },

      inner: eventStageSwitcher = [
          buildTree({
            el: "span",
            style: "event-stage-title",
            inner: activeStage
          }),
          buildTree({
            el: "img",
            style: "swap-button",
            attr: {"src":"images/swap_stage.svg"}
          })
      ]
    }
  ]
})

// main element
let monthController;
const calendar = buildTree({
  el: "main",
  style: "calendar-main",
  inner: [{
            el: "div",
            style: "calendar-header",
            inner: [{
                      el: "img",
                      style: "calendar-menu-desktop",
                      attr: {"src": "images/menu_desk.svg"}
                    },
                    monthController = buildTree({
                      el: "div",
                      style: "calendar-month-controller",
                      inner: [{
                                el: "img",
                                style: "controller-button",
                                attr: {"src": "images/controller_left.svg"},
                                events: {"click": () => handleMonthChange(-1)}
                              },
                              monthControllerDisplay = buildTree({
                                el: "span",
                                style: "controller-month-display",
                                inner: MONTHS[monthState],
                                events: {"click": toggleMonthsMenu}
                              }),
                              {
                                el: "img",
                                style: "controller-button",
                                attr: {"src": "images/controller_right.svg"},
                                events: {"click": () => handleMonthChange(1)}
                              },
                              monthMenu
                            ],
                    }),
                    {
                      el: "div",
                      style: "calendar-date-controller",
                      events: {"click": setCurrentDate},
                      inner: [
                        dayDateController = buildTree({
                          el: "span",
                          style: "day-controller",
                          inner: dayStateUTC.toString()
                        }),
                        monthDateController = buildTree({
                          el: "span",
                          style: "month-controller",
                          inner: monthStateUTC()
                        }),
                        yearDateController = buildTree({
                          el: "span",
                          style: "year-controller",
                          inner: yearStateUTC.toString()
                        })
                      ]
                    }]    
          }, // header end
          { // active section wrapper
            el: "div",
            style: "active-wrapper",
            inner: [
              calendarActiveElement, // calendar section
              eventsPreview // calendar event control
            ]
          }
        ]
});

function handleMonthChange(changeState) {
  let yearChanged = false;
  if(changeState > 0) {
    monthState++;
    if(monthState > 11) {
      monthState = 0;
      yearStateUTC++;
      yearChanged = true;
    }
  } else if(changeState < 0) {
    monthState--;
    if(monthState < 0) {
      monthState = 11;
      yearStateUTC--;
      yearChanged = true;
    }
  }
  updateDateDisplay(yearChanged);
}

function updateDateDisplay(yearChanged) {
  monthControllerDisplay.textContent = MONTHS[monthState];
  updateCalendarDays(1)
}

let tempDaysCreated = 0;

function updateCalendarDays(update) {
  if(calendarDays) {
    if(update == 1) {
      todayDiv.classList.remove("today");
      for(let i = 0; i < tempDaysCreated; i++) {
        calendarDays[i].textContent = "";
      }
    }
    
    let currentDate = new Date(yearStateUTC, monthState);
    let firstCalendarDay = currentDate.getDay();
    firstCalendarDay == 0 ? firstCalendarDay = 6 : firstCalendarDay;
    let lastMonthDay = new Date(yearStateUTC, monthState + 1, 0).getDate();
    let dayCounter = 1;
    tempDaysCreated = lastMonthDay + firstCalendarDay - 1;

    for(let i = firstCalendarDay - 1; i < lastMonthDay + firstCalendarDay - 1; i++) {
      calendarDays[i].textContent = dayCounter;
      if(CURRENT_DATE.getFullYear() == yearStateUTC && CURRENT_DATE.getMonth() == monthState && dayCounter == TODAY) {
        todayDiv = calendarDays[i];
        todayDiv.classList.add("today")
      }
      dayCounter++
    }
  }
}


function walkCalendarDays(callbackfnc) {
  if(calendarDays) {
    for(let i = 0; i < 42; i++) {
      callbackfnc(calendarDays[i])
    }
  }
}


function handleStageSwap(e) {
  if(activeStage == stage[0]) {
    activeStage = stage[1];
  } else if (activeStage == stage[1]) {
    activeStage = stage[0]
  }
  if(monthMenu.classList.contains("active")) {
    monthMenu.classList.replace("active", "hidden");
  }
  eventStageSwitcher[0].textContent = activeStage;
  eventStageSwitcher[1].classList.toggle("swapped");
}

function toggleMonthsMenu() {
    if(monthMenu.classList.contains("active")) {
      monthMenu.classList.replace("active", "hidden");
    } else {
      monthMenu.classList.replace("hidden", "active");
    }
}

function handleMenuMonthChange(index) {
  monthState = index;
  updateDateDisplay(0);
  toggleMonthsMenu();
}

// utils
function monthMenuHide() {
  if(monthMenu && monthMenu.classList.contains("active")) {
    monthMenu.classList.replace("active", "hidden");
  }
}

function setCurrentDate() {
  monthState = CURRENT_DATE.getMonth();
  yearStateUTC = CURRENT_DATE.getFullYear();
  updateDateDisplay()
}

document.body.insertAdjacentElement("beforeend", calendar);
updateCalendarDays(0);