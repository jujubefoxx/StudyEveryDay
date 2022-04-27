// 引入 events 模块:事件触发器
const events = require('events');

// 创建 eventEmitter 对象
// 当 EventEmitter 对象触发事件时，所有绑定到该特定事件的函数都会被同步地调用。 被调用的监听器返回的任何值都将被忽略和丢弃。
// EventEmitter 的核心就是事件触发与事件监听器功能的封装。
const eventEmitter = new events.EventEmitter();


// -------------- 同步事件 Start ----------------
// 创建事件处理程序
const connectHandler = function connected() {

    console.log('连接成功。');

    // 触发 data_received 事件
    eventEmitter.emit('data_received');
}

// 绑定 connection 事件处理程序
eventEmitter.on('connection', connectHandler);

// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function () {
    console.log('数据接收成功。');
});

console.log('-------------同步Start------------')

// 触发 connection 事件 → 触发 connection 绑定的 connectHandler
eventEmitter.emit('connection');// 同步执行

console.log('-------------同步End------------')

// -------------- 同步事件 End ----------------

// -------------- 异步事件 Start ----------------
// 绑定some_event事件为一个匿名函数
eventEmitter.on('some_event', function () {
    console.log('-------------异步Start------------')
    console.log('some_event 事件触发');
});

// 异步触发some_event
setTimeout(function () {
    eventEmitter.emit('some_event');
    console.log('-------------异步End------------')
}, 1000);

console.log('异步执行some_event')
// -------------- 异步事件 End ----------------

// -------------- 多个事件 Start ----------------
// 每个事件，EventEmitter 支持 若干个事件监听器。
// 当事件触发时，注册到这个事件的事件监听器被依次调用，事件参数作为回调函数参数传递。

// someEvent注册了两个事件监听器
eventEmitter.on('someEvent', function (arg1, arg2) {
    console.log('listener1', arg1, arg2);
});
eventEmitter.on('someEvent', function (arg1, arg2) {
    console.log('listener2', arg1, arg2);
});

console.log('-------------调用多个事件Start-------------')
eventEmitter.emit('someEvent', '参数1', '参数2');
console.log('-------------调用多个事件End-------------')
// -------------- 传递参数 End ----------------


// -------------- 展示其他方法 End ----------------

// 监听器 #1
const listener1 = function listener1() {
    console.log('我是第一个监听器。');
};

// 监听器 #2
const listener2 = function listener2() {
    console.log('我是第二个监听器。');
};

// 单次监听器 #3
const listener3 = function listener3() {
    console.log('我是第三个监听器，我只监听一次');
};
// addListener(event, listener)
// 为指定事件添加一个监听器到监听器数组的尾部。
// 绑定 connection 事件，处理函数为 listener1
eventEmitter.addListener('connection', listener1);

// on(event, listener)
// 为指定事件注册一个监听器，接受一个字符串 event 和一个回调函数。
// 绑定 connection 事件，处理函数为 listener2
eventEmitter.on('connection', listener2);

//once(event, listener)
// 为指定事件注册一个单次监听器，即监听器最多只会触发一次，触发后立刻解除该监听器。
eventEmitter.once('connection', listener3);


// listenerCount(emitter, event)
// 返回指定事件的监听器数量。
let eventListeners = eventEmitter.listenerCount('connection');
console.log(eventListeners + " 个监听器监听连接事件。"); // 4 因为最上面还绑定了一个

// 触发 connection 事件
// 按监听器的顺序执行执行每个监听器，如果事件有注册监听返回 true，否则返回 false。
eventEmitter.emit('connection');

console.log("第三个事件没啦。");


// listeners(event)
// 返回指定事件的监听器数组。
console.log(eventEmitter.listeners('connection'))


// removeListener
// 从指定监听器数组中删除一个监听器。需要注意的是，此操作将会改变处于被删监听器之后的那些监听器的索引。
// 移除监绑定的 listener1 函数
eventEmitter.removeListener('connection', listener1);
eventEmitter.removeListener('connection', connectHandler);

console.log("第一个和最上面的事件没啦。");
eventEmitter.listeners('connection')
eventEmitter.emit('connection');

eventListeners = eventEmitter.listenerCount('connection');
console.log(eventListeners + " 个监听器监听连接事件。");
// removeAllListeners([event])
// 移除所有事件的所有监听器， 如果指定事件，则移除指定事件的所有监听器。
// setMaxListeners(n)
// 默认情况下， EventEmitters 如果你添加的监听器超过 10 个就会输出警告信息。 setMaxListeners 函数用于改变监听器的默认限制的数量。


console.log("程序执行完毕。");

// 补充
// MyEmitter 继承 eventEmitter
class MyEmitter extends events.EventEmitter {
}

const myEmitter = new MyEmitter();

// newListener: 监听《添加事件》事件
// 在将监听器添加到其内部监听器数组之前，EventEmitter 实例将触发自身的 'newListener' 事件。
// 为 'newListener' 事件注册的监听器会传入事件名称和对正在添加的监听器的引用。
// 在添加监听器之前触发事件这一事实有一个微妙但重要的副作用：在 'newListener' 回调中注册到同一个 name 的任何其他监听器都会在正在添加的监听器之前插入。
myEmitter.once('newListener', (event, listener) => {
    if (event === 'event') {
        // 在前面插入新的监听器
        myEmitter.on('event', () => {
            console.log('B');
        });
    }
});
myEmitter.on('event', () => {
    console.log('A');
});
myEmitter.emit('event');
// 打印:
//   B
//   A
