'use strict';

const morgan = require('morgan');
const express = require ('express');


const  {top50}  = require('./data/top50');

const {books} = require('./data/books');



const PORT = process.env.PORT || 3000;

const app = express();


app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

// endpoints here
app.get('/top50', (req, res) => {
    res.render('pages/top50', {
        title: "Top 50 Songs Streamed on Spotify",
        top50: top50,
        });
});

app.get('/top50/mostPopArtist', (req, res) =>{
    const allArtists = [];
    /* I create an empty array in which I will push all the artists */
    const numArtists = {};
    /* I creat en empty object that I will populate with the number of artists
    /* create a function that will
    render the songs of the most popular artist on the list.
    FOR THAT I NEED TO DETERMINE WHO IS THE ARTIST THAT COMES BACK THE MOSRT && THE MOST STREAMS*/ 
    /*I look for each  "song" in the top50 and I push the artist value of each object of the top50 array in my new array */
    top50.forEach(song => {
        if (!allArtists.includes(song.artist)){
            allArtists.push(song.artist)
        }/* Why do we need to determine that topArtists doesnt include (song.artist)*/
        
    });

    /*I need compare my new allArtist array with with the top 50 array
    to count how many times each comes back
    for each artist in the allArtist that is also in the top 50 I add its count
    in my numArtist object
    for that I need create a count that starts at 0 and after comparing 
    equate my numArtist[artist] to count
    */
    allArtists.forEach(artist =>{
        let count = 0
        top50.forEach(song => {
            if(artist === song.artist) count += 1

        });
        numArtists[artist] = count
    });

    /* now that I added all my artists in the numArtists object,
    I need to rank them.
    I will do that by creating a new array in which I will push them
    I need to get the object.values of my numArtist for each
    current value (count)
    and the array index of the current element(what is their ranking)
    I DON'T UNDERSTAND THE REST
    */



    const rankedArtists = []

    Object.values(numArtists).forEach((count,id) =>{
        const artist = Object.keys(numArtists)[id];
        rankedArtists.push({
            artist: artist,
            count: count
    });
    });
    const mostPopArtist = rankedArtists.sort((a, b) => a.count < b.count ? 1 : -1)[0].artist;
    
    res.render('pages/mostPopArtist', {
        title: 'Most Popular Artist',
        song: top50.filter(song => song.artist === mostPopArtist)
    });
});

app.get('/top50/song/:rank', (req,res)=>{
    const rank = req.params.rank - 1;
    console.log(req)
    /* I NEED TO GO OVER THAT VARIBALE WITH A TC */
    if (top50[rank]) {  /* WHY ARE WE MAKING AN IF ELSE STATEMENT if we already have a 404 page set up*/  
        res.render('pages/songPage', {
            title: `Song #${top50[rank].rank}`,
            song: top50[rank]
        });
    } else {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    }
});

app.get('/books', (req, res)=>{
    res.render('pages/myBookShelf',  {
        title: 'My Bookshelf',
        books: books
    })

});





// handle 404s
app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/fourOhFour', {
        title: 'I got nothing',
        path: req.originalUrl
    });
});


app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
