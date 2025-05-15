import path from "path";
import pug from "pug";

const dirname = import.meta.dirname;
const viewsPath = path.join(dirname, "..", "views");

const loggedUser = {
    name: {
        first: "Jean",
        last: "Dupont",
    },
    age: 36,
    birthdate: new Date("1986-04-18"),
    location: {
        zipcode: "77420",
        city: "Champs-sur-Marne",
    },
    isAdmin: true,
};

const result = pug.renderFile(path.join(viewsPath, "isAdmin.pug"), {
    user: loggedUser,
});

console.log(result);
