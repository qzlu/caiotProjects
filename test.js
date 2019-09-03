let  province = require('./src/mapJson/province') 
let fs = require('fs')
let data = province.map(item => {
    if(item.isProvince){
        let citys = require(`./src/mapJson/${item.jsonName}.json`)
        let children = citys.features.map(obj => {
            return {
                id:obj.properties.adcode,
                name:obj.properties.name
            }
        })
        return {
            id:item.id,
            name:item.name,
            children:children
        }
    }else{
        return {
            id:item.id,
            name:item.name
        }
    }
})
fs.writeFileSync('./src/mapJson/provinceList.json',JSON.stringify(data))