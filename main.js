const express = require('express')
const handlebars = require('express-handlebars')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000
const API_KEY = "621fbd5d2c5649328fd2254577c35db8" //process.env.API_KEY || "" 
let location

const app = express()

const ENDPOINT = "https://newsapi.org/v2/top-headlines"

app.engine('hbs', handlebars({defaultLayout: 'default.hbs'}))
app.set('view engine', 'hbs')

//how to set API KEY in HTTP header
// const url = withQuery(URL, {
//     country: 'us',
//     //apiKey: API_KEY,
//     catgory: sports
// })

// const headers = {
//     'X-Api-Key': API_KEY
// }

// fetch(url, {headers})
//     .then(result => result.json())
//     .then(result => {
//         console.info('>> result: ', result)
//     })
//     .catch(err => {
//         console.error('err: ', err)
//     })
//end

app.get('/', 
    (req, resp) => {

        const noCountry = true
        resp.status(200)
        resp.type('text/html')
        resp.render('index', {noCountry})
    }
)

app.get('/sg', 
    (req, resp) => {

        const noCountry = false
        location = "sg"
        resp.status(200)
        resp.type('text/html')
        resp.render('index', {noCountry, location: "Singapore"})
    }
)

app.get('/us', 
    (req, resp) => {

        const noCountry = false
        location = "us"
        resp.status(200)
        resp.type('text/html')
        resp.render('index', {noCountry, location: "US"})
    }
)

app.get('/search',
    async (req, resp) => {
        const search = req.query['search_term']
        const country = req.query['country'] || location
        const category = req.query['category']
        console.info('Search Term: ', search)
        console.info('Country: ', country)
        console.info('Category: ', category)

        const url = withQuery(
            ENDPOINT,
            {
                q: search,
                country: country,
                category: category,
                apiKey: API_KEY,
                PageSize: 10
            }
        )
        const result = await fetch(url)
        const news = await result.json()
        console.info("Search Results: ", news)
        
        const searchResults = news.articles.map(d => {
            return {
                title: d.title, 
                img: d.urlToImage, 
                description: d.description, 
                publishedAt: d.publishedAt,
                artUrl: d.url
            }
        })

        resp.status(200)
        resp.type('text/html')
        resp.render('search', {searchResults})
    }
)

app.use(express.static(__dirname + '/static'))

app.listen(PORT, () => {
    console.info(`Application started at port ${PORT} on ${new Date()}.`)
})