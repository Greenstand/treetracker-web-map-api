const Map = require("./Map");

const {Pool} = require("pg");
jest.mock("pg");

describe("Map", () => {
  let query;

  beforeEach(() => {
    query = jest.fn().mockReturnValue(true);
    Pool.prototype.query = query;
  })

  describe("Query", () => {

    describe("Normal cases", () => {

      it("{clusterRadius=8, zoom_level=2} should call SQL case1 ", async () => {
        const map = new Map();
        await map.init({
          clusterRadius: 8,
          zoom_level: 2,
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case1/i),
          values: [2],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case6/i),
          values: [2, 2+2],
        });
      });

      it("/trees?clusterRadius=0&zoom_level=17&bounds=-7.822425451587485,38.40904457076313,-7.840964880298422,38.40561440621655", async () => {
        const map =new Map();
        await map.init({
          clusterRadius: 0,
          zoom_level: 17,
          bounds: "37.93124715513169,-3.2148087439778705,36.74472371763169,-3.494479867143523",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case2.*estimated_geometric_location && ST_MakeEnvelope/is),
          values: [],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });

      it("/trees?clusterRadius=0.005&zoom_level=14&bounds=-13.100891610856054,8.430363406583758,-13.249207040543554,8.395721322779956", async () => {
        const queryCount = jest.fn()
          .mockResolvedValue({
            rows: [{count:1999}],
          });
        query.mockImplementationOnce(queryCount);
        const map =new Map();
        await map.init({
          clusterRadius: 0.005,
          zoom_level: 14,
          bounds: "37.93124715513169,-3.2148087439778705,36.74472371763169,-3.494479867143523",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case4.*location && ST_MakeEnvelope/is),
          values: [],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });

    });

    describe("User map cases", () => {

      it("with userid, and trees count under this user < 2000", async () => {
        const queryCount = jest.fn()
          .mockResolvedValue({
            rows: [{count:1999}],
          });
        query.mockImplementationOnce(queryCount);
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 9,
          userid:1,
        });
        let result = await map.getQuery();
        expect(queryCount).toBeCalledWith({
          text: expect.stringMatching(/count/i),
          values: []
        });
        expect(result).toMatchObject({
          //case 3
          text: expect.stringMatching(/case3.*AND trees.planter_id =/is),
          values: [0.05],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case6/i),
          values: [9, 9+2],
        });
      });

      it("with userid, and trees count under this user > 2000", async () => {
        const queryCount = jest.fn()
          .mockResolvedValue({
            rows: [{count:2001}],
          });
        query.mockImplementationOnce(queryCount);
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 9,
          userid: 12
        });
        let result = await map.getQuery();
        expect(queryCount).toBeCalledWith({
          text: expect.stringMatching(/count/i),
          values: []
        });
        expect(result).toMatchObject({
          //should call the new query with `join` to the tree, 
          text: expect.stringMatching(/case1.*join trees on.*and planter_id =/is),
          values: [9],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case6/is),
          values: [9, 9+2],
        });
      });

      it("{userid:1, clusterRadius:0.095, zoom_level:9}, SQL should be case 3", async () => {
        const queryCount = jest.fn()
          .mockResolvedValue({
            rows: [{count:1999}],
          });
        query.mockImplementationOnce(queryCount);
        const map =new Map();
        await map.init({
          clusterRadius: 0.095,
          zoom_level: 9,
          userid: 1,
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          //should call case3 with planter filter
          text: expect.stringMatching(/case3.*AND trees.planter_id =/is),
          values: expect.anything(),
        });

        result = await map.getZoomTargetQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case6/is),
          values: [9, 9 + 2],
        });
      });

      it("/trees?clusterRadius=0.03&zoom_level=11&bounds=37.93124715513169,-3.2148087439778705,36.74472371763169,-3.494479867143523&userid=1", async () => {
        const queryCount = jest.fn()
          .mockResolvedValue({
            rows: [{count:1999}],
          });
        query.mockImplementationOnce(queryCount);
        const map =new Map();
        await map.init({
          clusterRadius: 0.03,
          zoom_level: 11,
          bounds: "37.93124715513169,-3.2148087439778705,36.74472371763169,-3.494479867143523",
          userid: 1,
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          //should call case3 with planter filter and bounds filter
          text: expect.stringMatching(/case3.*estimated_geometric_location && ST_MakeEnvelope.*AND trees.planter_id =/is),
          values: [0.03],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });

      it("/trees?clusterRadius=0&zoom_level=17&bounds=37.30692471435548,-3.3515417307543633,37.288385285644544,-3.3559115991882575&userid=1", async () => {
        const queryCount = jest.fn()
          .mockResolvedValue({
            rows: [{count:1999}],
          });
        query.mockImplementationOnce(queryCount);
        const map =new Map();
        await map.init({
          clusterRadius: 0,
          zoom_level: 17,
          bounds: "37.93124715513169,-3.2148087439778705,36.74472371763169,-3.494479867143523",
          userid: 1,
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          //should call case2 with planter filter and bounds filter
          text: expect.stringMatching(/case2.*estimated_geometric_location && ST_MakeEnvelope.*AND trees.planter_id =/is),
          values: [],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });
    });

    describe("Single tree cases", () => {

      it("{treeid:1, clusterRadius:0.05, zoom_level:10}, SQL should be case 2", async () => {
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 10,
          treeid: 12
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          //should call the new query with `join` to the tree, 
          text: expect.stringMatching(/case2.*AND trees.id =/is),
          values: [],
        });
        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });
    });

    describe("Wallet map cases", () => {

      it("{wallet:'fortest', clusterRadius:0.05, zoom_level:10}, SQL should be case 3", async () => {
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 10,
          wallet: "fortest",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          //should call the new query with `join` to the tree, 
          text: expect.stringMatching(/case3.*AND entity.wallet =/is),
          values: [0.05],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });

      it("{wallet:'fortest', clusterRadius:0.003, zoom_level:17}, SQL should be case 3", async () => {
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 16,
          wallet: "fortest",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case2.*AND entity.wallet =/is),
          values: [],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });
    });

    describe("Token map cases", () => {

      it("{token:'fortest', clusterRadius:0.05, zoom_level:10}, SQL should be case 3", async () => {
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 10,
          token: "fortest",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          //should call the new query with `join` to the tree, 
          text: expect.stringMatching(/case3.*INNER JOIN certificates/is),
          values: [0.05],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });

      it("{token:'fortest', clusterRadius:0.003, zoom_level:17}, SQL should be case 3", async () => {
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 16,
          token: "fortest",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case2.*INNER JOIN certificates/is),
          values: [],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });
    });

    describe("Flavor map cases", () => {

      it("{flavor:'fortest', clusterRadius:0.05, zoom_level:10}, SQL should be case 3", async () => {
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 10,
          flavor: "fortest",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          //should call the new query with `join` to the tree, 
          text: expect.stringMatching(/case3.*inner join tree_attributes.*and tree_attributes.key =/is),
          values: [0.05],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });

      it("{flavor:'fortest', clusterRadius:0.003, zoom_level:17}, SQL should be case 3", async () => {
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 16,
          flavor: "fortest",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case2.*inner join tree_attributes.*and tree_attributes.key =/is),
          values: [],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });
    });

    describe("Org map cases", () => {

      it("mapName case0: /trees?clusterRadius=0.05&zoom_level=3&map_name=freetown", async () => {
        const queryOrg = jest.fn()
          .mockResolvedValue({
            rows: [{id:1}],
          });
        query.mockImplementationOnce(queryOrg);
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 3,
          map_name: "freetown",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case1.*tree_region.tree_id in.*map_name =/is),
          values: [3],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case6.*tree_region.tree_id in.*map_name =/is),
          values: [3, 3+2],
        });
      });

      it("mapName case1: /trees?clusterRadius=0.05&zoom_level=10&map_name=freetown", async () => {
        const queryOrg = jest.fn()
          .mockResolvedValue({
            rows: [{id:1}],
          });
        query.mockImplementationOnce(queryOrg);
        const map =new Map();
        await map.init({
          clusterRadius: 0.05,
          zoom_level: 10,
          map_name: "freetown",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case1.*tree_region.tree_id in.*map_name =/is),
          values: [10],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });

      it("mapName case2: /trees?clusterRadius=0.005&zoom_level=14&bounds=-13.093788230138243,8.435735998833929,-13.242103659825743,8.401094395636814&map_name=freetown", async () => {
        const queryOrg = jest.fn()
          .mockResolvedValue({
            rows: [{id:1}],
          });
        query.mockImplementationOnce(queryOrg);
        const map =new Map();
        await map.init({
          clusterRadius: 0.005,
          zoom_level: 14,
          map_name: "freetown",
          bounds: "-13.093788230138243,8.435735998833929,-13.242103659825743,8.401094395636814",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case1.*tree_region.tree_id in.*map_name =/is),
          values: [14],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });

      it("mapName case3: /trees?clusterRadius=0.003&zoom_level=16&bounds=-13.149406516271055,8.422745649932644,-13.18648537369293,8.414085249049373&map_name=freetown", async () => {
        const queryOrg = jest.fn()
          .mockResolvedValue({
            rows: [{id:1}],
          });
        query.mockImplementationOnce(queryOrg);
        const map =new Map();
        await map.init({
          clusterRadius: 0.003,
          zoom_level: 16,
          map_name: "freetown",
          bounds: "-13.093788230138243,8.435735998833929,-13.242103659825743,8.401094395636814",
        });
        let result = await map.getQuery();
        expect(result).toMatchObject({
          text: expect.stringMatching(/case2.*location && ST_MakeEnvelope.*trees.id in.*map_name =/is),
          values: [],
        });

        result = await map.getZoomTargetQuery();
        expect(result).toBeUndefined();
      });

    });

  });

});
