'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Infos = require('./models/infos');
const infos = require('./models/infos');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

/* app.get('/hola/:name', (req, res) => {
    res.send({ message: `Hola ${req.params.name}!`});
}); */

app.get('/api/infos', async (req, res) => {
    try {
        // Obtener todos los documentos de la colección "infos"
        const allInfos = await Infos.find();
        
        // Enviar la lista de documentos como respuesta
        res.status(200).send({ infos: allInfos });
    } catch (error) {
        console.error(`Error al obtener la lista de infos: ${error}`);
        res.status(500).send({ message: `Error al obtener la lista de infos: ${error}` });
    }
});

/* app.get('/api/infos/:infoId', (req, res) => {
    let infoId = req.params.infoId

    Infos.findById(infoId, (err, infos) {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}`})
        if (!infos) return res.status(404).send({ message: `El producto no existe`})

        res.status(200).send({ infos })
    })
}); */

// GET MEJORADO
app.get('/api/infos/:infoId', async (req, res) => {
    try {
        const infoId = req.params.infoId;
        
        const info = await Infos.findById(infoId);
        if (!info) {
            return res.status(404).send({ message: 'La información no existe' });
        }

        res.status(200).send({ info });
    } catch (error) {
        console.error(`Error al realizar la petición: ${error}`);
        res.status(500).send({ message: `Error al realizar la petición: ${error}` });
    }
});

app.post('/api/infos', async (req, res) => {
    try {
        console.log('/api/infos');
        console.log(req.body);

        // Crear una nueva instancia del modelo Info
        let infos = new Infos({
            keyword: req.body.keyword,
            description: req.body.description,
            category: req.body.category
        });

        // Guardar la información en la base de datos
        const infosStored = await infos.save();

        // Devolver una respuesta al cliente
        res.status(200).send({ infos: infosStored });
    } catch (error) {
        // Manejar errores
        console.error(`Error al guardar en la base de datos: ${error}`);
        res.status(500).send({ message: `Error al guardar en la base de datos: ${error}` });
    }
});

/* app.put('/api/infos/:infoId', (req, res) => {
    let infoId = req.params.infoId;
    let update = req.body;

    Infos.findByIdAndUpdate(infoId, update, (err, infoUpdated) => {
        if (err) res.status(500).send({ message: `Error al actualizar el producto: ${err}` });
        res.status(200).send({ infos: infoUpdated });
    });
}); */

// UPDATE MEJORADO
app.put('/api/infos/:infoId', async (req, res) => {
    try {
        const infoId = req.params.infoId;
        const update = req.body;

        // Actualizar la información por su ID
        const infoUpdated = await Infos.findByIdAndUpdate(infoId, update, { new: true });
        
        if (!infoUpdated) {
            return res.status(404).send({ message: 'La información no existe' });
        }

        res.status(200).send({ infos: infoUpdated });
    } catch (error) {
        console.error(`Error al actualizar la información: ${error}`);
        res.status(500).send({ message: `Error al actualizar la información: ${error}` });
    }
});


/* app.delete('/api/infos/:infoId', (req, res) => {
    let infoId = req.params.infoId;

    Infos.findById(infoId, (err) => {
        if (err) res.status(500).send({ message: `Error al borrar la info: ${err}` })

        info.remove(err => {
            if (err) res.status(500).send({ message: `Error al borrar el producto: ${err}` })
            res.status(200).send({ message: 'La info ha sido eliminada'})
        })
    })
}); */

// DELETE MEJORADO
app.delete('/api/infos/:infoId', async (req, res) => {
    try {
        const infoId = req.params.infoId;

        // Eliminar la información por su ID
        const info = await Infos.findByIdAndDelete(infoId);
        
        if (!info) {
            return res.status(404).send({ message: 'La información no existe' });
        }

        res.status(200).send({ message: 'La información ha sido eliminada' });
    } catch (error) {
        console.error(`Error al borrar la información: ${error}`);
        res.status(500).send({ message: `Error al borrar la información: ${error}` });
    }
});

mongoose.connect('mongodb://localhost:27017/dbinfos')
    .then(() => {
        console.log(`Conexion con MONGODB exitosa con puerto`)
        app.listen(PORT, () => { console.log(`Servidor en funcionamiento: ${PORT}`) });
    })
    .catch( error => console.log("Error de conexion con MongoDB", error));