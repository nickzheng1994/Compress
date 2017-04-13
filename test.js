
var UglifyJS = require("uglify-js"),
    fs = require("fs"),
    path = require("path"),
    babel = require("babel-core"),
    colors = require('colors');

let config = path.join(__dirname,'we_app','app.json'),
    data = JSON.parse(fs.readFileSync(config).toString());

colors.setTheme({  
    load: 'blue',  
    finish: 'red',  
});

const compressCode = ()=>{

    data.pages.forEach((el)=> {

        let default_path = [__dirname,'we_app'];

        let el_arr = el.split('/');

        el_arr.push(el_arr.pop() + '.js');

        default_path =  default_path.concat(el_arr);

        let config_path = path.join(...default_path);

        let origCode = fs.readFileSync(config_path, 'utf8');

        const opt = {
            presets: ['es2015']
        }
        console.log(config_path + '正在压缩  '.load);

        let result = babel.transform(origCode,opt);
        
        result = UglifyJS.minify(result.code, {fromString: true});

        fs.writeFileSync(config_path, result.code);

        console.log(config_path + '已压缩完毕  '.finish)

    });
}

compressCode()