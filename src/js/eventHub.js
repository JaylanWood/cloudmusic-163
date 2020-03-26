window.eventHub = {
    events: {
        // 'event1': [fn1, fn2],
        // 'event2': [fn1, fn2]
    },
    init() {},
    //订阅
    on(eventName, fn) {
        if (this.events[eventName] === undefined) {
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    },
    //发布
    emit(eventName, data) {
        for (let key in this.events) {
            if (key === eventName) {
                this.events[key].map((fn) => {
                    return fn(data)
                })
            }
        }
    },
    off() {},
}