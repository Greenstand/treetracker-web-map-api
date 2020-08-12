import { mount } from "cypress-react-unit-test";
import React from "react";
import SidePanel from "./SidePanel";

describe("SidePanel", () => {

  it("SidePanel", () => {
    const trees = [{
      first_name: "Dadior",
      last_name: "Chen",
      image_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/2018.11.20.12.11.07_e7a81cf4-2d37-45ee-9d5a-47bdfd7c43cc_IMG_20181120_121037_7990135604649410080.jpg",
      user_image_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.10.18.32.42_b4fad89a-10b6-40cc-a134-0085d0e581d2_IMG_20190710_183201_8089920786231467340.jpg",
    },{
      first_name: "Ezra",
      last_name: "David",
      image_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/2018.11.20.12.11.07_e7a81cf4-2d37-45ee-9d5a-47bdfd7c43cc_IMG_20181120_121037_7990135604649410080.jpg",
      user_image_url: "https://treetracker-production.nyc3.digitaloceanspaces.com/2019.07.10.18.32.42_b4fad89a-10b6-40cc-a134-0085d0e581d2_IMG_20190710_183201_8089920786231467340.jpg",
    }];

    function Test(){
      const [treeIndex, setTreeIndex] = React.useState(0);

      function handleNext(){
        setTreeIndex(treeIndex + 1);
      }

      return(
        <div style={{background:"gray",height:"1000px"}} >
          <SidePanel 
            tree={trees[treeIndex]} 
            onNext={handleNext}
            hasNext={treeIndex < trees.length - 1}
            hasPrevious={treeIndex > 0}
          />
        </div>
      )
    }
    mount(
      <Test/>
    );
    cy.contains("Dadior");
    //is loading
    cy.get(".treePictureLoading");
    cy.get(".treePictureLoaded");
    cy.get("button[title='previous tree']").should("not.exist");
    cy.get("button[title='next tree']")
      .click();
    cy.contains("Ezra");
    cy.get("button[title='previous tree']");
    cy.get("button[title='next tree']").should("not.exist");
//    //should placed logo as avatar, cuz no image
//    cy.get("#planter-img")
//      .find("img")
//      .should("has.attr", "src")
//      .and("match", /greenstand_logo/);
  });

});

