import { CartItem } from './cartItem';
import express from 'express';

const routes = express.Router();

const cartItems: CartItem[] = [
    { id: 1, product: "almond milk", price: 3.00, quantity: 1 },
    { id: 2, product: "goat cheese", price: 6.00, quantity: 1 },
    { id: 3, product: "egg", price: 0.10, quantity: 12 },
    { id: 4, product: "pear", price: 1.30, quantity: 4 },
    { id: 5, product: "vanilla", price: 4.50, quantity: 1 },
    { id: 6, product: "cinnamon", price: 2.50, quantity: 1 }
];
let nextId: number = 7;

// GET /cart-items
routes.get( "/cart-items", ( req, res ) => {
    let maxPrice: number = parseInt( req.query.maxPrice as string );
    let prefix: string = req.query.prefix as string;
    let pageSize: number = parseInt( req.query.pageSize as string );
    let filteredCart = cartItems;

    // Cart only shows items that are at or below this price if specified
    if ( maxPrice ) {
        filteredCart = filteredCart.filter( item => item.price <= maxPrice );
    }
    // Cart only shows items that start with the given string in the response array if specified
    if ( prefix ) {
        prefix = prefix.toLowerCase();
        filteredCart = filteredCart.filter( item => item.product.toLowerCase().includes( prefix ) );
    }
    // Limit number of cart items shown 
    if ( pageSize ) {
        filteredCart = filteredCart.slice( 0, pageSize );
    }
    res.json( filteredCart );
    res.status( 200 );

    // ***************** How can page respond with 404 if 
    if ( filteredCart === undefined ) {
        res.status( 404 );
        res.send( `No item found with those parameters` );
    }
} );

// GET /cart-items/:id
// Responds with item with the given ID
routes.get( "/cart-items/:id", ( req, res ) => {
    const id: number = parseInt( req.params.id );
    const items: CartItem | undefined = cartItems.find( item => item.id === id );
    if ( items ) {
        res.json( items );
        res.status( 200 );
    }
    res.status( 404 );
    res.send( `No item found with ID: ${ id }` );
} );

// POST /cart-items
// Adds a cart item
routes.post( "/cart-items", ( req, res ) => {
    let item: CartItem = req.body;
    item.id = nextId;
    nextId++;
    cartItems.push( item );
    res.status( 201 );
    res.json( item );
} );

// PUT /cart-items/:id 
// Modifies cart item
routes.put( "/cart-items/:id", ( req, res ) => {
    const id: number = parseInt( req.params.id );
    let item: CartItem = req.body;
    item.id = id;
    const index: number = cartItems.findIndex( item => item.id === id );

    if ( index !== -1 ) {
        cartItems[ index ] = item;
        res.json( item );
    }
    res.status( 404 );
    res.send( `No item found with ID: ${ id }` );
} );

// DELETE /cart-items/:id 
routes.delete( "/cart-items/:id", ( req, res ) => {
    const id: number = parseInt( req.params.id );
    let item: CartItem = req.body;
    item.id = id;
    const index: number = cartItems.findIndex( item => item.id === id );

    if ( index !== -1 ) {
        cartItems.splice( index, 1 );
        res.status( 204 );
        res.send();
    }
    res.status( 404 );
    res.send( `No item found with ID: ${ id }` );
} );

export default routes;