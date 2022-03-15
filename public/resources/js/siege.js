
let VERSION = 10;

const currentRankMMRs = [
  {name: "Copper 5",    min_mmr: 1,     max_mmr: 1199, image: "https://i.imgur.com/SNSfudP.png"},
  {name: "Copper 4",    min_mmr: 1200,  max_mmr: 1299, image: "https://i.imgur.com/7PiisA2.png"},
  {name: "Copper 3",    min_mmr: 1300,  max_mmr: 1399, image: "https://i.imgur.com/aNCvwAI.png"},
  {name: "Copper 2",    min_mmr: 1400,  max_mmr: 1499, image: "https://i.imgur.com/fUzUApd.png"},
  {name: "Copper 1",    min_mmr: 1500,  max_mmr: 1599, image: "https://i.imgur.com/eGuxE0k.png"},
  {name: "Bronze 5",    min_mmr: 1600,  max_mmr: 1699, image: "https://i.imgur.com/bbjMf4V.png"},
  {name: "Bronze 4",    min_mmr: 1700,  max_mmr: 1799, image: "https://i.imgur.com/75IEQkD.png"},
  {name: "Bronze 3",    min_mmr: 1800,  max_mmr: 1899, image: "https://i.imgur.com/GIt29R0.png"},
  {name: "Bronze 2",    min_mmr: 1900,  max_mmr: 1999, image: "https://i.imgur.com/sTIXKlh.png"},
  {name: "Bronze 1",    min_mmr: 2000,  max_mmr: 2099, image: "https://i.imgur.com/zKRDUdK.png"},
  {name: "Silver 5",    min_mmr: 2100,  max_mmr: 2199, image: "https://i.imgur.com/CbAbvOa.png"},
  {name: "Silver 4",    min_mmr: 2200,  max_mmr: 2299, image: "https://i.imgur.com/2Y8Yr11.png"},
  {name: "Silver 3",    min_mmr: 2300,  max_mmr: 2399, image: "https://i.imgur.com/zNUuJSn.png"},
  {name: "Silver 2",    min_mmr: 2400,  max_mmr: 2499, image: "https://i.imgur.com/utTa5mq.png"},
  {name: "Silver 1",    min_mmr: 2500,  max_mmr: 2599, image: "https://i.imgur.com/27ISr4q.png"},
  {name: "Gold 3",      min_mmr: 2600,  max_mmr: 2799, image: "https://i.imgur.com/JJvq35l.png"},
  {name: "Gold 2",      min_mmr: 2800,  max_mmr: 2999, image: "https://i.imgur.com/Fco8pIl.png"},
  {name: "Gold 1",      min_mmr: 3000,  max_mmr: 3199, image: "https://i.imgur.com/m8FFWGi.png"},
  {name: "Platinum 3",  min_mmr: 3200,  max_mmr: 3499, image: "https://i.imgur.com/GpEpkDs.png"},
  {name: "Platinum 2",  min_mmr: 3500,  max_mmr: 3799, image: "https://i.imgur.com/P8IO0Sn.png"},
  {name: "Platinum 1",  min_mmr: 3800,  max_mmr: 4099, image: "https://i.imgur.com/52Y4EVg.png"},
  {name: "Diamond 3",   min_mmr: 4100,  max_mmr: 4399, image: "https://i.imgur.com/XEqbdS5.png"},
  {name: "Diamond 2",   min_mmr: 4400,  max_mmr: 4699, image: "https://i.imgur.com/A9hsLtc.png"},
  {name: "Diamond 1",   min_mmr: 4700,  max_mmr: 4999, image: "https://i.imgur.com/n0izxYa.png"},
  {name: "Champion",    min_mmr: 5000,  max_mmr: 15000, image: "https://i.imgur.com/QHZFdUj.png"}
];

let ranked = [];
let unranked = [];
let clown = 0;
firebase.database().ref(`GameStats/R6Sv${VERSION}/main_data`).once("value").then(snapshot => {

  firebase.database().ref(`GameStats/R6Sv${VERSION}/mmr_watch`).once("value").then(mmrSnapshot => {
    let mmrWatch = mmrSnapshot.val();

    snapshot.forEach(childSnapshot => {
      let cd = childSnapshot.val();
      if (cd.maxMMR !== -1){ ranked.push(cd); } else { unranked.push(cd); }
    });

    ranked.sort(function(a,b){return b.currentMMR - a.currentMMR})
    unranked.sort(function(a,b){return b.currentMMR - a.currentMMR})

    ranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u, clown, mmrWatch[u.ubisoftID])); });
    unranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u, clown, mmrWatch[u.ubisoftID], true)); });
  });
});

firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once("value").then(snapshot => {
  last_update = snapshot.val();

  let lastUpdateInterval = setInterval(function() {
    let now = parseInt(Date.now()/1000);
    let diff = now - last_update;

    $("#lastUpdated").replaceWith(`<span id="lastUpdated">${getUpdateTimeString(diff)}</span>`);

    if (diff >= 180) { $("#siegeManualUpdateButton").removeAttr("hidden"); }
  }, 1000);

  firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).on("value", snapshot => {
    if (snapshot.val() != last_update) { location.reload(); }
  });

});

function getUpdateTimeString(s) {
  let hours = Math.floor(s / 3600);
  s %= 3600;
  let minutes = Math.floor(s / 60);
  let seconds = s % 60;

  let msg = `${seconds} second${seconds == 1 ? '' : 's'}`;

  if (parseInt(minutes) != 0) {
    msg = `${minutes} minute${minutes == 1 ? '' : 's'} ${msg}`
  }
  if (parseInt(hours) != 0) {
    msg = `${hours} hour${hours == 1 ? '' : 's'} ${msg}`
  }

  return msg
};


function getStatsRow(u, clown, mmrWatch, unrank=false) {
  let pfpLink = `https://ubisoft-avatars.akamaized.net/${u.ubisoftID}/default_256_256.png`;
  let kd = u.sDeaths == 0 ? 0 : roundTwo(u.sKills / u.sDeaths);
  let wl = u.sDeaths == 0 ? 0 : roundTwo(u.sWins / (u.sWins + u.sLosses) * 100);
  let ptRAW = getPlaytime(u.totalPlaytime);
  let playtime = `${ptRAW[0]}h <span class="hidden-mobile">${ptRAW[1]}m ${ptRAW[2]}s</span>`;
  let mmrChangeColor = u.lastMMRchange >= 0 ? ( u.lastMMRchange == 0 ? "" : "color: var(--w-online)" ) : "color: var(--w-dnd)";
  let mmrChange = u.lastMMRchange == undefined ? '0' : u.lastMMRchange;
  let prevMMR = u.prevRankMMR == 0 ? getPrevRankMMR(u.currentMMR) : u.prevRankMMR;
  let nextMMR = u.nextRankMMR == 0 ? getNextRankMMR(u.currentMMR) : u.nextRankMMR;
  let topOps = getTopTwoOperators(u);
  let rankCell = getRankCell(u, unrank);
  let mmrWatchChangeColor = "";

  if (mmrWatch.adjustment) {
    mmrWatchChangeColor = `color: #faa05a !important`;
    mmrChangeColor = mmrWatch.adjustment_value >= 0 ? ( mmrWatch.adjustment_value == 0 ? "" : "color: var(--w-online)" ) : "color: var(--w-dnd)";
    mmrChange = mmrWatch.adjustment_value == undefined ? '0' : mmrWatch.adjustment_value;
  };


  let a = `
    <tr>
      <td class="hidden-mobile" sorttable_customkey="${clown}">
        <img style="height: 4rem;" src="${pfpLink}" />
      </td>
      <td class="name" style="min-width: 5rem;" sorttable_customkey="${u.currentMMR}">
        <a href="/siege_player?id=${u.ubisoftID}">
          ${u.ubisoftUsername}
        </a>
      </td>
      <td>
        ${rankCell}
      </td>
      <td class="hidden-mobile">
        <div>
          <span style="font-size: 0.8rem;">${prevMMR}</span>
          <span>👉</span>
          <span style="font-size: 0.8rem;">${nextMMR}</span>
        </div>
        <div>
          <span style="font-size: 1.5rem; ${mmrWatchChangeColor}">${addSpaces(parseInt(u.currentMMR))}</span>
          <span style="${mmrChangeColor}">${mmrChange}</span>
        </div>
      </td>
      <td>
        ${kd}
      </td>
      <td>
        ${wl}%
      </td>
      <td class="hidden-mobile">
        ${roundTwo(u.hs)}%
      </td>
      <td class="hidden-mobile">
        <div class="uk-flex uk-flex-row uk-flex-middle">
          <img style="height: 4rem;" src="${topOps[0].icon}" />
          <img style="height: 4rem;" src="${topOps[1].icon}" />
        </div>
      </td>
      <td class="hidden-mobile" sorttable_customkey="${u.totalPlaytime}">
        ${playtime}
      </td>
      <td class="hidden-mobile">
        ${u.alphapackProbability == undefined ? "0" : u.alphapackProbability/100}%
      </td>
    </tr>`;
  return a
};

function getRankCell(u, unrank=false) {
  let rankedCell = `
    <div class="rank-img-cell">
      <img style="height: 4rem;" src="${u.currentRankImage}" />
      <img style="height: 3.5rem;" class="hidden-mobile" src="${u.maxRankImage}" />
    </div>
  `;
  let unrankedCell = `
    <div class="rank-img-cell">
      <img class="hidden-mobile" style="height: 3.5rem;" src="${getRankImageFromMMR(u.currentMMR)}" />
      <span>${u.sWins+u.sLosses} / 10</span>
    </div>
  `;
  if (unrank) { return unrankedCell }
  else { return rankedCell }
};

function orderBySubKey(dict, key) {
  return Object.values( dict ).map( value => value ).sort( (a,b) => b[key] - a[key] );
};
function getTopTwoOperators(d) {
  let o = d.operators;
  //let atk = orderBySubKey(o.atk, "time_played");
  //let def = orderBySubKey(o.def, "time_played");
  return [o.atk1, o.def1]
};
function getPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
  return [hours, minutes, seconds]
};
function getRankFromMMR(mmr) {
  let x = "Wrong MMR";
  currentRankMMRs.forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) {
      x = r.name;
    }
  });
  return x
};
function getRankImageFromMMR(mmr) {
  let x = "https://i.imgur.com/RpPdtbU.png";
  currentRankMMRs.forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) {
      x = r.image;
    }
  });
  return x
};
function getPrevRankMMR(mmr) {
  let x = 0;
  currentRankMMRs.forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) { x = r.min_mmr; }
  });
  return x
};
function getNextRankMMR(mmr) {
  let x = 0;
  currentRankMMRs.forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) { x = r.max_mmr+1; }
  });
  return x
};

$(document).ready(function(){
  let requested = 0;
  let updateText = "⏰ Please wait, updating..";

  $("#siegeManualUpdateButton").click(() => {

    $.each( $("#siegeManualUpdateButton").attr("class").split(/\s+/) , (index, item) => {
      if (item === "requested") { requested += 1; }
    });

    switch (requested) {
      case 0:
        $("#siegeManualUpdateButton").addClass("requested");
        firebase.database().ref("GameStats/updateRequests/R6S").set(parseInt(Date.now()/1000));
        break;
      case 1:
        updateText = "What are you doing?";
        break;
      case 2:
        updateText = "More clicks != faster load times";
        break;
      case 10:
        updateText = "This ain't GTA 5";
        break;
      case 50:
        updateText = "🎵 Woah, we're half way there 🎵";
        break;
      case 100:
        updateText = "Are you done?";
        break;
      case 1000:
        updateText = "Seems not..";
        break;
      case 10000:
        updateText = "I'm calling the cops on you";
        break;
      case 10000:
        updateText = "Serisously, stop";
        break;
      case 100000:
        updateText = "Aight, whatever dude, I give up";
        break;
    }
    $("#siegeManualUpdateButton").text(updateText)
  });


  $.getJSON("https://game-status-api.ubisoft.com/v1/instances", data => {
    $.each(data, (key, val) => {
      if (val["AppID "] === "e3d5ea9e-50bd-43b7-88bf-39794f4e3d40") {
        if (val.Maintenance != null) { return $("#siegePcStatus").replaceWith(`<span style="color: var(--w-away);">Maintenance</span>`); }
        let color = val.Status == "Online" ? "--w-online" : "--w-dnd";
        return $("#siegePcStatus").replaceWith(`<span style="color: var(${color})">${val.Status}</span>`);
      }
    });
  });

});
