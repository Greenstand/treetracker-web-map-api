/*
 * get entity, edit the DOM
 */
const axios = require("axios");

const entity = {
  name: "entity",
  load: async function(id){
    const res = await axios.get(`/entitys/${id}`);
    if(res.status !== 200){
      throw Error("entity load fails");
    }
    return res.data;
  },
};

module.exports = entity;
