import path from "path";
import pug from "pug";

const dirname = import.meta.dirname;
const viewsPath = path.join(dirname, "..", "views");

const result = pug.renderFile(path.join(viewsPath, "isAdmin.pug"), {
    user: {
        isAdmin: true,
    },
});

console.log(result);
