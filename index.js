const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

// endpoints here

//test
server.get('/', (req, res) => {
  res.status(200).json('hello world!');
})

//GET all zoos in database
server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos')
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json({ message: 'cannot get zoos' });
  }
})

//GET zoo by id
server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zoo = await db('zoos') 
      .where({ id: req.params.id})
      .first()
    res.status(200).json(zoo);
  } catch (error) {
    res.status(500).json({ message: 'cannot get zoo'});
  }
})

//POST new zoo- only needs a name parameter
server.post('/api/zoos', async (req, res) => {
  try {
    const [id] = await db('zoos').insert(req.body);
    const newZoo = await db('zoos')
      .where({ id })
      .first()
    res.status(201).json({ newZoo });
  } catch (error) {
    res.status(500).json({message: 'cannot save zoo', error });
  }
})

//PUT- updates zoo name
server.put('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
      .where({ id: req.params.id })
      .update(req.body)
    if(count > 0) {
      const updated = await db('zoos')
        .where({ id: req.params.id })
        .first()
      res.status(201).json({ updated });
    } else {
      res.status(404).json({message: 'zoo not found'})
    }
  } catch (error) {
    res.status(500).json('error updating');
  }
})

//DELETE- removes zoo by id
server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
      .where({ id: req.params.id})
      .delete()
    if(count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json('zoo not found')
    }
  } catch (error) {
    res.status(500).json('unable to delete');
  }
})

//Stretch- bears table