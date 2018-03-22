import { generateRandomInt, getLine, getFileLineCount } from "./utils";
import { 
    SHOPIFY_STORE_URL,
    SHOPIFY_API_URL,
    SHOPIFY_AUTH_TOKEN,
    CUSTOMER_DATA_URL,
    PRODUCT_DATA_URL,
    
} from "./config";

export default class ShopifySystem {
    constructor(count) {
        this.dummyCustomers = [];
        this.dummyProducts = [];
        this.count = count;
    }

    async initializeCustomers(count){
        let customers = await fetch(`${CUSTOMER_DATA_URL}&count=${this.count}`)
        .then(resp => resp.json());
        this.dummyCustomers = customers;
        console.log('length', this.dummyCustomers.length);
        return this.dummyCustomers
    }

    async initializeProducts(count){

        let products = await fetch(`${PRODUCT_DATA_URL}&count=${this.count}`)
        .then(resp => resp.json());
        this.dummyProducts = products;
        console.log('length', this.dummyCustomers.length);
        return this.dummyProducts
    }

    async getCustomerId(){

    }

    async getProductId(){

    }

    getCustomer(){
        console.log(this.count, this.dummyCustomers);
        console.log(this.dummyCustomers.length);
        return this.dummyCustomers.pop();

    }

    getProduct(){
        console.log(this.count, this.dummyProducts);
        console.log(this.dummyProducts.length);
        return this.dummyProducts.pop();
    }

    // getOrder(){
    //     return this.dummyOrders.pop();
    // }

    async postCustomer(){
        let customerData = this.getCustomer();
        console.log(customerData)
        let customerResponse = await fetch(`${SHOPIFY_API_URL}/customers.json`, {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": SHOPIFY_AUTH_TOKEN,
                "Content-Type": "application/json;charset=UTF-8", 
                "Access-Control-Allow-Origin": "*",
                "scope": "write_customers,read_customers",
                "associated_user_scope": "write_customers",

            },
            body: JSON.stringify(
                {
                    "customer": {
                      "first_name": customerData.first_name,
                      "last_name": customerData.last_name,
                      "email": generateRandomInt(1,100)+customerData.email,
                      "phone": customerData.phone,
                      "verified_email": true,
                      "addresses": [
                        {
                          "address1": customerData.address,
                          "city": customerData.city,
                          "province": customerData.state,
                          "phone": customerData.phone,
                          "zip": customerData.zip,
                          "last_name": customerData.last_name,
                          "first_name": customerData.first_name,
                          "country": "US",
                        }
                      ]
                    }
                }
            )
        })

        let resp = await customerResponse.text()
        console.log(resp)
        return JSON.parse(resp)

    }

    async postProduct(){

        let productData = this.getProduct();

        let productResponse = await fetch(`${SHOPIFY_API_URL}/products.json`, {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": SHOPIFY_AUTH_TOKEN,
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(
                {
                    "product": {
                      "title": productData.name,
                      "body_html": productData.description,
                      "vendor": productData.company,
                      "product_type": productData.type,
                      "tags": productData.tags
                    }
                  }
            )
                
        })

        return productResponse

    }

    async getRandomProductFromShop(count){
        let product = await fetch(`${SHOPIFY_API_URL}/products.json?limit=1&page=${generateRandomInt(1, count)}`, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": SHOPIFY_AUTH_TOKEN,
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(resp => resp.json())
        return product.products[0]
    }

    async getRandomCustomerFromShop(count){
        let customerCount = await fetch(`${SHOPIFY_API_URL}/customers/count.json`, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": SHOPIFY_AUTH_TOKEN,
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(resp => resp.json())
        let customer = await fetch(`${SHOPIFY_API_URL}/customers.json?limit=1&page=${generateRandomInt(1, customerCount.count)}`, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": SHOPIFY_AUTH_TOKEN,
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(resp => resp.json())
        return customer.customers[0]
    }

    async getProductList(){
        let productCount = await fetch(`${SHOPIFY_API_URL}/products/count.json`, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": SHOPIFY_AUTH_TOKEN,
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            }
        }).then(resp => resp.json())

        let arrayOfProducts = [];
        for (let i=0; i<generateRandomInt(1,5); i++) {
            let product = await this.getRandomProductFromShop(productCount.count)
            arrayOfProducts.push(product)
        }
        return arrayOfProducts
    }

    async postOrder(){
        let customer = await this.getRandomCustomerFromShop();
        let product = await this.getProductList();
        let orderStatus = generateRandomInt(1,14);

        let orderResponse = await fetch(`${SHOPIFY_API_URL}/orders.json`, {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": SHOPIFY_AUTH_TOKEN,
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(
                {
                    "order": {
                        "customer": customer,
                        "line_items": product.map(p => ({
                            "variant_id": p.variants[0].id,
                            "quantity": generateRandomInt(1,3)
                        }))
                    }
                }
            ) 
                
        })
        let resp = await orderResponse.text()
        console.log(resp)
        return JSON.parse(resp)
    }


}