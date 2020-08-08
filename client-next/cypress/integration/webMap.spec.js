
const scale = 1;

describe("Web Map", () => {

  it("Web map", () => {
    cy.visit("http://localhost:3000/");
    cy.get("img[alt=logo]");
    cy.get("input[placeholder='Search Greenstand'");
    cy.contains("3");
    cy
      .wait(2000*scale)
      .get("#map-canvas")
      .then(el => {
        console.log("el:", el);
        //click
        el[0].markers.forEach(marker => {
          console.log("marker:", marker);
          if(marker.getLabel().text === "3"){
            console.log("trigger");
            marker.triggerClick();
            //window.google.maps.event.trigger(marker, 'click');
          };
        });
      });
    //cy.contains("tree1");
    cy.wait(2000*scale);
    cy.get("#map-canvas")
      .then(el => {
        console.log("el:", el);
        //click
        el[0].markers.forEach(marker => {
          console.log("marker:", marker);
          if(marker.payload.id === 1){
            console.log("trigger");
            marker.triggerClick();
            //window.google.maps.event.trigger(marker, 'click');
          };
        });
      });
    cy.contains("Clyde");
    cy.pause();
    cy.contains(/#1/i);
    cy.wait(2000*scale);
    cy.get("button[title='next tree']")
      .click();
    cy.contains(/#2/i);
    cy.wait(2000*scale);
    cy.get("button[title='next tree']")
      .click();
    cy.contains(/#3/i);
  });

});

