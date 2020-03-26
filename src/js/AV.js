// 保存AV对象
function saveAvObject(className, data) {
    var AvObjetct = AV.Object.extend(className)
    var avObjetct = new AvObjetct()
    return avObjetct.set(data).save()
        .then(function (avObjetct) {
            console.log(`保存成功。avObjetctId：${avObjetct}`);
        }, function (error) {
            console.log(`保存失败。错误：${error}`)
        })
}

// 获取AV对象
function getAvObject(className, id) {
    return new AV.Query(className).get(id)
}

// 保存AvMap多对多关系
function saveAvMap(avObj1, avObj2, mapName) {
    Promise
        .all([avObj1, avObj2])
        .then(responses => {
            let map = new AV.Object(mapName)
            for (data of responses) {
                map.set(`${data.className}`, data)
            }
            map.save()
        })
}

// 获取一个AvObject的所有maps
let avObjP = getAvObject('Playlist', '5e73a52c8a84ab00773c0872')

let maps = getAvMaps(avObj, 'SongPlaylistMap')

// console.log(maps)

function getAvMaps(avObjP, mapName) {
    return new AV.Query(mapName).equalTo(`${avObj.className}`, avObj).find().then(xxx=>{
        console.log(xxx)
    })
}

function getAvObjectFromMaps() {
    maps.then(maps => {
        maps.forEach(function (map) {
            let songClassName = map.attributes.Song.className
            let songId = map.attributes.Song.id
            getAvObject(songClassName, songId).then((xxx) => {
                console.log(xxx)
            })
        })
    })
}

// let song2 = getAvObject('Song', '5e73a2de21460d006b21fab6')