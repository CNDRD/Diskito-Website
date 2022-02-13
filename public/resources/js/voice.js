
const actuallyCurrentYear = new Date().getFullYear();
const currentYear = new URLSearchParams(window.location.search).get("year") || actuallyCurrentYear;
renameHeaders(currentYear);

for (let yr = 2020; yr <= actuallyCurrentYear; yr++) {
  $("#yearsGrid").append(
    `
    <div>
      <a href="/voice?year=${yr}">${yr}</a>
    </div>
    `
  );
}

const chartZoomSettings = {
  limits: {
    x: {
      max: "original",
    },
    y: {
      max: "original",
    },
  },
  zoom: {
    wheel: {
      enabled: true,
    },
    drag: {
      enabled: true,
    },
    pinch: {
      enabled: true
    },
    mode: 'xy',
  }
};

firebase.database().ref(`voice/${currentYear}/total`).once('value').then(users => {
  let lvsData = [];
  let totalData = [];
  let voiceTreshold = 1800; // 30minutes

  users.forEach(user => {
    let u = user.val()
    let username = prettifyUsernameForChart(u.name);
    // If voice time is above 'voiceTreshold' minutes push it to the graph
    if (u.voice >= voiceTreshold){ totalData.push({time:secondsToHours(u.voice), user:username}) };
    if (u.lvs >= voiceTreshold){ lvsData.push({time:secondsToHours(u.lvs), user:username}) };
  });

  // Sort the data
  totalData = totalData.sort(function(a, b){ return b.time - a.time });
  lvsData = lvsData.sort(function(a, b){ return b.time - a.time });


  let totalYearlyVoiceChart = new Chart(document.getElementById("totalChartCanvas"), {
    type: 'bar',
    data: {
      labels: totalData.map( ({user}) => user ),
      datasets: [{
        label: 'Hours',
        data: totalData.map( ({time}) => time ),
        backgroundColor: "rgba(250, 240, 202, 0.75)",
      }]
    },
    options: { plugins: { zoom: chartZoomSettings, legend: { display: false } } }
  });

  let lvsVoiceChart = new Chart(document.getElementById("lvsChartCanvas"), {
    type: 'bar',
    data: {
      labels: lvsData.map( ({user}) => user ),
      datasets: [{
        label: 'Hours',
        data: lvsData.map( ({time}) => time ),
        backgroundColor: "rgba(249, 87, 56, 0.8)",
      }]
    },
    options: { plugins: { zoom: chartZoomSettings, legend: { display: false } } }
  });

});

firebase.database().ref(`voice/${currentYear}/day`).once('value').then(days => {
  let dates = [];
  let times = [];

  days.forEach(day => {
    dates.push(fixDate(day.key));
    times.push(day.val() != 0 ? secondsToHours(day.val()) : null)
  });

  const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;

  // Give the data to the graph
  let dailyVoiceChart = new Chart(document.getElementById("dailyChartCanvas"), {
    type: "line",
    data: {
      labels: dates, 
      datasets: [{
        label: "Hours",
        backgroundColor: "rgba(194, 180, 122, 0.9)",
        borderColor: "rgba(194, 180, 122, 0.4)",
  
        pointStyle: 'circle',
        pointRadius: 4,
        pointHoverRadius: 3,
  
        tension: 0.6,

        spanGaps: true,
        segment: {
          borderColor: ctx => skipped(ctx, 'rgb(194, 180, 122, 0.1)'),
          borderDash: ctx => skipped(ctx, [6, 6]),
        },

        data: times,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        zoom: chartZoomSettings,
      }
    }
  });

});

firebase.database().ref(`users`).once('value').then(users => {
  let userTimes = [];
  let yearlyTimes = {};
  let yearlyNames = [];

  // Need empty lists so i can push data to them later
  for (let yr = 2020; yr <= currentYear; yr++) { yearlyTimes[yr] = []; }

  users.forEach(u => {
    u = u.val();

    if (u.in_server) {
      let time = u.all_time_total_voice;
      let name = u.username;

      if (time != undefined && time > 18000 ) {
        // All Time Total Voice Stuff
        userTimes.push({ time:secondsToHours(time), user: prettifyUsernameForChart(name) });

        // Yearly User Time
        if (time > (4*60)) {
          yearlyNames.push(name);

          for (yr in yearlyTimes) {
            yearlyTimes[yr].push(`voice_year_${yr}` in u ? secondsToHours(u[`voice_year_${yr}`]) : null);
          }
        }

      }
    };

  });

  // Remove duplicate names
  yearlyNames = [...new Set(yearlyNames)];
    
  // Generate datasets
  let yearlyDatasets = [];

  for (yr in yearlyTimes) {
    let color = generateRandomColorRGB();

    yearlyDatasets.push({
      label: yr,
      data: yearlyTimes[yr],
      backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`,
      stack: "Stack 0",
    });
  };

  let yearlyUserTimeChart = new Chart(document.getElementById("yearlyUserTimeChartCanvas"), {
    type: 'bar',
    data: {
      labels: yearlyNames,
      datasets: yearlyDatasets,
    },
    options: {
      responsive: true,
      plugins: {
        zoom: chartZoomSettings,
        title: {
          display: true,
          text: "If the colors are too similar, refresh the page"
        }
      }
    }
  });

  // Sort the data
  userTimes = userTimes.sort(function(a, b){ return b.time - a.time });
  // Split the data for the Chart to monch over
  let times = userTimes.map( ({time}) => time );
  let usernames = userTimes.map( ({user}) => user );

  let allTimeTotalVoiceChart = new Chart(document.getElementById("totalTotalChartCanvas"), {
    type: 'bar',
    data: {
      labels: usernames,
      datasets: [{
        label: 'Hours',
        data: times,
        backgroundColor: "rgba(244, 211, 94, 0.8)",
      }]
    },
    options: { plugins: { zoom: chartZoomSettings, legend: { display: false } } }
  });

});


function prettifyUsernameForChart(u) {
  u = u.split('#')
  return reduceNameLength(u, 20)
};
function reduceNameLength(splitname, len){
  return splitname[0].substr(0,len).length > (len-1) ? `${splitname[0].substr(0,len)}..` : splitname[0].substr(0,len)
};
function secondsToHours(s){
  return Math.round((s/60/60)*100)/100
};
function fixDate(d) {
  let ds = d.split("-");
  return `${parseInt(ds[2])}.${parseInt(ds[1])}.`;
};
function generateRandomColorRGB() {
  let hex = Math.floor(Math.random()*16777215).toString(16);
  // https://stackoverflow.com/a/5624139/13186339
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

function renameHeaders(yr) {
  $('#dailyChartH3').text(`Daily Voice in ${yr}`);
  $('#dailyChartTab').text(`Daily Voice in ${yr}`);
  $('#totalChartH3').text(`Total Time Spent per User in ${yr}`);
  $('#totalChartTab').text(`Total Time per User in ${yr}`);
  $('#lvsChartH3').text(`Longest Voice Sessions in ${yr}`);
  $('#lvsChartTab').text(`Longest Voice Sessions in ${yr}`);
};
