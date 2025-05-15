import http from "http";
import path from "path";
import pug from "pug";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
    const renderedNavbar = pug.compileFile(
        path.join(__dirname, "views", "navbar.pug")
    );

    const loggedUser = {
        name: {
            first: "John",
            last: "Doe",
        },
        birthdate: new Date(1990, 0, 1),
        location: {
            city: "Paris",
            zipcode: "75001",
        },
        isAdmin: true,
    };

    const renderedTemplate = pug.renderFile(
        path.join(__dirname, "views", "isAdmin.pug"),
        {
            user: {
                isAdmin: true,
            },
            navbar: renderedNavbar(),
            loggedUser: loggedUser,
        }
    );

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(renderedTemplate);
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
