console.log("Here we go");

interface Observer<T> {
  next(value: T) : void;
  error(err : any) : void;
  complete(): void;
}

type Teardown = () => void;


class Observable<T>{
  constructor(private init: (observer: Observer<T>) => Teardown){

  }

  subscribe(observer: Observer<T>): Subscription{
    const subscription = new Subscription();
    const subscriber = new Subscriber(observer,subscription);
    subscription.add(this.init(subscriber));
    return subscription;
  }
}


class Subscriber<T> implements Observer<T>{
  
  closed = false;

  constructor(
    private destination: Observer<T>,
    private subscription: Subscription
  ){
    subscription.add(() => this.closed = true);
  }
  
  next(value:T ) {
    if(!closed){
      this.destination.next(value);
    }
  }

  error(err:any){
    if(!this.closed){
      this.closed = true;
      this.destination.error(err);
    }
  }

  complete() {
    if(!this.closed){
      this.closed = true;
      this.destination.complete();
    }
  }
}

class Subscription {
  private teardowns: Teardown[] = [];

  add(teardown:Teardown){
    this.teardowns.push(teardown);
  }

  unsubscribe(){
    for(const teardown of this.teardowns){
      teardown();
    }
    this.teardowns = [];
  }


}


const  myObservable = new Observable((observer: Observer<number> ) =>  {
  let i = 0;
  const id = setInterval(() => {
    observer.next(i++);
    if(i > 3){
      observer.complete();
      observer.next(99999);
    }
  },100);
  return () => {
    console.log('tearing down');
    clearInterval(id);
  }
});

const teardown = myObservable.subscribe({
  next(value) { console.log(value);},
  error(err) {console.log(err);},
  complete() { console.log('done')}
})



setTimeout(() => {
  teardown.unsubscribe();
},2000);
