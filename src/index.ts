import { Hono } from 'hono'
import { Bindings } from 'hono/types'
import { nanoid } from 'nanoid'

type Binding={
  movie : KVNamespace,
}

type Movie={
  title: string,
  year: string,
  imdb: string,
  movie:string,
  trailer:string,
  poster:string,
  description:string,
  language:string,
  Duration:string,
  rating:string,
  genre:string[],
  directed_by:string
}
type flim ={
  name: string
  movie: string
}

const app = new Hono<{Bindings:Binding}>()

app.get('/movie/:id', async(c) => {
  const id = c.req.param("id")
  const movie = await c.env.movie.get(`movie ${id}`)
  return c.json(movie?JSON.parse(movie):null)
})
app.get('/flim/get/:id', async(c) => {
  const id = c.req.param("id")
  const movie = await c.env.movie.get(id)
  return c.json(movie?JSON.parse(movie):null)
})
app.post("/flim", async (c) => {
  const {name,movie}= await c.req.json()
  const newmovie:flim={
    name:name,
    movie:movie
  }
  await c.env.movie.put(nanoid(),JSON.stringify(newmovie))
  return c.json(newmovie)
})
app.get('/movie/get/ggg', async(c) => {
  const movieListResult = await c.env.movie.list({prefix:`movie `})
   const movies = await Promise.all(movieListResult.keys.map(async ({ name }) => {
     const movieData = await c.env.movie.get(name);
     return movieData ? JSON.parse(movieData) : null;
   }));
   return c.json(movies)
})
app.get('/flim/getall', async(c) => {
  const FlimListResult = await c.env.movie.list()
   const movies = await Promise.all(FlimListResult.keys.map(async ({ name }) => {
    if(!name.startsWith("movie ")){
      const movieData = await c.env.movie.get(name);
     return movieData ? JSON.parse(movieData) : null;
    }
    else{
      return null
    }
    
  }));
  const filteredMovies = movies.filter(movie => movie !== null);
  if (filteredMovies.length > 0) {
    return c.json(filteredMovies);
  } else {
    // If no movies matched the prefix, respond with an empty body
    return c.text("");
  }
})

app.post('/movie/post', async (c) => {
  const {title ,year,imdb ,movie,trailer,poster,description,language,Duration,rating,genre,directed_by}= await c.req.json()
  const newmovie:Movie={
    title:title,
    year:year,
    imdb:imdb,
    movie:movie,
    trailer: trailer,
    poster: poster,
    description: description,
    language: language,
    Duration: Duration,
    rating: rating,
    genre: genre,
    directed_by: directed_by
    
  }
  await c.env.movie.put(`movie ${nanoid()}`,JSON.stringify(newmovie))
  return c.json(newmovie)

})



export default app
