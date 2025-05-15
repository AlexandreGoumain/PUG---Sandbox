import fs from "fs";
import http from "http";
import path from "path";
import pug from "pug";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction pour mettre à jour l'état actif du menu
function updateMenuActiveState(currentPath) {
    return [
        { path: "/", title: "Home", isActive: currentPath === "/" },
        {
            path: "/about-me",
            title: "About",
            isActive: currentPath === "/about-me",
        },
        {
            path: "/references",
            title: "References",
            isActive: currentPath === "/references",
        },
        {
            path: "/contact-me",
            title: "Contact",
            isActive: currentPath === "/contact-me",
        },
    ];
}

// Création du serveur HTTP
const server = http.createServer((req, res) => {
    const url = req.url;

    // Route pour la page d'accueil
    if (url === "/") {
        const menuItems = updateMenuActiveState("/");
        const renderedTemplate = pug.renderFile(
            path.join(__dirname, "views", "index.pug"),
            {
                title: "Portfolio - Accueil",
                menuItems: menuItems,
            }
        );

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(renderedTemplate);
    }
    // page "À propos"
    else if (url === "/about-me") {
        const menuItems = updateMenuActiveState("/about-me");
        const renderedTemplate = pug.renderFile(
            path.join(__dirname, "views", "about-me.pug"),
            {
                title: "Portfolio - À propos de moi",
                menuItems: menuItems,
            }
        );

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(renderedTemplate);
    }
    // Servir les fichiers statiques (CSS, JS, etc.)
    else if (url.match(/\.(css|js|jpg|png|gif)$/)) {
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
    }
    // Page non trouvée
    else {
        res.writeHead(404);
        res.end("Page not found");
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Le serveur est démarré sur http://localhost:${port}`);
});
