const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/movies')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/movies/', async (request, response) => {
  const getMoviesQuery = `
    SELECT
      *
    FROM
      movie;`
  const moviesArray = await db.all(getMoviesQuery)
  const ans = moviesArray => {
    return {
      movieName: moviesArray.movie_name,
    }
  }
  response.send(moviesArray.map(eachmovie => ans(eachmovie)))
})

app.post('/movies/', async (request, response) => {
  const {movie_id, director_id, movie_name, lead_actor} = request.body
  const addMoviesQuery = `
    INSERT INTO
      movie (movie_id,director_id,movie_name,lead_actor)
    VALUES
      (
        '${movie_id}',
        '${director_id}',
        '${movie_name}',
        '${lead_actor}'
      );`

  const dbResponse = await db.run(addMoviesQuery)
  response.send('Movie successfully added')
})

module.exports = app
