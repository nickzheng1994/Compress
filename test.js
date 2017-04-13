
var UglifyJS = require("uglify-js"),
    fs = require("fs"),
    path = require("path"),
    babel = require("babel-core"),
    colors = require('colors');

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
    })


const compressCode = ()=>{

    data.pages.forEach((el)=> {

        let default_path = [__dirname,'we_app'],
            new_arr = []

        let el_arr = el.split('/');

        el_arr.push(el_arr.pop() + '.js');

        new_arr =  default_path.concat(el_arr);

        let config_path = path.join(...new_arr);

        let origCode = fs.readFileSync(config_path, 'utf8');

        const opt = {
            presets: ['es2015']
        }
        console.log(config_path + '正在压缩  '.load);

        let result = babel.transform(origCode,opt);
        
        result = UglifyJS.minify(result.code, {fromString: true});

        let min_default_path = [__dirname,'build-min'];

        let min_path_arr = min_default_path.concat(el_arr);

        let min_path = path.join(...min_path_arr);

        config_path = min_path.replace('.js','.min.js');

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

        mkdir(config_path);

        fs.writeFileSync(config_path, result.code);

        console.log(config_path + '已压缩完毕  '.finish)

    });
}
