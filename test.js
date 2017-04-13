
var UglifyJS = require("uglify-js"),
    fs = require("fs"),
    path = require("path"),
    babel = require("babel-core");

let config = path.join(__dirname,'app.json'),
    data = JSON.parse(fs.readFileSync(config).toString());

const compressCode = ()=>{

    data.pages.forEach((el)=> {

        let default_path = [__dirname,'we_app'];

        let el_arr = el.split('/');

        el_arr.push(el_arr.pop() + '.js');

        default_path =  default_path.concat(el_arr);

        let config_path = path.join(...default_path);

        let origCode = fs.readFileSync(config_path, 'utf8');

        // let result = UglifyJS.minify(config_path);
        const opt = {
            presets: ['es2015']
        }
        let result = babel.transform(origCode,opt);
        
        result = UglifyJS.minify(result.code, {fromString: true});

        fs.writeFileSync(config_path, result.code);

    });
}

compressCode()