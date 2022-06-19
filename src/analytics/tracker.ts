type TrackerEvent = {
  event: string;
  tags: string[];
  url: string;
  title: string;
  ts: string;
};

function dateToLocalISO(date: Date) {
  const offset = date.getTimezoneOffset();
  const absOffset = Math.abs(offset);
  return (
    new Date(date.getTime() - offset * 60 * 1000)
      .toISOString()
      .substring(0, 23) +
    (offset > 0 ? "-" : "+") +
    Math.floor(absOffset / 60)
      .toFixed(0)
      .padStart(2, "0") +
    ":" +
    (absOffset % 60).toString().padStart(2, "0")
  );
}

class Tracker {
  #buffer: TrackerEvent[] = [];
  #timer: NodeJS.Timer;

  constructor() {
    window.addEventListener("beforeunload", () => {
      this.track("tab-closed");
      this.sendData.apply(this);
    });

    document.addEventListener("click", (event) => {
      // @ts-ignore
      const anchor = event.target.closest("a");

      if (anchor) {
        this.track(
          "send-data-before-link-pressed",
          anchor.getAttribute("href")
        );
        // this.sendData();
      }
    });

    this.#timer = setTimeout(this.sendData.bind(this), 1000);
  }

  sendData() {
    if (this.#buffer.length > 0) {
      fetch("http://localhost:8001/track", {
        method: "POST",
        headers: { "Content-Type": "text/plain" }, // use text/plain to disable CORS preflight requests
        body: JSON.stringify({ events: this.#buffer }),
      }).then((res) => {
        if (res.ok) {
          this.#buffer = [];
        }
      });
    }

    this.#timer = setTimeout(this.sendData.bind(this), 1000);
  }

  track(event: string, ...tags: string[]) {
    const newEvent: TrackerEvent = {
      event,
      tags,
      title: document.title,
      url: document.URL,
      ts: dateToLocalISO(new Date()),
    };

    this.#buffer.push(newEvent);
  }
}

const tracker = new Tracker();
