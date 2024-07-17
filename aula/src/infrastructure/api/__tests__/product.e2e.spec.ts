import request from "supertest";
import { app, sequelize } from "../express";

describe('E2E test for product', () => {
    beforeEach(async () => {
      await sequelize.sync({ force: true });
    });
  
    afterAll(async () => {
      await sequelize.close();
    });

    it('should create a product', async () => {

       const response = await request(app)
         .post('/product')
         .send({
           type: 'Product',
           name: 'Product 1',
           price: 1.1           
       });

       expect(response.status).toBe(200);
       expect(response.body.name).toBe('Product 1');
       expect(response.body.price).toBe(1.1);
    });

    it('should not create a product', async () => {

      const response = await request(app)
         .post('/product')
         .send({
           name: 'Product 1',
       });

       expect(response.status).toBe(500);
    });

    it('should update a product', async () => {

        const responseCreate = await request(app)
         .post('/product')
         .send({
           type: 'Product',
           name: 'Product 1',
           price: 1.1,
       });

       expect(responseCreate.status).toBe(200);

       const idProductCreated = responseCreate.body.id;

       const responseUpdate = await request(app)
           .put('/product')
           .send({
             id: idProductCreated,
             name: 'Product 2',
             price: 1.2,
         });

         expect(responseUpdate.status).toBe(200);
         expect(responseUpdate.body.name).toBe('Product 2');
         expect(responseUpdate.body.price).toBe(1.2);
      });

      it('should find a product', async () => {

        const responseCreate = await request(app)
         .post('/product')
         .send({
           type: 'Product',
           name: 'Product 1',
           price: 1.1,
       });

       expect(responseCreate.status).toBe(200);

       const idProductCreated = responseCreate.body.id;

       const responseFind = await request(app)
         .get(`/product/${idProductCreated}`)
         .send({id: idProductCreated});

       expect(responseFind.status).toBe(200);
       expect(responseFind.body.name).toBe(responseCreate.body.name);
       expect(responseFind.body.price).toBe(responseCreate.body.price);
      });

      it('should list all product', async () => {

        const responseCreate1 = await request(app)
         .post('/product')
         .send({
           type: 'Product',
           name: 'Product 1',
           price: 1.1,
       });

       expect(responseCreate1.status).toBe(200);

       const responseCreate2 = await request(app)
         .post('/product')
         .send({
           type: 'Product',
           name: 'Product 2',
           price: 1.2,
       });

       expect(responseCreate2.status).toBe(200);

       const listResponse = await request(app).get('/product').send();
       console.log('listResponse', listResponse.error);
       expect(listResponse.status).toBe(200);
       expect(listResponse.body.products.length).toBe(2);

       const product1 = listResponse.body.products[0];
       expect(product1.name).toBe('Product 1');
       expect(product1.price).toBe(1.1);

       const product2 = listResponse.body.products[1];
       expect(product2.name).toBe('Product 2');
       expect(product2.price).toBe(1.2);

    });
});