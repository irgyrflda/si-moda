import { NextFunction, Request, Response } from "express";
import getConfig from "@config/dotenv";

const documentationApi = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const html: string = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Dokumentasi Service PDF</title>
            <style>
                body {
                    margin: 25px;
                    padding: 0;
                    background-color: orange;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    font-family: Arial, sans-serif;
                    color: white;
                    text-align: center;
                    overflow: hidden;
                }
                .container {
                    text-align: center;
                }
                .button {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: white;
                    color: orange;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }
                .button:hover {
                    background-color: #ffcc66;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>WELCOME TO DOCUMENTATION PDF SERVICE!!</h1>
                <h3>Klik here 
                    <a href=https://example.com class="button">Documentation</a>
                </h3>
            </div>
        </body>
        </html>
        `
        res.send(html)
    } catch (error) {
        throw new Error('Halaman Sedang Tidak Tersedia')
    }
}

export default documentationApi;
