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

const tap = f => x => { f(x); return x; }

const pipe = (f,g) => x => g(f(x));


observable.subscribe(pipe(tap(console.log),console.log));


observable.emit(5);
observable.emit(8);
observable.emit(10);


