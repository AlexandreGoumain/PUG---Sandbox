import fs from "fs";
import http from "http";
import path from "path";
import pug from "pug";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const menuItems = [
    { path: "/", title: "Home", isActive: true },
    { path: "/about-me", title: "About", isActive: false },
    { path: "/references", title: "References", isActive: false },
    { path: "/contact-me", title: "Contact", isActive: false },
];

const server = http.createServer((req, res) => {
    const url = req.url;

    if (url === "/" || url === "/index.html") {
        const renderedTemplate = pug.renderFile(
            path.join(__dirname, "views", "index.pug"),
            {
                title: "Portfolio - Accueil",
                menuItems: menuItems,
            }
        );

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(renderedTemplate);
    } else if (url.match(/\.(css|js|jpg|png|gif)$/)) {
        const filePath = path.join(__dirname, "public", url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("File not found");
                return;
            }

            const contentType = {
                ".css": "text/css",
                ".js": "text/javascript",
                ".jpg": "image/jpeg",
                ".png": "image/png",
            }[path.extname(url)];

            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end("Page not found");
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Le serveur est démarré sur http://localhost:${port}`);
});
