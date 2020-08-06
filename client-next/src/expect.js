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

  toString(){
    return `any of ${this.sample}`;
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

class StringMatching extends Matcher{
  constructor(regex){
    super(regex);
    this.regex = regex;
  }

  equal(other){
    return (this.regex.test(other));
  }
}

function equal(actual, ex){
  if(ex instanceof Matcher){
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

  get to(){return this;}
  get be(){return this;}
  get been(){return this;}
  get is(){return this;}
  get and(){return this;}
  get has(){return this;}
  get have(){return this;}
  get with(){return this;}
  get that(){return this;}
  get which(){return this;}
  get at(){return this;}
  get of(){return this;}
  get same(){return this;}
  get but(){return this;}
  get does(){return this;}
  get still(){return this;}

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
    let jsonString;
    try{
      jsonString = JSON.stringify(this.actual, null, 2);
    }catch(e){
      console.error("stringify failed:", e, "the source:", this.actual);
      jsonString = this.actual
    }
    throw Error(`[assert failed] expect ${jsonString} --to--> ${expectMessage}`);
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

  lengthOf(length){
    if(this.actual.length === length){
      return this;
    }else{
      this.throw(`length of ${length}`);
    }
  }

  a(target){
    if(equal(this.actual, target)){
      return this;
    }else {
      this.throw(`be ${target}`)
    }
  }

  least(number){
    if(this.actual >= number){
      return this;
    }else {
      this.throw(`least ${number}`)
    }
  }

  most(number){
    if(this.actual <= number){
      return this;
    }else {
      this.throw(`most ${number}`)
    }
  }

  above(number){
    if(this.actual > number){
      return this;
    }else {
      this.throw(`above ${number}`)
    }
  }

  below(number){
    if(this.actual < number){
      return this;
    }else {
      this.throw(`below ${number}`)
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

expect.stringMatching = function(regex){
  return new StringMatching(regex);
}

export default expect;
