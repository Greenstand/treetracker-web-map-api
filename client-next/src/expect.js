
class Expectation{

  constructor(actual){
    this.actual = actual;
    this.flags = [];
  }

  get not() {
    this.addFlag("not");
    return this;
  }

  addFlag(flag){
    this.flags.push(flag);
  }

  defined(){
    console.log("this.actual:", this.actual);
    if(this.flags.includes("not")){
      if(this.actual === undefined){
        //pass
        return this;
      }else{
        throw Error("defined");
      }
    }else{
      if(this.actual !== undefined){
        //pass
        return this;
      }else{
        throw Error("not defined");
      }
    }
  }
}


function expect(actual){
  const expectation = new Expectation(actual);
  return expectation;
}

export default expect;
