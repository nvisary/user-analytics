"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Tracker_buffer, _Tracker_timer;
function dateToLocalISO(date) {
    const offset = date.getTimezoneOffset();
    const absOffset = Math.abs(offset);
    return (new Date(date.getTime() - offset * 60 * 1000).toISOString().substring(0, 23) +
        (offset > 0 ? '-' : '+') +
        Math.floor(absOffset / 60).toFixed(0).padStart(2, '0') + ':' +
        (absOffset % 60).toString().padStart(2, '0'));
}
class Tracker {
    constructor() {
        _Tracker_buffer.set(this, []);
        _Tracker_timer.set(this, void 0);
        window.addEventListener("beforeunload", () => {
            this.track("close tab", "it", "is", "working");
            trySend();
        });
        window.addEventListener("unload", () => {
            this.track("close tab", "it", "is", "working");
            trySend();
        });
        const trySend = () => {
            if (__classPrivateFieldGet(this, _Tracker_buffer, "f").length > 0) {
                console.log("SEND");
                fetch("http://localhost:8001/track", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ events: [__classPrivateFieldGet(this, _Tracker_buffer, "f")] })
                }).then((res) => {
                    if (res.ok) {
                        __classPrivateFieldSet(this, _Tracker_buffer, [], "f");
                    }
                });
            }
            setTimeout(trySend, 1000);
        };
        __classPrivateFieldSet(this, _Tracker_timer, setTimeout(trySend, 1000), "f");
    }
    track(event, ...tags) {
        const newEvent = {
            event,
            tags,
            title: document.title,
            url: document.URL,
            ts: dateToLocalISO(new Date()),
        };
        __classPrivateFieldGet(this, _Tracker_buffer, "f").push(newEvent);
    }
}
_Tracker_buffer = new WeakMap(), _Tracker_timer = new WeakMap();
const tracker = new Tracker();
