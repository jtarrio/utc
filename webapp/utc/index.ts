// Copyright 2025 Jacobo Tarrio Barreiro. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
class Time {
  constructor(
    readonly offset: number | null,
    readonly rtt: number | null
  ) {}

  static FromTimings(
    clientSend: number,
    server: number,
    clientReceive: number
  ): Time {
    const offset = (server - clientSend + (server - clientReceive)) / 2;
    const rtt = clientReceive - clientSend;
    return new Time(offset, rtt);
  }

  static async FromServer(): Promise<Time> {
    const clientSend = Date.now();
    let resp = await fetch("204.html");
    const clientReceive = Date.now();
    if (!resp.ok) return new Time(null, null);
    let time = resp.headers.get("x-time");
    if (!time || !time.startsWith("t=")) return new Time(null, null);
    const server = Number(time.substring(2)) / 1000;
    return Time.FromTimings(clientSend, server, clientReceive);
  }

  now(): number {
    return Date.now() + (this.offset || 0);
  }

  date(): Date {
    return new Date(Date.now() + (this.offset || 0));
  }
}

var time = new Time(null, null);

function showTime(clock: HTMLDivElement, date: HTMLDivElement) {
  const toStr = (n: number) => (n < 10 ? "0" + String(n) : String(n));
  const now = time.date();
  clock.textContent = `${toStr(now.getUTCHours())}:${toStr(now.getUTCMinutes())}:${toStr(now.getUTCSeconds())}`;
  date.textContent = `${now.getFullYear()}-${toStr(now.getUTCMonth() + 1)}-${toStr(now.getUTCDate())}`;
  requestAnimationFrame(() => showTime(clock, date));
}

async function updateTime() {
  time = await Time.FromServer();
  let info = document.getElementsByClassName("info")[0];
  if (time.offset == null) {
    info.textContent = `Could not connect to the server to get the exact time.`;
    return;
  }
  let offset = Math.abs(time.offset);
  let offsetText = "";
  if (offset < 1) {
    offsetText = `Your computer's clock matches my server's exactly`;
  } else {
    let direction = time.offset < 0 ? "ahead of" : "behind";
    let offsetStrs = [];
    let sec = (Math.floor(offset) / 1000) % 60;
    if (sec >= 1) {
      offsetStrs.unshift(`${sec} seconds`);
    } else {
      let ms = Math.floor(offset % 1000);
      if (ms > 0) offsetStrs.unshift(`${ms} ms`);
    }
    let min = Math.floor(offset / (60 * 1000)) % 60;
    if (min > 0) offsetStrs.unshift(`${min} minutes`);
    let hrs = Math.floor(offset / (60 * 60 * 1000));
    if (hrs > 0) offsetStrs.unshift(`${hrs} hours`);
    offsetText = `Your computer is ${offsetStrs.join(", ")} ${direction} my server`;
  }
  info.textContent = `${offsetText}. The round-trip time is ${time.rtt} ms.`;
}

function start() {
  let clock = document.getElementsByClassName("clock")[0] as HTMLDivElement;
  let date = document.getElementsByClassName("date")[0] as HTMLDivElement;
  updateTime();
  setInterval(updateTime, 30 * 60 * 1000);
  showTime(clock, date);
}

window.addEventListener("load", start);
