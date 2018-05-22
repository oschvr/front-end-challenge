# BITSO FRONT END CHALLENGE

![Front End Challenge Image](https://github.com/bitsoex/front-end-challenge/blob/master/bann_bfec.jpg)

> Por [oschvr](https://github.com/oschvr)
> 
> Last change: **17/05/2018**

### DEPENDENCIAS

Utilizamos el repositorio de **[`create-react-app`](https://github.com/facebook/create-react-app)** para crear nuestro starter pack, 

- "react": "^16.3.2"
- "react-dom": "^16.3.2"
- "react-scripts": "1.1.4",

**[`bootstrap-less-port`](https://github.com/seanCodes/bootstrap-less-port)*** Utilizaré el port de less para usar **Bootstrap 4** para no iniciar de cero en el styling

- "bootstrap-less-port": "^0.3.0",


Después utilizamos **[`react-grid-system`](https://github.com/JSxMachina/react-grid-system)*** para hacer nuestros layouts y grids.

- "react-grid-system": "^3.2.3",

> ¿Por que no usar el sistema de grids de Bootstrap v4.1?
> 
> R: Según la documentacón, **react-grid-system** está inspirado en el grid de Boostrap v4.1, pero ya con los bindings y además utiliza poderosas caracteristicas como breakpoints custom y widths de gutters a través del contexto de React. 

**[`socket.io-client`](http://socket.io/)** para establecer un socket desde el app de react con **wss://ws.bitso.com**

- "socket.io-client": "^2.1.0"


### DEPENDENCIAS DE DESARROLLO

**[`grunt`](https://gruntjs.com/)** es el task runner que escogi para convertir nuestro código less a css

- "grunt": "^1.0.2",
- "grunt-contrib-less": "^1.4.1",
- "grunt-contrib-watch": "^1.1.0",
- "less-plugin-autoprefix": "^1.5.1",
- "less-plugin-clean-css": "^1.5.1",

**[`nodemon`](https://nodemon.io/)** para mantener corriendo el servidor y recargar cualquier cambio.

- "nodemon": "^1.17.4"



### Notas sobre el API

Para obtener la información de `open`, `close`, `high` y `low` por día en un periodo de tiempo, deberás consultar el siguiente URL:
```https://bitso.com/trade/chartJSON/<book>/<timeframe>```
dónde `book` es el libro a consultar y `timeframe` puede tomar estos valores:
   * `1month`
   * `3months`
   * `1year`

Por ejemplo: https://bitso.com/trade/chartJSON/btc_mxn/1month , regresa la información de el último mes del mercado BTC/MXN.