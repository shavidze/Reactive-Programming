// base functions


const tap = f => x => { f(x); return x; }

const pipe = (...fs) => x => fs.reduce(((acc,f) => f(acc)),x);

//


class Observable {

    constructor(){
        this.cbs = []; //callbacks
    }

    subscribe(cbs){
        this.cbs.push(cbs);
    }

    emit(x){
        this.cbs.forEach(cb => cb(x));
    }


}

const observable = new Observable();



const double = (x) => x + x;

observable.subscribe(pipe(double,double,tap(console.log)));



observable.emit(5);
observable.emit(8);
observable.emit(10);


