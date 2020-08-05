class Matcher{}

class Any extends Matcher{
  constructor(sample){
    super();
    this.sample = sample;
  }

  equal(other){
    if (this.sample == String) {
      return typeof other == 'string' || other instanceof String;
    }

    if (this.sample == Number) {
      return typeof other == 'number' || other instanceof Number;
    }

    if (this.sample == Function) {
      return typeof other == 'function' || other instanceof Function;
    }

    if (this.sample == Object) {
      return typeof other == 'object';
    }

    if (this.sample == Boolean) {
      return typeof other == 'boolean';
    }

    /* global BigInt */
    if (this.sample == BigInt) {
      return typeof other == 'bigint';
    }

    if (this.sample == Symbol) {
      return typeof other == 'symbol';
    }

    return other instanceof this.sample;
  }
}

class Anything extends Matcher{
  equal(other){
    if(other !== undefined){
      return true;
    }else{
      return false;
    }
  }
}

function equal(actual, ex){
  if(ex instanceof Anything || ex instanceof Any){
    return ex.equal(actual);
  }else{
    return actual === ex;
  }
}

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
    if(this.flags.includes("not")){
      if(this.actual === undefined){
        //pass
        return this;
      }else{
        this.throw("not be defined");
      }
    }else{
      if(this.actual !== undefined){
        //pass
        return this;
      }else{
        this.throw("be defined");
      }
    }
  }

  number(){
    if(typeof this.actual === "number"){
      //pass
      return this;
    }else{
      this.throw("be number");
    }
  }

  property(propertyName){
    const propertyValue = this.actual[propertyName];
    if(propertyValue === undefined){
      this.throw(`has property:${propertyName}`);
    }else{
      const expectation = new Expectation(propertyValue);
      return expectation;
    }
  }

  throw(expectMessage){
    throw Error(`[assert failed] expect ${JSON.stringify(this.actual, null, 2)} --to--> ${expectMessage}`);
  }

  match(object){
    if(this.actual === undefined){
      this.throw(`match ${JSON.stringify(object, null, 2)}`);
    }
    if(object instanceof RegExp){
      if(!object.test(this.actual)){
        this.throw(`match ${object.toString()}`);
      }else{
        return this;
      }
    }else if(typeof object === "object"){
      let matched = true;
      Object.keys(object).forEach(key => {
        const value = object[key];
        const actualValue = this.actual[key];
        if(typeof value === "object" && !(value instanceof Matcher)){
          //nest object
          expect(actualValue).match(value);
        }else{
          if(equal(actualValue, value)){
          }else{
            matched = false;
          }
        }
      });
      if(matched === false){
        this.throw(`match ${JSON.stringify(object, null, 2)}`);
      }else{
        return this;
      }
    }else {
      this.throw(`match ${object}`);
    }
  }


}


function expect(actual){
  const expectation = new Expectation(actual);
  return expectation;
}

expect.any = function(type){
    return new Any(type);
  }

expect.anything = function(){
    return new Anything();
  }

export default expect;
