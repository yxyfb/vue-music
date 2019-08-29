//在singerList页面中，重复添加下面这个对象，就可以实例化对象，达到简写的目的

export default class Singer {
    constructor({mid,name}) {   //constructor自动执行实例化
        this.mid = mid;
        this.name =name;
        this.avatar = `http://y.gtimg.cn/music/photo_new/T001R300x300M000${this.mid}.jpg?max_age=2592000`;
    }
} 