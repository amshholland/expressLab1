import cartRoutes from './cart';
import cors from "cors";
import express from 'express';

const app = express();

app.use( express.json() );
app.use( cors() );


app.use( "/", cartRoutes );

const port = 3000;

app.listen( port, () => {
    console.log( `Listening on port ${ port }` );
} );