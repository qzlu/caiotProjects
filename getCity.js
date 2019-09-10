let  province = require('./mapJson/province') 
let fs = require('fs')
let data = []
province.forEach(item => {
    if(item.isProvince){
        let citys = require(`./mapJson/${item.jsonName}.json`)
        citys.features.forEach(obj => {
            data.push({
                id:obj.properties.adcode,
                name:obj.properties.name
            })
        })
    }else{
        data.push({
            id:item.id,
            name:item.name
        })
    }
})
fs.writeFileSync('./city.json',JSON.stringify(data))