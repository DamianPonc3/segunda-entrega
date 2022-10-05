const fs = require('fs');
const path = require('path');

const fastFoodList = "fastfood.json"


class Products{
    constructor(fastFoodList){
        this.fastFoodList = fastFoodList
    }

    async validateExistList() {
        try{
            await fs.promises.stat(this.fastFoodList);
            return 1;
        }catch (err){
            console.log("Creating list");
            await fs.promises.writeFile(this.fastFoodList, JSON.stringify([]));
            return 0;
        }
    }

    async getAll(){
        try{
            const data = await fs.promises.readFile(this.fastFoodList, 'utf-8');
            return JSON.parse(data);
        }catch(err){
            console.log("Could not get fast food list", err)
        }
    }

    async saveProducts(products){
        try{
            const data = JSON.stringify(products, null, '\t')
            await fs.promises.writeFile(this.fastFoodList, data);

        } catch(err){
            console.log("Failed to save food to list", err)
        }
    }

    async getById(id){
        try {
            const products = await this.getAll();
            const i = products.findIndex((product) => product.id === id);
            if (i < 0) {
                throw new Error("The food sought does not exist");
            }
            return products[i];
            } catch (error) {
            console.log("There was a problem looking for food", error);
        }
    }

    async saveProduct(data){
        if (
            !data.title ||
            !data.price ||
            typeof data.title !== "string" ||
            typeof data.price !== "number"
            )
            throw new Error("invalid data!");
        try {
            const products = await this.getAll();
            let id = 1;
            if (products.length) {
                id = products[products.length - 1].id + 1;
            }
            const newProduct = {
                title: data.title,
                price: "$" + data.price,
                id: id,
            };
            products.push(newProduct);
            await this.saveProducts(products);
        } catch (error) {
            console.log("Failed to save food to list", error);
        }
    }

    async deleteAll(){
        try {
            await this.saveProducts([]);
        } catch (error) {
            console.log("There was a problem deleting foods from the list", error);
        }
    }

    async deleteById(id){
        try {
            const products = await this.getAll();
            const i = products.findIndex((product) => product.id === id);
            if (i < 0) {
                throw new Error("The food to eliminate does not exist");
            }
            products.splice(i, 1);
            await this.saveProducts(products);
            } catch (error) {
            console.log("There was a problem deleting the indicated food", error);
        }
    }
}


const fastFood1 = new Products(fastFoodList)

    const main = async () => {
        try {
        let e = await fastFood1.validateExistList();
        if (e === 1) {
            console.log("The list already exists!");
        }
    
        let products = await fastFood1.getAll();
    
        if (products.length == 0) {
            console.log("The list has no products to display");
        } else {
            console.log(products);
        }
    
        const product = await fastFood1.getById(1);
        if (product != null) {
            console.log(product);
        }
    
        const newProduct = {
            title: "Empanada",
            price: 100,
        };
    
        await fastFood1.saveProduct(newProduct);
        products = await fastFood1.getAll();
        console.log(products);
    
        try {
            await fastFood1.deleteById(2);
            products = await fastFood1.getAll();
            console.log(products);
        } catch (error) {
            console.log(error);
        }
    
        // await fastFood1.deleteAll();
        products = await fastFood1.getAll();
        console.log(products);
        } catch (error) {
        console.log(error);
        }
    };
    
    main();






