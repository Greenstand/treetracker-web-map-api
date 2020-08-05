
const scale = 1;

describe("Web Map", () => {

  it("Web map", () => {
    cy.visit("http://localhost:3000/")
      .contains("3")
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
    cy.contains("tree3");
    cy.wait(2000*scale);
    cy.get("#map-canvas")
      .then(el => {
        console.log("el:", el);
        //click
        el[0].markers.forEach(marker => {
          console.log("marker:", marker);
          if(marker.getLabel().text === "tree3"){
            console.log("trigger");
            marker.triggerClick();
            //window.google.maps.event.trigger(marker, 'click');
          };
        });
      });
    cy.contains("Dadior");
  });

});

