"use strict";

const ccheck = 0;

const newConst = "master build branch change";

function buildTree( { el, style, attr, events, inner, inhtml } ) {

    let new_element = document.createElement(el);

    style ? new_element.classList = style : null;

    if(attr && attr instanceof Object) {
        for(let key in attr) {
            new_element.setAttribute(key, attr[key]);
        }
    }

    if(inner) {
        if(typeof(inner) == "string") {
            new_element.textContent = inner;
        } else if(Array.isArray(inner)) {
            inner.forEach(elem => {
              if(!(elem instanceof HTMLElement)) {
                elem = buildTree(elem);
              }
              new_element.insertAdjacentElement("beforeend", elem)
            });
        }
    }
    
    if(events && events instanceof Object) {
        for(let key in events) {
            new_element.addEventListener(key, events[key]);
        }
    }
    
    if(inhtml && typeof(inhtml) == "string") {
      new_element.insertAdjacentHTML("beforeend", inhtml);
    }
    return new_element
}
