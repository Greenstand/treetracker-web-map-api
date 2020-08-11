//import expect from "../../src/expect";
const scale = 1;

describe("Web Map", () => {

  it("Web map", () => {
    //cy.viewport("ipad-2");
//    cy.viewport("iphone-x");
//    cy.viewport("macbook-13");
    //cy.viewport("samsung-note9");
//    cy.visit("http://localhost:3000/");
//    cy.visit("http://test.dadiorchen.com");
    cy.visit("http://localhost:3000");
    cy.get("img[alt=logo]");
    cy.get("input[placeholder='Search Greenstand'");
    cy.contains(/137K/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().forEach(marker => {
          if(marker.getLabel().text === "137K"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(1000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.contains(/3/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().forEach(marker => {
          if(marker.getLabel().text === "3"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(1000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.contains(/2/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().reverse().forEach(marker => {
          if(marker.getLabel().text === "2"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(1000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.contains(/2/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().forEach(marker => {
          if(marker.getLabel().text === "2"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(1000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.contains(/1/,{timeout: 1000*30});
    cy
      .get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers().forEach(marker => {
          if(marker.getLabel().text === "1"){
            marker.triggerClick();
          };
        });
      });
    cy.wait(1000);
    cy.get("#map-canvas", {timeout:1000*30})
      .should(e1 => {
        expect(e1[0].map.getLoadingMarkers()).to.be.equal(false);
      });
    cy.get("img[src='/img/pin_29px.png']",{timeout:1000*30});
    cy.get("#map-canvas")
      .then(el => {
        //click
        el[0].map.getMarkers()[0].triggerClick();
      });
    cy.contains(/Tree Id: #\d+/);
    cy.pause();
    cy.wait(10000*scale);
    cy.get("#map-canvas")
      .then(el => {
        console.log("el:", el);
        //click
        el[0].markers.forEach(marker => {
          console.log("marker:", marker);
          if(marker.payload.id === 222187){
            console.log("trigger");
            marker.triggerClick();
            //window.google.maps.event.trigger(marker, 'click');
          };
        });
      });
    cy.contains("Clyde");
    cy.contains(/#\d+/i);
    cy.wait(2000*scale);
    cy.get("button[title='next tree']")
      .click();
    cy.wait(2000*scale);
    cy.get("button[title='next tree']")
      .click();
  });

});

