require('es6-promise').polyfill();
require('isomorphic-fetch');
import { Observable } from 'rxjs';
import ShopifySystem from './shopify';
// import { version } from 'punycode';
// import { count } from 'rxjs/operators';
// const program = require('commander');

// program
//     .version('0.1.0')
//     .option('-g, --generate', 'Generate', null,'all')
//     .option('-c, --count', 'Count', null, 100)
//     .parse(process.argv);

// let shopifySystem = new ShopifySystem()

// shopifySystem.initializeCustomers(2)
// shopifySystem.initializeProducts(2)

// .then(shopifySystem.postCustomer.bind(shopifySystem))
// .then(resp => console.log(resp))

// .then(shopifySystem.postProduct.bind(shopifySystem))
// .then(resp => console.log(resp))

// .then(shopifySystem.postOrder.bind(shopifySystem))
// .then(resp => console.log(resp))

let program = require('commander');

const argv = require('yargs').argv;

let generate = argv.generate || 'orders'
let count = argv.count || 10

let shopifySystem = new ShopifySystem(count)
console.log(generate, count)
switch (generate) {
    case 'customer':
    case 'customers':
        Observable.fromPromise(shopifySystem.initializeCustomers())
            .mergeMap(resp => 
                Observable.timer(0, 1000)
                .timeInterval()
            )
            .take(count)
            .mergeMap(resp => Observable.fromPromise(shopifySystem.postCustomer()))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("Completed")
            )
        break;

    case 'product':
    case 'products':
        Observable.fromPromise(shopifySystem.initializeProducts())
            .mergeMap(resp => 
                Observable.timer(0, 1000)
                .timeInterval()
            )
            .take(count)
            .mergeMap(resp => Observable.fromPromise(shopifySystem.postProduct()))
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("Completed")
            )
        break;

    case 'order':
    case 'orders':
    default:
        Observable.timer(0, 3000)
            .timeInterval()
            .take(count)
            .mergeMap(resp => shopifySystem.postOrder())
            .subscribe(
                data => console.log(data),
                err => console.log(err),
                () => console.log("Completed")
            )
        break;
}

