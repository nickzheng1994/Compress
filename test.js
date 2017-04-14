
var UglifyJS = require("uglify-js"),
    fs = require("fs"),
    path = require("path"),
    babel = require("babel-core"),
    colors = require('colors');
var minify = require('html-minifier').minify;

colors.setTheme({  
    load: 'blue',  
    finish: 'red', 
    err:'red',
    warn:'grey' 
});

let config = path.join(__dirname,'we_app','app.json'),
    data = '';

fs.exists(config,function(exists){
    if(!exists){
        console.log('没有找到' + config .finish)
    }else{
        data = JSON.parse(fs.readFileSync(config).toString());

        compressCode(); 
    }
});
//创建文件夹
const  mkdir = (dirpath,dirname) =>{  
    //判断是否是第一次调用
    if(dirpath.indexOf('.js') != -1){
        var dirpath_Arr = dirpath.split('/');
        dirpath_Arr.pop();
        dirpath = dirpath_Arr.join('/');
    }
    if(typeof dirname === "undefined"){   
        if(fs.existsSync(dirpath)){  
            return;  
        }else{  
            mkdir(dirpath,path.dirname(dirpath));  
        }  
    }else{  
        //判断第二个参数是否正常，避免调用时传入错误参数  
        if(dirname !== path.dirname(dirpath)){   
            mkdir(dirpath);   
            return;  
        }
        if(fs.existsSync(dirname)){
            fs.mkdirSync(dirpath);  
        }else{  
            mkdir(dirname,path.dirname(dirname));  
            fs.mkdirSync(dirpath); 
        } 
    } 
}

//文件路径

const compressPath =(el,format)=>{

    //编译前的路径

    let default_path = [__dirname,'we_app'],
            new_arr = [];

    let el_arr = el.split('/');

    el_arr.push(el_arr.pop() + format);

    new_arr =  default_path.concat(el_arr);

    let config_path = path.join(...new_arr);

    //编译后的路径

    let min_default_path = [__dirname,'build-min'];

    let min_path_arr = min_default_path.concat(el_arr);

    let min_path = path.join(...min_path_arr);

    const mini_path = min_path.replace(format,'.min' + format);

    return {
        path: config_path,
        mini_path: mini_path
    }
}

//压缩js代码

const compressJS = (el)=>{

    let config_path = compressPath(el,'.js').path;

    let origCode = fs.readFileSync(config_path, 'utf8');

    const opt = {
        presets: ['es2015']
    };

    console.log(config_path + '正在压缩  '.load);

    let result = babel.transform(origCode,opt);
    
    result = UglifyJS.minify(result.code, {fromString: true});

    config_path = compressPath(el,'.js').mini_path;

    mkdir(config_path);

    fs.writeFileSync(config_path, result.code);

    console.log(config_path + '已压缩完毕  '.finish)

}

//压缩wxml代码

const compressWXML = (el)=>{

    let config_path = compressPath(el,'.wxml').path;

    let origCode = fs.readFileSync(config_path, 'utf8');

    console.log(config_path + '正在压缩  '.load);

    let result = minify(origCode, {
            removeAttributeQuotes: true,
            removeComments:true,
            collapseWhitespace :true
        });

    config_path = compressPath(el,'.wxml').mini_path;

    fs.writeFileSync(config_path, result);

    console.log(config_path + '已压缩完毕  '.finish)

}

//压缩代码
const compressCode = ()=>{

    data.pages.forEach((el)=> {

        compressJS(el);
        compressWXML(el);
    });
}
