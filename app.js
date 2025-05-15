import fs from "fs";
import http from "http";
import path from "path";
import pug from "pug";
import querystring from "querystring";
import url, { fileURLToPath } from "url";

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

function saveContact(contact) {
    const contactsPath = path.join(__dirname, "data", "contacts.json");
    let contacts = [];

    if (fs.existsSync(contactsPath)) {
        const data = fs.readFileSync(contactsPath, "utf8");
        contacts = JSON.parse(data);
    }

    contact.date = new Date().toISOString();
    contacts.push(contact);

    fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    switch (pathname) {
        case "/": {
            const menuItems = updateMenuActiveState("/");
            const renderedTemplate = pug.renderFile(
                path.join(__dirname, "views", "index.pug"),
                {
                    title: "Portfolio - Accueil",
                    menuItems: menuItems,
                    message: parsedUrl.query.message || null,
                }
            );

            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(renderedTemplate);
            break;
        }
        case "/about-me": {
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
            break;
        }
        case "/contact-me": {
            const menuItems = updateMenuActiveState("/contact-me");
            const renderedTemplate = pug.renderFile(
                path.join(__dirname, "views", "contact-me.pug"),
                {
                    title: "Portfolio - Contact",
                    menuItems: menuItems,
                }
            );

            res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            res.end(renderedTemplate);
            break;
        }
        case "/submit-contact": {
            if (method !== "POST") break;

            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });

            req.on("end", () => {
                const formData = querystring.parse(body);

                if (!formData.email || !formData.message) {
                    res.writeHead(400, {
                        "Content-Type": "text/plain; charset=utf-8",
                    });
                    res.end("Les champs email et message sont requis.");
                    return;
                }

                saveContact({
                    email: formData.email,
                    message: formData.message,
                });

                const successMessage =
                    "Votre message a bien été envoyé. Merci de nous avoir contacté !";
                const encodedMessage = encodeURIComponent(successMessage);

                res.writeHead(302, {
                    "Content-Type": "text/html; charset=utf-8",
                    Location: `/?message=${encodedMessage}`,
                });
                res.end();
            });
            break;
        }
        default: {
            if (pathname.match(/\.(css|js|jpg|png)$/)) {
                const filePath = path.join(__dirname, "public", pathname);
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
                    }[path.extname(pathname)];

                    res.writeHead(200, { "Content-Type": contentType });
                    res.end(data);
                });
            } else {
                res.writeHead(404);
                res.end("Page not found");
            }
            break;
        }
    }
});

const port = 3000;

server.listen(port, () => {
    console.log(`Le serveur est démarré sur http://localhost:${port}`);
});
