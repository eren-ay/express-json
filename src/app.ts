import { json } from 'body-parser';
import express from 'express';
import { Request, Response } from 'express';
import { writeFile } from 'fs/promises';
import db from "./db.json";

const app = express();



app.use(express.json());
app.use(express.urlencoded());




class Book {
    author: string;
    pages: number;
    title: string;
    year: number;
    constructor(author:string,pages:number,title:string ="title",year:number=1990){
        this.author=author;
        this.pages=pages;
        this.title=title;
        this.year=year;
    }
}


app.get('/books', (req: Request, res: Response) => {
     

    res.send(db);
});



app.get('/books/book:id',(req: Request, res: Response)=>{
    const bookId: number= Number(req.params.id);
    res.send(db[bookId]);
});



app.post('/books/add',(req:Request,res: Response)=>{
    const book=new Book(req.body.author,req.body.pages);
    if (book.author == null || book.pages == null) {
        console.log(req.body);
        return res.status(400).send({error: true, msg: 'data missing'});
    }
    saveBookData(book);
    res.sendStatus(200);
});



app.delete('/books/delete:id',(req:Request,res: Response)=>{
    const bookId: number= Number(req.params.id);
    db.splice(bookId,1);
    writeFile('./src/db.json',JSON.stringify(db));
    res.send(200);
});



const saveBookData = (data:Book) => {
    db.push(data);
    const stringifyData = JSON.stringify(db);
    writeFile('./src/db.json', stringifyData);
}

app.listen(3000, () => {
    console.log('Application started on port 3000!');
});