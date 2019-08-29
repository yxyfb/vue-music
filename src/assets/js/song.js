//在singer-detail页面中，添加对象，就可以实例化对象，达到简写的目的

export default class Song {
    constructor({songmid,songname,songid,singer,albummid,albumname,image,duration}) {   //constructor自动执行实例化
        this.songmid = songmid;   //歌曲播放id
        this.songname = songname;  //歌曲名
        this.songid = songid;  //歌曲专属id
        this.singer = singer;  //歌曲名
        this.albummid = albummid;  //图片id
        this.albumname = albumname;  //专辑名字
        this.image = image;
        this.duration = duration;  //歌曲时间
    }
} 

//在singer-detaill中是循环调用，所以，这里实例化，避免在循环中重复实例化
export const createSong = (musicData) => {
    return new Song({
        songmid: musicData.songmid,  //歌曲播放id
        songname: musicData.songname, //歌曲名
        songid: musicData.songid, //歌曲专属id
        singer: getsingerName(musicData.singer), //歌手名
        albummid: musicData.albummid, //图片id
        albumname: musicData.albumname, //专辑名字
        duration:musicData.interval,  //歌曲时长
        image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
        // url:`http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=6711929420&uin=0&fromtag=38&vkey=${vkey}`
    })
}

//点击歌单，实例刷歌单数据
export const createSongSheet = (musicData) => {
    return new Song({
        songmid: musicData.mid,  //歌曲播放id和图片id是同一个
        songname: musicData.album.name, //歌曲名
        songid: musicData.id, //歌曲专属id
        singer: getsingerName(musicData.singer), //歌手名
        albumname: musicData.name, //专辑名字
        duration:musicData.interval,  //歌曲时长
        image:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`,
        // url:`http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=6711929420&uin=0&fromtag=38&vkey=${vkey}`
    })
}

//在数据中，歌手名字是个数组，所以这里需要拼接
export const getsingerName = (singers) => {
    let ret = [];
    if(!singers) {
        return '';
    }
    singers.forEach(singer => {
        if(singer.name) {
            ret.push(singer.name);
        }
    })
    return ret.join('·');
}